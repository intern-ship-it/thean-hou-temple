<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_id',
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
    public function quotation()
    {
        return $this->belongsTo(Quotation::class);
    }

    public function billingItem()
    {
        return $this->belongsTo(BillingItem::class);
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($quotationItem) {
            $quotationItem->subtotal = $quotationItem->quantity * $quotationItem->unit_price;
        });
    }
}