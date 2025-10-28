import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearError } from "../../features/auth/authSlice";
import { Building2, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    await dispatch(login(formData));
  };

  const fillDemo = (email, password) => {
    setFormData({ email, password });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && formData.email && formData.password && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Replace this URL with your temple image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076')`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Gradient Overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-6">
          {/* Chinese Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-2xl tracking-wider">
            天后宫管理系统
          </h1>

          {/* English Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-1 drop-shadow-lg">
            Thean Hou Temple
          </h2>

          {/* Subtitle */}
          <p className="text-base text-white/90 drop-shadow-lg">
            Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            {/* Logo Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
              管理員入口
            </h3>
            <p className="text-gray-600 mb-5 text-center text-sm">
              Admin Portal
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2.5 text-center font-medium">
                Demo Credentials
              </p>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => fillDemo(account.email, account.password)}
                    disabled={loading}
                    className="w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="block font-medium text-gray-900 text-sm">
                      {account.role}
                    </span>
                    <span className="block text-xs text-gray-600 mt-0.5">
                      {account.email}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-white/80 mt-4 drop-shadow-lg">
            © {new Date().getFullYear()} Thean Hou Temple. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
