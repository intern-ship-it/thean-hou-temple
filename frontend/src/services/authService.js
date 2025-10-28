// src/services/authService.js
import api from "./api";

const authService = {
  /**
   * Login
   */
  login: async (email, password) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  /**
   * Get current user
   */
  me: async () => {
    const response = await api.get("/me");
    return response.data;
  },

  /**
   * Logout
   */
  logout: async () => {
    const response = await api.post("/logout");
    return response.data;
  },

  /**
   * Logout from all devices
   */
  logoutAll: async () => {
    const response = await api.post("/logout-all");
    return response.data;
  },

  /**
   * Store auth data in localStorage
   */
  setAuthData: (token, user) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
  },

  /**
   * Get auth token from localStorage
   */
  getToken: () => {
    return localStorage.getItem("auth_token");
  },

  /**
   * Get user from localStorage
   */
  getUser: () => {
    const user = localStorage.getItem("auth_user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Clear auth data from localStorage
   */
  clearAuthData: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("auth_token");
  },
};

export default authService;
