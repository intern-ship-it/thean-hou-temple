<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDevoteeRequest;
use App\Http\Requests\UpdateDevoteeRequest;
use App\Http\Resources\DevoteeResource;
use App\Models\Devotee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DevoteeController extends Controller
{
    /**
     * Display a listing of devotees with pagination and search.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search', '');

        $devotees = Devotee::query()
            ->search($search)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Devotees retrieved successfully',
            'data' => DevoteeResource::collection($devotees->items()),
            'meta' => [
                'current_page' => $devotees->currentPage(),
                'last_page' => $devotees->lastPage(),
                'per_page' => $devotees->perPage(),
                'total' => $devotees->total(),
                'from' => $devotees->firstItem(),
                'to' => $devotees->lastItem(),
            ],
        ]);
    }

    /**
     * Store a newly created devotee.
     */
    public function store(StoreDevoteeRequest $request): JsonResponse
    {
        try {
            $devotee = Devotee::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Devotee created successfully',
                'data' => new DevoteeResource($devotee),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create devotee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified devotee.
     */
    public function show(Devotee $devotee): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Devotee retrieved successfully',
            'data' => new DevoteeResource($devotee),
        ]);
    }

    /**
     * Update the specified devotee.
     */
    public function update(UpdateDevoteeRequest $request, Devotee $devotee): JsonResponse
    {
        try {
            $devotee->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Devotee updated successfully',
                'data' => new DevoteeResource($devotee->fresh()),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update devotee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified devotee (soft delete).
     */
    public function destroy(Devotee $devotee): JsonResponse
    {
        try {
            $devotee->delete();

            return response()->json([
                'success' => true,
                'message' => 'Devotee deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete devotee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Restore a soft deleted devotee.
     */
    public function restore($id): JsonResponse
    {
        try {
            $devotee = Devotee::withTrashed()->findOrFail($id);
            $devotee->restore();

            return response()->json([
                'success' => true,
                'message' => 'Devotee restored successfully',
                'data' => new DevoteeResource($devotee),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore devotee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Permanently delete a devotee.
     */
    public function forceDelete($id): JsonResponse
    {
        try {
            $devotee = Devotee::withTrashed()->findOrFail($id);
            $devotee->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Devotee permanently deleted',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to permanently delete devotee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all active devotees (for dropdowns).
     */
    public function active(): JsonResponse
    {
        $devotees = Devotee::active()
            ->orderBy('name_english')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Active devotees retrieved successfully',
            'data' => DevoteeResource::collection($devotees),
        ]);
    }

    /**
     * Get devotee statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Devotee::count(),
            'active' => Devotee::active()->count(),
            'inactive' => Devotee::inactive()->count(),
            'male' => Devotee::where('gender', 'male')->count(),
            'female' => Devotee::where('gender', 'female')->count(),
            'new_this_month' => Devotee::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Statistics retrieved successfully',
            'data' => $stats,
        ]);
    }

    /**
     * Bulk update devotee status.
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'devotee_ids' => 'required|array',
            'devotee_ids.*' => 'exists:devotees,id',
            'is_active' => 'required|boolean',
        ]);

        try {
            Devotee::whereIn('id', $request->devotee_ids)
                ->update(['is_active' => $request->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'Devotees status updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}