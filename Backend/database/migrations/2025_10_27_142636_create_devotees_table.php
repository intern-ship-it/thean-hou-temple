<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devotees', function (Blueprint $table) {
            $table->id();
            $table->string('devotee_code')->unique(); // DEV00001
            $table->string('name_english');
            $table->string('name_chinese')->nullable();
            $table->string('ic_number')->unique();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('postcode')->nullable();
            $table->string('city');
            $table->string('state');
            $table->string('country')->default('Malaysia');
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female'])->default('male');
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            // Indexes for faster search
            $table->index('devotee_code');
            $table->index('ic_number');
            $table->index('phone');
            $table->index('name_english');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devotees');
    }
};