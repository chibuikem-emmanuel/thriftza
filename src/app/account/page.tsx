'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone_number?: string;
  whatsapp_number?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (!token || !storedUser) {
      router.push('/login');
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    // Dispatch custom event to notify components like Navbar of auth state change
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-zinc-400">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase text-white">My Account</h1>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-semibold">
            Active Member
          </span>
        </div>

        <div className="space-y-4 text-sm text-zinc-300">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-500 block mb-1 font-semibold">
                Username
              </label>
              <span className="text-white font-medium text-base">{user.username}</span>
            </div>

            <div className="border-t border-zinc-800/60 pt-3">
              <label className="text-xs uppercase tracking-wider text-zinc-500 block mb-1 font-semibold">
                Email Address
              </label>
              <span className="text-white font-medium">{user.email || 'Not provided'}</span>
            </div>

            <div className="border-t border-zinc-800/60 pt-3">
              <label className="text-xs uppercase tracking-wider text-zinc-500 block mb-1 font-semibold">
                WhatsApp / Phone Number
              </label>
              <span className="text-white font-medium">
                {user.whatsapp_number || user.phone_number || 'Not provided'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-zinc-800 text-center py-3 rounded-lg text-white font-semibold hover:bg-zinc-700 transition"
          >
            Continue Shopping
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-600/10 border border-red-600/40 text-red-500 font-bold py-3 rounded-lg hover:bg-red-600 hover:text-white transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}