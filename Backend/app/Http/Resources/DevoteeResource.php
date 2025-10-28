<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DevoteeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'devotee_code' => $this->devotee_code,
            'name_english' => $this->name_english,
            'name_chinese' => $this->name_chinese,
            'full_name' => $this->full_name,
            'ic_number' => $this->ic_number,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'postcode' => $this->postcode,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'age' => $this->age,
            'gender' => $this->gender,
            'notes' => $this->notes,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}