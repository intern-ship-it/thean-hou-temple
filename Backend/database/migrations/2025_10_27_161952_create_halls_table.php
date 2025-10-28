<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('halls', function (Blueprint $table) {
            $table->id();
            $table->string('hall_code', 20)->unique(); // MAIN, VIP, KARAOKE
            $table->string('hall_name', 100);
            $table->string('hall_name_chinese', 100)->nullable();
            $table->integer('capacity');
            $table->text('description')->nullable();
            $table->text('facilities')->nullable(); // JSON array of facilities
            $table->decimal('base_price_internal', 10, 2)->default(0);
            $table->decimal('base_price_external', 10, 2)->default(0);
            $table->integer('session_duration')->default(5); // hours
            $table->decimal('overtime_rate_15min', 10, 2)->default(0);
            $table->decimal('overtime_rate_after_midnight', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('hall_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('halls');
    }
};