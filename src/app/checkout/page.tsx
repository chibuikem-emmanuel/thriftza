'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { apiFetch } from '@/lib/api';

export default function CheckoutPage() {
  const cart = useStore((state) => state.cart);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        customer_email: formData.email,
        customer_phone: formData.phone,
        items: cart.map((item) => ({
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };

      const response = await apiFetch('/orders/checkout/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        throw new Error('Failed to retrieve checkout URL.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h1 className="text-3xl font-black uppercase">Shipping Information</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-600 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (e.g., 08012345678)"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : `PAY NOW (₦${total.toLocaleString()})`}
          </button>
        </form>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-fit">
        <h2 className="text-xl font-bold uppercase mb-4 border-b border-zinc-800 pb-3">
          Items ({cart.length})
        </h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
              </div>
              <span className="font-mono">₦{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}