import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, CheckCheck } from 'lucide-react';
import axiosEmployee from '../../../lib/axiosEmployee';

const DEFAULT_PROFILE = {
  fullname: 'Nhân viên tác nghiệp',
  username: 'employee',
  role: 'Employee',
  status: 'active',
};

export default function EmployeeHeader({
  activeTabTitle = 'Tổng Quan & KPI',
  onOpenMobile,
  onOpenProfile,
  profile,
}) {
  const [notifications, setNotifications] = useState([]);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const currentProfile = profile || DEFAULT_PROFILE;
  const displayName = currentProfile.fullname || currentProfile.username || 'Nhân viên';
  const displayRole = currentProfile.role === 'Employee' ? 'Nhân viên tác nghiệp' : (currentProfile.role || 'Nhân viên');
  const displayStatus = currentProfile.status === 'active' ? 'Đang hoạt động' : (currentProfile.status || 'Đang ca trực');

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = async () => {
    if (currentProfile?.id) {
      try {
        await axiosEmployee.patch(`/api/notifications/user/${currentProfile.id}/read-all`);
      } catch (err) {
        console.warn('Không cập nhật được trạng thái đã đọc:', err);
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Tải danh sách thông báo thật của nhân viên từ CSDL
  useEffect(() => {
    if (!currentProfile?.id) return;
    let isMounted = true;

    axiosEmployee
      .get(`/api/notifications/user/${currentProfile.id}`)
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : [];
        const formatted = list.map((n) => ({
          id: n.id,
          title: n.title,
          desc: n.message,
          time: n.createdAt
            ? new Date(n.createdAt).toLocaleDateString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
              })
            : 'Vừa xong',
          unread: !n.readAt,
          type: n.type || 'system',
        }));
        setNotifications(formatted);
      })
      .catch((err) => {
        console.warn('Chưa lấy được thông báo:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [currentProfile?.id]);

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
        </div>
      </div>

      {/* Right: Duty Badge, Notifications, Quick Profile */}
      <div className="flex items-center gap-3">
        {/* On Duty Status Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{displayStatus}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotiDropdown((prev) => !prev)}
            className="relative rounded-2xl border border-[#F0E4E6] bg-white p-2.5 text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#B85064] transition-all shadow-sm"
            title="Thông báo hệ thống"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#B85064] text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotiDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border border-[#F0E4E6] bg-white p-4 shadow-[0_12px_40px_rgb(184,80,100,0.12)] z-50 text-[#261A1E]">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E6]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Thông Báo Tác Nghiệp</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#FDF0F3] text-[#B85064] border border-[#F5D5DC] px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#B85064] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Đọc tất cả
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#F0E4E6] max-h-72 overflow-y-auto my-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#9E8E93]">
                    Không có thông báo mới nào từ hệ thống.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition-colors rounded-xl ${
                        n.unread ? 'bg-[#FAF5F5]' : 'bg-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[#261A1E]">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-[#9E8E93] font-normal font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#7A6C71] mt-1">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Trigger */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 rounded-2xl border border-[#F0E4E6] bg-white p-1.5 pr-3 hover:border-[#B85064]/50 transition-all shadow-sm"
        >
          {currentProfile.avatar ? (
            <img
              src={currentProfile.avatar}
              alt={displayName}
              className="w-8 h-8 rounded-xl object-cover shadow-sm border border-[#F0E4E6]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
          ) : null}
          <div
            className={`avatar-fallback w-8 h-8 rounded-xl bg-gradient-to-tr from-[#B85064] to-[#E28E9E] flex items-center justify-center text-white font-bold text-xs shadow-sm select-none ${
              currentProfile.avatar ? 'hidden' : 'flex'
            }`}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-[#261A1E] leading-tight truncate max-w-[120px]">
              {displayName}
            </p>
            <p className="text-[10px] text-[#9E8E93] leading-tight">
              {displayRole}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
