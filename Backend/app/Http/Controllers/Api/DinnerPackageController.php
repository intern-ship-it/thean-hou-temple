<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DinnerPackageResource;
use App\Models\DinnerPackage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DinnerPackageController extends Controller
{
    public function index(): JsonResponse
    {
        $packages = DinnerPackage::active()->get();

        return response()->json([
            'success' => true,
            'message' => 'Dinner packages retrieved successfully',
            'data' => DinnerPackageResource::collection($packages),
        ]);
    }

    public function show(DinnerPackage $dinnerPackage): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Dinner package retrieved successfully',
            'data' => new DinnerPackageResource($dinnerPackage),
        ]);
    }

    public function calculateTotal(Request $request): JsonResponse
    {
        $request->validate([
            'package_id' => 'required|exists:dinner_packages,id',
            'number_of_tables' => 'required|integer|min:50',
        ]);

        $package = DinnerPackage::findOrFail($request->package_id);
        $total = $package->calculateTotal($request->number_of_tables);

        return response()->json([
            'success' => true,
            'message' => 'Total calculated successfully',
            'data' => [
                'package_name' => $package->package_name,
                'price_per_table' => $package->price_per_table,
                'number_of_tables' => $request->number_of_tables,
                'total_amount' => $total,
            ],
        ]);
    }
}