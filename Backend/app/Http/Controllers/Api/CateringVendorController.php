<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CateringVendorResource;
use App\Models\CateringVendor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CateringVendorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $vendorType = $request->input('vendor_type', '');

        $vendors = CateringVendor::query()
            ->active()
            ->when($vendorType, function ($q) use ($vendorType) {
                if ($vendorType === 'vegetarian') {
                    return $q->vegetarian();
                } elseif ($vendorType === 'non_vegetarian') {
                    return $q->nonVegetarian();
                }
            })
            ->orderBy('vendor_type')
            ->orderBy('vendor_name')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Catering vendors retrieved successfully',
            'data' => CateringVendorResource::collection($vendors),
        ]);
    }

    public function show(CateringVendor $cateringVendor): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Catering vendor retrieved successfully',
            'data' => new CateringVendorResource($cateringVendor),
        ]);
    }
}