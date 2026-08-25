'use client';

import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { ShoppingBag, Heart, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const cart = useStore((state) => state.cart);
  const favorites = useStore((state) => state.favorites);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  const cartCount = cart.reduce((total, item) => total + (item.quantity ?? 1), 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase">
          THRIFTZA<span className="text-red-600">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <Link href="/favorites" className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition">
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}