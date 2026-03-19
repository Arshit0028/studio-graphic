import axios from "axios";

// 1. Create the API Instance
const api = axios.create({
  baseURL: "/api", // Works in dev (Vite proxy) and production (vercel.json rewrite)
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor — attach token to every request
api.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem("token");

    if (rawToken && !config.headers.Authorization) {
      // Strip any accidental surrounding quotes from the token
      const token = rawToken.replace(/^"|"$/g, "");
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let browser set Content-Type automatically for FormData (multipart)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Response Interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("🔒 Session Expired or Invalid Token");

      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      // Only clear token and redirect if user was actually logged in
      // Do NOT redirect on guest token 401 (it will retry on next load)
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
