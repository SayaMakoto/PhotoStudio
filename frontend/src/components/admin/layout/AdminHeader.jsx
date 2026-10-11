import React from 'react';
import { Menu, Bell, Search, Calendar, ChevronRight } from 'lucide-react';
import ShinyText from '../../animations/ShinyText';

export default function AdminHeader({
  activeMenu,
  onOpenMobile,
  selectedYear,
  selectedMonth,
  onChangeYear,
  onChangeMonth,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 sm:px-8 backdrop-blur-xl">
      {/* Left: Mobile Toggle & Page Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-400">Admin</span>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
          <span className="font-semibold text-white">
            <ShinyText text="Bảng Điều Khiển Tổng Quan" speed={3} />
          </span>
        </div>
      </div>

      {/* Right: Quick Global Filters & Notifications */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Month & Year Selectors */}
        <div className="hidden sm:flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-1.5 shadow-sm">
          <Calendar className="h-4 w-4 text-amber-400" />
          <span className="text-xs text-neutral-400 font-medium">Kỳ xem:</span>
          
          <select
            value={selectedMonth}
            onChange={(e) => onChangeMonth(Number(e.target.value))}
            className="bg-transparent text-xs text-amber-300 font-semibold focus:outline-none cursor-pointer"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m} className="bg-neutral-900 text-white">
                Tháng {m}
              </option>
            ))}
          </select>

          <span className="text-neutral-600">/</span>

          <select
            value={selectedYear}
            onChange={(e) => onChangeYear(Number(e.target.value))}
            className="bg-transparent text-xs text-amber-300 font-semibold focus:outline-none cursor-pointer"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y} className="bg-neutral-900 text-white">
                Năm {y}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Button */}
        <button className="relative rounded-xl border border-neutral-800 bg-neutral-900/80 p-2 text-neutral-400 hover:border-neutral-700 hover:text-white transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute 1 top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        </button>
      </div>
    </header>
  );
}
