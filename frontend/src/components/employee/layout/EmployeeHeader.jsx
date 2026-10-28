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
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-[#F0E4E6] bg-white/85 px-4 sm:px-8 backdrop-blur-xl">
      {/* Left: Mobile Toggle & Tab Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-xl p-2 text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#261A1E] lg:hidden"
          title="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9E8E93] font-medium">PhotoStudio Staff</span>
            <span className="text-[#D4C5C8]">/</span>
            <h2 className="text-sm sm:text-base font-bold text-[#261A1E] tracking-tight">
              {activeTabTitle}
            </h2>
          </div>
          <p className="text-[11px] text-[#7A6C71] hidden sm:block">
            Xin chào, <strong className="text-[#261A1E] font-semibold">{displayName}</strong> • {displayRole}
          </p>
        </div>
      </div>

      {/* Right: Duty Badge, Notifications Dropdown & Profile Avatar */}
      <div className="flex items-center gap-3">
        {/* Live Duty Status Badge */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{displayStatus}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotiDropdown((prev) => !prev)}
            className="relative rounded-2xl border border-[#F0E4E6] bg-white p-2.5 text-[#7A6C71] hover:border-[#B85064]/40 hover:text-[#B85064] transition-all shadow-sm"
            title="Thông báo từ quản trị"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B85064] px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showNotiDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border border-[#F0E4E6] bg-white p-4 shadow-[0_12px_40px_rgb(184,80,100,0.12)] z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E6]">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#261A1E]">Chỉ Đạo & Thông Báo Studio</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#FDF0F3] px-2 py-0.5 text-[10px] font-bold text-[#B85064] border border-[#F5D5DC]">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#7A6C71] hover:text-[#B85064] transition-colors"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Đã đọc</span>
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-[#F0E4E6] pr-1">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-[#9E8E93]">
                    Không có thông báo mới.
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleRead(item.id)}
                      className={`cursor-pointer rounded-2xl p-3 border transition-all ${
                        item.unread
                          ? 'border-[#F5D5DC] bg-[#FDF0F3]/70 text-[#261A1E] shadow-sm'
                          : 'border-[#F0E4E6] bg-[#FAF5F5]/50 text-[#7A6C71] hover:bg-white hover:border-[#F5D5DC]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#B85064]">{item.sender}</span>
                        <span className="text-[#9E8E93] text-[10px]">{item.time}</span>
                      </div>
                      <p className="text-xs font-bold text-[#261A1E] mt-1">{item.title}</p>
                      <p className="text-[11px] text-[#7A6C71] mt-0.5 line-clamp-2 leading-relaxed">
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
          className="rounded-2xl border border-[#F0E4E6] p-0.5 hover:border-[#B85064]/50 transition-all shadow-sm"
          title="Xem hồ sơ nhân viên"
        >
          <img
            src={currentProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={displayName}
            className="h-8 w-8 rounded-[12px] object-cover"
          />
        </button>
      </div>
    </header>
  );
}
