<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'customer_id',
        'hall_id',
        'booking_type',
        'event_date',
        'time_slot',
        'start_time',
        'end_time',
        'event_type',
        'guest_count',
        'status',
        'total_amount',
        'deposit_amount',
        'deposit_paid',
        'deposit_paid_date',
        'fifty_percent_paid',
        'fifty_percent_paid_date',
        'fully_paid',
        'fully_paid_date',
        'special_requests',
        'internal_notes',
        'cancelled_reason',
        'cancelled_at',
        'created_by',
    ];

    protected $casts = [
        'event_date' => 'date',
        'deposit_paid_date' => 'date',
        'fifty_percent_paid_date' => 'date',
        'fully_paid_date' => 'date',
        'cancelled_at' => 'datetime',
        'deposit_paid' => 'boolean',
        'fifty_percent_paid' => 'boolean',
        'fully_paid' => 'boolean',
        'total_amount' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'guest_count' => 'integer',
    ];

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->booking_code)) {
                $booking->booking_code = self::generateBookingCode();
            }
        });
    }

    // Relationships
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }

    public function bookingItems()
    {
        return $this->hasMany(BookingItem::class);
    }

    public function dinnerPackage()
    {
        return $this->hasOne(BookingDinnerPackage::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now()->toDateString())
            ->whereIn('status', ['confirmed', 'pending']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('event_date', [$startDate, $endDate]);
    }

    // Helper Methods
    public static function generateBookingCode(): string
    {
        $year = date('Y');
        $lastBooking = self::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        if ($lastBooking) {
            $lastNumber = (int) substr($lastBooking->booking_code, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return 'BK' . $year . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    public function calculateTotal(): float
    {
        $itemsTotal = $this->bookingItems()->sum('subtotal');
        $packageTotal = $this->dinnerPackage ? $this->dinnerPackage->total_package_amount : 0;

        return $itemsTotal + $packageTotal;
    }

    public function getRemainingBalance(): float
    {
        $totalPaid = $this->payments()->sum('amount');
        return (float) $this->total_amount - $totalPaid;
    }

    public function needsFiftyPercentPayment(): bool
    {
        return $this->booking_type === 'dinner_package'
            && !$this->fifty_percent_paid
            && $this->event_date->diffInDays(now()) <= 30;
    }

    public function needsFullPayment(): bool
    {
        $daysBeforeEvent = $this->booking_type === 'dinner_package' ? 14 : 21;
        return !$this->fully_paid
            && $this->event_date->diffInDays(now()) <= $daysBeforeEvent;
    }
}