<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HallResource;
use App\Models\Hall;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HallController extends Controller
{
    public function index(): JsonResponse
    {
        $halls = Hall::active()->get();

        return response()->json([
            'success' => true,
            'message' => 'Halls retrieved successfully',
            'data' => HallResource::collection($halls),
        ]);
    }

    public function show(Hall $hall): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Hall retrieved successfully',
            'data' => new HallResource($hall),
        ]);
    }

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