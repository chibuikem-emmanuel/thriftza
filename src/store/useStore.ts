// src/store/useStore.ts
import { create } from 'zustand';

export interface CartItem {
  id: string | number;
  name?: string;
  title: string;          // Added/Required
  price: number;
  quantity: number;
  selectedSize?: string;  // Added/Optional
  image?: string;
}

export interface AppState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;  // Added
}

export const useStore = create<AppState>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  clearCart: () => set({ cart: [] }),
}));