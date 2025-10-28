<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dinner_packages', function (Blueprint $table) {
            $table->id();
            $table->string('package_code', 20)->unique(); // PKG_A, PKG_B, PKG_C
            $table->string('package_name', 100);
            $table->string('package_name_chinese', 100)->nullable();
            $table->decimal('price_per_table', 10, 2);
            $table->integer('min_tables')->default(50);
            $table->text('description')->nullable();
            $table->json('includes')->nullable(); // Array of included items
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dinner_packages');
    }
};