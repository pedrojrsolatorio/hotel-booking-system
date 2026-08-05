<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_reference' => $this->booking_reference,
            'check_in' => $this->check_in?->toDateString(),
            'check_out' => $this->check_out?->toDateString(),
            'nights' => $this->nights(),
            'guests' => $this->guests,
            'total_price' => (float) $this->total_price,
            'special_requests' => $this->special_requests,
            'status' => $this->status,
            'is_cancellable' => $this->isCancellable(),
            'room' => new RoomResource($this->whenLoaded('room')),
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'payment' => $this->whenLoaded('payment', fn() => $this->payment ? [
                'amount' => (float) $this->payment->amount,
                'payment_status' => $this->payment->payment_status,
                'payment_method' => $this->payment->payment_method,
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
