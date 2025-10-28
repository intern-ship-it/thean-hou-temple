<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'hall_id' => ['required', 'exists:halls,id'],
            'booking_type' => ['required', 'in:standard,dinner_package'],
            'event_date' => ['required', 'date', 'after_or_equal:today'],
            'time_slot' => ['required', 'in:morning,evening'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'event_type' => ['nullable', 'string', 'max:100'],
            'guest_count' => ['nullable', 'integer', 'min:1'],
            'status' => ['nullable', 'in:pending,confirmed,completed,cancelled'],
            'special_requests' => ['nullable', 'string'],
            'internal_notes' => ['nullable', 'string'],

            // Booking items
            'items' => ['required', 'array', 'min:1'],
            'items.*.billing_item_id' => ['required', 'exists:billing_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.remarks' => ['nullable', 'string'],

            // Dinner package (only if booking_type is dinner_package)
            'dinner_package' => ['required_if:booking_type,dinner_package', 'array'],
            'dinner_package.dinner_package_id' => ['required_with:dinner_package', 'exists:dinner_packages,id'],
            'dinner_package.catering_vendor_id' => ['required_with:dinner_package', 'exists:catering_vendors,id'],
            'dinner_package.number_of_tables' => ['required_with:dinner_package', 'integer', 'min:50'],
            'dinner_package.special_menu_requests' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer is required',
            'customer_id.exists' => 'Selected customer does not exist',
            'hall_id.required' => 'Hall is required',
            'hall_id.exists' => 'Selected hall does not exist',
            'event_date.required' => 'Event date is required',
            'event_date.after_or_equal' => 'Event date cannot be in the past',
            'time_slot.required' => 'Time slot is required',
            'items.required' => 'At least one billing item is required',
            'items.min' => 'At least one billing item is required',
            'dinner_package.required_if' => 'Dinner package details are required for dinner package bookings',
            'dinner_package.number_of_tables.min' => 'Minimum 50 tables required for dinner packages',
        ];
    }
}