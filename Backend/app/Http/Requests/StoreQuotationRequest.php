<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuotationRequest extends FormRequest
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
            'quotation_type' => ['required', 'in:standard,dinner_package'],
            'event_date' => ['nullable', 'date', 'after_or_equal:today'],
            'time_slot' => ['nullable', 'in:morning,evening'],
            'valid_until' => ['nullable', 'date', 'after:today'],
            'notes' => ['nullable', 'string'],

            // Quotation items
            'items' => ['required', 'array', 'min:1'],
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
            'customer_id.exists' => 'Selected customer does not exist',
            'hall_id.required' => 'Hall is required',
            'hall_id.exists' => 'Selected hall does not exist',
            'quotation_type.required' => 'Quotation type is required',
            'items.required' => 'At least one item is required',
            'items.min' => 'At least one item is required',
        ];
    }
}