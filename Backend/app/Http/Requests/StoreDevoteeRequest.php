<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDevoteeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name_english' => ['required', 'string', 'max:255'],
            'name_chinese' => ['nullable', 'string', 'max:255'],
            'ic_number' => ['required', 'string', 'max:20', 'unique:devotees,ic_number'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'postcode' => ['nullable', 'string', 'max:10'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['required', 'in:male,female'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name_english.required' => 'English name is required',
            'ic_number.required' => 'IC number is required',
            'ic_number.unique' => 'This IC number is already registered',
            'phone.required' => 'Phone number is required',
            'email.email' => 'Please provide a valid email address',
            'city.required' => 'City is required',
            'state.required' => 'State is required',
            'date_of_birth.before' => 'Date of birth must be in the past',
            'gender.in' => 'Gender must be either male or female',
        ];
    }
}