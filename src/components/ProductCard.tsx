'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.favorites);

  const isFavorite = favorites.some((item) => item.id === product.id);

  // Safe fallback assignments for product titles, media, and metadata
  const displayTitle = product.title || product.name || 'Untitled Item';
  const displayImage =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg');
  const displayVideo = product.video || product.video_url;

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between transition hover:border-zinc-700">
      <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
        {displayVideo ? (
          <video
            src={displayVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <Image
            src={displayImage}
            alt={displayTitle}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        )}

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(product)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
            isFavorite
              ? 'bg-red-600 text-white'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          aria-label="Add to Favorites"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Condition Tag */}
        {product.condition && (
          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-wider">
            {product.condition}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-white text-base truncate hover:text-red-500 transition">
            {displayTitle}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-black text-white">
            ₦{product.price?.toLocaleString()}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="bg-red-600 text-white p-2.5 rounded-xl hover:bg-red-700 transition flex items-center justify-center"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}