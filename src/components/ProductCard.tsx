'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.favorites);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isFavorite = favorites.some((item) => item.id === product.id);
  const title = product.title || product.name || 'Product';
  const imageSrc = (product.images && product.images[0]) || product.image || '/placeholder.png';
  const videoSrc = product.video || product.video_url;

  useEffect(() => {
    if (isPreviewOpen && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPreviewOpen]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCloseVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPreviewOpen(false);
  };

  return (
    <div className="group relative bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between transition hover:border-red-600/50">
      
      {/* Media Box */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
        
        {/* Product Cover Image */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className={`object-cover transition duration-300 ${
            isPreviewOpen ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
          }`}
        />

        {/* Watch Video Button (Shown on Card Hover if video is attached) */}
        {videoSrc && !isPreviewOpen && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              className="pointer-events-auto flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition duration-300"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch Video
            </button>
          </div>
        )}

        {/* Video Player Modal Layer */}
        {videoSrc && isPreviewOpen && (
          <div className="absolute inset-0 bg-black z-20 flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoSrc}
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />

            {/* Video Header Controls */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
                Video Preview
              </span>

              <button
                onClick={handleCloseVideo}
                className="p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                aria-label="Close Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Footer Controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-30">
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={handleToggleMute}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Favorite Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-900 dark:text-zinc-100 hover:text-red-600 transition z-30"
          aria-label="Favorite"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
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