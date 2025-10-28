<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuotationRequest extends FormRequest
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
            'event_date' => ['nullable', 'date'],
            'time_slot' => ['nullable', 'in:morning,evening'],
            'valid_until' => ['nullable', 'date'],
            'status' => ['nullable', 'in:draft,sent,accepted,rejected,expired'],
            'notes' => ['nullable', 'string'],

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
            'quotation_type.required' => 'Quotation type is required',
        ];
    }
}