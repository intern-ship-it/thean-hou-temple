import { useState, useEffect, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset, clearError } from "../../features/auth/authSlice";
import { Church, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition(); // React 19 feature

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess && user) {
      startTransition(() => {
        navigate("/");
      });
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());

    startTransition(() => {
      dispatch(login({ email, password }));
    });
  };

  const demoAccounts = [
    {
      role: "Super Admin",
      email: "admin@theanhou.com",
      password: "password123",
    },
    {
      role: "Temple Staff",
      email: "temple@theanhou.com",
      password: "password123",
    },
    {
      role: "Hall Manager",
      email: "hall@theanhou.com",
      password: "password123",
    },
  ];

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(clearError());
  };

  const isSubmitting = isLoading || isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-950 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full shadow-2xl mb-4">
            <Church className="w-10 h-10 text-red-900" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Thean Hou Temple
          </h1>
          <p className="text-yellow-200 text-lg">Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Welcome Back
          </h2>

          {/* Error Message */}
          {isError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Login Failed</p>
                <p className="text-sm text-red-600 mt-1">{message}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
              Quick Demo Access
            </p>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => fillDemo(account.email, account.password)}
                  disabled={isSubmitting}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-lg border border-gray-200 transition-all disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {account.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {account.email}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 group-hover:text-red-500 transition-colors">
                      Click to use
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-yellow-200 mt-6">
          © 2025 Thean Hou Temple. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
