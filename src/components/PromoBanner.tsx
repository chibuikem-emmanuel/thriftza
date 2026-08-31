'use client';

import { Truck, Sparkles, Flame } from 'lucide-react';

export default function PromoBanner() {
  return (
    <div className="bg-red-600 text-white text-xs md:text-sm font-black uppercase py-2.5 px-4 overflow-hidden relative shadow-md">
      <div className="flex items-center justify-center gap-6 whitespace-nowrap animate-pulse">
        <span className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
          EVERYTHING ₦5,500 FLAT RATE
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:flex items-center gap-1.5">
          <Truck className="w-4 h-4" />
          FREE WAYBILL ON BULK ORDERS
        </span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-300" />
          PREMIUM ROUND NECKS
        </span>
      </div>
    </div>
  );
}