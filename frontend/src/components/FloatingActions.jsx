import { useState, useEffect } from 'react';
import { PhoneIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

export default function FloatingActions({ onOpenBooking }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex items-center gap-2.5">
      {/* Floating Booking Button */}
      <button
        onClick={onOpenBooking}
        className="cursor-pointer group relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-extrabold text-xs tracking-wider uppercase shadow-2xl shadow-amber-500/40 hover:scale-105 transition-all duration-300"
      >
        <span className="absolute -inset-0.5 rounded-full bg-amber-400 opacity-40 blur-sm group-hover:opacity-75 animate-pulse pointer-events-none" />
        <CalendarDaysIcon className="w-4 h-4 text-white relative z-10" />
        <span className="relative z-10">Đặt Lịch Nhanh</span>
      </button>

      {/* Hotline Quick Call Button - hugs tight to bottom-right corner */}
      <a
        href="tel:0901234567"
        className="w-12 h-12 rounded-full bg-neutral-900/95 border-2 border-amber-400 text-amber-400 hover:bg-amber-500 hover:text-white flex items-center justify-center shadow-2xl shadow-amber-500/40 transition-all duration-300 hover:scale-110 group relative"
        title="Gọi Hotline: 0901 234 567"
        aria-label="Hotline 0901 234 567"
      >
        <span className="absolute -inset-1 rounded-full bg-amber-400/25 animate-ping pointer-events-none" />
        <PhoneIcon className="w-5 h-5 text-amber-400 group-hover:text-white transition-colors" />
        <span className="absolute right-14 bottom-1 bg-neutral-900 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl">
          📞 0901 234 567
        </span>
      </a>
    </div>
  );
}
