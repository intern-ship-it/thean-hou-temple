<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    use HasFactory;

    protected $fillable = [
        'hall_name',
        'capacity',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'capacity' => 'integer',
    ];

    // Relationships
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function quotations()
    {
        return $this->hasMany(Quotation::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helper Methods
    public function isAvailable($date, $timeSlot)
    {
        return !$this->bookings()
            ->where('event_date', $date)
            ->where('time_slot', $timeSlot)
            ->whereIn('status', ['confirmed', 'pending'])
            ->exists();
    }
}