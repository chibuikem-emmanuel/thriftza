'use client';

import { useState } from 'react';
import Preloader from '@/components/Preloader';
import PromoBanner from '@/components/PromoBanner';
import HeroSection from '@/components/HeroSection';
import BulkPromoModal from '@/components/BulkPromoModal';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Product } from '@/types/product';

const ROUND_NECK_POLOS: Product[] = [
  {
    id: 'p1',
    name: 'Vintage Oversized Cotton Polo',
    price: 4500,
    category: 'Round Neck Polo',
    condition: 'Grade A Thrift',
    size: 'L',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-street-setting-42023-large.mp4',
  },
  {
    id: 'p2',
    name: 'Heavyweight Plain Navy Polo',
    price: 4500,
    category: 'Round Neck Polo',
    condition: 'Like New',
    size: 'M',
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-young-woman-posing-41130-large.mp4',
  },
  {
    id: 'p3',
    name: 'Retro Striped Round Neck Tee',
    price: 4500,
    category: 'Round Neck Polo',
    condition: 'Grade A Thrift',
    size: 'XL',
    images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41227-large.mp4',
  },
  {
    id: 'p4',
    name: 'Classic White Athletic Polo',
    price: 4500,
    category: 'Round Neck Polo',
    condition: 'Grade A Thrift',
    size: 'M',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-street-setting-42023-large.mp4',
  },
  {
    id: 'p5',
    name: 'Streetwear Black Graphic Polo',
    price: 4500,
    category: 'Round Neck Polo',
    condition: 'Like New',
    size: 'L',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-young-woman-posing-41130-large.mp4',
  },
  {
    id: 'p6',
    name: 'Essential Olive Green Cotton Tee',
    price: 4500,
    category: 'Round Neck Polo',
    condition: 'Grade A Thrift',
    size: 'S',
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41227-large.mp4',
  },
];

const PLAIN_TROUSERS: Product[] = [
  {
    id: 't1',
    name: 'Minimalist Straight-Fit Plain Trousers',
    price: 4500,
    category: 'Plain Trousers',
    condition: 'Grade A Thrift',
    size: '32',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-street-setting-42023-large.mp4',
  },
  {
    id: 't2',
    name: 'Tailored Smart Casual Chino Trousers',
    price: 4500,
    category: 'Plain Trousers',
    condition: 'Like New',
    size: '34',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-young-woman-posing-41130-large.mp4',
  },
  {
    id: 't3',
    name: 'Relaxed Fit Plain Black Trousers',
    price: 4500,
    category: 'Plain Trousers',
    condition: 'Grade A Thrift',
    size: '30',
    images: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41227-large.mp4',
  },
  {
    id: 't4',
    name: 'Pleated Cream Smart Trousers',
    price: 4500,
    category: 'Plain Trousers',
    condition: 'Grade A Thrift',
    size: '33',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-street-setting-42023-large.mp4',
  },
  {
    id: 't5',
    name: 'Slim Fit Grey Formal Trousers',
    price: 4500,
    category: 'Plain Trousers',
    condition: 'Like New',
    size: '31',
    images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-young-woman-posing-41130-large.mp4',
  },
  {
    id: 't6',
    name: 'Vintage Khaki Everyday Trousers',
    price: 4500,
    category: 'Plain Trousers',
    condition: 'Grade A Thrift',
    size: '36',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41227-large.mp4',
  },
];

export default function Home() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors duration-300 overflow-x-hidden">
      <Preloader onComplete={() => setIsPreloaderDone(true)} />

      {isPreloaderDone && (
        <>
          <PromoBanner />
          <HeroSection />
          <BulkPromoModal />

          {/* Round Neck Polos Section */}
          <section id="polos" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-red-600 font-extrabold uppercase text-[10px] sm:text-xs tracking-widest">
                  STEAL PRICE • ₦4,500
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white">
                  ROUND NECK POLOS
                </h2>
              </div>
              <span className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-mono">
                Showing {ROUND_NECK_POLOS.length} Items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
              {ROUND_NECK_POLOS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Plain Trousers Section */}
          <section id="trousers" className="bg-zinc-200/60 dark:bg-zinc-900/50 py-10 sm:py-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-red-600 font-extrabold uppercase text-[10px] sm:text-xs tracking-widest">
                    STEAL PRICE • ₦4,500
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white">
                    PLAIN TROUSERS
                  </h2>
                </div>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-mono">
                  Showing {PLAIN_TROUSERS.length} Items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
                {PLAIN_TROUSERS.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
}