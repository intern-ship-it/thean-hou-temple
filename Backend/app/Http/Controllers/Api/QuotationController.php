<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuotationRequest;
use App\Http\Requests\UpdateQuotationRequest;
use App\Http\Resources\QuotationResource;
use App\Models\Quotation;
use App\Models\QuotationItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class QuotationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $status = $request->input('status', '');

        $quotations = Quotation::query()
            ->with(['customer', 'hall', 'quotationItems.billingItem'])
            ->when($status, fn($q) => $q->byStatus($status))
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Quotations retrieved successfully',
            'data' => QuotationResource::collection($quotations->items()),
            'meta' => [
                'current_page' => $quotations->currentPage(),
                'last_page' => $quotations->lastPage(),
                'per_page' => $quotations->perPage(),
                'total' => $quotations->total(),
            ],
        ]);
    }

    public function store(StoreQuotationRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $quotationData = $request->except(['items']);
            $quotationData['created_by'] = auth()->id();
            $quotation = Quotation::create($quotationData);

            // Add quotation items
            foreach ($request->items as $item) {
                QuotationItem::create([
                    'quotation_id' => $quotation->id,
                    'billing_item_id' => $item['billing_item_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'remarks' => $item['remarks'] ?? null,
                ]);
            }

            // Calculate and update total
            $quotation->total_amount = $quotation->calculateTotal();
            $quotation->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Quotation created successfully',
                'data' => new QuotationResource($quotation->load(['customer', 'hall', 'quotationItems.billingItem'])),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create quotation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Quotation $quotation): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Quotation retrieved successfully',
            'data' => new QuotationResource($quotation->load(['customer', 'hall', 'quotationItems.billingItem'])),
        ]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation): JsonResponse
    {
        DB::beginTransaction();

        try {
            $quotation->update($request->except(['items']));

            // Update items if provided
            if ($request->has('items')) {
                $quotation->quotationItems()->delete();

                foreach ($request->items as $item) {
                    QuotationItem::create([
                        'quotation_id' => $quotation->id,
                        'billing_item_id' => $item['billing_item_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'remarks' => $item['remarks'] ?? null,
                    ]);
                }

                $quotation->total_amount = $quotation->calculateTotal();
                $quotation->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Quotation updated successfully',
                'data' => new QuotationResource($quotation->fresh()->load(['customer', 'hall', 'quotationItems.billingItem'])),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update quotation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Quotation $quotation): JsonResponse
    {
        try {
            $quotation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Quotation deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete quotation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function accept(Quotation $quotation): JsonResponse
    {
        try {
            $quotation->status = 'accepted';
            $quotation->accepted_at = now();
            $quotation->save();

            return response()->json([
                'success' => true,
                'message' => 'Quotation accepted successfully',
                'data' => new QuotationResource($quotation),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept quotation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}