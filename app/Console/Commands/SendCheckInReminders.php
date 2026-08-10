<?php

namespace App\Console\Commands;

use App\Mail\BookingReminder;
use App\Models\Booking;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

#[Signature('app:send-check-in-reminders')]
#[Description('Command description')]
class SendCheckInReminders extends Command
{
    protected $signature = 'bookings:send-reminders {--days=1 : How many days before check-in to send the reminder}';

    protected $description = 'Email guests a reminder ahead of their check-in date';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $targetDate = now()->addDays((int) $this->option('days'))->toDateString();

        $bookings = Booking::query()
            ->with(['user', 'room'])
            ->where('status', 'confirmed')
            ->whereDate('check_in', $targetDate)
            ->whereNull('reminder_sent_at')
            ->get();

        if ($bookings->isEmpty()) {
            $this->info("No check-ins on {$targetDate} need a reminder.");

            return self::SUCCESS;
        }

        foreach ($bookings as $booking) {
            Mail::to($booking->user->email)->send(new BookingReminder($booking));
            $booking->update(['reminder_sent_at' => now()]);

            $this->line("Reminder sent for booking {$booking->booking_reference} ({$booking->user->email})");
        }

        $this->info("Sent {$bookings->count()} check-in reminder(s) for {$targetDate}.");

        return self::SUCCESS;
    }
}
