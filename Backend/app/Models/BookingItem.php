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
        'subtotal',
        'remarks',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Relationships
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function billingItem()
    {
        return $this->belongsTo(BillingItem::class);
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($bookingItem) {
            $bookingItem->subtotal = $bookingItem->quantity * $bookingItem->unit_price;
        });
    }
}