<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'billing_item_id',
        'quantity',
        'unit_price',
        'total_price',
        'remarks',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    /**
     * Get the booking that owns this item
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the billing item
     */
    public function billingItem()
    {
        return $this->belongsTo(BillingItem::class);
    }

    /**
     * Calculate total price
     */
    public function calculateTotal()
    {
        $this->total_price = $this->quantity * $this->unit_price;
    }

    /**
     * Boot method to auto-calculate total
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            $item->calculateTotal();
        });

        static::updating(function ($item) {
            $item->calculateTotal();
        });
    }
}
