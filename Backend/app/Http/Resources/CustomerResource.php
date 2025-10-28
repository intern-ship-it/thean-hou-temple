<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_code' => $this->customer_code,
            'customer_type' => $this->customer_type,
            'name_english' => $this->name_english,
            'name_chinese' => $this->name_chinese,
            'full_name' => $this->full_name,
            'ic_number' => $this->ic_number,
            'address' => $this->address,
            'postcode' => $this->postcode,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'contact_person' => $this->contact_person,
            'contact_number' => $this->contact_number,
            'email' => $this->email,
            'company_name' => $this->company_name,
            'remarks' => $this->remarks,
            'is_active' => $this->is_active,
            'is_internal' => $this->isInternal(),
            'total_bookings' => $this->bookings()->count(),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}