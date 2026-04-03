import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem("token");
    if (rawToken) {
      const token = rawToken.replace(/^"|"$/g, "");
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — smart 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // ✅ Public routes — NEVER logout on these even if 401
    const publicRoutes = ["/v1/box-types", "/v1/boxes", "/v1/products"];

    const isPublicRoute = publicRoutes.some((route) => url.includes(route));

    if (status === 401 && !isPublicRoute) {
      // Only logout if it's a protected route (cart, orders, profile etc.)
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (isLoggedIn) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
