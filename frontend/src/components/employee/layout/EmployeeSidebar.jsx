import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Layers,
  Star,
  User,
  LogOut,
  Camera,
  X,
} from 'lucide-react';
import employeeAuthService from '../../../services/employee/authService';
import { ROUTES } from '../../../routes/web';

export const EMPLOYEE_NAV_ITEMS = [
  { id: 'dashboard', label: 'Tổng Quan & KPI', icon: LayoutDashboard },
  { id: 'schedule', label: 'Lịch Chụp & Ca Trực', icon: CalendarDays },
  { id: 'equipment', label: 'Thiết Bị Tác Nghiệp', icon: Layers },
  { id: 'reviews', label: 'Đánh Giá Khách Hàng', icon: Star },
  { id: 'profile', label: 'Hồ Sơ Cá Nhân', icon: User },
];

const DEFAULT_PROFILE = {
  fullname: 'Nhân viên tác nghiệp',
  username: 'employee',
  role: 'Employee',
  status: 'active',
};

export default function EmployeeSidebar({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  profile,
}) {
  const navigate = useNavigate();
  const currentProfile = profile || DEFAULT_PROFILE;

  const handleLogout = async () => {
    await employeeAuthService.logout();
    navigate(ROUTES.AUTH.EMPLOYEE_LOGIN, { replace: true });
  };

  const displayName = currentProfile.fullname || currentProfile.username || 'Nhân viên';
  const displayRole = currentProfile.role === 'Employee' ? 'Nhân viên tác nghiệp' : (currentProfile.role || 'Nhân viên');
  const displayStatus = currentProfile.status === 'active' ? 'Đang hoạt động' : (currentProfile.status || 'Đang ca trực');

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container - Light Studio Theme */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-76 flex-col border-r border-[#F0E4E6] bg-white/95 text-[#261A1E] backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo - Consistent with User Studio theme */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-[#F0E4E6]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#B85064] to-[#E28E9E] text-white shadow-[0_4px_12px_rgb(184,80,100,0.25)]">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-base text-[#261A1E]">PhotoStudio</span>
                <span className="rounded-md bg-[#FDF0F3] border border-[#F5D5DC] px-1.5 py-0.2 text-[10px] font-bold text-[#B85064]">
                  STAFF
                </span>
              </div>
              <p className="text-[11px] text-[#7A6C71] font-medium">Cổng Tác Nghiệp Studio</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="rounded-xl p-1.5 text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#261A1E] lg:hidden"
            title="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Mini Profile Card */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex items-center gap-3">
          <div className="relative">
            {currentProfile.avatar ? (
              <img
                src={currentProfile.avatar}
                alt={displayName}
                className="w-11 h-11 rounded-full object-cover shadow-sm border border-[#F0E4E6]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}
            <div
              className={`avatar-fallback w-11 h-11 rounded-full bg-gradient-to-tr from-[#B85064] to-[#E28E9E] flex items-center justify-center text-white font-bold text-sm shadow-sm select-none ${
                currentProfile.avatar ? 'hidden' : 'flex'
              }`}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#261A1E] truncate">{displayName}</h4>
            <p className="text-[11px] text-[#7A6C71] truncate">{displayRole}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-emerald-700 font-semibold">{displayStatus}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9E8E93]">
          Phân Hệ Tác Nghiệp
        </div>

        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {EMPLOYEE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B85064] to-[#C96377] text-white shadow-[0_4px_16px_rgb(184,80,100,0.25)]'
                    : 'text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#261A1E]'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-[#9E8E93]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Logout */}
        <div className="p-4 border-t border-[#F0E4E6] bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất tác nghiệp</span>
          </button>
        </div>
      </aside>
    </>
  );
}
