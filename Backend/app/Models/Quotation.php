<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_code',
        'customer_id',
        'hall_id',
        'event_date',
        'time_slot',
        'quotation_type',
        'total_amount',
        'valid_until',
        'status',
        'notes',
        'created_by',
        'accepted_at',
    ];

    protected $casts = [
        'event_date' => 'date',
        'valid_until' => 'date',
        'accepted_at' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quotation) {
            if (empty($quotation->quotation_code)) {
                $quotation->quotation_code = self::generateQuotationCode();
            }

            // Set valid_until to 30 days from now if not set
            if (empty($quotation->valid_until)) {
                $quotation->valid_until = now()->addDays(30);
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

    public function quotationItems()
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeExpired($query)
    {
        return $query->where('valid_until', '<', now())
            ->where('status', '!=', 'accepted');
    }

    // Helper Methods
    public static function generateQuotationCode(): string
    {
        $year = date('Y');
        $lastQuotation = self::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        if ($lastQuotation) {
            $lastNumber = (int) substr($lastQuotation->quotation_code, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return 'QT' . $year . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    public function calculateTotal(): float
    {
        return $this->quotationItems()->sum('subtotal');
    }

    public function isExpired(): bool
    {
        return $this->valid_until < now() && $this->status !== 'accepted';
    }
}