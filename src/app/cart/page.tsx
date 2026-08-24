'use client';

import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-black mb-4">YOUR CART IS EMPTY</h1>
        <p className="text-zinc-400 mb-8">Discover our fresh drops and add your favorites.</p>
        <Link href="/" className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition">
          EXPLORE DROPS
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-black uppercase">Shopping Cart</h1>
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-xl items-center">
            <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-zinc-400">Size: {item.size}</p>
              <p className="text-red-500 font-bold mt-1">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-red-500"><Minus className="w-4 h-4" /></button>
              <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-red-500"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="p-2 text-zinc-500 hover:text-red-500">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-fit">
        <h2 className="text-xl font-bold uppercase mb-4 border-b border-zinc-800 pb-3">Order Summary</h2>
        <div className="flex justify-between py-2 text-zinc-300">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 text-zinc-300">
          <span>Shipping</span>
          <span className="text-emerald-500 font-medium">Calculated at Checkout</span>
        </div>
        <div className="flex justify-between py-4 text-xl font-black border-t border-zinc-800 mt-4">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Link href="/checkout" className="w-full bg-red-600 block text-center text-white py-3 rounded-lg font-bold hover:bg-red-700 transition mt-4">
          PROCEED TO CHECKOUT
        </Link>
      </div>
    </div>
  );
}