import React from 'react';
import {
  Camera,
  CalendarDays,
  Briefcase,
  Layers,
  Star,
  Bell,
  User,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { EMPLOYEE_PROFILE, EMPLOYEE_KPIS } from '../employeeData';

export const EMPLOYEE_TABS = [
  { id: 'dashboard', label: 'Dashboard & KPI', icon: Camera, section: 'Cơ bản' },
  { id: 'schedule', label: 'Lịch Làm Việc', icon: CalendarDays, section: 'Cơ bản' },
  { id: 'tasks', label: 'Quản Lý Công Việc', icon: Briefcase, section: 'Cơ bản', badge: '2 Đang chạy' },
  { id: 'equipment', label: 'Thiết Bị & Phục Trang', icon: Layers, section: 'Cơ bản' },
  { id: 'reviews', label: 'Đánh Giá Khách Hàng', icon: Star, section: 'Cơ bản' },
  { id: 'notifications', label: 'Chỉ Đạo & Thông Báo', icon: Bell, section: 'Cơ bản', badge: `${EMPLOYEE_KPIS.unreadNotifications} Mới` },
  { id: 'profile', label: 'Hồ Sơ Nhân Viên', icon: User, section: 'Cơ bản' },
  { id: 'chat', label: 'Chat Nội Bộ Booking', icon: MessageSquare, section: 'Mở rộng' },
  { id: 'presets', label: 'Concept & Preset Màu', icon: Sparkles, section: 'Mở rộng' },
  { id: 'incident', label: 'Báo Cáo Sự Cố', icon: AlertTriangle, section: 'Mở rộng' },
];

export default function EmployeeSidebar({ activeTab, onSelectTab, isMobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-76 flex-col border-r border-neutral-800 bg-neutral-950/95 text-neutral-300 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-18 items-center justify-between border-b border-neutral-800/80 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 font-black shadow-lg shadow-amber-500/20">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                PhotoStudio <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/30">STAFF</span>
              </h1>
              <p className="text-[11px] text-neutral-400">Cổng Tác Nghiệp Nhân Viên</p>
            </div>
          </div>
        </div>

        {/* User Mini Profile Card in Sidebar */}
        <div className="p-3.5 border-b border-neutral-800/60 bg-neutral-900/30">
          <div className="flex items-center gap-3 rounded-xl bg-neutral-900/80 p-2.5 border border-neutral-800/80">
            <img
              src={EMPLOYEE_PROFILE.avatar}
              alt={EMPLOYEE_PROFILE.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-amber-400/80"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-bold text-white">{EMPLOYEE_PROFILE.name}</p>
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              </div>
              <p className="truncate text-[11px] text-neutral-400">{EMPLOYEE_PROFILE.role}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-400">{EMPLOYEE_PROFILE.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
          {/* Group 1: Module Cơ Bản */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
              A. Module Tác Nghiệp Cơ Bản
            </div>
            <div className="space-y-0.5">
              {EMPLOYEE_TABS.filter((t) => t.section === 'Cơ bản').map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 font-semibold border border-amber-500/30 shadow-inner'
                        : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                    )}
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-neutral-400 group-hover:text-amber-400'
                        }`}
                      />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/30">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: Module Mở Rộng */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-amber-400/80 uppercase">
              B. Tiện Ích Mở Rộng Studio
            </div>
            <div className="space-y-0.5">
              {EMPLOYEE_TABS.filter((t) => t.section === 'Mở rộng').map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 font-semibold border border-amber-500/30 shadow-inner'
                        : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                    )}
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-neutral-400 group-hover:text-amber-400'
                        }`}
                      />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-neutral-800/80 p-3 bg-neutral-950/60">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-2 py-1">
            <span className="text-[11px]">Mã NV: <strong>{EMPLOYEE_PROFILE.id}</strong></span>
            <span className="text-[11px] text-amber-400 font-medium">Phiên 2026.1</span>
          </div>
        </div>
      </aside>
    </>
  );
}
