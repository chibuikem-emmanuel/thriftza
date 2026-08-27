'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { fetchApi } from '@/lib/api';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: 'Lagos',
    state: 'Lagos State',
  });

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: cartTotal,
      };

      const response = await fetchApi('/api/orders/checkout/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const checkoutUrl =
        response.checkout_url ||
        response.data?.checkout_url ||
        response.data?.authorization_url;

      if (checkoutUrl) {
        // Redirect user to Bachs Payment Gateway
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Payment gateway URL was not returned. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Failed to initiate checkout. Please try again.'
      );
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-black uppercase text-zinc-900 dark:text-zinc-100">
          Your Cart is Empty
        </h1>
        <p className="text-zinc-500 text-sm mt-2 mb-6">
          Add some items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl uppercase transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="customer_name"
                required
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="customer_email"
                  required
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  required
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="08012345678"
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                Delivery Address
              </label>
              <textarea
                name="shipping_address"
                required
                rows={3}
                value={formData.shipping_address}
                onChange={handleChange}
                placeholder="Street address, apartment, suite..."
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-black py-4 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Proceed to Payment <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
            <h2 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-100 mb-4">
              Order Summary
            </h2>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.name}</p>
                    <p className="text-zinc-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono font-semibold">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4 flex justify-between items-center">
              <span className="font-bold uppercase text-zinc-900 dark:text-zinc-100">Total</span>
              <span className="text-xl font-black text-red-600 font-mono">
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secured redirect to Bachs Payment Gateway
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}