<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    protected $model = Room::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = [
            'Standard' => [80, 120],
            'Deluxe' => [130, 180],
            'Suite' => [200, 280],
            'Executive Suite' => [300, 450],
        ];

        $type = array_rand($types);
        [$min, $max] = $types[$type];

        $name = $type . ' Room ' . $this->faker->numberBetween(100, 599);

        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::random(4),
            'description' => $this->faker->paragraphs(3, true),
            'type' => $type,
            'price' => $this->faker->numberBetween($min, $max),
            'capacity' => match ($type) {
                'Standard' => 2,
                'Deluxe' => 3,
                'Suite' => 4,
                'Executive Suite' => 6,
                default => 2,
            },
            'amenities' => $this->faker->randomElements(
                ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Ocean View', 'Balcony', 'Room Service', 'Jacuzzi', 'Coffee Maker', 'Safe'],
                $this->faker->numberBetween(4, 7)
            ),
            'total_units' => $this->faker->numberBetween(3, 10),
            'status' => 'available',
        ];
    }
}
