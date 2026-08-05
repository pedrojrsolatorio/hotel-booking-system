<?php

namespace App\Services;

use App\Models\Room;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RoomService
{
    /**
     * Create a room and store any uploaded images.
     *
     * @param  array  $data  Validated data from StoreRoomRequest
     * @param  UploadedFile[]  $images
     */
    public function create(array $data, array $images = []): Room
    {
        $room = Room::create([
            ...$this->roomAttributes($data),
            'slug' => $this->uniqueSlug($data['name']),
        ]);

        $this->attachImages($room, $images);

        return $room->load('images');
    }

    /**
     * Update a room and append any newly uploaded images.
     *
     * @param  UploadedFile[]  $images
     */
    public function update(Room $room, array $data, array $images = []): Room
    {
        $attributes = $this->roomAttributes($data);

        if (isset($data['name']) && $data['name'] !== $room->name) {
            $attributes['slug'] = $this->uniqueSlug($data['name']);
        }

        $room->update($attributes);

        $this->attachImages($room, $images);

        return $room->load('images');
    }

    public function delete(Room $room): void
    {
        foreach ($room->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $room->delete(); // soft delete
    }

    private function roomAttributes(array $data): array
    {
        return array_filter([
            'name' => $data['name'] ?? null,
            'description' => $data['description'] ?? null,
            'type' => $data['type'] ?? null,
            'price' => $data['price'] ?? null,
            'capacity' => $data['capacity'] ?? null,
            'amenities' => $data['amenities'] ?? null,
            'total_units' => $data['total_units'] ?? null,
            'status' => $data['status'] ?? null,
        ], fn($value) => $value !== null);
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 1;

        while (Room::where('slug', $slug)->exists()) {
            $slug = "{$base}-" . ++$suffix;
        }

        return $slug;
    }

    /**
     * @param  UploadedFile[]  $images
     */
    private function attachImages(Room $room, array $images): void
    {
        if (empty($images)) {
            return;
        }

        $hasPrimary = $room->images()->where('is_primary', true)->exists();
        $nextOrder = (int) $room->images()->max('sort_order') + 1;

        foreach ($images as $index => $image) {
            $path = $image->store('rooms', 'public');

            $room->images()->create([
                'image_path' => $path,
                'is_primary' => ! $hasPrimary && $index === 0,
                'sort_order' => $nextOrder + $index,
            ]);
        }
    }
}
