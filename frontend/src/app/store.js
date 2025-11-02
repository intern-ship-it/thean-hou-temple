// src/app/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import devoteesReducer from "../features/templeOperations/devoteesSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

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
import systemSettingsReducer from "../features/systemSettings/systemSettingsSlice";


// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  devotees: devoteesReducer,
  customers: customersReducer,
  //     // Hall Booking
  halls: hallsReducer,
  billingItems: billingItemsReducer,
  dinnerPackages: dinnerPackagesReducer,
  cateringVendors: cateringVendorsReducer,
  bookings: bookingsReducer,
  quotations: quotationsReducer,
  payments: paymentsReducer,
  language: languageReducer,
  systemSettings: systemSettingsReducer,
});

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     devotees: devoteesReducer,

//     // Hall Booking
//     customers: customersReducer,
//     halls: hallsReducer,
//     billingItems: billingItemsReducer,
//     dinnerPackages: dinnerPackagesReducer,
//     cateringVendors: cateringVendorsReducer,
//     bookings: bookingsReducer,
//     quotations: quotationsReducer,
//     payments: paymentsReducer,
//     language: languageReducer,
//   },
// });



const persistConfig = {
  key: "thean-hou-temple", // Key for localStorage
  storage,
  whitelist: [
    "auth", // Persist authentication state
    "language", // Persist language preference
    // Add other slices you want to persist
    // "customers",
    // "halls",
    // "bookings",
  ],
  // Optional: blacklist certain slices from persisting
  // blacklist: ['devotees'], // Don't persist devotees (always fetch fresh)
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);




// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PERSIST",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
