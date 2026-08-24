'use client';

import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';

export default function FavoritesPage() {
  const favorites = useStore((state) => state.favorites);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black uppercase mb-8">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p className="text-zinc-400">No favorite items saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}