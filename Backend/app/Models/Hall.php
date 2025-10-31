<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hall extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'hall_code',
        'hall_name',
        'hall_name_chinese',
        'capacity',
        'description',
        'facilities',
        'location', 
        'internal_price',
        'external_price',
        'session_duration',
        'overtime_rate_15min',
        'overtime_rate_after_midnight',
        'is_active',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'internal_price' => 'decimal:2',
        'external_price' => 'decimal:2',
        'session_duration' => 'integer',
        'overtime_rate_15min' => 'decimal:2',
        'overtime_rate_after_midnight' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get only active halls
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get bookings for this hall
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Check if hall is available for a specific date and time slot
     */
    public function isAvailable(string $eventDate, string $timeSlot): bool
    {
        return !$this->bookings()
            ->where('event_date', $eventDate)
            ->where('time_slot', $timeSlot)
            ->whereNotIn('status', ['cancelled'])
            ->exists();
    }

    /**
     * Get hall price based on customer type
     */
    public function getPrice(string $customerType): float
    {
        return $customerType === 'internal'
            ? $this->internal_price
            : $this->external_price;
    }
}