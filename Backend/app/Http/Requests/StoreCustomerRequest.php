<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_type' => ['required', 'in:internal,external'],
            'name_english' => ['required', 'string', 'max:200'],
            'name_chinese' => ['nullable', 'string', 'max:200'],
            'ic_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'postcode' => ['nullable', 'string', 'max:10'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'contact_person' => ['required', 'string', 'max:200'],
            'contact_number' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:100'],
            'company_name' => ['nullable', 'string', 'max:200'],
            'remarks' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_type.required' => 'Customer type is required',
            'customer_type.in' => 'Customer type must be internal or external',
            'name_english.required' => 'English name is required',
            'contact_person.required' => 'Contact person is required',
            'contact_number.required' => 'Contact number is required',
            'email.email' => 'Please provide a valid email address',
        ];
    }
}