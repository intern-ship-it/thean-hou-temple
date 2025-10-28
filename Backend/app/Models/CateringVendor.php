<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CateringVendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_name',
        'vendor_name_chinese',
        'vendor_type',
        'contact_person',
        'contact_number',
        'email',
        'address',
        'remarks',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationships
    public function bookingDinnerPackages()
    {
        return $this->hasMany(BookingDinnerPackage::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVegetarian($query)
    {
        return $query->where('vendor_type', 'vegetarian');
    }

    public function scopeNonVegetarian($query)
    {
        return $query->where('vendor_type', 'non_vegetarian');
    }

    // Helper Methods
    public function getFullNameAttribute(): string
    {
        return $this->vendor_name .
            ($this->vendor_name_chinese ? " ({$this->vendor_name_chinese})" : '');
    }
}