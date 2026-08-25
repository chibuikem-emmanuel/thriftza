'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black uppercase mb-4 text-zinc-900 dark:text-zinc-100">
          Your Cart is Empty
        </h1>
        <p className="text-zinc-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-xl uppercase transition"
        >
          Explore Shop <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase text-zinc-900 dark:text-zinc-100">
          Shopping Cart ({cart.length})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs uppercase font-bold text-red-500 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const itemTitle = item.title || item.name || 'Item';
            const itemImage = (item.images && item.images[0]) || item.image || '/placeholder.png';
            const itemSize = item.selectedSize || item.size;
            const quantity = item.quantity ?? 1;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                    <Image
                      src={itemImage}
                      alt={itemTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{itemTitle}</h3>
                    {itemSize && <p className="text-xs text-zinc-500 uppercase">Size: {itemSize}</p>}
                    <p className="text-sm font-black text-red-600 mt-1">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, quantity - 1)}
                      className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                      className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl h-fit">
          <h2 className="text-lg font-bold uppercase mb-4 text-zinc-800 dark:text-zinc-200">
            Order Summary
          </h2>
          <div className="space-y-3 text-sm border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Subtotal</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Delivery</span>
              <span className="text-xs uppercase font-bold text-zinc-500">Calculated at Checkout</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-4 text-lg font-black text-zinc-900 dark:text-zinc-100">
            <span>Total</span>
            <span className="text-red-600">₦{total.toLocaleString()}</span>
          </div>
          <Link
            href="/checkout"
            className="w-full mt-2 block text-center bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}