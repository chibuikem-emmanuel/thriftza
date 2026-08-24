'use client';

import Link from 'next/link';
import { Camera, Share2, Globe, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Link href="/" className="text-3xl font-black tracking-widest text-red-600 uppercase">
            THRIFTZA
          </Link>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            Curated vintage & thrift streetwear pieces. Elevating everyday fashion with sustainable, authentic apparel.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-200 hover:text-red-600 dark:hover:text-red-500 transition">
              <Camera className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-200 hover:text-red-600 dark:hover:text-red-500 transition">
              <Share2 className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-200 hover:text-red-600 dark:hover:text-red-500 transition">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-zinc-900 dark:text-white font-extrabold uppercase mb-4 text-sm tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <li><Link href="/" className="hover:text-red-600 dark:hover:text-white transition">Shop All Products</Link></li>
            <li><Link href="/#polos" className="hover:text-red-600 dark:hover:text-white transition">Round Neck Polos</Link></li>
            <li><Link href="/#trousers" className="hover:text-red-600 dark:hover:text-white transition">Plain Trousers</Link></li>
            <li><Link href="/favorites" className="hover:text-red-600 dark:hover:text-white transition">Saved Favorites</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-zinc-900 dark:text-white font-extrabold uppercase mb-4 text-sm tracking-wider">Support</h4>
          <ul className="space-y-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <li><a href="#" className="hover:text-red-600 dark:hover:text-white transition">Size Guide</a></li>
            <li><a href="#" className="hover:text-red-600 dark:hover:text-white transition">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-red-600 dark:hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-red-600 dark:hover:text-white transition">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-zinc-900 dark:text-white font-extrabold uppercase mb-4 text-sm tracking-wider">Join The VIP Club</h4>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">Get early access to weekly vintage drops and secret promo codes.</p>
          <div className="flex bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg overflow-hidden p-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent text-zinc-900 dark:text-white px-3 py-2 text-sm focus:outline-none w-full placeholder:text-zinc-400"
            />
            <button className="bg-red-600 text-white px-4 rounded-md hover:bg-red-700 transition">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 text-center py-6 text-xs text-zinc-500 font-medium">
        © {new Date().getFullYear()} THRIFTZA Inc. All rights reserved. Built for style enthusiasts.
      </div>
    </footer>
  );
}