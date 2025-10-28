<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Get user's permissions based on role
     */
    public function getPermissions(): array
    {
        return match ($this->role) {
            'super_admin' => ['*'], // All permissions
            'hall_manager' => [
                'hall_booking.view',
                'hall_booking.create',
                'hall_booking.edit',
                'hall_booking.approve',
            ],
            'temple_staff' => [
                'temple_operations.view',
                'temple_operations.create',
                'temple_operations.edit',
            ],
            'accountant' => [
                'reports.view',
                'financial.view',
            ],
            default => [],
        };
    }
}