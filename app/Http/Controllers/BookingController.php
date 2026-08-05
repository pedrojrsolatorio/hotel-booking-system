<?php

namespace App\Http\Controllers;

use App\Exceptions\RoomUnavailableException;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(private readonly BookingService $bookingService) {}

    /**
     * "My bookings" list for the logged-in customer (GET /bookings).
     */
    public function index(): Response
    {
        $bookings = auth()->user()
            ->bookings()
            ->with(['room.images', 'payment'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Bookings/Index', [
            'bookings' => BookingResource::collection($bookings),
        ]);
    }

    /**
     * Create the booking from the room details / booking flow form
     * (POST /bookings). Redirects to the confirmation page on success.
     */
    public function store(StoreBookingRequest $request): RedirectResponse
    {
        try {
            $booking = $this->bookingService->create($request->user(), $request->validated());
        } catch (RoomUnavailableException $e) {
            return Redirect::back()
                ->withErrors(['room_id' => $e->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('bookings.show', $booking)
            ->with('success', 'Your booking is confirmed! A confirmation email is on its way.');
    }

    /**
     * Booking confirmation / details page (GET /bookings/{booking}).
     */
    public function show(Booking $booking): Response
    {
        $this->authorize('view', $booking);

        return Inertia::render('Bookings/Show', [
            'booking' => (new BookingResource($booking->load(['room.images', 'payment', 'user'])))->resolve(),
        ]);
    }

    /**
     * Cancel a booking (PATCH /bookings/{booking}/cancel). Available to the
     * owning customer (while cancellable) or an admin.
     */
    public function cancel(Booking $booking): RedirectResponse
    {
        $this->authorize('cancel', $booking);

        $this->bookingService->cancel($booking);

        return redirect()
            ->back()
            ->with('success', "Booking {$booking->booking_reference} has been cancelled.");
    }
}
