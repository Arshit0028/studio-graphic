import { create } from "zustand";

const getStoredUser = () => {
  try {
    const item = localStorage.getItem("user");
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  user: getStoredUser(),
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",

  // Called after successful real login
  login: (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
    }

    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    set({
      token: data?.token || null,
      user: data?.user || null,
      isLoggedIn: true,
    });
  },

  // Called to store guest token only (not a real login)
  setToken: (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      set({ token: newToken });
    }
  },

  // Called on logout — clears everything
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    set({ token: null, user: null, isLoggedIn: false });
  },
}));

export default useAuthStore;
