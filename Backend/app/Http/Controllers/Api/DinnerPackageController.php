<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DinnerPackageResource;
use App\Models\DinnerPackage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class DinnerPackageController extends Controller
{
    /**
     * Display a listing of dinner packages
     */
    public function index(): JsonResponse
    {
        $packages = DinnerPackage::active()
            ->orderBy('package_code')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Dinner packages retrieved successfully',
            'data' => DinnerPackageResource::collection($packages),
        ]);
    }

    /**
     * Display the specified dinner package
     */
    public function show(DinnerPackage $dinnerPackage): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Dinner package retrieved successfully',
            'data' => new DinnerPackageResource($dinnerPackage),
        ]);
    }

    /**
     * Store a newly created dinner package
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'package_code' => 'required|string|max:10|unique:dinner_packages,package_code',
            'package_name' => 'required|string|max:100',
            'price_per_table' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'minimum_tables' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
        ]);

        // Set default minimum tables if not provided
        if (!isset($validated['minimum_tables'])) {
            $validated['minimum_tables'] = 50;
        }

        $package = DinnerPackage::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Dinner package created successfully',
            'data' => new DinnerPackageResource($package),
        ], 201);
    }

    /**
     * Update the specified dinner package
     */
    public function update(Request $request, DinnerPackage $dinnerPackage): JsonResponse
    {
        $validated = $request->validate([
            'package_code' => [
                'sometimes',
                'required',
                'string',
                'max:10',
                Rule::unique('dinner_packages', 'package_code')->ignore($dinnerPackage->id)
            ],
            'package_name' => 'sometimes|required|string|max:100',
            'price_per_table' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'minimum_tables' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
        ]);

        $dinnerPackage->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Dinner package updated successfully',
            'data' => new DinnerPackageResource($dinnerPackage->fresh()),
        ]);
    }

    /**
     * Remove the specified dinner package
     */
    public function destroy(DinnerPackage $dinnerPackage): JsonResponse
    {
        // Check if package is used in any bookings
        if ($dinnerPackage->bookingDinnerPackages()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete dinner package that is used in bookings. Please deactivate instead.',
            ], 422);
        }

        $dinnerPackage->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dinner package deleted successfully',
        ]);
    }

    /**
     * Calculate total cost for dinner package booking
     */
    public function calculateTotal(Request $request): JsonResponse
    {
        $request->validate([
            'dinner_package_id' => 'required|exists:dinner_packages,id',
            'number_of_tables' => 'required|integer|min:1',
        ]);

        $package = DinnerPackage::findOrFail($request->dinner_package_id);

        // Validate minimum tables requirement
        if ($request->number_of_tables < $package->minimum_tables) {
            return response()->json([
                'success' => false,
                'message' => "Minimum {$package->minimum_tables} tables required for this package.",
            ], 422);
        }

        $totalAmount = $package->price_per_table * $request->number_of_tables;

        return response()->json([
            'success' => true,
            'message' => 'Total calculated successfully',
            'data' => [
                'package_id' => $package->id,
                'package_name' => $package->package_name,
                'price_per_table' => $package->price_per_table,
                'number_of_tables' => $request->number_of_tables,
                'total_amount' => $totalAmount,
                'minimum_tables' => $package->minimum_tables,
            ],
        ]);
    }
}