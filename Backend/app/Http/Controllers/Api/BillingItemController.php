<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BillingItemResource;
use App\Models\BillingItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BillingItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $category = $request->input('category', '');

        $items = BillingItem::query()
            ->active()
            ->when($category, fn($q) => $q->byCategory($category))
            ->orderBy('category')
            ->orderBy('item_name')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Billing items retrieved successfully',
            'data' => BillingItemResource::collection($items),
        ]);
    }

    public function show(BillingItem $billingItem): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Billing item retrieved successfully',
            'data' => new BillingItemResource($billingItem),
        ]);
    }

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
            ],
        ]);
    }
}