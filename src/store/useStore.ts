import { create } from 'zustand';

export interface CartItem {
  id: string | number;
  title?: string;
  name?: string;
  price: number;
  quantity?: number;
  image?: string;
  images?: string[];
  size?: string;
  selectedSize?: string;
  category?: string;
}

export interface Product extends CartItem {}

export interface AppState {
  cart: CartItem[];
  favorites: CartItem[];
  theme: 'light' | 'dark';
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (item: CartItem) => void;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  cart: [],
  favorites: [],
  theme: 'dark',

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      const addedQty = item.quantity || 1;
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: (i.quantity || 1) + addedQty }
              : i
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: addedQty }] };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => (item.quantity || 0) > 0),
    })),

  clearCart: () => set({ cart: [] }),

  toggleFavorite: (item) =>
    set((state) => {
      const exists = state.favorites.some((fav) => fav.id === item.id);
      if (exists) {
        return { favorites: state.favorites.filter((fav) => fav.id !== item.id) };
      }
      return { favorites: [...state.favorites, item] };
    }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));