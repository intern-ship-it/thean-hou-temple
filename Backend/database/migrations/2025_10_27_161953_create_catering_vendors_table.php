<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('catering_vendors', function (Blueprint $table) {
            $table->id();
            $table->string('vendor_code', 20)->unique(); // VENDOR001
            $table->string('restaurant_name', 200);
            $table->string('restaurant_name_chinese', 200)->nullable();
            $table->enum('vendor_type', ['non_vegetarian', 'vegetarian']);
            $table->string('contact_person', 100);
            $table->string('contact_number', 20);
            $table->string('email', 100)->nullable();
            $table->text('address')->nullable();
            $table->text('menu_description')->nullable();
            $table->text('remarks')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('vendor_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catering_vendors');
    }
};