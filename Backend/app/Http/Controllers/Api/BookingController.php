<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\BookingDinnerPackage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $status = $request->input('status', '');
        $startDate = $request->input('start_date', '');
        $endDate = $request->input('end_date', '');

        $bookings = Booking::query()
            ->with(['customer', 'hall', 'bookingItems.billingItem', 'dinnerPackage.dinnerPackage', 'dinnerPackage.cateringVendor'])
            ->when($status, fn($q) => $q->byStatus($status))
            ->when($startDate && $endDate, fn($q) => $q->byDateRange($startDate, $endDate))
            ->orderBy('event_date', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Bookings retrieved successfully',
            'data' => BookingResource::collection($bookings->items()),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
        ]);
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Create booking
            $bookingData = $request->except(['items', 'dinner_package']);
            $bookingData['created_by'] = auth()->id();
            $booking = Booking::create($bookingData);

            // Add booking items
            foreach ($request->items as $item) {
                BookingItem::create([
                    'booking_id' => $booking->id,
                    'billing_item_id' => $item['billing_item_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'remarks' => $item['remarks'] ?? null,
                ]);
            }

            // Add dinner package if applicable
            if ($request->booking_type === 'dinner_package' && $request->has('dinner_package')) {
                $packageData = $request->dinner_package;
                $package = \App\Models\DinnerPackage::findOrFail($packageData['dinner_package_id']);

                BookingDinnerPackage::create([
                    'booking_id' => $booking->id,
                    'dinner_package_id' => $packageData['dinner_package_id'],
                    'catering_vendor_id' => $packageData['catering_vendor_id'],
                    'number_of_tables' => $packageData['number_of_tables'],
                    'price_per_table' => $package->price_per_table,
                    'special_menu_requests' => $packageData['special_menu_requests'] ?? null,
                ]);
            }

            // Calculate and update total
            $booking->total_amount = $booking->calculateTotal();
            $booking->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data' => new BookingResource($booking->load(['customer', 'hall', 'bookingItems.billingItem', 'dinnerPackage'])),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Booking $booking): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Booking retrieved successfully',
            'data' => new BookingResource($booking->load(['customer', 'hall', 'bookingItems.billingItem', 'dinnerPackage.dinnerPackage', 'dinnerPackage.cateringVendor', 'payments'])),
        ]);
    }

    public function update(UpdateBookingRequest $request, Booking $booking): JsonResponse
    {
        DB::beginTransaction();

        try {
            $booking->update($request->except(['items']));

            // Update items if provided
            if ($request->has('items')) {
                // Delete old items
                $booking->bookingItems()->delete();

                // Add new items
                foreach ($request->items as $item) {
                    BookingItem::create([
                        'booking_id' => $booking->id,
                        'billing_item_id' => $item['billing_item_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'remarks' => $item['remarks'] ?? null,
                    ]);
                }

                // Recalculate total
                $booking->total_amount = $booking->calculateTotal();
                $booking->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Booking updated successfully',
                'data' => new BookingResource($booking->fresh()->load(['customer', 'hall', 'bookingItems.billingItem', 'dinnerPackage'])),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Booking $booking): JsonResponse
    {
        try {
            // Only allow deletion of pending bookings
            if ($booking->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending bookings can be deleted',
                ], 422);
            }

            $booking->delete();

            return response()->json([
                'success' => true,
                'message' => 'Booking deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete booking',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function upcoming(): JsonResponse
    {
        $bookings = Booking::upcoming()
            ->with(['customer', 'hall'])
            ->orderBy('event_date')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Upcoming bookings retrieved successfully',
            'data' => BookingResource::collection($bookings),
        ]);
    }

    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Booking::count(),
            'pending' => Booking::byStatus('pending')->count(),
            'confirmed' => Booking::byStatus('confirmed')->count(),
            'completed' => Booking::byStatus('completed')->count(),
            'cancelled' => Booking::byStatus('cancelled')->count(),
            'upcoming' => Booking::upcoming()->count(),
            'this_month' => Booking::whereMonth('event_date', now()->month)
                ->whereYear('event_date', now()->year)
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Booking statistics retrieved successfully',
            'data' => $stats,
        ]);
    }
}