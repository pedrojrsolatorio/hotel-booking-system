<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Room listing page with filters (GET /rooms).
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'check_in' => ['nullable', 'date'],
            'check_out' => ['nullable', 'date', 'after:check_in'],
            'guests' => ['nullable', 'integer', 'min:1'],
            'type' => ['nullable', 'string'],
            'sort' => ['nullable', 'in:price_asc,price_desc,capacity'],
        ]);

        $query = Room::query()->availableStatus()->with('images');

        if (! empty($validated['type'])) {
            $query->where('type', $validated['type']);
        }

        if (! empty($validated['guests'])) {
            $query->where('capacity', '>=', $validated['guests']);
        }

        $rooms = $query->get();

        // If searching specific dates, filter down to rooms with real availability.
        if (! empty($validated['check_in']) && ! empty($validated['check_out'])) {
            $rooms = $rooms->filter(
                fn(Room $room) => $room->hasAvailability($validated['check_in'], $validated['check_out'])
            )->values();
        }

        $rooms = match ($validated['sort'] ?? null) {
            'price_asc' => $rooms->sortBy('price')->values(),
            'price_desc' => $rooms->sortByDesc('price')->values(),
            'capacity' => $rooms->sortByDesc('capacity')->values(),
            default => $rooms,
        };

        return Inertia::render('Rooms/Index', [
            'rooms' => RoomResource::collection($rooms)->resolve(),
            'filters' => $validated,
        ]);
    }

    /**
     * Room details page (GET /rooms/{room:slug}).
     */
    public function show(Room $room): Response
    {
        $room->load('images');

        $similarRooms = Room::query()
            ->availableStatus()
            ->where('type', $room->type)
            ->where('id', '!=', $room->id)
            ->with('images')
            ->limit(3)
            ->get();

        return Inertia::render('Rooms/Show', [
            'room' => (new RoomResource($room))->resolve(),
            'similarRooms' => RoomResource::collection($similarRooms)->resolve(),
        ]);
    }
}
