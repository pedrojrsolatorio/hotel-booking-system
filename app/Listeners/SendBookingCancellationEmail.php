<?php

namespace App\Listeners;

use App\Events\BookingCancelled;
use App\Mail\BookingCancelled as BookingCancelledMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendBookingCancellationEmail implements ShouldQueue
{
    // /**
    //  * Create the event listener.
    //  */
    // public function __construct()
    // {
    //     //
    // }

    /**
     * Handle the event.
     */
    public function handle(BookingCancelled $event): void
    {
        Mail::to($event->booking->user->email)
            ->send(new BookingCancelledMail($event->booking));
    }
}
