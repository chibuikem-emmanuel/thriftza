'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, Play, Pause, Volume2, VolumeX, X, Maximize2 } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.favorites);

  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const hoverVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const isFavorite = favorites.some((item) => item.id === product.id);
  const title = product.title || product.name || 'Product';
  const imageSrc = (product.images && product.images[0]) || product.image || '/placeholder.png';
  const videoSrc = product.video || product.video_url;

  // Handle auto-play preview on hover
  useEffect(() => {
    if (videoSrc && hoverVideoRef.current && !isFullModalOpen) {
      if (isCardHovered) {
        hoverVideoRef.current.play().catch(() => {});
      } else {
        hoverVideoRef.current.pause();
        hoverVideoRef.current.currentTime = 0;
      }
    }
  }, [isCardHovered, videoSrc, isFullModalOpen]);

  // Handle full modal video playback
  useEffect(() => {
    if (isFullModalOpen && modalVideoRef.current) {
      modalVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isFullModalOpen]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalVideoRef.current) return;
    if (isPlaying) {
      modalVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      modalVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalVideoRef.current) return;
    modalVideoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        className="group relative bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between transition hover:border-red-600/50"
      >
        {/* Media Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
          
          {/* Static Cover Image */}
          <Image
            src={imageSrc}
            alt={title}
            fill
            className={`object-cover transition duration-300 ${
              videoSrc && isCardHovered ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
            }`}
          />

          {/* Hover Video Preview Layer */}
          {videoSrc && (
            <video
              ref={hoverVideoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                isCardHovered ? 'opacity-100 scale-105' : 'opacity-0'
              }`}
            />
          )}

          {/* "Watch Video" Action Button (Appears on Hover when Video Exists) */}
          {videoSrc && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullModalOpen(true);
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-full shadow-xl transform translate-y-2 group-hover:translate-y-0 transition duration-300"
              >
                <Play className="w-4 h-4 fill-white" />
                Watch Video
              </button>
            </div>
          )}

          {/* Video Indicator Badge */}
          {videoSrc && !isCardHovered && (
            <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full z-10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Play className="w-3 h-3 fill-white" /> Video
            </span>
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

      {/* Dedicated Video Modal Viewer */}
      {videoSrc && isFullModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
            
            {/* Header Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
              <span className="text-xs font-bold uppercase tracking-wider bg-red-600 text-white px-3 py-1 rounded-full">
                Product Showcase
              </span>

              <button
                onClick={() => setIsFullModalOpen(false)}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Video Screen */}
            <div className="relative aspect-square w-full">
              <video
                ref={modalVideoRef}
                src={videoSrc}
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Footer Bar & Player Controls */}
            <div className="p-4 bg-zinc-950 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{title}</h4>
                <p className="text-xs text-red-500 font-black">₦{product.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="p-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={handleToggleMute}
                  className="p-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    addToCart(product);
                    setIsFullModalOpen(false);
                  }}
                  className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase rounded-xl transition flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}