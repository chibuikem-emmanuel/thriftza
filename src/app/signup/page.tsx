'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { useStore } from '@/store/useStore';

export default function SignupPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    whatsapp_number: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const nameParts = formData.full_name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        first_name: firstName,
        last_name: lastName,
        phone_number: formData.whatsapp_number,
      });

      if (response?.user) {
        setUser(response.user);
      }

      window.dispatchEvent(new Event('auth-change'));
      router.push('/account');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-black uppercase text-center mb-6 text-white">Create Account</h1>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-600 text-red-500 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            required
            value={formData.full_name}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
          />
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
            type="tel"
            name="whatsapp_number"
            placeholder="WhatsApp Phone Number (e.g., 08012345678)"
            required
            value={formData.whatsapp_number}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 font-bold py-3 rounded-lg text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-red-500 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}