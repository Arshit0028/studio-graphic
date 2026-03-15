import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],

      toggleWishlist: (product) => {
        const currentWishlist = get().wishlist;
        const exists = currentWishlist.find((item) => item.id === product.id);

        if (exists) {
          set({
            wishlist: currentWishlist.filter((item) => item.id !== product.id),
          });
        } else {
          set({ wishlist: [...currentWishlist, product] });
        }
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "wishlist-storage",
    },
  ),
);
