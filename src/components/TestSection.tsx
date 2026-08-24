'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, ShoppingBag, Check, Flame, Palette, RefreshCw } from 'lucide-react';
import { Product } from '@/types/product';
import { useStore } from '@/store/useStore';

interface TestSectionProps {
  polos: Product[];
  trousers: Product[];
}

// Common color palettes for filtering
const COLOR_OPTIONS = [
  { name: 'All Colors', value: 'all', class: 'bg-gradient-to-r from-red-500 via-amber-400 to-blue-500' },
  { name: 'Black', value: 'black', class: 'bg-black border-zinc-700' },
  { name: 'White / Light', value: 'white', class: 'bg-zinc-100 border-zinc-300' },
  { name: 'Red / Warm', value: 'red', class: 'bg-red-600' },
  { name: 'Blue / Navy', value: 'blue', class: 'bg-blue-600' },
  { name: 'Earth / Beige', value: 'beige', class: 'bg-amber-700' },
];

export default function TestSection({ polos, trousers }: TestSectionProps) {
  const [selectedTopColor, setSelectedTopColor] = useState<string>('all');
  const [selectedBottomColor, setSelectedBottomColor] = useState<string>('all');
  const [addedComboId, setAddedComboId] = useState<string | null>(null);

  const addToCart = useStore((state) => state.addToCart);

  // Helper to check if item name or description matches selected color keywords
  const matchesColorFilter = (item: Product, colorFilter: string) => {
    if (colorFilter === 'all') return true;
    const itemText = `${item.name} ${item.condition || ''}`.toLowerCase();

    if (colorFilter === 'black') return itemText.includes('black') || itemText.includes('dark');
    if (colorFilter === 'white') return itemText.includes('white') || itemText.includes('light') || itemText.includes('cream');
    if (colorFilter === 'red') return itemText.includes('red') || itemText.includes('warm') || itemText.includes('maroon');
    if (colorFilter === 'blue') return itemText.includes('blue') || itemText.includes('navy') || itemText.includes('denim');
    if (colorFilter === 'beige') return itemText.includes('beige') || itemText.includes('brown') || itemText.includes('khaki') || itemText.includes('chino');

    return true;
  };

  // Filter items based on selected color chips
  const filteredPolos = useMemo(
    () => polos.filter((p) => matchesColorFilter(p, selectedTopColor)),
    [polos, selectedTopColor]
  );

  const filteredTrousers = useMemo(
    () => trousers.filter((t) => matchesColorFilter(t, selectedBottomColor)),
    [trousers, selectedBottomColor]
  );

  // Automatically construct stylish pairs from filtered subsets
  const outfitCombinations = useMemo(() => {
    const activePolos = filteredPolos.length > 0 ? filteredPolos : polos;
    const activeTrousers = filteredTrousers.length > 0 ? filteredTrousers : trousers;

    return activePolos.map((polo, index) => {
      const trouser = activeTrousers[index % activeTrousers.length] || activeTrousers[0];
      return {
        id: `combo-${polo.id}-${trouser.id}`,
        polo,
        trouser,
        styleName: index % 2 === 0 ? 'Urban Minimalist Fit' : 'Casual Smart Streetwear',
        matchScore: Math.min(99, 92 + (index % 7)),
        totalPrice: polo.price + trouser.price,
      };
    });
  }, [filteredPolos, filteredTrousers, polos, trousers]);

  const handleBuyCombo = (combo: typeof outfitCombinations[0]) => {
    addToCart(combo.polo);
    addToCart(combo.trouser);
    setAddedComboId(combo.id);
    setTimeout(() => setAddedComboId(null), 2000);
  };

  const handleResetFilters = () => {
    setSelectedTopColor('all');
    setSelectedBottomColor('all');
  };

  if (!polos.length || !trousers.length) return null;

  return (
    <section id="test" className="py-16 bg-zinc-900 border-y border-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" /> AI Outfit Generator
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              Automated <span className="text-red-500">Styling Sense</span> Lookbook
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Smart color-matching and outfit pairings automatically calculated from your active catalog.
            </p>
          </div>

          {/* Reset Action */}
          {(selectedTopColor !== 'all' || selectedBottomColor !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 self-start md:self-auto text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-2 rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Palette Filters
            </button>
          )}
        </div>

        {/* COLOR MATCHING FILTER CONTROLS */}
        <div className="bg-zinc-950/80 border border-zinc-800 p-4 sm:p-5 rounded-2xl mb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 border-b border-zinc-800/80 pb-3">
            <Palette className="w-4 h-4" /> Color Palette Matching Controls
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Color Filter Selector */}
            <div>
              <span className="text-xs font-bold uppercase text-zinc-400 block mb-2">
                Top Color (Polos):
              </span>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={`top-${color.value}`}
                    onClick={() => setSelectedTopColor(color.value)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      selectedTopColor === color.value
                        ? 'bg-zinc-800 text-white border-red-500 shadow-md'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full border ${color.class}`} />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Color Filter Selector */}
            <div>
              <span className="text-xs font-bold uppercase text-zinc-400 block mb-2">
                Bottom Color (Trousers):
              </span>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={`bottom-${color.value}`}
                    onClick={() => setSelectedBottomColor(color.value)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      selectedBottomColor === color.value
                        ? 'bg-zinc-800 text-white border-red-500 shadow-md'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full border ${color.class}`} />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Outfit Combination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfitCombinations.map((combo) => (
            <div
              key={combo.id}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition"
            >
              <div>
                {/* Lookbook Badge Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-500" /> {combo.styleName}
                  </span>
                  <span className="text-[10px] font-bold bg-green-950 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">
                    {combo.matchScore}% Color Harmony
                  </span>
                </div>

                {/* Split Visual Pairing (Polo + Trouser Side-by-Side) */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {/* Polo Image */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <Image
                      src={combo.polo.images[0]}
                      alt={combo.polo.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-zinc-950/80 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded text-zinc-300">
                      Top
                    </span>
                  </div>

                  {/* Trouser Image */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <Image
                      src={combo.trouser.images[0]}
                      alt={combo.trouser.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-zinc-950/80 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded text-zinc-300">
                      Bottom
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1 text-xs text-zinc-300 mb-4">
                  <p className="truncate font-semibold">• Top: {combo.polo.name}</p>
                  <p className="truncate font-semibold">• Bottom: {combo.trouser.name}</p>
                </div>
              </div>

              {/* Combo Price and Buy Button */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-black block">Pair Total</span>
                  <span className="text-base font-black text-amber-400">₦{combo.totalPrice.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => handleBuyCombo(combo)}
                  disabled={addedComboId === combo.id}
                  className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
                    addedComboId === combo.id
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {addedComboId === combo.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" /> Buy Fit
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}