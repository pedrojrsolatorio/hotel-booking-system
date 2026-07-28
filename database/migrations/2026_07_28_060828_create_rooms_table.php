<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('type'); // e.g. Standard, Deluxe, Suite, Executive
            $table->decimal('price', 10, 2);
            $table->unsignedTinyInteger('capacity');
            $table->json('amenities')->nullable(); // ["WiFi", "AC", "TV", ...]
            $table->unsignedInteger('total_units')->default(1); // how many rooms of this type exist
            $table->enum('status', ['available', 'unavailable', 'maintenance'])->default('available');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
