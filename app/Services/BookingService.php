<?php

namespace App\Services;

use App\Events\BookingCancelled;
use App\Events\BookingCreated;
use App\Exceptions\RoomUnavailableException;
use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class BookingService
{
    /**
     * Create a booking inside a DB transaction, re-checking availability
     * with a row lock so two customers can't double-book the last unit
     * of a room type between the form's validation pass and this write.
     *
     * @throws RoomUnavailableException
     */
    public function create(User $user, array $data): Booking
    {
        return DB::transaction(function () use ($user, $data) {
            /** @var Room $room */
            $room = Room::query()->lockForUpdate()->findOrFail($data['room_id']);

            if (! $room->hasAvailability($data['check_in'], $data['check_out'])) {
                throw new RoomUnavailableException(
                    'This room was just booked by someone else for those dates. Please choose different dates or another room.'
                );
            }

            $booking = Booking::create([
                'user_id' => $user->id,
                'room_id' => $room->id,
                'check_in' => $data['check_in'],
                'check_out' => $data['check_out'],
                'guests' => $data['guests'],
                'special_requests' => $data['special_requests'] ?? null,
                'total_price' => Booking::calculateTotal($room, $data['check_in'], $data['check_out']),
                'status' => 'pending',
            ]);

            $booking->payment()->create([
                'amount' => $booking->total_price,
                'payment_status' => 'pending',
            ]);

            event(new BookingCreated($booking->load(['room.images', 'payment'])));

            return $booking;
        });
    }

    public function cancel(Booking $booking): Booking
    {
        $booking->update(['status' => 'cancelled']);

        if ($booking->payment && $booking->payment->payment_status === 'paid') {
            $booking->payment->update(['payment_status' => 'refunded']);
        }

        event(new BookingCancelled($booking));

        return $booking;
    }

    /**
     * Marks a pending booking as confirmed, e.g. once payment succeeds.
     * Wired up fully once payment processing is added; for now the admin
     * dashboard (Phase 5) can call this directly to confirm manually.
     */
    public function confirm(Booking $booking): Booking
    {
        $booking->update(['status' => 'confirmed']);

        if ($booking->payment) {
            $booking->payment->update(['payment_status' => 'paid']);
        }

        return $booking;
    }
}
