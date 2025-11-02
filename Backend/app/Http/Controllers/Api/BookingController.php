<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\DinnerPackage;
use App\Http\Resources\BookingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings
     */
    public function index(Request $request)
    {
        $query = Booking::with(['customer', 'hall']);

        // Filter by year and month if provided
        if ($request->has('year') && $request->has('month')) {
            $year = $request->input('year');
            $month = $request->input('month');

            $query->whereYear('event_date', $year)
                ->whereMonth('event_date', $month);
        }

        // Other filters (status, etc.)
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $bookings = $query->orderBy('event_date', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => BookingResource::collection($bookings)
        ]);
    }

    /**
     * Display a specific booking
     */
    public function show($id)
    {
        $booking = Booking::with([
            'customer',
            'hall',
            'bookingItems.billingItem',
            'dinnerPackage.package',
            'dinnerPackage.vendor'
        ])->findOrFail($id);

        return new BookingResource($booking);
    }

    /**
     * Store a newly created booking
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,id',
            'hall_id' => 'required|exists:halls,id',
            'booking_type' => 'required|in:standard,with_dinner',
            'event_date' => 'required|date',
            'time_slot' => 'required|in:morning,evening',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'event_type' => 'nullable|string|max:100',
            'guest_count' => 'nullable|integer|min:0',
            'status' => 'required|in:pending,confirmed,cancelled,completed',

            // Booking items
            'booking_items' => 'nullable|array',
            'booking_items.*.billing_item_id' => 'required|exists:billing_items,id',
            'booking_items.*.quantity' => 'required|integer|min:1',
            'booking_items.*.unit_price' => 'required|numeric|min:0',
            'booking_items.*.remarks' => 'nullable|string',

            // Dinner package
            'dinner_package' => 'nullable|array',
            'dinner_package.dinner_package_id' => 'required_with:dinner_package|exists:dinner_packages,id',
            'dinner_package.catering_vendor_id' => 'required_with:dinner_package|exists:catering_vendors,id',
            'dinner_package.number_of_tables' => 'required_with:dinner_package|integer|min:1',
            'dinner_package.special_menu_requests' => 'nullable|string',

            // Pricing
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
            'deposit_amount' => 'nullable|numeric|min:0',

            // Additional info
            'special_requests' => 'nullable|string',
            'internal_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Create booking with all fields
            $booking = Booking::create($request->only([
                'customer_id',
                'hall_id',
                'booking_type',
                'event_date',
                'time_slot',
                'start_time',
                'end_time',
                'event_type',
                'guest_count',
                'status',
                'discount_percentage',
                'tax_percentage',
                'deposit_amount',
                'special_requests',
                'internal_notes',
            ]));

            // Create booking items if provided
            if ($request->has('booking_items')) {
                foreach ($request->booking_items as $item) {
                    $booking->bookingItems()->create([
                        'billing_item_id' => $item['billing_item_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $item['quantity'] * $item['unit_price'],
                        'remarks' => $item['remarks'] ?? null,
                    ]);
                }
            }

            // Create dinner package if provided - ✅ FIXED!
            if ($request->has('dinner_package') && $request->booking_type === 'with_dinner') {
                $dinnerData = $request->dinner_package;

                // ✅ Get the package to retrieve price_per_table
                $package = DinnerPackage::findOrFail($dinnerData['dinner_package_id']);

                // ✅ Calculate total_amount
                $totalAmount = $package->price_per_table * $dinnerData['number_of_tables'];

                // ✅ Create with price_per_table and total_amount
                $booking->dinnerPackage()->create([
                    'dinner_package_id' => $dinnerData['dinner_package_id'],
                    'catering_vendor_id' => $dinnerData['catering_vendor_id'],
                    'number_of_tables' => $dinnerData['number_of_tables'],
                    'price_per_table' => $package->price_per_table,  // ✅ ADD THIS
                    'total_amount' => $totalAmount,                   // ✅ ADD THIS
                    'special_menu_requests' => $dinnerData['special_menu_requests'] ?? null,
                ]);
            }

            // ✅ Recalculate totals
            $booking->load(['customer', 'hall', 'bookingItems', 'dinnerPackage.package']);
            $booking->calculateTotals();
            $booking->save();

            DB::commit();

            // Load relationships for response
            $booking->load([
                'customer',
                'hall',
                'bookingItems.billingItem',
                'dinnerPackage.package',
                'dinnerPackage.vendor'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data' => new BookingResource($booking)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing booking
     */
    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'customer_id' => 'sometimes|required|exists:customers,id',
            'hall_id' => 'sometimes|required|exists:halls,id',
            'booking_type' => 'sometimes|required|in:standard,with_dinner',
            'event_date' => 'sometimes|required|date',
            'time_slot' => 'sometimes|required|in:morning,evening',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'event_type' => 'nullable|string|max:100',
            'guest_count' => 'nullable|integer|min:0',
            'status' => 'sometimes|required|in:pending,confirmed,cancelled,completed',

            // Booking items
            'booking_items' => 'nullable|array',
            'booking_items.*.billing_item_id' => 'required|exists:billing_items,id',
            'booking_items.*.quantity' => 'required|integer|min:1',
            'booking_items.*.unit_price' => 'required|numeric|min:0',
            'booking_items.*.remarks' => 'nullable|string',

            // Dinner package
            'dinner_package' => 'nullable|array',
            'dinner_package.package_id' => 'required_with:dinner_package|exists:dinner_packages,id',
            'dinner_package.vendor_id' => 'required_with:dinner_package|exists:catering_vendors,id',
            'dinner_package.number_of_tables' => 'required_with:dinner_package|integer|min:1',
            'dinner_package.special_menu_requests' => 'nullable|string',

            // Pricing
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
            'deposit_amount' => 'nullable|numeric|min:0',

            // Additional info
            'special_requests' => 'nullable|string',
            'internal_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Update booking
            $booking->update($request->only([
                'customer_id',
                'hall_id',
                'booking_type',
                'event_date',
                'time_slot',
                'start_time',
                'end_time',
                'event_type',
                'guest_count',
                'status',
                'discount_percentage',
                'tax_percentage',
                'deposit_amount',
                'special_requests',
                'internal_notes',
            ]));

            // Update booking items if provided
            if ($request->has('booking_items')) {
                // Delete existing items
                $booking->bookingItems()->delete();

                // Create new items
                foreach ($request->booking_items as $item) {
                    $booking->bookingItems()->create([
                        'billing_item_id' => $item['billing_item_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $item['quantity'] * $item['unit_price'],
                        'remarks' => $item['remarks'] ?? null,
                    ]);
                }
            }

            // Update dinner package if provided - ✅ FIXED!
            if ($request->has('dinner_package')) {
                $booking->dinnerPackage()->delete();

                if ($request->booking_type === 'with_dinner') {
                    $dinnerData = $request->dinner_package;

                    // ✅ Get the package to retrieve price_per_table
                    $package = DinnerPackage::findOrFail($dinnerData['package_id']);

                    // ✅ Calculate total_amount
                    $totalAmount = $package->price_per_table * $dinnerData['number_of_tables'];

                    // ✅ Create with price_per_table and total_amount
                    $booking->dinnerPackage()->create([
                        'dinner_package_id' => $dinnerData['package_id'],
                        'catering_vendor_id' => $dinnerData['vendor_id'],
                        'number_of_tables' => $dinnerData['number_of_tables'],
                        'price_per_table' => $package->price_per_table,  // ✅ ADD THIS
                        'total_amount' => $totalAmount,                   // ✅ ADD THIS
                        'special_menu_requests' => $dinnerData['special_menu_requests'] ?? null,
                    ]);
                }
            }

            // ✅ Recalculate totals
            $booking->load(['customer', 'hall', 'bookingItems', 'dinnerPackage.package']);
            $booking->calculateTotals();
            $booking->save();

            DB::commit();

            // Load relationships for response
            $booking->load([
                'customer',
                'hall',
                'bookingItems.billingItem',
                'dinnerPackage.package',
                'dinnerPackage.vendor'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Booking updated successfully',
                'data' => new BookingResource($booking)
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a booking
     */
    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'Booking deleted successfully'
        ], 200);
    }

    /**
     * Get upcoming bookings
     */
    public function upcoming()
    {
        $bookings = Booking::with([
            'customer',
            'hall',
            'bookingItems.billingItem',
            'dinnerPackage.package',
            'dinnerPackage.vendor'
        ])
            ->where('event_date', '>=', now())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('event_date', 'asc')
            ->limit(10)
            ->get();

        return BookingResource::collection($bookings);
    }

    /**
     * Get booking statistics
     */
    public function statistics()
    {
        $stats = [
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'confirmed_bookings' => Booking::where('status', 'confirmed')->count(),
            'completed_bookings' => Booking::where('status', 'completed')->count(),
            'cancelled_bookings' => Booking::where('status', 'cancelled')->count(),
            'total_revenue' => Booking::whereIn('status', ['confirmed', 'completed'])
                ->sum('total_amount'),
            'this_month_bookings' => Booking::whereMonth('event_date', now()->month)
                ->whereYear('event_date', now()->year)
                ->count(),
            'this_month_revenue' => Booking::whereMonth('event_date', now()->month)
                ->whereYear('event_date', now()->year)
                ->whereIn('status', ['confirmed', 'completed'])
                ->sum('total_amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}