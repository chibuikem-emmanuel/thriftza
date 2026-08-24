'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shuffle, Play, Pause, ShoppingBag, ArrowRight, Check, Layers } from 'lucide-react';
import { Product } from '@/types/product';
import { useStore } from '@/store/useStore';

interface VirtualMannequinProps {
  polos: Product[];
  trousers: Product[];
}

// Preset model poses / silhouettes for stylish visual representation
const MODEL_PRESETS = [
  {
    id: 1,
    name: 'Metropolitan Clean',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    vibe: 'Smart Casual Streetwear',
  },
  {
    id: 2,
    name: 'Minimalist Luxe',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
    vibe: 'Modern Thrift Fit',
  },
];

export default function VirtualMannequin({ polos, trousers }: VirtualMannequinProps) {
  const [selectedPoloIndex, setSelectedPoloIndex] = useState(0);
  const [selectedTrouserIndex, setSelectedTrouserIndex] = useState(0);
  const [modelIndex, setModelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [addedCombo, setAddedCombo] = useState(false);

  const addToCart = useStore((state) => state.addToCart);

  const currentPolo = polos[selectedPoloIndex] || polos[0];
  const currentTrouser = trousers[selectedTrouserIndex] || trousers[0];
  const currentModel = MODEL_PRESETS[modelIndex];

  // Auto-cycle outfit combinations every 4 seconds when playing
  useEffect(() => {
    if (!isPlaying || polos.length === 0 || trousers.length === 0) return;

    const interval = setInterval(() => {
      setSelectedPoloIndex((prev) => (prev + 1) % polos.length);
      setSelectedTrouserIndex((prev) => (prev + 1) % trousers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, polos.length, trousers.length]);

  const handleShuffle = () => {
    if (polos.length > 0) setSelectedPoloIndex(Math.floor(Math.random() * polos.length));
    if (trousers.length > 0) setSelectedTrouserIndex(Math.floor(Math.random() * trousers.length));
    setModelIndex((prev) => (prev + 1) % MODEL_PRESETS.length);
  };

  const handleAddComboToCart = () => {
    if (currentPolo) addToCart(currentPolo);
    if (currentTrouser) addToCart(currentTrouser);

    setAddedCombo(true);
    setTimeout(() => setAddedCombo(false), 2500);
  };

  if (!currentPolo || !currentTrouser) return null;

  const totalComboPrice = currentPolo.price + currentTrouser.price;

  return (
    <section className="py-12 sm:py-20 bg-zinc-950 text-white relative overflow-hidden border-y border-zinc-800">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Live AI Style Studio
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight">
              Automated <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">Styling Fitting Room</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base max-w-xl mt-2">
              Watch automated high-fashion combinations of our Grade-A Round Necks and Plain Trousers in real time.
            </p>
          </div>

          {/* Quick Controls Header */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold uppercase transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-green-400" />}
              <span>{isPlaying ? 'Pause Rotation' : 'Auto Rotate'}</span>
            </button>

            <button
              onClick={handleShuffle}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase transition shadow-lg shadow-red-600/20 active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle Fit</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT: Selected Top (Round Neck Polo) */}
          <div className="lg:col-span-3 order-2 lg:order-1 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 text-xs font-black uppercase text-amber-400 tracking-wider">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Top Layer</span>
              <span className="text-zinc-500">Item {selectedPoloIndex + 1}/{polos.length}</span>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-950 mb-3 border border-zinc-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPolo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentPolo.images[0]}
                    alt={currentPolo.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <h3 className="font-bold text-sm sm:text-base text-zinc-100 truncate">{currentPolo.name}</h3>
            <p className="text-xs text-zinc-400 uppercase font-mono mt-0.5">Size: {currentPolo.size} • ₦{currentPolo.price.toLocaleString()}</p>

            {/* Polo Selector Thumbnail Ribbon */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              {polos.map((polo, idx) => (
                <button
                  key={polo.id}
                  onClick={() => {
                    setSelectedPoloIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    idx === selectedPoloIndex ? 'border-red-500 scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={polo.images[0]} alt={polo.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* CENTER: Live Model Display Stage */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative aspect-[3/4] max-h-[580px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl flex items-center justify-center">
            
            {/* Model Base Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentModel.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentModel.image}
                  alt={currentModel.name}
                  fill
                  priority
                  className="object-cover object-top filter brightness-90 contrast-105"
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlay Gradient Shading for Look Integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

            {/* Floating Live Mix-Match Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-20">
              <span className="bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-amber-300 font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                {currentModel.vibe}
              </span>

              <button
                onClick={() => setModelIndex((prev) => (prev + 1) % MODEL_PRESETS.length)}
                className="bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-zinc-300 hover:text-white font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-full transition"
              >
                Switch Model
              </button>
            </div>

            {/* Bottom Overlay Combo Card & CTA */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-zinc-950/85 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                  Complete Look Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-amber-400">
                    ₦{totalComboPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-green-400 bg-green-950/60 border border-green-800/50 px-2 py-0.5 rounded">
                    Free Waybill Eligible
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddComboToCart}
                disabled={addedCombo}
                className={`py-3 px-5 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg ${
                  addedCombo
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 active:scale-95'
                }`}
              >
                {addedCombo ? (
                  <>
                    <Check className="w-4 h-4" /> Combo Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Buy Entire Fit <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>

          {/* RIGHT: Selected Bottom (Plain Trouser) */}
          <div className="lg:col-span-3 order-3 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 text-xs font-black uppercase text-amber-400 tracking-wider">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Bottom Layer</span>
              <span className="text-zinc-500">Item {selectedTrouserIndex + 1}/{trousers.length}</span>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-950 mb-3 border border-zinc-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTrouser.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentTrouser.images[0]}
                    alt={currentTrouser.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <h3 className="font-bold text-sm sm:text-base text-zinc-100 truncate">{currentTrouser.name}</h3>
            <p className="text-xs text-zinc-400 uppercase font-mono mt-0.5">Size: {currentTrouser.size} • ₦{currentTrouser.price.toLocaleString()}</p>

            {/* Trouser Selector Thumbnail Ribbon */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              {trousers.map((trouser, idx) => (
                <button
                  key={trouser.id}
                  onClick={() => {
                    setSelectedTrouserIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    idx === selectedTrouserIndex ? 'border-red-500 scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={trouser.images[0]} alt={trouser.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}