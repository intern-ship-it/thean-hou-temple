<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'booking_id' => ['required', 'exists:bookings,id'],
            'payment_type' => ['required', 'in:deposit,partial,full,refund'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'in:cash,cheque,online_banking,credit_card,debit_card,duitnow'],
            'payment_date' => ['required', 'date', 'before_or_equal:today'],
            'reference_number' => ['nullable', 'string', 'max:100'],
            'cheque_number' => ['required_if:payment_method,cheque', 'string', 'max:50'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'remarks' => ['nullable', 'string'],
            'receipt_number' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'booking_id.required' => 'Booking is required',
            'booking_id.exists' => 'Selected booking does not exist',
            'payment_type.required' => 'Payment type is required',
            'amount.required' => 'Amount is required',
            'amount.min' => 'Amount must be greater than 0',
            'payment_method.required' => 'Payment method is required',
            'payment_date.required' => 'Payment date is required',
            'payment_date.before_or_equal' => 'Payment date cannot be in the future',
            'cheque_number.required_if' => 'Cheque number is required when payment method is cheque',
        ];
    }
}