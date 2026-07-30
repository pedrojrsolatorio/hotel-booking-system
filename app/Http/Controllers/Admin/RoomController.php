<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use App\Services\RoomService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function __construct(private readonly RoomService $roomService) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Room::class);

        $rooms = Room::query()->with('images')->latest()->paginate(15);

        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => RoomResource::collection($rooms),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Room::class);

        return Inertia::render('Admin/Rooms/Create');
    }

    public function store(StoreRoomRequest $request): RedirectResponse
    {
        $this->authorize('create', Room::class);

        $room = $this->roomService->create(
            $request->safe()->except('images'),
            $request->file('images', [])
        );

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', "Room \"{$room->name}\" was created.");
    }

    public function edit(Room $room): Response
    {
        $this->authorize('update', $room);

        return Inertia::render('Admin/Rooms/Edit', [
            'room' => (new RoomResource($room->load('images')))->resolve(),
        ]);
    }

    public function update(UpdateRoomRequest $request, Room $room): RedirectResponse
    {
        $this->authorize('update', $room);

        $this->roomService->update(
            $room,
            $request->safe()->except('images'),
            $request->file('images', [])
        );

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', "Room \"{$room->name}\" was updated.");
    }

    public function destroy(Room $room): RedirectResponse
    {
        $this->authorize('delete', $room);

        $this->roomService->delete($room);

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', "Room \"{$room->name}\" was deleted.");
    }
}
