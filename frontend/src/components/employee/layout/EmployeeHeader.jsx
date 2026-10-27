import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, CheckCheck, User, Calendar, ShieldCheck, X } from 'lucide-react';
import { EMPLOYEE_PROFILE, ADMIN_NOTIFICATIONS } from '../employeeData';

export default function EmployeeHeader({
  activeTabTitle = 'Tổng Quan & KPI',
  onOpenMobile,
  onOpenProfile,
  profile,
}) {
  const [notifications, setNotifications] = useState(ADMIN_NOTIFICATIONS);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const currentProfile = profile || EMPLOYEE_PROFILE;
  const displayName = currentProfile.fullname || currentProfile.username || 'Nhân viên';
  const displayRole = currentProfile.role === 'Employee' ? 'Nhân viên tác nghiệp' : (currentProfile.role || 'Nhân viên');
  const displayStatus = currentProfile.status === 'active' ? 'Đang hoạt động' : (currentProfile.status || 'Ca trực Studio B');

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotiDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-neutral-800 bg-neutral-950/85 px-4 sm:px-8 backdrop-blur-xl">
      {/* Left: Mobile Toggle & Tab Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
          title="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">PhotoStudio Staff</span>
            <span className="text-neutral-600">/</span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {activeTabTitle}
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 hidden sm:block">
            Xin chào, <strong className="text-neutral-200">{displayName}</strong> • {displayRole}
          </p>
        </div>
      </div>

      {/* Right: Duty Badge, Notifications Dropdown & Profile Avatar */}
      <div className="flex items-center gap-3">
        {/* Live Duty Status Badge */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{displayStatus}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotiDropdown((prev) => !prev)}
            className="relative rounded-xl border border-neutral-800 bg-neutral-900/80 p-2.5 text-neutral-400 hover:border-neutral-700 hover:text-white transition-colors"
            title="Thông báo từ quản trị"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-neutral-950">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showNotiDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Chỉ Đạo & Thông Báo Studio</span>
                  {unreadCount > 0 && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Đã đọc</span>
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-neutral-800 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-neutral-500">
                    Không có thông báo mới.
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleRead(item.id)}
                      className={`cursor-pointer rounded-xl p-3 border transition-colors ${
                        item.unread
                          ? 'border-amber-500/30 bg-amber-500/10 text-white'
                          : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-amber-300">{item.sender}</span>
                        <span className="text-neutral-500 text-[10px]">{item.time}</span>
                      </div>
                      <p className="text-xs font-bold text-white mt-1">{item.title}</p>
                      <p className="text-[11px] text-neutral-300 mt-0.5 line-clamp-2">
                        {item.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Quick Link */}
        <button
          onClick={onOpenProfile}
          className="rounded-xl border border-neutral-800 p-0.5 hover:border-amber-400/60 transition-colors"
          title="Xem hồ sơ nhân viên"
        >
          <img
            src={currentProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={displayName}
            className="h-8 w-8 rounded-[10px] object-cover"
          />
        </button>
      </div>
    </header>
  );
}
