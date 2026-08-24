'use client';

import { motion } from 'framer-motion';
import { Truck, ArrowRight, Tag, ShoppingBag, Sparkles, Shirt, Percent } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white border-b border-zinc-800 py-10 sm:py-16 lg:py-24">
      {/* Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-red-600/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Floating Animated Badges (Visible on XL screens) */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-8 hidden xl:flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 text-red-500 p-3 rounded-2xl shadow-xl backdrop-blur-md pointer-events-none z-20"
      >
        <ShoppingBag className="w-6 h-6" />
        <span className="text-xs font-black text-white uppercase">Grade A Quality</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-12 left-1/3 hidden xl:flex items-center gap-2 bg-zinc-900/80 border border-amber-500/30 text-amber-400 p-3 rounded-2xl shadow-xl backdrop-blur-md pointer-events-none z-20"
      >
        <Percent className="w-6 h-6" />
        <span className="text-xs font-black text-white uppercase">Flat ₦4,500</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-1/3 right-8 hidden xl:flex items-center gap-2 bg-zinc-900/80 border border-red-500/30 text-red-400 p-3 rounded-2xl shadow-xl backdrop-blur-md pointer-events-none z-20"
      >
        <Shirt className="w-6 h-6" />
        <span className="text-xs font-black text-white uppercase">Polos & Trousers</span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        {/* Left Callout */}
        <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 px-3.5 sm:px-4 py-1.5 rounded-full text-red-400 font-extrabold text-[10px] sm:text-xs tracking-wider uppercase"
          >
            <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400 animate-spin" />
            <span>STEAL DEAL • LIMITED STOCK AVAILABLE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight sm:leading-none"
          >
            STYLIST THRIFTS AT{' '}
            <span className="text-red-500 underline decoration-red-600 underline-offset-4 sm:underline-offset-8">
              ₦4,500
            </span>{' '}
            EACH
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
          >
            Upgrade your daily fits with quality grade-A round neck polos and tailored plain
            trousers. Premium thrifted pieces delivered right to your doorstep.
          </motion.p>

          {/* Bulk Special Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-3.5 sm:p-4 bg-zinc-900/90 border border-amber-500/30 rounded-2xl flex items-center gap-3 sm:gap-4 shadow-lg text-left"
          >
            <div className="p-2.5 sm:p-3 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <Truck className="w-5 sm:w-7 h-5 sm:h-7 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-400 text-xs sm:text-sm uppercase flex items-center gap-1.5">
                BULK BUYER SPECIAL <Tag className="w-3 h-3" />
              </h4>
              <p className="text-zinc-300 text-xs sm:text-sm font-medium">
                Buy in bulk and enjoy{' '}
                <span className="text-white font-bold underline decoration-amber-400">
                  100% FREE Waybill
                </span>{' '}
                nationwide!
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
          >
            <Link
              href="#polos"
              className="bg-red-600 hover:bg-red-700 text-white font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              Shop Polos (₦4.5k) <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
            <Link
              href="#trousers"
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base uppercase tracking-wider transition border border-zinc-700 text-center"
            >
              Shop Trousers
            </Link>
          </motion.div>
        </div>

        {/* Right Feature Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 relative pt-4 lg:pt-0">
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-zinc-900 border border-zinc-800 p-2.5 sm:p-3 rounded-2xl overflow-hidden shadow-2xl relative group"
          >
            <span className="absolute top-4 left-4 z-10 bg-red-600 text-white font-black text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-md">
              ₦4,500
            </span>
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800"
              alt="Round Neck Polo"
              className="w-full aspect-[4/5] object-cover rounded-xl group-hover:scale-105 transition duration-500"
            />
            <div className="pt-2 sm:pt-3 pb-1 px-1">
              <p className="font-bold text-xs sm:text-sm text-zinc-100 truncate">Round Neck Polo</p>
              <p className="text-[10px] sm:text-xs text-zinc-400">Multiple Colors</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-zinc-900 border border-zinc-800 p-2.5 sm:p-3 rounded-2xl overflow-hidden shadow-2xl relative group mt-6 lg:mt-12"
          >
            <span className="absolute top-4 left-4 z-10 bg-red-600 text-white font-black text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-md">
              ₦4,500
            </span>
            <img
              src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800"
              alt="Plain Trousers"
              className="w-full aspect-[4/5] object-cover rounded-xl group-hover:scale-105 transition duration-500"
            />
            <div className="pt-2 sm:pt-3 pb-1 px-1">
              <p className="font-bold text-xs sm:text-sm text-zinc-100 truncate">Plain Trousers</p>
              <p className="text-[10px] sm:text-xs text-zinc-400">Casual & Smart</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}