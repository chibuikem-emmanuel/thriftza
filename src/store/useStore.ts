import { create } from 'zustand';

export interface Product {
  id: string | number;
  name?: string;
  title?: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
  size?: string;
  selectedSize?: string;
  condition?: string;
  video?: string;
  video_url?: string;
  description?: string;
  quantity?: number;
}

export interface User {
  id?: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone_number?: string;
}

export interface AppState {
  cart: Product[];
  favorites: Product[];
  theme: 'light' | 'dark';
  user: User | null;

  // Actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  initTheme: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
}

export const useStore = create<AppState>((set) => ({
  cart: [],
  favorites: [],
  theme: 'dark',
  user: null,

  setUser: (user) => set({ user }),
  login: (user) => set({ user }),
  logout: () => set({ user: null }),

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        localStorage.setItem('theme', nextTheme);
      }
      return { theme: nextTheme };
    }),

  initTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      set({ theme: savedTheme });
    }
  },

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity ?? 1) + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((item) => item.id !== productId) };
      }
      return {
        cart: state.cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      };
    }),

  clearCart: () => set({ cart: [] }),

  toggleFavorite: (product) =>
    set((state) => {
      const isFav = state.favorites.some((item) => item.id === product.id);
      if (isFav) {
        return {
          favorites: state.favorites.filter((item) => item.id !== product.id),
        };
      }
      return { favorites: [...state.favorites, product] };
    }),
}));