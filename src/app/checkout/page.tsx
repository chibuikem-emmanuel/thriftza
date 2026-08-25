'use client';

import { useState, useEffect } from 'react';
import { useStore, CartItem } from '@/store/useStore';
import { fetchApi } from '@/lib/api';

export default function CheckoutPage() {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setFormData((prev) => ({
          ...prev,
          full_name: user.full_name || '',
          email: user.email || '',
          phone: user.whatsapp_number || '',
        }));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        customer: formData,
        items: cart.map((item: any) => ({
          id: item.id,
          title: item.title || item.name || 'Item',
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize || item.size || '',
        })),
        total_amount: totalAmount,
      };

      const res = await fetchApi('/api/checkout/', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Payment initiation failed.');
      }

      if (data.checkout_url) {
        if (clearCart) clearCart();
        window.location.href = data.checkout_url;
      } else {
        throw new Error('Checkout URL was not returned by backend.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black uppercase mb-8 text-zinc-900 dark:text-zinc-100">
        Checkout
      </h1>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-600 text-red-500 p-4 rounded-xl text-sm font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-bold uppercase text-zinc-800 dark:text-zinc-200">
            Delivery Information
          </h2>

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            required
            value={formData.full_name}
            onChange={handleChange}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-red-600"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-red-600"
          />

          <input
            type="tel"
            name="phone"
            placeholder="WhatsApp / Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-red-600"
          />

          <input
            type="text"
            name="address"
            placeholder="Street Address"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-red-600"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-red-600"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase transition disabled:opacity-50"
          >
            {loading ? 'PROCESSING PAYMENT...' : `PAY ₦${totalAmount.toLocaleString()}`}
          </button>
        </form>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl h-fit">
          <h2 className="text-lg font-bold uppercase mb-4 text-zinc-800 dark:text-zinc-200">
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <p className="text-zinc-500 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item: any, index: number) => {
                const itemTitle = item.title || item.name || 'Product';
                const itemSize = item.selectedSize || item.size;
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm border-b border-zinc-200 dark:border-zinc-800 pb-3"
                  >
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{itemTitle}</p>
                      <p className="text-xs text-zinc-500">
                        Qty: {item.quantity} {itemSize ? `| Size: ${itemSize}` : ''}
                      </p>
                    </div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}

              <div className="pt-2 flex justify-between font-black text-lg text-zinc-900 dark:text-zinc-100">
                <span>Total:</span>
                <span className="text-red-600">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}