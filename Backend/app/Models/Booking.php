<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'customer_id',
        'hall_id',
        'booking_type',
        'event_date',
        'time_slot',
        'start_time',
        'end_time',
        'event_type',
        'guest_count',
        'status',
        'hall_rental_amount',
        'additional_items_amount',
        'dinner_package_amount',
        'subtotal',
        'discount_amount',
        'discount_percentage',
        'tax_amount',
        'tax_percentage',
        'total_amount',
        'deposit_amount',
        'balance_amount',
        'special_requests',
        'internal_notes',
    ];

    protected $casts = [
        'event_date' => 'date',
        'guest_count' => 'integer',
        'hall_rental_amount' => 'decimal:2',
        'additional_items_amount' => 'decimal:2',
        'dinner_package_amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'tax_percentage' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'balance_amount' => 'decimal:2',
    ];

    /**
     * Get the customer that owns the booking
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the hall for this booking
     */
    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }

    /**
     * Get the booking items
     */
    public function bookingItems()
    {
        return $this->hasMany(BookingItem::class);
    }

    /**
     * Get the dinner package for this booking
     */
    public function dinnerPackage()
    {
        return $this->hasOne(BookingDinnerPackage::class);
    }

    /**
     * Generate unique booking code
     */
    public static function generateBookingCode()
    {
        $date = now()->format('Ymd');
        $lastBooking = self::whereDate('created_at', now())->latest('id')->first();
        $sequence = $lastBooking ? (intval(substr($lastBooking->booking_code, -4)) + 1) : 1;

        return 'BK' . $date . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Boot method to auto-generate booking code
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->booking_code)) {
                $booking->booking_code = self::generateBookingCode();
            }
        });
    }

    /**
     * Calculate all totals for this booking
     */
    public function calculateTotals()
    {
        // 1. Hall Rental Amount
        if ($this->hall && $this->customer) {
            $this->hall_rental_amount = $this->customer->customer_type === 'internal'
                ? $this->hall->rental_rate_internal
                : $this->hall->rental_rate_external;
        }

        // 2. Additional Items Amount
        $this->additional_items_amount = $this->bookingItems()->sum('total_price');

        // 3. Dinner Package Amount
        $this->dinner_package_amount = $this->dinnerPackage ? $this->dinnerPackage->total_amount : 0;

        // 4. Subtotal
        $this->subtotal = $this->hall_rental_amount + $this->additional_items_amount + $this->dinner_package_amount;

        // 5. Discount Amount
        if ($this->discount_percentage > 0) {
            $this->discount_amount = ($this->subtotal * $this->discount_percentage) / 100;
        } else {
            $this->discount_amount = 0;
        }

        // 6. After Discount
        $afterDiscount = $this->subtotal - $this->discount_amount;

        // 7. Tax Amount
        if ($this->tax_percentage > 0) {
            $this->tax_amount = ($afterDiscount * $this->tax_percentage) / 100;
        } else {
            $this->tax_amount = 0;
        }

        // 8. Total Amount
        $this->total_amount = $afterDiscount + $this->tax_amount;

        // 9. Balance Amount
        $this->balance_amount = $this->total_amount - ($this->deposit_amount ?? 0);
    }
}