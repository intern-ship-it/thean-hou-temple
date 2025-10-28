<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_code',
        'booking_id',
        'payment_type',
        'amount',
        'payment_method',
        'payment_date',
        'reference_number',
        'cheque_number',
        'bank_name',
        'remarks',
        'receipt_number',
        'created_by',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            if (empty($payment->payment_code)) {
                $payment->payment_code = self::generatePaymentCode();
            }
        });
    }

    // Relationships
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Helper Methods
    public static function generatePaymentCode(): string
    {
        $year = date('Y');
        $lastPayment = self::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        if ($lastPayment) {
            $lastNumber = (int) substr($lastPayment->payment_code, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return 'PAY' . $year . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }
}