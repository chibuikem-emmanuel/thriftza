'use client';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Graphic Icon Badge */}
      <div className="relative w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30 overflow-hidden transform -rotate-3">
        {/* Accent Glow Circle */}
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full blur-xs opacity-80" />
        
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white z-10"
        >
          {/* Thrift Tag Shape */}
          <path d="M12.5 2H6a2 2 0 0 0-2 2v6.5a2 2 0 0 0 .586 1.414l8 8a2 2 0 0 0 2.828 0l6.5-6.5a2 2 0 0 0 0-2.828l-8-8A2 2 0 0 0 12.5 2z" />
          <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Brand Name Text */}
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black tracking-widest text-zinc-900 dark:text-white uppercase font-sans">
          ZA<span className="text-red-600">WEAR</span>
        </span>
        <span className="text-[9px] font-extrabold tracking-widest text-zinc-400 uppercase">
          STEALS & FITS
        </span>
      </div>
    </div>
  );
}