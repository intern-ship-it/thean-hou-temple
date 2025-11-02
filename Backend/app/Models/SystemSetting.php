<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'setting_key',
        'setting_label',
        'setting_value',
        'setting_type',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getDecodedValueAttribute()
    {
        if ($this->setting_type === 'json') {
            return json_decode($this->setting_value, true);
        }
        return $this->setting_value;
    }

    public static function getByKey($key)
    {
        $setting = self::where('setting_key', $key)->where('is_active', true)->first();
        return $setting ? $setting->decoded_value : null;
    }
}