<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
            'booking_code' => $this->booking_code,

            // Customer - CHECK FOR NULL
            'customer_id' => $this->customer_id,
            'customer' => $this->customer ? [
                'id' => $this->customer->id,
                'customer_code' => $this->customer->customer_code,
                'name_english' => $this->customer->name_english,
                'name_chinese' => $this->customer->name_chinese,
                'customer_type' => $this->customer->customer_type,
                'contact_number' => $this->customer->contact_number,
                'email' => $this->customer->email,
            ] : null,

            // Hall - CHECK FOR NULL
            'hall_id' => $this->hall_id,
            'hall' => $this->hall ? [
                'id' => $this->hall->id,
                'hall_name' => $this->hall->hall_name,
                'hall_name_chinese' => $this->hall->hall_name_chinese,
                'capacity' => $this->hall->capacity,
                'rental_rate_internal' => $this->hall->rental_rate_internal,
                'rental_rate_external' => $this->hall->rental_rate_external,
            ] : null,

            // Booking Details
            'booking_type' => $this->booking_type,
            'event_date' => $this->event_date,
            'time_slot' => $this->time_slot,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'event_type' => $this->event_type,
            'guest_count' => $this->guest_count,
            'status' => $this->status,

            // Pricing
            'hall_rental_amount' => $this->hall_rental_amount,
            'additional_items_amount' => $this->additional_items_amount,
            'dinner_package_amount' => $this->dinner_package_amount,
            'subtotal' => $this->subtotal,
            'discount_amount' => $this->discount_amount,
            'discount_percentage' => $this->discount_percentage,
            'tax_amount' => $this->tax_amount,
            'tax_percentage' => $this->tax_percentage,
            'total_amount' => $this->total_amount,
            'deposit_amount' => $this->deposit_amount,
            'balance_amount' => $this->balance_amount,

            // Additional Info
            'special_requests' => $this->special_requests,
            'internal_notes' => $this->internal_notes,

            // Booking Items - CHECK FOR NULL
            'booking_items' => $this->whenLoaded('bookingItems', function () {
                return $this->bookingItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'billing_item_id' => $item->billing_item_id,
                        'billing_item' => $item->billingItem ? [
                            'id' => $item->billingItem->id,
                            'item_code' => $item->billingItem->item_code,
                            'item_name' => $item->billingItem->item_name,
                            'category' => $item->billingItem->category,
                            'unit' => $item->billingItem->unit,
                        ] : null,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'remarks' => $item->remarks,
                    ];
                });
            }),

            // Dinner Package - CHECK FOR NULL
            'dinner_package' => $this->whenLoaded('dinnerPackage', function () {
                if (!$this->dinnerPackage) {
                    return null;
                }

                return [
                    'id' => $this->dinnerPackage->id,
                    'package' => $this->dinnerPackage->package ? [
                        'id' => $this->dinnerPackage->package->id,
                        'package_code' => $this->dinnerPackage->package->package_code,
                        'package_name' => $this->dinnerPackage->package->package_name,
                        'price_per_table' => $this->dinnerPackage->package->price_per_table,
                    ] : null,
                    'vendor' => $this->dinnerPackage->vendor ? [
                        'id' => $this->dinnerPackage->vendor->id,
                        'vendor_name' => $this->dinnerPackage->vendor->vendor_name,
                        'vendor_name_chinese' => $this->dinnerPackage->vendor->vendor_name_chinese,
                        'vendor_type' => $this->dinnerPackage->vendor->vendor_type,
                    ] : null,
                    'number_of_tables' => $this->dinnerPackage->number_of_tables,
                    'total_amount' => $this->dinnerPackage->total_package_amount,
                    'special_menu_requests' => $this->dinnerPackage->special_menu_requests,
                ];
            }),

            // Timestamps
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}