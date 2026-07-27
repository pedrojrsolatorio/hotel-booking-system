<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'price',
        'capacity',
        'amenities',
        'total_units',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'amenities' => 'array',
            'price' => 'decimal:2',
        ];
    }

    public function images(): HasMany
    {
        return $this->hasMany(RoomImage::class)->orderBy('sort_order');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function primaryImage()
    {
        return $this->images()->where('is_primary', true)->first()
            ?? $this->images()->first();
    }

    public function scopeAvailableStatus(Builder $query): Builder
    {
        return $query->where('status', 'available');
    }

    /**
     * Number of units of this room type already booked
     * for a given date range (overlapping stays), excluding cancelled bookings.
     */
    public function unitsBookedBetween(string $checkIn, string $checkOut): int
    {
        return $this->bookings()
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('check_in', '<', $checkOut)
            ->where('check_out', '>', $checkIn)
            ->count();
    }

    public function hasAvailability(string $checkIn, string $checkOut): bool
    {
        if ($this->status !== 'available') {
            return false;
        }

        return $this->unitsBookedBetween($checkIn, $checkOut) < $this->total_units;
    }

    /**
     * Rooms with availability for a given search, optionally filtered by
     * capacity and type. Used by RoomController@index and the chatbot service.
     */
    public static function searchAvailable(string $checkIn, string $checkOut, ?int $guests = null, ?string $type = null)
    {
        return static::availableStatus()
            ->when($guests, fn (Builder $q) => $q->where('capacity', '>=', $guests))
            ->when($type, fn (Builder $q) => $q->where('type', $type))
            ->get()
            ->filter(fn (Room $room) => $room->hasAvailability($checkIn, $checkOut))
            ->values();
    }
}
