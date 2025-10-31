<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BillingItemResource;
use App\Models\BillingItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class BillingItemController extends Controller
{
    /**
     * Display a listing of billing items
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->input('category', '');

        $items = BillingItem::query()
            ->active()
            ->when($category, fn($q) => $q->where('category', $category))
            ->orderBy('category')
            ->orderBy('item_name')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Billing items retrieved successfully',
            'data' => BillingItemResource::collection($items),
        ]);
    }

    /**
     * Display the specified billing item
     */
    public function show(BillingItem $billingItem): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Billing item retrieved successfully',
            'data' => new BillingItemResource($billingItem),
        ]);
    }

    /**
     * Store a newly created billing item
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_code' => 'required|string|max:20|unique:billing_items,item_code',
            'item_name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'category' => 'required|in:hall,equipment,furniture,service,other',
            'internal_price' => 'required|numeric|min:0',
            'external_price' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ]);

        if (!isset($validated['unit'])) {
            $validated['unit'] = 'unit';
        }

        $billingItem = BillingItem::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Billing item created successfully',
            'data' => new BillingItemResource($billingItem),
        ], 201);
    }

    /**
     * Update the specified billing item
     */
    public function update(Request $request, BillingItem $billingItem): JsonResponse
    {
        $validated = $request->validate([
            'item_code' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('billing_items', 'item_code')->ignore($billingItem->id)
            ],
            'item_name' => 'sometimes|required|string|max:200',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|in:hall,equipment,furniture,service,other',
            'internal_price' => 'sometimes|required|numeric|min:0',
            'external_price' => 'sometimes|required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ]);

        $billingItem->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Billing item updated successfully',
            'data' => new BillingItemResource($billingItem->fresh()),
        ]);
    }

    /**
     * Remove the specified billing item
     */
    public function destroy(BillingItem $billingItem): JsonResponse
    {
        // Check if used in bookings or quotations
        if ($billingItem->bookingItems()->exists() || $billingItem->quotationItems()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete billing item that is used in bookings or quotations. Please deactivate instead.',
            ], 422);
        }

        $billingItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Billing item deleted successfully',
        ]);
    }

    /**
     * Get price for specific customer type
     */
    public function getPrice(Request $request): JsonResponse
    {
        $request->validate([
            'billing_item_id' => 'required|exists:billing_items,id',
            'customer_type' => 'required|in:internal,external',
        ]);

        $item = BillingItem::findOrFail($request->billing_item_id);
        $price = $item->getPriceForCustomerType($request->customer_type);

        return response()->json([
            'success' => true,
            'message' => 'Price retrieved successfully',
            'data' => [
                'item_id' => $item->id,
                'item_name' => $item->item_name,
                'customer_type' => $request->customer_type,
                'price' => $price,
                'unit' => $item->unit,
            ],
        ]);
    }
}