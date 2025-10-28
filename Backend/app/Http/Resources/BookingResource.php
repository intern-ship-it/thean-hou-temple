<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_code' => $this->booking_code,
            'booking_type' => $this->booking_type,

            // Customer info
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'customer_id' => $this->customer_id,

            // Hall info
            'hall' => new HallResource($this->whenLoaded('hall')),
            'hall_id' => $this->hall_id,

            // Event details
            'event_date' => $this->event_date?->format('Y-m-d'),
            'time_slot' => $this->time_slot,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'event_type' => $this->event_type,
            'guest_count' => $this->guest_count,

            // Status
            'status' => $this->status,

            // Financial
            'total_amount' => (float) $this->total_amount,
            'deposit_amount' => (float) $this->deposit_amount,
            'deposit_paid' => $this->deposit_paid,
            'deposit_paid_date' => $this->deposit_paid_date?->format('Y-m-d'),
            'fifty_percent_paid' => $this->fifty_percent_paid,
            'fifty_percent_paid_date' => $this->fifty_percent_paid_date?->format('Y-m-d'),
            'fully_paid' => $this->fully_paid,
            'fully_paid_date' => $this->fully_paid_date?->format('Y-m-d'),
            'remaining_balance' => $this->getRemainingBalance(),

            // Items & Package
            'booking_items' => $this->whenLoaded('bookingItems', function () {
                return $this->bookingItems->map(function ($item) {
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

            'dinner_package' => $this->whenLoaded('dinnerPackage', function () {
                if ($this->dinnerPackage) {
                    return [
                        'id' => $this->dinnerPackage->id,
                        'package' => new DinnerPackageResource($this->dinnerPackage->dinnerPackage),
                        'vendor' => new CateringVendorResource($this->dinnerPackage->cateringVendor),
                        'number_of_tables' => $this->dinnerPackage->number_of_tables,
                        'price_per_table' => (float) $this->dinnerPackage->price_per_table,
                        'total_package_amount' => (float) $this->dinnerPackage->total_package_amount,
                        'special_menu_requests' => $this->dinnerPackage->special_menu_requests,
                    ];
                }
                return null;
            }),

            'payments' => PaymentResource::collection($this->whenLoaded('payments')),

            // Notes
            'special_requests' => $this->special_requests,
            'internal_notes' => $this->internal_notes,

            // Cancellation
            'cancelled_reason' => $this->cancelled_reason,
            'cancelled_at' => $this->cancelled_at?->format('Y-m-d H:i:s'),

            // Meta
            'created_by' => $this->created_by,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),

            // Helper flags
            'needs_fifty_percent_payment' => $this->needsFiftyPercentPayment(),
            'needs_full_payment' => $this->needsFullPayment(),
        ];
    }
}