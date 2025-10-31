<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BillingItem extends Model
{
    use HasFactory, SoftDeletes;

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
        'internal_price' => 'decimal:2',
        'external_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get only active items
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get items by category
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Get booking items
     */
    public function bookingItems()
    {
        return $this->hasMany(BookingItem::class);
    }

    /**
     * Get quotation items
     */
    public function quotationItems()
    {
        return $this->hasMany(QuotationItem::class);
    }

    /**
     * Get price based on customer type
     */
    public function getPriceForCustomerType(string $customerType): float
    {
        return $customerType === 'internal' 
            ? $this->internal_price 
            : $this->external_price;
    }
}