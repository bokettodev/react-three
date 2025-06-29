import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { MOCK_PRODUCTS } from "../constants/products";
import type { AppState, CartItem, Product } from "../types";

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

export const useStore = create<AppState>()(
  devtools(
    (set) => ({
      products: MOCK_PRODUCTS,
      cart: {
        items: [],
        total: 0,
      },

      addToCart: (product: Product) => {
        set((state) => {
          const existingItem = state.cart.items.find(
            (item) => item.product.id === product.id
          );

          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.cart.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newItems = [...state.cart.items, { product, quantity: 1 }];
          }

          return {
            cart: {
              items: newItems,
              total: calculateTotal(newItems),
            },
          };
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => {
          const newItems = state.cart.items.filter(
            (item) => item.product.id !== productId
          );
          return {
            cart: {
              items: newItems,
              total: calculateTotal(newItems),
            },
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.cart.items.filter(
              (item) => item.product.id !== productId
            );
            return {
              cart: {
                items: newItems,
                total: calculateTotal(newItems),
              },
            };
          }

          const newItems = state.cart.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );

          return {
            cart: {
              items: newItems,
              total: calculateTotal(newItems),
            },
          };
        });
      },

      clearCart: () => {
        set({
          cart: {
            items: [],
            total: 0,
          },
        });
      },
    }),
    {
      name: "shop-store",
    }
  )
);
