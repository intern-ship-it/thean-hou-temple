<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@theanhou.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'phone' => '0123456789',
            'is_active' => true,
        ]);

        // Temple Staff (Developer 1)
        User::create([
            'name' => 'Temple Staff',
            'email' => 'temple@theanhou.com',
            'password' => Hash::make('password123'),
            'role' => 'temple_staff',
            'phone' => '0123456788',
            'is_active' => true,
        ]);

        // Hall Manager (Developer 2)
        User::create([
            'name' => 'Hall Manager',
            'email' => 'hall@theanhou.com',
            'password' => Hash::make('password123'),
            'role' => 'hall_manager',
            'phone' => '0123456787',
            'is_active' => true,
        ]);

        // Accountant
        User::create([
            'name' => 'Accountant',
            'email' => 'accountant@theanhou.com',
            'password' => Hash::make('password123'),
            'role' => 'accountant',
            'phone' => '0123456786',
            'is_active' => true,
        ]);
    }
}