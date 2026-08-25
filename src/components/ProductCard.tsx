'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, Play } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.favorites);

  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isFavorite = favorites.some((item) => item.id === product.id);
  const title = product.title || product.name || 'Product';
  const imageSrc = (product.images && product.images[0]) || product.image || '/placeholder.png';
  const videoSrc = product.video || product.video_url;

  useEffect(() => {
    if (isHovered && videoRef.current && videoSrc) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video play interrupted or muted autoplay blocked:', err);
        });
      }
    } else if (!isHovered && videoRef.current && videoSrc) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, videoSrc]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between transition hover:border-red-600/50"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
        {/* Static Cover Image */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className={`object-cover transition duration-300 ${
            videoSrc && isHovered && isVideoLoaded ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
          }`}
        />

        {/* Video Preview Layer */}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered && isVideoLoaded ? 'opacity-100 scale-105' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Video Indicator Badge */}
        {videoSrc && !isHovered && (
          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full z-10">
            <Play className="w-3 h-3 fill-white" />
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-900 dark:text-zinc-100 hover:text-red-600 transition z-20"
          aria-label="Favorite"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
        </button>
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
            {product.condition}
          </span>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 mt-1">
            {title}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-black text-lg text-zinc-900 dark:text-zinc-100">
            ₦{product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}