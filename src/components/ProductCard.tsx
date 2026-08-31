'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Play, X } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.favorites);

  const isFavorite = favorites.some((item) => item.id === product.id);

  const displayTitle = product.title || product.name || 'Untitled Item';
  const displayImage =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg');
  const displayVideo = product.video || product.videoUrl || product.video_url;

  return (
    <>
      <div className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between transition hover:border-zinc-700">
        <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
          <Image
            src={displayImage}
            alt={displayTitle}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />

          <button
            onClick={() => toggleFavorite(product)}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition ${
              isFavorite
                ? 'bg-red-600 text-white'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            aria-label="Add to Favorites"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          {product.condition && (
            <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-wider z-10">
              {product.condition}
            </span>
          )}

          {displayVideo && (
            <button
              onClick={() => setIsVideoOpen(true)}
              className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md transition shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Video</span>
            </button>
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

      {isVideoOpen && displayVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h4 className="font-bold text-white truncate max-w-[80%]">{displayTitle} - Video Preview</h4>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800 hover:bg-zinc-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-square w-full bg-black">
              <video
                src={displayVideo}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}