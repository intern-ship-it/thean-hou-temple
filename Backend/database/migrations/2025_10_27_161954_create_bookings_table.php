<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number', 50)->unique(); // BKG-2025-00001
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('hall_id')->constrained('halls')->restrictOnDelete();
            $table->date('event_date');
            $table->enum('time_slot', ['morning', 'evening']); // 9AM-2PM or 6PM-11PM
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('booking_type', ['standard', 'dinner_package'])->default('standard');

            // Dinner package fields
            $table->foreignId('dinner_package_id')->nullable()->constrained('dinner_packages')->nullOnDelete();
            $table->foreignId('catering_vendor_id')->nullable()->constrained('catering_vendors')->nullOnDelete();
            $table->integer('number_of_tables')->nullable();

            // Event details
            $table->string('event_type', 100); // Wedding, Birthday, Corporate, etc.
            $table->text('special_requirements')->nullable();

            // Financial
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('balance_amount', 10, 2)->default(0);

            // Deposits
            $table->decimal('deposit_amount', 10, 2)->default(5000.00);
            $table->boolean('deposit_paid')->default(false);
            $table->date('deposit_paid_date')->nullable();
            $table->decimal('refundable_deposit', 10, 2)->default(0);
            $table->boolean('deposit_refunded')->default(false);

            // Status
            $table->enum('status', [
                'draft',
                'quotation_sent',
                'confirmed',
                'deposit_paid',
                'partially_paid',
                'fully_paid',
                'completed',
                'cancelled'
            ])->default('draft');

            // Dates
            $table->date('quotation_sent_date')->nullable();
            $table->date('confirmed_date')->nullable();
            $table->date('cancelled_date')->nullable();
            $table->text('cancellation_reason')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('booking_number');
            $table->index('event_date');
            $table->index('status');
            $table->unique(['hall_id', 'event_date', 'time_slot'], 'unique_hall_booking');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};