import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CartItem {
  id: string | number;
  title?: string;
  name?: string;
  price: number;
  quantity?: number;
  image?: string;
  images?: string[];
  video?: string;
  video_url?: string;
  size?: string;
  selectedSize?: string;
  category?: string;
  condition?: string;
}

export interface Product extends CartItem {
  id: string | number;
  condition: string;
}

export interface AppState {
  cart: CartItem[];
  favorites: CartItem[];
  theme: 'light' | 'dark';
  user: User | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (item: CartItem) => void;
  toggleTheme: () => void;
  initTheme: () => void;
  login: (userData: User) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  cart: [],
  favorites: [],
  theme: 'dark',
  user: null,

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      const addedQty = item.quantity ?? 1;
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: (i.quantity ?? 1) + addedQty }
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
        .filter((item) => (item.quantity ?? 0) > 0),
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

  initTheme: () => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      set({ theme: isDark ? 'dark' : 'light' });
    }
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    set({ theme: newTheme });
  },

  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
}));