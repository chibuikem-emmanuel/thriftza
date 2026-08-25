'use client';

import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const favorites = useStore((state) => state.favorites);

  if (favorites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black uppercase mb-4 text-zinc-900 dark:text-zinc-100">
          No Saved Favorites
        </h1>
        <p className="text-zinc-500 mb-8">Items you bookmark will appear here.</p>
        <Link
          href="/shop"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-xl uppercase transition"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black uppercase mb-8 text-zinc-900 dark:text-zinc-100">
        Saved Items ({favorites.length})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              condition: product.condition || 'Used - Good',
            }}
          />
        ))}
      </div>
    </div>
  );
}