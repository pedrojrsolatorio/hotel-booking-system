<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Room::class); // any admin

        return Inertia::render('Admin/Dashboard', [
            'stats' => $this->overviewStats(),
            'monthlyBookings' => $this->monthlyBookings(),
            'revenueTrend' => $this->revenueTrend(),
            'popularRoomTypes' => $this->popularRoomTypes(),
        ]);
    }

    private function overviewStats(): array
    {
        $totalBookings = Booking::count();

        $revenue = Booking::whereIn('status', ['confirmed', 'completed'])->sum('total_price');

        $availableRooms = Room::availableStatus()->count();
        $totalRooms = Room::count();

        $activeBookingsToday = Booking::whereIn('status', ['confirmed', 'pending'])
            ->where('check_in', '<=', now())
            ->where('check_out', '>', now())
            ->count();

        $totalUnits = (int) Room::availableStatus()->sum('total_units');
        $occupancyRate = $totalUnits > 0
            ? round(($activeBookingsToday / $totalUnits) * 100, 1)
            : 0.0;

        return [
            'total_bookings' => $totalBookings,
            'revenue' => (float) $revenue,
            'available_rooms' => $availableRooms,
            'total_rooms' => $totalRooms,
            'occupancy_rate' => $occupancyRate,
        ];
    }

    private function monthlyBookings(): array
    {
        $start = Carbon::now()->subMonths(5)->startOfMonth();

        $rows = Booking::query()
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as total")
            ->where('created_at', '>=', $start)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        return $this->fillLastSixMonths($rows, 'total');
    }

    private function revenueTrend(): array
    {
        $start = Carbon::now()->subMonths(5)->startOfMonth();

        $rows = Booking::query()
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) as revenue")
            ->whereIn('status', ['confirmed', 'completed'])
            ->where('created_at', '>=', $start)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        return $this->fillLastSixMonths($rows, 'revenue');
    }

    private function fillLastSixMonths($rows, string $valueKey): array
    {
        $result = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key = $date->format('Y-m');

            $result[] = [
                'month' => $date->format('M Y'),
                'value' => (float) ($rows[$key]->{$valueKey} ?? 0),
            ];
        }

        return $result;
    }

    private function popularRoomTypes(): array
    {
        return Booking::query()
            ->join('rooms', 'rooms.id', '=', 'bookings.room_id')
            ->selectRaw('rooms.type as type, COUNT(*) as bookings_count')
            ->groupBy('rooms.type')
            ->orderByDesc('bookings_count')
            ->get()
            ->map(fn($row) => ['type' => $row->type, 'count' => (int) $row->bookings_count])
            ->values()
            ->all();
    }
}
