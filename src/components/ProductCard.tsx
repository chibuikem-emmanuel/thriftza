'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Film, X } from 'lucide-react';
import { Product } from '@/types/product';
import { useStore } from '@/store/useStore';

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.favorites);

  const isFav = favorites.some((item) => item.id === product.id);

  return (
    <>
      <div
        className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {product.videoUrl && isHovered && (
            <video
              src={product.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
            />
          )}

          <span className="absolute top-3 left-3 z-20 bg-black/80 text-white backdrop-blur-md text-xs font-bold px-2.5 py-1 rounded-md border border-zinc-700 pointer-events-none">
            {product.condition}
          </span>

          {product.videoUrl && (
            <button
              onClick={() => setShowVideoModal(true)}
              className="absolute bottom-3 left-3 z-20 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-md transition shadow-md"
            >
              <Film className="w-3.5 h-3.5" />
              <span>{isHovered ? 'PLAYING PREVIEW' : 'WATCH VIDEO'}</span>
            </button>
          )}

          <button
            onClick={() => toggleFavorite(product)}
            className="absolute top-3 right-3 z-20 p-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-full text-zinc-900 dark:text-white hover:text-red-600 transition shadow-sm"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-red-600 text-red-600' : ''}`} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-grow justify-between bg-white dark:bg-zinc-900">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition line-clamp-1">
                {product.name}
              </h3>
              <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded font-mono font-bold border border-zinc-200 dark:border-zinc-700">
                {product.size}
              </span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{product.category}</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-extrabold text-red-600 dark:text-red-500">
              ₦{product.price.toLocaleString()}
            </span>
            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </div>

      {showVideoModal && product.videoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden max-w-2xl w-full">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h3 className="text-white font-bold text-lg">{product.name} — Video View</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <video src={product.videoUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}