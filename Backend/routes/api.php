<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DevoteeController;

// Hall Booking Controllers
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\HallController;
use App\Http\Controllers\Api\BillingItemController;
use App\Http\Controllers\Api\DinnerPackageController;
use App\Http\Controllers\Api\CateringVendorController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\QuotationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SystemSettingController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // ==================== AUTH ROUTES ====================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/me', [AuthController::class, 'me']);

    // ==================== TEMPLE OPERATIONS ====================
    Route::prefix('temple-operations')->group(function () {
        // Devotees CRUD
        Route::apiResource('devotees', DevoteeController::class);

        // Additional devotee endpoints
        Route::get('devotees-active', [DevoteeController::class, 'active']);
        Route::get('devotees-statistics', [DevoteeController::class, 'statistics']);
        Route::post('devotees/{id}/restore', [DevoteeController::class, 'restore']);
        Route::delete('devotees/{id}/force-delete', [DevoteeController::class, 'forceDelete']);
        Route::post('devotees/bulk-update-status', [DevoteeController::class, 'bulkUpdateStatus']);
    });

    // ==================== HALL BOOKING ====================
    Route::prefix('hall-booking')->group(function () {

        // CUSTOMERS
        Route::apiResource('customers', CustomerController::class);
        Route::get('customers-statistics', [CustomerController::class, 'statistics']);

        // HALLS - FULL CRUD NOW ENABLED
        Route::apiResource('halls', HallController::class); // Changed from ->only(['index', 'show'])
        Route::post('halls/check-availability', [HallController::class, 'checkAvailability']);

        // BILLING ITEMS
        Route::apiResource('billing-items', BillingItemController::class);
        Route::post('billing-items/get-price', [BillingItemController::class, 'getPrice']);

        //DINNER PACKAGES
        Route::apiResource('dinner-packages', DinnerPackageController::class); // Full CRUD enabled
        Route::post('dinner-packages/calculate-total', [DinnerPackageController::class, 'calculateTotal']);

        // CATERING VENDORS
        Route::apiResource('catering-vendors', CateringVendorController::class);

        // BOOKINGS
        Route::apiResource('bookings', BookingController::class);
        Route::get('bookings-upcoming', [BookingController::class, 'upcoming']);
        
        Route::get('bookings-statistics', [BookingController::class, 'statistics']);

        // QUOTATIONS
        Route::apiResource('quotations', QuotationController::class);
        Route::post('quotations/{quotation}/accept', [QuotationController::class, 'accept']);

        // PAYMENTS
        Route::apiResource('payments', PaymentController::class);
    });
    Route::prefix('system-settings')->group(function () {
        Route::get('/', [SystemSettingController::class, 'index']);
        Route::get('/booking-settings', [SystemSettingController::class, 'getBookingSettings']);
        Route::get('/{id}', [SystemSettingController::class, 'show']);
        Route::put('/{id}', [SystemSettingController::class, 'update']);
    });
});
