// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";
// Layout
import MainLayout from "./components/layout/MainLayout";

// Auth
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/auth/Login";

// Pages
import Dashboard from "./pages/Dashboard";

// Temple Operations
import Devotees from "./pages/templeOperations/Devotees";

// Hall Booking - Operational Pages
import Customers from "./pages/hallBooking/Customers";
import Bookings from "./pages/hallBooking/Bookings";
import Quotations from "./pages/hallBooking/Quotations";

// Hall Booking - Master Setup Pages
import Halls from "./pages/hallBooking/Halls";
import BillingItems from "./pages/hallBooking/BillingItems"; // ADD THIS
import DinnerPackages from "./pages/hallBooking/DinnerPackages"; // ADD THIS
import CateringVendors from "./pages/hallBooking/CateringVendors"; // WE'LL CREATE THIS
import CreateBooking from "./pages/hallBooking/CreateBooking"; // ← ADD THIS
import EditBooking from "./pages/hallBooking/EditBooking"; 
import BookingCalendarPage from "./pages/hallBooking/BookingCalendarPage";   
// Placeholder Pages
const PagodaLightsPage = () => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Pagoda Lights Management</h2>
    <p className="text-gray-600">Pagoda Lights page coming soon...</p>
  </div>
);

const DonationsPage = () => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Donations Management</h2>
    <p className="text-gray-600">Donations page coming soon...</p>
  </div>
);

const PaymentsPage = () => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Payments Management</h2>
    <p className="text-gray-600">Payments page coming soon...</p>
  </div>
);

// Auth Redirect Component
const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const currentLanguage = useSelector((state) => state.language.currentLanguage);

  // Update document language when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* ==================== TEMPLE OPERATIONS ==================== */}
            <Route
              path="temple/devotees"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "temple_staff"]}>
                  <Devotees />
                </ProtectedRoute>
              }
            />
            <Route
              path="temple/pagoda-lights"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "temple_staff"]}>
                  <PagodaLightsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="temple/donations"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "temple_staff"]}>
                  <DonationsPage />
                </ProtectedRoute>
              }
            />

            {/* ==================== HALL BOOKING - OPERATIONAL ==================== */}
            <Route
              path="hall/customers"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "hall_manager"]}>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="hall/bookings"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "hall_manager"]}>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            {/* ==================== CALENDAR PAGE ==================== */}
            <Route
              path="hall/bookings/calendar"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "hall_manager"]}>
                  <BookingCalendarPage />
                </ProtectedRoute>
              }
            />
            {/* ← ADD THESE TWO ROUTES */}
            <Route
              path="hall/bookings/create"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "hall_manager"]}>
                  <CreateBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="hall/bookings/edit/:id"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "hall_manager"]}>
                  <EditBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="hall/quotations"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "hall_manager"]}>
                  <Quotations />
                </ProtectedRoute>
              }
            />
            <Route
              path="hall/payments"
              element={
                <ProtectedRoute requiredRoles={["super_admin", "hall_manager"]}>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />

            {/* ==================== HALL BOOKING - MASTER SETUP ==================== */}
            <Route
              path="hall/halls"
              element={
                <ProtectedRoute requiredRoles={["super_admin"]}>
                  <Halls />
                </ProtectedRoute>
              }
            />
            <Route
              path="hall/billing-items"
              element={
                <ProtectedRoute requiredRoles={["super_admin"]}>
                  <BillingItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="hall/dinner-packages"
              element={
                <ProtectedRoute requiredRoles={["super_admin"]}>
                  <DinnerPackages />
                </ProtectedRoute>
              }
            />
            <Route
              path="hall/catering-vendors"
              element={
                <ProtectedRoute requiredRoles={["super_admin"]}>
                  <CateringVendors />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Toast Container with Custom Styling */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={currentLanguage === "zh"} // RTL support for Chinese if needed
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          fontFamily:
            currentLanguage === "zh"
              ? "'Noto Sans SC', sans-serif"
              : "'Inter', sans-serif",
        }}
      />
    </>
  );
}

export default App;
