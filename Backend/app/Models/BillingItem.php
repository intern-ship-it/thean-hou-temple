<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillingItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_code',
        'item_name',
        'description',
        'category',
        'internal_price',
        'external_price',
        'unit',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'internal_price' => 'decimal:2',
        'external_price' => 'decimal:2',
    ];

    // Relationships
    public function bookingItems()
    {
        return $this->hasMany(BookingItem::class);
    }

    public function quotationItems()
    {
        return $this->hasMany(QuotationItem::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Helper Methods
    public function getPriceForCustomerType($customerType): float
    {
        return $customerType === 'internal'
            ? (float) $this->internal_price
            : (float) $this->external_price;
    }
}