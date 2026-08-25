'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function CartPage() {
  const cart = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center text-red-600 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black uppercase text-zinc-900 dark:text-zinc-100">
          Your Shopping Bag Is Empty
        </h1>
        <p className="text-sm text-zinc-500 max-w-sm mt-2 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>

        {/* Updated Navigation Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl shadow-lg shadow-red-600/20 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black uppercase text-zinc-900 dark:text-zinc-100">
          Shopping Cart ({cart.length})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-bold uppercase text-zinc-400 hover:text-red-600 transition flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const qty = item.quantity ?? 1;
            const title = item.title || item.name || 'Product';
            const imageSrc =
              (item.images && item.images[0]) || item.image || '/placeholder.png';

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src={imageSrc}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      {title}
                    </h3>
                    <p className="text-red-600 font-black text-sm mt-0.5">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, qty - 1)}
                      className="p-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded transition"
                    >
                      <Minus className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
                    </button>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 px-1">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, qty + 1)}
                      className="p-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded transition"
                    >
                      <Plus className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 h-fit space-y-4">
          <h2 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-100">
            Order Summary
          </h2>
          <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>Subtotal</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              ₦{subtotal.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100">
            <span>Total</span>
            <span className="text-red-600">₦{subtotal.toLocaleString()}</span>
          </div>
          <button className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs rounded-xl transition shadow-lg shadow-red-600/20">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}