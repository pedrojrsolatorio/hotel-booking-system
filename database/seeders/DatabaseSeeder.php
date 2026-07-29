<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Example admin account
        User::factory()->create([
            'name' => 'Hotel Admin',
            'email' => 'admin@hotel.test',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Example customer account
        User::factory()->create([
            'name' => 'Jane Customer',
            'email' => 'customer@hotel.test',
            'password' => bcrypt('password'),
            'role' => 'customer',
        ]);

        // Sample rooms with images
        Room::factory()
            ->count(12)
            ->create()
            ->each(function (Room $room) {
                $room->images()->createMany([
                    ['image_path' => 'rooms/placeholder-1.jpg', 'is_primary' => true, 'sort_order' => 1],
                    ['image_path' => 'rooms/placeholder-2.jpg', 'is_primary' => false, 'sort_order' => 2],
                ]);
            });

        $this->call(FaqSeeder::class);
    }
}
