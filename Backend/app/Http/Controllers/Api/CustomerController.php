<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search', '');
        $customerType = $request->input('customer_type', '');

        $customers = Customer::query()
            ->search($search)
            ->when($customerType, fn($q) => $q->where('customer_type', $customerType))
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Customers retrieved successfully',
            'data' => CustomerResource::collection($customers->items()),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ],
        ]);
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        try {
            $customer = Customer::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Customer created successfully',
                'data' => new CustomerResource($customer),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create customer',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Customer retrieved successfully',
            'data' => new CustomerResource($customer->load('bookings', 'quotations')),
        ]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        try {
            $customer->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Customer updated successfully',
                'data' => new CustomerResource($customer->fresh()),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update customer',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Customer $customer): JsonResponse
    {
        try {
            // Check if customer has bookings
            if ($customer->bookings()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete customer with existing bookings',
                ], 422);
            }

            $customer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Customer deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete customer',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Customer::count(),
            'internal' => Customer::internal()->count(),
            'external' => Customer::external()->count(),
            'active' => Customer::active()->count(),
            'with_bookings' => Customer::has('bookings')->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Customer statistics retrieved successfully',
            'data' => $stats,
        ]);
    }
}