<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CateringVendorResource;
use App\Models\CateringVendor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CateringVendorController extends Controller
{
    /**
     * Display a listing of catering vendors
     */
    public function index(Request $request): JsonResponse
    {
        $vendorType = $request->input('vendor_type', '');

        $vendors = CateringVendor::query()
            ->active()
            ->when($vendorType, fn($q) => $q->where('vendor_type', $vendorType))
            ->orderBy('vendor_name')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Catering vendors retrieved successfully',
            'data' => CateringVendorResource::collection($vendors),
        ]);
    }

    /**
     * Display the specified catering vendor
     */
    public function show(CateringVendor $cateringVendor): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Catering vendor retrieved successfully',
            'data' => new CateringVendorResource($cateringVendor),
        ]);
    }

    /**
     * Store a newly created catering vendor
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vendor_name' => 'required|string|max:200',
            'vendor_name_chinese' => 'nullable|string|max:200',
            'vendor_type' => 'required|in:non_vegetarian,vegetarian',
            'contact_person' => 'nullable|string|max:200',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string',
            'remarks' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $vendor = CateringVendor::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Catering vendor created successfully',
            'data' => new CateringVendorResource($vendor),
        ], 201);
    }

    /**
     * Update the specified catering vendor
     */
    public function update(Request $request, CateringVendor $cateringVendor): JsonResponse
    {
        $validated = $request->validate([
            'vendor_name' => 'sometimes|required|string|max:200',
            'vendor_name_chinese' => 'nullable|string|max:200',
            'vendor_type' => 'sometimes|required|in:non_vegetarian,vegetarian',
            'contact_person' => 'nullable|string|max:200',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string',
            'remarks' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $cateringVendor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Catering vendor updated successfully',
            'data' => new CateringVendorResource($cateringVendor->fresh()),
        ]);
    }

    /**
     * Remove the specified catering vendor
     */
    public function destroy(CateringVendor $cateringVendor): JsonResponse
    {
        // Check if vendor is used in any bookings
        if ($cateringVendor->bookingDinnerPackages()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete catering vendor that is used in bookings. Please deactivate instead.',
            ], 422);
        }

        $cateringVendor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catering vendor deleted successfully',
        ]);
    }
}