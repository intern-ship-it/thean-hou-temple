import { useEffect, useTransition } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../../features/auth/authSlice";
import LoadingSpinner from "./LoadingSpinner";
import { ShieldAlert } from "lucide-react";

function ProtectedRoute({ children, requiredRoles = [] }) {
  const dispatch = useDispatch();
  const { user, token, isLoading } = useSelector((state) => state.auth);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (token && !user) {
      startTransition(() => {
        dispatch(getCurrentUser());
      });
    }
  }, [token, user, dispatch]);

  // Show loading while checking auth
  if (isLoading || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role permissions
  if (requiredRoles.length > 0) {
    const hasRequiredRole =
      requiredRoles.includes(user.role) || user.role === "super_admin";

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have permission to access this page.
              </p>
              <button
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg"
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
}

export default ProtectedRoute;
