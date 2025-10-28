<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DinnerPackageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'package_code' => $this->package_code,
            'package_name' => $this->package_name,
            'price_per_table' => (float) $this->price_per_table,
            'description' => $this->description,
            'minimum_tables' => $this->minimum_tables,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}