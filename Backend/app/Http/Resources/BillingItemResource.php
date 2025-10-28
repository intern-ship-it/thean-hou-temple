<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillingItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item_code' => $this->item_code,
            'item_name' => $this->item_name,
            'description' => $this->description,
            'category' => $this->category,
            'internal_price' => (float) $this->internal_price,
            'external_price' => (float) $this->external_price,
            'unit' => $this->unit,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}