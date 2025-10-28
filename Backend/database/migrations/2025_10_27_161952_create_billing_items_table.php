<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('billing_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_code', 50)->unique();
            $table->string('item_name', 200);
            $table->string('item_name_chinese', 200)->nullable();
            $table->text('description')->nullable();
            $table->enum('item_category', [
                'hall_rental',
                'room',
                'equipment',
                'furniture',
                'service',
                'overtime',
                'deposit',
                'other'
            ]);
            $table->decimal('price_internal', 10, 2)->default(0);
            $table->decimal('price_external', 10, 2)->default(0);
            $table->enum('pricing_unit', ['per_session', 'per_hour', 'per_item', 'per_set', 'fixed'])->default('per_item');
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index('item_code');
            $table->index('item_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_items');
    }
};