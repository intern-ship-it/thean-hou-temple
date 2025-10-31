<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HallResource;
use App\Models\Hall;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class HallController extends Controller
{
    /**
     * Display a listing of active halls
     */
    public function index(): JsonResponse
    {
        $halls = Hall::active()->get();

        return response()->json([
            'success' => true,
            'message' => 'Halls retrieved successfully',
            'data' => HallResource::collection($halls),
        ]);
    }

    /**
     * Display the specified hall
     */
    public function show(Hall $hall): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Hall retrieved successfully',
            'data' => new HallResource($hall),
        ]);
    }

    /**
     * Store a newly created hall
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hall_code' => 'required|string|max:20|unique:halls,hall_code',
            'hall_name' => 'required|string|max:100',
            'hall_name_chinese' => 'nullable|string|max:100',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'facilities' => 'nullable|array',
            'internal_price' => 'required|numeric|min:0',
            'external_price' => 'required|numeric|min:0',
            'session_duration' => 'nullable|integer|min:1',
            'overtime_rate_15min' => 'nullable|numeric|min:0',
            'overtime_rate_after_midnight' => 'nullable|numeric|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Convert facilities array to JSON if provided
        if (isset($validated['facilities'])) {
            $validated['facilities'] = json_encode($validated['facilities']);
        }

        $hall = Hall::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hall created successfully',
            'data' => new HallResource($hall),
        ], 201);
    }

    /**
     * Update the specified hall
     */
    public function update(Request $request, Hall $hall): JsonResponse
    {
        $validated = $request->validate([
            'hall_code' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('halls', 'hall_code')->ignore($hall->id)
            ],
            'hall_name' => 'sometimes|required|string|max:100',
            'hall_name_chinese' => 'nullable|string|max:100',
            'capacity' => 'sometimes|required|integer|min:1',
            'description' => 'nullable|string',
            'facilities' => 'nullable|array',
            'internal_price' => 'sometimes|required|numeric|min:0',
            'external_price' => 'sometimes|required|numeric|min:0',
            'session_duration' => 'nullable|integer|min:1',
            'overtime_rate_15min' => 'nullable|numeric|min:0',
            'overtime_rate_after_midnight' => 'nullable|numeric|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Convert facilities array to JSON if provided
        if (isset($validated['facilities'])) {
            $validated['facilities'] = json_encode($validated['facilities']);
        }

        $hall->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hall updated successfully',
            'data' => new HallResource($hall->fresh()),
        ]);
    }

    /**
     * Remove the specified hall (soft delete)
     */
    public function destroy(Hall $hall): JsonResponse
    {
        // Check if hall has any bookings
        if ($hall->bookings()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete hall with existing bookings. Please deactivate instead.',
            ], 422);
        }

        $hall->delete();

        return response()->json([
            'success' => true,
            'message' => 'Hall deleted successfully',
        ]);
    }

    /**
     * Check hall availability for a specific date and time slot
     */
    public function checkAvailability(Request $request): JsonResponse
    {
        $request->validate([
            'hall_id' => 'required|exists:halls,id',
            'event_date' => 'required|date',
            'time_slot' => 'required|in:morning,evening',
        ]);

        $hall = Hall::findOrFail($request->hall_id);
        $isAvailable = $hall->isAvailable($request->event_date, $request->time_slot);

        return response()->json([
            'success' => true,
            'message' => 'Availability checked successfully',
            'data' => [
                'hall_id' => $hall->id,
                'hall_name' => $hall->hall_name,
                'event_date' => $request->event_date,
                'time_slot' => $request->time_slot,
                'is_available' => $isAvailable,
            ],
        ]);
    }
}