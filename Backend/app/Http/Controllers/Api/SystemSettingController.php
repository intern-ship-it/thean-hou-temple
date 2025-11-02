<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SystemSettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::where('is_active', true)->get()->map(function ($setting) {
            return [
                'id' => $setting->id,
                'key' => $setting->setting_key,
                'label' => $setting->setting_label,
                'value' => $setting->decoded_value,
                'type' => $setting->setting_type,
                'description' => $setting->description,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function getBookingSettings()
    {
        $settings = [
            'time_slots' => SystemSetting::getByKey('time_slots'),
            'booking_types' => SystemSetting::getByKey('booking_types'),
            'customer_types' => SystemSetting::getByKey('customer_types'),
            'booking_statuses' => SystemSetting::getByKey('booking_statuses'),
            'min_dinner_tables' => SystemSetting::getByKey('min_dinner_tables'),
            'default_tax_percentage' => SystemSetting::getByKey('default_tax_percentage'),
        ];

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function show($id)
    {
        $setting = SystemSetting::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $setting->id,
                'key' => $setting->setting_key,
                'label' => $setting->setting_label,
                'value' => $setting->decoded_value,
                'type' => $setting->setting_type,
                'description' => $setting->description,
                'is_active' => $setting->is_active,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $setting = SystemSetting::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'setting_label' => 'sometimes|required|string|max:255',
            'setting_value' => 'required',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $value = $request->setting_value;
        if ($setting->setting_type === 'json' && is_array($value)) {
            $value = json_encode($value);
        }

        $setting->update([
            'setting_label' => $request->setting_label ?? $setting->setting_label,
            'setting_value' => $value,
            'description' => $request->description ?? $setting->description,
            'is_active' => $request->is_active ?? $setting->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Setting updated successfully',
            'data' => [
                'id' => $setting->id,
                'key' => $setting->setting_key,
                'label' => $setting->setting_label,
                'value' => $setting->decoded_value,
                'type' => $setting->setting_type,
                'description' => $setting->description,
                'is_active' => $setting->is_active,
            ]
        ]);
    }
}