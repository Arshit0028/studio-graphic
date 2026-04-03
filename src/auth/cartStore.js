import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const currentCart = get().cart;
        const exists = currentCart.find((item) => item.id === product.id);

        if (exists) {
          set({
            cart: currentCart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...product, quantity: 1 }] });
        }
      },

      incrementQuantity: (id) => {
        const currentCart = get().cart;
        set({
          cart: currentCart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        });
      },

      decrementQuantity: (id) => {
        const currentCart = get().cart;
        const item = currentCart.find((i) => i.id === id);
        if (!item) return;

        if (item.quantity <= 1) {
          set({ cart: currentCart.filter((i) => i.id !== id) });
        } else {
          set({
            cart: currentCart.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
            ),
          });
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          set({ cart: get().cart.filter((item) => item.id !== id) });
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        });
      },

      removeFromCart: (id) =>
        set({ cart: get().cart.filter((item) => item.id !== id) }),

      clearCart: () => set({ cart: [] }),

      getTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage",
    },
  ),
);
