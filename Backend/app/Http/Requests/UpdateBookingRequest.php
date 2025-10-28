<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
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
            'event_date' => ['required', 'date'],
            'time_slot' => ['required', 'in:morning,evening'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'event_type' => ['nullable', 'string', 'max:100'],
            'guest_count' => ['nullable', 'integer', 'min:1'],
            'status' => ['nullable', 'in:pending,confirmed,completed,cancelled'],
            'special_requests' => ['nullable', 'string'],
            'internal_notes' => ['nullable', 'string'],
            'cancelled_reason' => ['required_if:status,cancelled', 'string'],

            // Payment flags
            'deposit_paid' => ['nullable', 'boolean'],
            'deposit_paid_date' => ['nullable', 'date'],
            'fifty_percent_paid' => ['nullable', 'boolean'],
            'fifty_percent_paid_date' => ['nullable', 'date'],
            'fully_paid' => ['nullable', 'boolean'],
            'fully_paid_date' => ['nullable', 'date'],

            // Items (optional for update)
            'items' => ['nullable', 'array'],
            'items.*.billing_item_id' => ['required', 'exists:billing_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.remarks' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer is required',
            'hall_id.required' => 'Hall is required',
            'event_date.required' => 'Event date is required',
            'time_slot.required' => 'Time slot is required',
            'cancelled_reason.required_if' => 'Cancellation reason is required when status is cancelled',
        ];
    }
}