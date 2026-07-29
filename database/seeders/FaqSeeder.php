<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Faq;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            ['category' => 'booking', 'question' => 'What time is check-in and check-out?', 'answer' => 'Check-in is from 2:00 PM and check-out is by 12:00 PM (noon). Early check-in and late check-out may be available on request.'],
            ['category' => 'booking', 'question' => 'Can I cancel my booking?', 'answer' => 'Yes, bookings can be cancelled free of charge up to 48 hours before check-in from your account dashboard.'],
            ['category' => 'payment', 'question' => 'What payment methods do you accept?', 'answer' => 'We accept major credit/debit cards and PayPal. Payment is processed securely at the time of booking confirmation.'],
            ['category' => 'amenities', 'question' => 'Is breakfast included?', 'answer' => 'Breakfast is included with Suite and Executive Suite bookings. Standard and Deluxe rooms can add breakfast during checkout.'],
            ['category' => 'general', 'question' => 'Do you allow pets?', 'answer' => 'Select rooms are pet-friendly. Please mention this in your special requests when booking so we can assign an appropriate room.'],
        ];

        foreach ($faqs as $index => $faq) {
            Faq::create($faq + ['sort_order' => $index + 1]);
        }
    }
}
