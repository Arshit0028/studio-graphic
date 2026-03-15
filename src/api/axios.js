import axios from "axios";

// 1. Create the API Instance
const api = axios.create({
  baseURL: "/api", // Goes through Vite Proxy
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem("token");

    if (rawToken && !config.headers.Authorization) {
      const token = rawToken.replace(/^"|"$/g, "");
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("🔒 Session Expired or Invalid Token");
    }
    return Promise.reject(error);
  },
);
export default api;
