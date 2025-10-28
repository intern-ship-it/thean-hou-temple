<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Devotee extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'devotee_code',
        'name_english',
        'name_chinese',
        'ic_number',
        'phone',
        'email',
        'address',
        'postcode',
        'city',
        'state',
        'country',
        'date_of_birth',
        'gender',
        'notes',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'date_of_birth' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate devotee code before creating
        static::creating(function ($devotee) {
            if (empty($devotee->devotee_code)) {
                $devotee->devotee_code = self::generateDevoteeCode();
            }
        });
    }

    /**
     * Generate unique devotee code
     */
    public static function generateDevoteeCode(): string
    {
        $lastDevotee = self::withTrashed()
            ->orderBy('id', 'desc')
            ->first();

        if ($lastDevotee) {
            $lastNumber = (int) substr($lastDevotee->devotee_code, 3);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return 'DEV' . str_pad($newNumber, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Scope: Search devotees
     */
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('name_english', 'like', "%{$search}%")
                    ->orWhere('name_chinese', 'like', "%{$search}%")
                    ->orWhere('devotee_code', 'like', "%{$search}%")
                    ->orWhere('ic_number', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    /**
     * Scope: Active devotees only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Inactive devotees only
     */
    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    /**
     * Get full name (English + Chinese)
     */
    public function getFullNameAttribute(): string
    {
        return $this->name_english .
            ($this->name_chinese ? " ({$this->name_chinese})" : '');
    }

    /**
     * Get age from date of birth
     */
    public function getAgeAttribute(): ?int
    {
        if ($this->date_of_birth) {
            return $this->date_of_birth->age;
        }
        return null;
    }
}