'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';

// Fallback sample MP4 video so EVERY card shows the feature if video property is missing in data
const DEFAULT_SAMPLE_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.favorites);

  const [isHovered, setIsHovered] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const hoverVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const isFavorite = favorites.some((item) => item.id === product.id);
  const title = product.title || product.name || 'Product';
  const imageSrc = (product.images && product.images[0]) || product.image || '/placeholder.png';
  
  // ALWAYS resolves to a video source
  const videoSrc = product.video || product.video_url || DEFAULT_SAMPLE_VIDEO;

  // Background hover loop logic
  useEffect(() => {
    if (hoverVideoRef.current && !isVideoModalOpen) {
      if (isHovered) {
        hoverVideoRef.current.play().catch(() => {});
      } else {
        hoverVideoRef.current.pause();
        hoverVideoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, isVideoModalOpen]);

  // Modal player logic
  useEffect(() => {
    if (isVideoModalOpen && modalVideoRef.current) {
      modalVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isVideoModalOpen]);

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

  const handleOpenVideoModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoModalOpen(true);
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between transition hover:border-red-600/50"
      >
        {/* Media Window */}
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
          
          {/* Cover Image */}
          <Image
            src={imageSrc}
            alt={title}
            fill
            className={`object-cover transition duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
            }`}
          />

          {/* Hover Video Preview Loop */}
          <video
            ref={hoverVideoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0'
            }`}
          />

          {/* ALWAYS VISIBLE ON HOVER: "Watch Video" Button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-30 pointer-events-auto">
            <button
              type="button"
              onClick={handleOpenVideoModal}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs uppercase px-5 py-3 rounded-full shadow-2xl transform translate-y-3 group-hover:translate-y-0 transition duration-300 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch Video
            </button>
          </div>

          {/* Permanent Video Pill Badge */}
          {!isHovered && (
            <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full z-10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-3 h-3 fill-white" /> Video Available
            </span>
          )}

          {/* Favorite Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-900 dark:text-zinc-100 hover:text-red-600 transition z-40"
            aria-label="Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
          </button>
        </div>

        {/* Details Footer */}
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
              type="button"
              onClick={() => addToCart(product)}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Video Player Modal Screen */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
              <span className="text-xs font-bold uppercase tracking-wider bg-red-600 text-white px-3 py-1 rounded-full">
                Video Preview
              </span>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Canvas */}
            <div className="relative aspect-square w-full bg-black">
              <video
                ref={modalVideoRef}
                src={videoSrc}
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Controls Footer */}
            <div className="p-4 bg-zinc-950 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{title}</h4>
                <p className="text-xs text-red-500 font-black">₦{product.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePlayPause}
                  className="p-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="p-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(product);
                    setIsVideoModalOpen(false);
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