<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_code',
        'customer_type',
        'name_english',
        'name_chinese',
        'ic_number',
        'address',
        'postcode',
        'city',
        'state',
        'country',
        'contact_person',
        'contact_number',
        'email',
        'company_name',
        'remarks',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Boot method for auto-generating customer code
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            if (empty($customer->customer_code)) {
                $customer->customer_code = self::generateCustomerCode();
            }
        });
    }

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
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('name_english', 'like', "%{$search}%")
                    ->orWhere('name_chinese', 'like', "%{$search}%")
                    ->orWhere('customer_code', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }
        return $query;
    }

    public function scopeInternal($query)
    {
        return $query->where('customer_type', 'internal');
    }

    public function scopeExternal($query)
    {
        return $query->where('customer_type', 'external');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helper Methods
    public static function generateCustomerCode(): string
    {
        $lastCustomer = self::orderBy('id', 'desc')->first();

        if ($lastCustomer) {
            $lastNumber = (int) substr($lastCustomer->customer_code, 4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return 'CUST' . str_pad($newNumber, 5, '0', STR_PAD_LEFT);
    }

    public function getFullNameAttribute(): string
    {
        return $this->name_english .
            ($this->name_chinese ? " ({$this->name_chinese})" : '');
    }

    public function isInternal(): bool
    {
        return $this->customer_type === 'internal';
    }
}