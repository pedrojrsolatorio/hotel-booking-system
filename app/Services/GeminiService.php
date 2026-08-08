<?php

namespace App\Services;

use App\Models\Faq;
use App\Models\Room;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Talks to the Gemini API on behalf of the chat widget. Gemini never touches
 * the database directly — when it needs live data (room availability), it
 * issues a "function call" that this service executes against Eloquent,
 * then sends the result back to Gemini for a final, natural-language reply.
 *
 * Flow:
 *   React ChatWidget -> POST /chat -> ChatController -> GeminiService -> Gemini API
 *                                                     \-> Room::searchAvailable() (tool)
 */
class GeminiService
{
    private readonly string $apiKey;
    private readonly string $model;
    private readonly string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key', '');
        $this->model = config('services.gemini.model', 'gemini-2.0-flash');
        $this->baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $history  Oldest-first conversation so far, including the latest user message.
     * @return array{content: string, metadata: array}
     */
    public function reply(array $history): array
    {
        if (empty($this->apiKey)) {
            return [
                'content' => "I'm not fully configured yet — ask the hotel to add a GEMINI_API_KEY to get me talking. In the meantime, check the FAQ section or browse Rooms & Suites directly!",
                'metadata' => ['error' => 'missing_api_key'],
            ];
        }

        $contents = $this->toGeminiContents($history);

        try {
            $first = $this->callGemini($contents);
            $part = $first['candidates'][0]['content']['parts'][0] ?? null;

            if (isset($part['functionCall'])) {
                return $this->handleFunctionCall($contents, $part['functionCall']);
            }

            return [
                'content' => $part['text'] ?? "Sorry, I didn't quite catch that — could you rephrase?",
                'metadata' => [],
            ];
        } catch (\Throwable $e) {
            Log::warning('Gemini chat request failed', ['error' => $e->getMessage()]);

            return [
                'content' => "I'm having trouble reaching my assistant brain right now. Please try again in a moment, or reach the front desk directly.",
                'metadata' => ['error' => 'gemini_request_failed'],
            ];
        }
    }

    private function handleFunctionCall(array $contents, array $functionCall): array
    {
        $functionResult = match ($functionCall['name']) {
            'check_room_availability' => $this->checkRoomAvailability($functionCall['args'] ?? []),
            default => ['error' => "Unknown function: {$functionCall['name']}"],
        };

        $contents[] = [
            'role' => 'model',
            'parts' => [['functionCall' => $functionCall]],
        ];

        $contents[] = [
            'role' => 'user',
            'parts' => [[
                'functionResponse' => [
                    'name' => $functionCall['name'],
                    'response' => $functionResult,
                ],
            ]],
        ];

        $followUp = $this->callGemini($contents);
        $text = $followUp['candidates'][0]['content']['parts'][0]['text'] ?? null;

        return [
            'content' => $text ?? "Here's what I found, but I had trouble summarizing it — please check the Rooms page directly.",
            'metadata' => [
                'tool_used' => $functionCall['name'],
                'tool_args' => $functionCall['args'] ?? [],
                'tool_result' => $functionResult,
            ],
        ];
    }

    /**
     * The only "action" Gemini is allowed to take: look up real availability.
     * It cannot create, modify, or cancel bookings — that always requires
     * the customer to confirm through the normal booking form.
     */
    private function checkRoomAvailability(array $args): array
    {
        $checkIn = $args['check_in'] ?? null;
        $checkOut = $args['check_out'] ?? null;
        $guests = isset($args['guests']) ? (int) $args['guests'] : null;
        $type = $args['room_type'] ?? null;

        if (! $checkIn || ! $checkOut) {
            return ['error' => 'check_in and check_out dates are required, in YYYY-MM-DD format.'];
        }

        try {
            $rooms = Room::searchAvailable($checkIn, $checkOut, $guests, $type);
        } catch (\Throwable $e) {
            return ['error' => 'Could not search availability for those dates.'];
        }

        return [
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'available_rooms' => $rooms->map(fn(Room $room) => [
                'name' => $room->name,
                'type' => $room->type,
                'price_per_night' => (float) $room->price,
                'capacity' => $room->capacity,
                'url_slug' => $room->slug,
            ])->all(),
        ];
    }

    private function callGemini(array $contents): array
    {
        $response = Http::timeout(20)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post("{$this->baseUrl}/{$this->model}:generateContent?key={$this->apiKey}", [
                'system_instruction' => [
                    'parts' => [['text' => $this->systemPrompt()]],
                ],
                'contents' => $contents,
                'tools' => [
                    ['function_declarations' => [$this->availabilityFunctionSchema()]],
                ],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'maxOutputTokens' => 400,
                ],
            ])
            ->throw();

        return $response->json();
    }

    private function toGeminiContents(array $history): array
    {
        return collect($history)
            ->map(fn(array $message) => [
                'role' => $message['role'] === 'assistant' ? 'model' : 'user',
                'parts' => [['text' => $message['content']]],
            ])
            ->values()
            ->all();
    }

    private function availabilityFunctionSchema(): array
    {
        return [
            'name' => 'check_room_availability',
            'description' => 'Check which real rooms are available for given dates, optionally filtered by guest count or room type. Always use this instead of guessing — never state a room is available or state a price without calling this first.',
            'parameters' => [
                'type' => 'OBJECT',
                'properties' => [
                    'check_in' => ['type' => 'STRING', 'description' => 'Check-in date, YYYY-MM-DD'],
                    'check_out' => ['type' => 'STRING', 'description' => 'Check-out date, YYYY-MM-DD'],
                    'guests' => ['type' => 'INTEGER', 'description' => 'Number of guests, if known'],
                    'room_type' => ['type' => 'STRING', 'description' => 'One of Standard, Deluxe, Suite, Executive Suite, if the guest has a preference'],
                ],
                'required' => ['check_in', 'check_out'],
            ],
        ];
    }

    private function systemPrompt(): string
    {
        $faqText = Faq::orderBy('sort_order')->get()
            ->map(fn(Faq $faq) => "Q: {$faq->question}\nA: {$faq->answer}")
            ->implode("\n\n");

        $roomTypes = Room::query()->availableStatus()->distinct()->pluck('type')->implode(', ');

        return <<<PROMPT
        You are the booking assistant for Verity House, a small boutique hotel.
        Be warm, concise, and precise. Never invent room names, prices, or
        availability — always call check_room_availability for anything about
        specific dates, prices, or open rooms. If the guest hasn't given both a
        check-in and check-out date yet, ask for whichever is missing before
        calling the function.

        You cannot create, modify, or cancel a reservation yourself. Once the
        guest has decided on a room and dates, direct them to complete the
        booking on the room's page (e.g. "head to the {room name} page and
        confirm your dates there") rather than confirming a booking in chat.

        Room types currently offered: {$roomTypes}.

        Frequently asked questions you can answer directly, without calling
        any function:

        {$faqText}
        PROMPT;
    }
}
