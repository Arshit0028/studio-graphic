// src/store/productsStore.js  ← create this file
import { create } from "zustand";
import api from "../api/axios";

const fixImageUrl = (url) => {
  if (!url || typeof url !== "string")
    return "https://placehold.co/400x400?text=No+Preview";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      return new URL(url).pathname;
    } catch {
      return "https://placehold.co/400x400?text=No+Preview";
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
};

export const useProductsStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fetched: false, // ← key flag

  fetchProducts: async (token) => {
    if (get().fetched) return; // ✅ don't re-fetch if already loaded
    if (!token) return;

    set({ loading: true, error: null });

    try {
      const response = await api.get("/v1/admin/boxes");
      const raw = response.data;
      let safeData = [];

      if (Array.isArray(raw)) safeData = raw;
      else if (Array.isArray(raw?.data)) safeData = raw.data;
      else if (Array.isArray(raw?.data?.data)) safeData = raw.data.data;
      else {
        const found = Object.values(raw?.data || {}).find(Array.isArray);
        if (found) safeData = found;
      }

      set({
        products: safeData.map((item) => ({
          ...item,
          _id: item._id || item.id || `temp-${Math.random()}`,
          name: item.name || item.title || "Untitled Box",
          price: Number(item.price) || 0,
          image: fixImageUrl(item.image),
          category: item.categoryId?.name || item.category || "",
        })),
        fetched: true,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: "Unable to load products. Please try again.",
        loading: false,
      });
    }
  },
}));
