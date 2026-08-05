<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'type' => $this->type,
            'price' => (float) $this->price,
            'capacity' => $this->capacity,
            'amenities' => $this->amenities ?? [],
            'total_units' => $this->total_units,
            'status' => $this->status,
            'images' => RoomImageResource::collection($this->whenLoaded('images')),
            'primary_image' => $this->when(
                $this->relationLoaded('images'),
                fn() => $this->primaryImage()?->url
            ),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
