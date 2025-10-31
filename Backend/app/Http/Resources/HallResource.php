<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HallResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hall_code' => $this->hall_code,
            'hall_name' => $this->hall_name,
            'hall_name_chinese' => $this->hall_name_chinese,
            'location' => $this->location,
            'internal_price' => (float) $this->internal_price,
            'external_price' => (float) $this->external_price,
            'capacity' => $this->capacity,
            'description' => $this->description,
            'facilities' => $this->facilities ? json_decode($this->facilities, true) : [],
           
            'session_duration' => $this->session_duration,
            'overtime_rate_15min' => (float) $this->overtime_rate_15min,
            'overtime_rate_after_midnight' => (float) $this->overtime_rate_after_midnight,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}