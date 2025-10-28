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
        'total_package_amount',
        'special_menu_requests',
    ];

    protected $casts = [
        'number_of_tables' => 'integer',
        'price_per_table' => 'decimal:2',
        'total_package_amount' => 'decimal:2',
    ];

    // Relationships
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function dinnerPackage()
    {
        return $this->belongsTo(DinnerPackage::class);
    }

    public function cateringVendor()
    {
        return $this->belongsTo(CateringVendor::class);
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($packageBooking) {
            $packageBooking->total_package_amount =
                $packageBooking->number_of_tables * $packageBooking->price_per_table;
        });
    }
}