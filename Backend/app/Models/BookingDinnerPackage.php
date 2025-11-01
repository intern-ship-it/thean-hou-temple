<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingDinnerPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'dinner_package_id',
        'catering_vendor_id',
        'number_of_tables',
        'price_per_table',
        'total_package_amount', // ← CHANGED FROM total_amount
        'special_menu_requests',
    ];

    protected $casts = [
        'number_of_tables' => 'integer',
        'price_per_table' => 'decimal:2',
        'total_package_amount' => 'decimal:2', // ← CHANGED FROM total_amount
    ];

    /**
     * Get the booking that owns this dinner package
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the dinner package
     */
    public function package()
    {
        return $this->belongsTo(DinnerPackage::class, 'dinner_package_id');
    }

    /**
     * Get the catering vendor
     */
    public function vendor()
    {
        return $this->belongsTo(CateringVendor::class, 'catering_vendor_id');
    }

    /**
     * Calculate total amount based on package price and number of tables
     */
    public function calculateTotal()
    {
        if ($this->package) {
            $this->price_per_table = $this->package->price_per_table;
            $this->total_package_amount = $this->price_per_table * $this->number_of_tables;
        }
    }

    /**
     * Boot method to auto-calculate total
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($dinnerPackage) {
            $dinnerPackage->calculateTotal();
        });

        static::updating(function ($dinnerPackage) {
            $dinnerPackage->calculateTotal();
        });
    }
}