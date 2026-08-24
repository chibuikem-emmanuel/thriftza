'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, User, Sun, Moon, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Logo from './Logo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const cart = useStore((state) => state.cart);
  const favorites = useStore((state) => state.favorites);
  const { theme, toggleTheme } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Check authentication status from localStorage
  const checkAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    setIsAuthenticated(!!token);
  };

useEffect(() => {
  checkAuth();

  window.addEventListener('auth-change', checkAuth);
  window.addEventListener('storage', checkAuth);

  return () => {
    window.removeEventListener('auth-change', checkAuth);
    window.removeEventListener('storage', checkAuth);
  };
}, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 active:scale-95 transition"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="hover:opacity-90 transition flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs lg:text-sm font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            <Link href="/" className="hover:text-red-600 transition">Shop All</Link>
            <Link href="/#polos" className="hover:text-red-600 transition">Round Necks</Link>
            <Link href="/#trousers" className="hover:text-red-600 transition">Plain Trousers</Link>
          </nav>

          {/* Right: Essential Quick Actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 transition"
              title="Toggle Light/Dark Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-800" />}
            </button>

            {/* Favorites Icon */}
            <Link
              href="/favorites"
              className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-zinc-950">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-zinc-950">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Desktop Account Link - Dynamic /account or /login */}
            <Link
              href={isAuthenticated ? '/account' : '/login'}
              className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition hidden sm:block"
              aria-label={isAuthenticated ? 'My Account' : 'User Login'}
              title={isAuthenticated ? 'My Account' : 'Login / Register'}
            >
              <User className={`w-5 h-5 ${isAuthenticated ? 'text-red-600' : ''}`} />
            </Link>
          </div>

        </div>
      </header>

      {/* Clean Full-Screen Slide Drawer for Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 h-full shadow-2xl flex flex-col justify-between z-10 border-r border-zinc-200 dark:border-zinc-800"
            >
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links Body */}
              <div className="p-4 flex-grow overflow-y-auto space-y-6">
                
                {/* Navigation Links */}
                <div>
                  <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block mb-3 px-2">
                    Categories
                  </span>
                  <div className="space-y-1">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl font-extrabold text-sm uppercase hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                    >
                      <span>Shop All Drops</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </Link>
                    <Link
                      href="/#polos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl font-extrabold text-sm uppercase hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                    >
                      <span>Round Neck Polos</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </Link>
                    <Link
                      href="/#trousers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl font-extrabold text-sm uppercase hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                    >
                      <span>Plain Trousers</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </Link>
                  </div>
                </div>

                {/* Account Shortcut */}
                <div>
                  <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block mb-3 px-2">
                    Account & Preferences
                  </span>
                  <Link
                    href={isAuthenticated ? '/account' : '/login'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl font-extrabold text-sm uppercase bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition"
                  >
                    <User className="w-4 h-4 text-red-600" />
                    <span>{isAuthenticated ? 'My Profile' : 'Account Login'}</span>
                  </Link>
                </div>

              </div>

              {/* Drawer Footer Banner */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <p className="text-[11px] font-extrabold uppercase text-amber-500 tracking-wider">
                  BULK WAYBILL OFFER
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Free nationwide shipping auto-applies on bulk orders.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}