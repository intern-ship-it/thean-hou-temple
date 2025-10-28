<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_code', 20)->unique(); // CUST00001
            $table->enum('customer_type', ['internal', 'external'])->default('external');
            $table->string('name_english', 200);
            $table->string('name_chinese', 200)->nullable();
            $table->string('ic_number', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('postcode', 10)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('country', 100)->default('Malaysia');
            $table->string('contact_person', 200);
            $table->string('contact_number', 20);
            $table->string('email', 100)->nullable();
            $table->foreignId('member_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('remarks')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('customer_code');
            $table->index('customer_type');
            $table->index('contact_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};