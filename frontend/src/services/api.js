
// // src/services/api.js
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("auth_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token} `;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       // 401 Unauthorized
//       if (error.response.status === 401) {
//         localStorage.removeItem("auth_token");
//         localStorage.removeItem("auth_user");
//         window.location.href = "/login";
//       }

//       // 403 Forbidden
//       if (error.response.status === 403) {
//         console.error("Access denied");
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// src/services/api.js
import axios from "axios";

// Production-ready API URL
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? "/api" : "http://localhost:8000/api");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ← Removed extra space
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
      }

      // 403 Forbidden
      if (error.response.status === 403) {
        console.error("Access denied");
      }
    }
    return Promise.reject(error);
  }
);

export default api;