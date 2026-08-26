import { create } from 'zustand';

export interface User {
  id: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone_number?: string;
}

export interface AppState {
  cart: any[];
  favorites: any[];
  theme: 'light' | 'dark';
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  cart: [],
  favorites: [],
  theme: 'dark',
  user: null,
  setUser: (user) => set({ user }),
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
}));