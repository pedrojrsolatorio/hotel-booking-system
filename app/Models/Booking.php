<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_reference',
        'user_id',
        'room_id',
        'check_in',
        'check_out',
        'guests',
        'total_price',
        'special_requests',
        'status',
        'reminder_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'check_in' => 'date',
            'check_out' => 'date',
            'total_price' => 'decimal:2',
            'reminder_sent_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            if (empty($booking->booking_reference)) {
                $booking->booking_reference = 'BK-' . strtoupper(Str::random(8));
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function nights(): int
    {
        return Carbon::parse($this->check_in)->diffInDays(Carbon::parse($this->check_out));
    }

    public static function calculateTotal(Room $room, string $checkIn, string $checkOut): float
    {
        $nights = Carbon::parse($checkIn)->diffInDays(Carbon::parse($checkOut));

        return round((float) $room->price * max($nights, 1), 2);
    }

    public function isCancellable(): bool
    {
        return in_array($this->status, ['pending', 'confirmed'])
            && Carbon::parse($this->check_in)->isFuture();
    }
}
