import React from 'react';
import { Menu, Search, Bell, Filter, Calendar, Camera } from 'lucide-react';
import ShinyText from '../../animations/ShinyText';
import { EMPLOYEE_PROFILE, EMPLOYEE_KPIS } from '../employeeData';

export default function EmployeeHeader({
  onOpenMobile,
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  unreadCount,
  onNotificationClick,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-neutral-800 bg-neutral-950/85 px-4 sm:px-8 backdrop-blur-xl">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>Xin chào, {EMPLOYEE_PROFILE.name}</span>
            <span className="hidden sm:inline-block rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-2 py-0.5">
              {EMPLOYEE_PROFILE.role}
            </span>
          </h2>
          <p className="text-[11px] text-neutral-400 hidden sm:block">
            {EMPLOYEE_PROFILE.department} • Trạng thái: <span className="text-emerald-400 font-medium">{EMPLOYEE_PROFILE.status}</span>
          </p>
        </div>
      </div>

      {/* Center & Right: Search, Filter, Notification */}
      <div className="flex items-center gap-3">
        {/* Quick Filter Tool (Module B - Search & Fast Filter) */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm mã Booking (BK-..), tên khách..."
            className="w-56 lg:w-72 rounded-xl border border-neutral-800 bg-neutral-900/90 py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Date Filter selector */}
        <div className="hidden sm:flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs">
          <Calendar className="h-3.5 w-3.5 text-amber-400" />
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="bg-transparent text-xs text-neutral-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-neutral-900">Tất cả thời gian</option>
            <option value="today" className="bg-neutral-900">Hôm nay (10/10)</option>
            <option value="this_week" className="bg-neutral-900">Tuần này</option>
            <option value="this_month" className="bg-neutral-900">Tháng này (10/2026)</option>
          </select>
        </div>

        {/* Notifications button */}
        <button
          onClick={onNotificationClick}
          className="relative rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
          title="Thông báo & Chỉ đạo Admin"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-neutral-950 ring-2 ring-neutral-950">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
