// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import devoteesReducer from "../features/templeOperations/devoteesSlice";

// Hall Booking Reducers
import customersReducer from "../features/hallBooking/customersSlice";
import hallsReducer from "../features/hallBooking/hallsSlice";
import billingItemsReducer from "../features/hallBooking/billingItemsSlice";
import dinnerPackagesReducer from "../features/hallBooking/dinnerPackagesSlice";
import cateringVendorsReducer from "../features/hallBooking/cateringVendorsSlice";
import bookingsReducer from "../features/hallBooking/bookingsSlice";
import quotationsReducer from "../features/hallBooking/quotationsSlice";
import paymentsReducer from "../features/hallBooking/paymentsSlice";
import languageReducer from "../features/language/languageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devotees: devoteesReducer,

    // Hall Booking
    customers: customersReducer,
    halls: hallsReducer,
    billingItems: billingItemsReducer,
    dinnerPackages: dinnerPackagesReducer,
    cateringVendors: cateringVendorsReducer,
    bookings: bookingsReducer,
    quotations: quotationsReducer,
    payments: paymentsReducer,
    language: languageReducer,
  },
});
