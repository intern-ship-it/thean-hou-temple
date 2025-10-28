// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Bookings from "./pages/hallBooking/Bookings";
import Quotations from "./pages/hallBooking/Quotations";
// Layout
import MainLayout from "./components/layout/MainLayout";

// Auth
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import Customers from "./pages/hallBooking/Customers";
// Pages
import Dashboard from "./pages/Dashboard";
import Devotees from "./pages/templeOperations/Devotees";

const PagodaLightsPage = () => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Pagoda Lights Management
    </h2>
    <p className="text-gray-600">Pagoda Lights page coming soon...</p>
  </div>
);

const DonationsPage = () => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Donations Management
    </h2>
    <p className="text-gray-600">Donations page coming soon...</p>
  </div>
);

// Hall Booking Pages (Placeholders for now)
const CustomersPage = () => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Customers Management
    </h2>
    <p className="text-gray-600">Customers page coming soon...</p>
  </div>
);

const BookingsPage = () => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Bookings Management
    </h2>
    <p className="text-gray-600">Bookings page coming soon...</p>
  </div>
);

const QuotationsPage = () => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Quotations Management
    </h2>
    <p className="text-gray-600">Quotations page coming soon...</p>
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
  return (
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

          {/* Temple Operations Routes */}
          <Route
            path="temple/devotees"
            element={
              <ProtectedRoute requiredRoles={["temple_staff"]}>
                <Devotees />
              </ProtectedRoute>
            }
          />
          <Route
            path="temple/pagoda-lights"
            element={
              <ProtectedRoute requiredRoles={["temple_staff"]}>
                <PagodaLightsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="temple/donations"
            element={
              <ProtectedRoute requiredRoles={["temple_staff"]}>
                <DonationsPage />
              </ProtectedRoute>
            }
          />

          {/* Hall Booking Routes */}
          <Route
            path="hall/customers"
            element={
              <ProtectedRoute requiredRoles={["hall_manager"]}>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="hall/bookings"
            element={
              <ProtectedRoute requiredRoles={["hall_manager"]}>
                <Bookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="hall/quotations"
            element={
              <ProtectedRoute requiredRoles={["hall_manager"]}>
                <Quotations />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
