<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChatMessageRequest;
use App\Models\ChatConversation;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function __construct(private readonly GeminiService $gemini) {}

    /**
     * POST /chat — send a message, get the assistant's reply.
     * Identified by a client-generated session_id (works for guests too);
     * if the visitor is logged in, the conversation is also linked to their account.
     */
    public function store(StoreChatMessageRequest $request): JsonResponse
    {
        $conversation = ChatConversation::firstOrCreate(
            ['session_id' => $request->string('session_id')],
            ['user_id' => $request->user()?->id]
        );

        $conversation->messages()->create([
            'role' => 'user',
            'content' => $request->string('message'),
        ]);

        $history = $conversation->messages()
            ->orderBy('created_at')
            ->get(['role', 'content'])
            ->map(fn($m) => ['role' => $m->role, 'content' => $m->content])
            ->all();

        $result = $this->gemini->reply($history);

        $assistantMessage = $conversation->messages()->create([
            'role' => 'assistant',
            'content' => $result['content'],
            'metadata' => $result['metadata'] ?? null,
        ]);

        return response()->json([
            'message' => [
                'id' => $assistantMessage->id,
                'role' => 'assistant',
                'content' => $assistantMessage->content,
                'created_at' => $assistantMessage->created_at->toIso8601String(),
            ],
        ]);
    }

    /**
     * GET /chat/history?session_id=... — used on page load to restore the
     * widget's conversation after a refresh or navigation.
     */
    public function history(Request $request): JsonResponse
    {
        $request->validate(['session_id' => ['required', 'string', 'max:64']]);

        $conversation = ChatConversation::where('session_id', $request->string('session_id'))->first();

        $messages = $conversation
            ? $conversation->messages()->orderBy('created_at')->get(['id', 'role', 'content', 'created_at'])
            : collect();

        return response()->json(['messages' => $messages]);
    }
}
