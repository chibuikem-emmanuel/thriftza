'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white select-none overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute w-72 h-72 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Logo & Brand Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 relative z-10"
          >
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Logo className="scale-125" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-mono tracking-widest text-zinc-400 uppercase pt-2"
            >
              Curating Grade-A Thrift Drops...
            </motion.p>
          </motion.div>

          {/* Animated Progress Bar */}
          <div className="w-48 h-1 bg-zinc-800 rounded-full mt-8 overflow-hidden relative z-10">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="h-full bg-red-600 rounded-full shadow-lg shadow-red-600/50"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}