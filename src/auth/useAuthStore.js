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

  login: (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    set({
      token: data?.token || null,

      user: data?.user || null,
    });
  },

  setToken: (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);

      set({ token: newToken });
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    set({ token: null, user: null });
  },
}));

export default useAuthStore;
