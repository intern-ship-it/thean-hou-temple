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
    /**
     * Display a listing of payments
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $bookingId = $request->input('booking_id', '');
        $paymentType = $request->input('payment_type', '');

        $payments = Payment::query()
            ->with(['booking.customer', 'booking.hall'])
            ->when($bookingId, fn($q) => $q->where('booking_id', $bookingId))
            ->when($paymentType, fn($q) => $q->where('payment_type', $paymentType))
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

    /**
     * Display the specified payment
     */
    public function show(Payment $payment): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Payment retrieved successfully',
            'data' => new PaymentResource($payment->load(['booking.customer', 'booking.hall'])),
        ]);
    }

    /**
     * Store a newly created payment
     */
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
                $booking->status = 'completed';
            }

            $booking->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment recorded successfully',
                'data' => new PaymentResource($payment->load(['booking.customer', 'booking.hall'])),
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

    /**
     * Update the specified payment
     */
    public function update(Request $request, Payment $payment): JsonResponse
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'payment_type' => 'sometimes|required|in:deposit,partial,full,refund',
                'amount' => 'sometimes|required|numeric|min:0',
                'payment_method' => 'sometimes|required|in:cash,cheque,online_banking,credit_card,debit_card,duitnow',
                'payment_date' => 'sometimes|required|date',
                'reference_number' => 'nullable|string|max:100',
                'cheque_number' => 'nullable|string|max:50',
                'bank_name' => 'nullable|string|max:100',
                'remarks' => 'nullable|string',
                'receipt_number' => 'nullable|string|max:50',
            ]);

            $oldPaymentType = $payment->payment_type;
            $oldPaymentDate = $payment->payment_date;

            $payment->update($validated);

            // Update booking if payment type or date changed
            if (isset($validated['payment_type']) || isset($validated['payment_date'])) {
                $booking = $payment->booking;

                // Clear old payment status if type changed
                if (isset($validated['payment_type']) && $oldPaymentType !== $validated['payment_type']) {
                    if ($oldPaymentType === 'deposit') {
                        $booking->deposit_paid = false;
                        $booking->deposit_paid_date = null;
                    } elseif ($oldPaymentType === 'partial') {
                        $booking->fifty_percent_paid = false;
                        $booking->fifty_percent_paid_date = null;
                    } elseif ($oldPaymentType === 'full') {
                        $booking->fully_paid = false;
                        $booking->fully_paid_date = null;
                    }
                }

                // Set new payment status
                $newType = $validated['payment_type'] ?? $payment->payment_type;
                $newDate = $validated['payment_date'] ?? $payment->payment_date;

                if ($newType === 'deposit') {
                    $booking->deposit_paid = true;
                    $booking->deposit_paid_date = $newDate;
                } elseif ($newType === 'partial') {
                    $booking->fifty_percent_paid = true;
                    $booking->fifty_percent_paid_date = $newDate;
                } elseif ($newType === 'full') {
                    $booking->fully_paid = true;
                    $booking->fully_paid_date = $newDate;
                }

                $booking->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment updated successfully',
                'data' => new PaymentResource($payment->fresh()->load(['booking.customer', 'booking.hall'])),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified payment
     */
    public function destroy(Payment $payment): JsonResponse
    {
        DB::beginTransaction();

        try {
            $booking = $payment->booking;
            $paymentType = $payment->payment_type;

            // Revert booking payment status
            if ($paymentType === 'deposit') {
                $booking->deposit_paid = false;
                $booking->deposit_paid_date = null;
            } elseif ($paymentType === 'partial') {
                $booking->fifty_percent_paid = false;
                $booking->fifty_percent_paid_date = null;
            } elseif ($paymentType === 'full') {
                $booking->fully_paid = false;
                $booking->fully_paid_date = null;
                // Revert booking status if it was marked as completed
                if ($booking->status === 'completed') {
                    $booking->status = 'confirmed';
                }
            }

            $booking->save();
            $payment->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment deleted successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}