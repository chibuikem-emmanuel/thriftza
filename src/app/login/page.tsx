'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Strict validation: Only proceed if backend returns user payload
      if (response && response.user) {
        setUser(response.user);
        window.dispatchEvent(new Event('auth-change'));
        router.push('/account');
        router.refresh();
      } else {
        throw new Error('Invalid credentials or missing response from server.');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-black uppercase text-center mb-6 text-white">Welcome Back</h1>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-600 text-red-500 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 font-bold py-3 rounded-lg text-white hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-red-500 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}