// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-800 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole =
      requiredRoles.includes(user.role) || user.role === "super_admin";

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have permission to access this page.
              </p>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
