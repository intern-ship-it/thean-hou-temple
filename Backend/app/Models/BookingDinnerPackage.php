<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingDinnerPackage extends Model
{
    protected $fillable = [
        'booking_id',
        'dinner_package_id',    // or 'package_id' 
        'catering_vendor_id',   // or 'vendor_id'
        'number_of_tables',
        'price_per_table',      // ADD THIS
        'total_amount',         // ADD THIS - IMPORTANT!
        'special_menu_requests',
    ];

    protected $casts = [
        'number_of_tables' => 'integer',
        'price_per_table' => 'decimal:2',
        'total_amount' => 'decimal:2',  // ADD THIS
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function package()
    {
        return $this->belongsTo(DinnerPackage::class, 'dinner_package_id');
        // OR if your column is 'package_id':
        // return $this->belongsTo(DinnerPackage::class, 'package_id');
    }

    public function vendor()
    {
        return $this->belongsTo(CateringVendor::class, 'catering_vendor_id');
        // OR if your column is 'vendor_id':
        // return $this->belongsTo(CateringVendor::class, 'vendor_id');
    }
}