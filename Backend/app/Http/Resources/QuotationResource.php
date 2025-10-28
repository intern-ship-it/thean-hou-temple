<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuotationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quotation_code' => $this->quotation_code,
            'quotation_type' => $this->quotation_type,

            // Customer & Hall
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'customer_id' => $this->customer_id,
            'hall' => new HallResource($this->whenLoaded('hall')),
            'hall_id' => $this->hall_id,

            // Event details
            'event_date' => $this->event_date?->format('Y-m-d'),
            'time_slot' => $this->time_slot,

            // Financial
            'total_amount' => (float) $this->total_amount,

            // Validity
            'valid_until' => $this->valid_until?->format('Y-m-d'),
            'is_expired' => $this->isExpired(),

            // Status
            'status' => $this->status,
            'accepted_at' => $this->accepted_at?->format('Y-m-d H:i:s'),

            // Items
            'quotation_items' => $this->whenLoaded('quotationItems', function () {
                return $this->quotationItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'billing_item' => new BillingItemResource($item->billingItem),
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'subtotal' => (float) $item->subtotal,
                        'remarks' => $item->remarks,
                    ];
                });
            }),

            // Notes
            'notes' => $this->notes,

            // Meta
            'created_by' => $this->created_by,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}