'use client';

import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';

export default function FavoritesPage() {
  const favorites = useStore((state) => state.favorites);

  if (favorites.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center text-red-600 mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black uppercase text-zinc-900 dark:text-zinc-100">
          Your Favorites List Is Empty
        </h1>
        <p className="text-sm text-zinc-500 max-w-sm mt-2 mb-6">
          Save items you love by tapping the heart icon on any product card.
        </p>

        {/* Updated Navigation Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl shadow-lg shadow-red-600/20 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black uppercase text-zinc-900 dark:text-zinc-100">
          Saved Favorites ({favorites.length})
        </h1>
        <Link
          href="/"
          className="text-xs font-bold uppercase text-red-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}