<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'payment_code' => $this->payment_code,
            'booking_id' => $this->booking_id,
            'payment_type' => $this->payment_type,
            'amount' => (float) $this->amount,
            'payment_method' => $this->payment_method,
            'payment_date' => $this->payment_date?->format('Y-m-d'),
            'reference_number' => $this->reference_number,
            'cheque_number' => $this->cheque_number,
            'bank_name' => $this->bank_name,
            'remarks' => $this->remarks,
            'receipt_number' => $this->receipt_number,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}