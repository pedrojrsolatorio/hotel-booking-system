<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredRooms = Room::query()
            ->availableStatus()
            ->with('images')
            ->latest()
            ->limit(6)
            ->get();

        return Inertia::render('Home', [
            'featuredRooms' => RoomResource::collection($featuredRooms)->resolve(),
        ]);
    }
}
