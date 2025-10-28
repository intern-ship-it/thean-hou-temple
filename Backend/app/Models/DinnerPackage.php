<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DinnerPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_code',
        'package_name',
        'price_per_table',
        'description',
        'minimum_tables',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price_per_table' => 'decimal:2',
        'minimum_tables' => 'integer',
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

    // Helper Methods
    public function calculateTotal($numberOfTables): float
    {
        return (float) $this->price_per_table * $numberOfTables;
    }
}