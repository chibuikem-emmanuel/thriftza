'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { ShoppingBag, Heart, Sun, Moon, User, LogOut, UserCheck } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const cart = useStore((state) => state.cart);
  const favorites = useStore((state) => state.favorites);
  const theme = useStore((state) => state.theme);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const initTheme = useStore((state) => state.initTheme);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartCount = cart.reduce((total, item) => total + (item.quantity ?? 1), 0);

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
    setIsDropdownOpen(false);
  };

  const openRegister = () => {
    setAuthMode('register');
    setIsAuthOpen(true);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
    logout();
    setIsDropdownOpen(false);
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase">
            THRIFTZA<span className="text-red-600">.</span>
          </Link>

          <div className="flex items-center gap-5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Saved Favorites */}
            <Link href="/favorites" className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition">
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Counter */}
            <Link href="/cart" className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Icon Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`p-2 rounded-full transition ${
                  user
                    ? 'text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-600/30'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-red-600'
                }`}
                aria-label="Account Menu"
              >
                <User className="w-5 h-5" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs font-semibold text-zinc-400 uppercase">Signed in as</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.name || 'User'}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={openLogin}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-2 transition"
                      >
                        <UserCheck className="w-4 h-4 text-red-600" />
                        Log In
                      </button>
                      <button
                        onClick={openRegister}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-2 transition"
                      >
                        <User className="w-4 h-4 text-red-600" />
                        Create Account
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}