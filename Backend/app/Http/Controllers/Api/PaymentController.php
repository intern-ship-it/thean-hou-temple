<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $bookingId = $request->input('booking_id', '');

        $payments = Payment::query()
            ->when($bookingId, fn($q) => $q->where('booking_id', $bookingId))
            ->orderBy('payment_date', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Payments retrieved successfully',
            'data' => PaymentResource::collection($payments->items()),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $paymentData = $request->validated();
            $paymentData['created_by'] = auth()->id();
            $payment = Payment::create($paymentData);

            // Update booking payment status
            $booking = Booking::findOrFail($request->booking_id);

            if ($request->payment_type === 'deposit') {
                $booking->deposit_paid = true;
                $booking->deposit_paid_date = $request->payment_date;
            } elseif ($request->payment_type === 'partial') {
                $booking->fifty_percent_paid = true;
                $booking->fifty_percent_paid_date = $request->payment_date;
            } elseif ($request->payment_type === 'full') {
                $booking->fully_paid = true;
                $booking->fully_paid_date = $request->payment_date;
            }

            $booking->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment recorded successfully',
                'data' => new PaymentResource($payment),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to record payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Payment $payment): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Payment retrieved successfully',
            'data' => new PaymentResource($payment),
        ]);
    }
}