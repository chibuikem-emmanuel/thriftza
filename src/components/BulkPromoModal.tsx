'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Truck, CheckCircle } from 'lucide-react';

export default function BulkPromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenModal = sessionStorage.getItem('thriftza_promo_seen');
      if (!hasSeenModal) {
        setIsOpen(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('thriftza_promo_seen', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-zinc-900 border-2 border-red-600 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-600/30 blur-2xl rounded-full pointer-events-none" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex p-3 bg-red-600/20 text-red-500 rounded-2xl mb-4">
              <Flame className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              FLASH DEAL!
            </h3>

            <div className="my-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
              <p className="text-3xl font-black text-red-500">
                ₦5,500 <span className="text-sm font-normal text-zinc-400">/ per item</span>
              </p>
              <p className="text-xs text-zinc-400 font-mono">*Prices subject to change in future drops</p>
            </div>

            <ul className="text-left space-y-2.5 text-sm text-zinc-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Grade-A Quality Round Neck Polos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Smart Polos</span>
              </li>
              <li className="flex items-center gap-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-amber-400 font-bold">
                <Truck className="w-5 h-5 shrink-0" />
                <span>FREE WAYBILL ON BULK PURCHASES!</span>
              </li>
            </ul>

            <button
              onClick={handleClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl text-base uppercase tracking-wider transition shadow-lg shadow-red-600/30"
            >
              CLAIM DEAL & SHOP NOW
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}