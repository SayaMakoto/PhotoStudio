import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Layers,
  Star,
  User,
  LogOut,
  Camera,
  X,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { EMPLOYEE_PROFILE } from '../employeeData';
import employeeAuthService from '../../../services/employee/authService';
import { ROUTES } from '../../../routes/web';

export const EMPLOYEE_NAV_ITEMS = [
  { id: 'dashboard', label: 'Tổng Quan & KPI', icon: LayoutDashboard },
  { id: 'schedule', label: 'Lịch Chụp & Ca Trực', icon: CalendarDays },
  { id: 'equipment', label: 'Thiết Bị & Sự Cố', icon: Layers },
  { id: 'reviews', label: 'Đánh Giá Khách Hàng', icon: Star },
  { id: 'profile', label: 'Hồ Sơ Cá Nhân', icon: User },
];

export default function EmployeeSidebar({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  profile,
}) {
  const navigate = useNavigate();
  const currentProfile = profile || EMPLOYEE_PROFILE;

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
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-76 flex-col border-r border-neutral-800 bg-neutral-950/95 text-neutral-300 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo - Consistent with Admin */}
        <div className="flex h-18 items-center justify-between border-b border-neutral-800/80 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 font-bold shadow-lg shadow-amber-500/20">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                PhotoStudio{' '}
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/30">
                  STAFF
                </span>
              </h1>
              <p className="text-xs text-neutral-400">Cổng tác nghiệp nhân viên</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-neutral-800">
          <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Menu Tác Nghiệp
          </div>

          {EMPLOYEE_NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20 shadow-sm'
                    : 'text-neutral-400 hover:bg-neutral-900/80 hover:text-neutral-100'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-amber-400' : 'text-neutral-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User profile card & Logout button in Sidebar bottom (matching AdminSidebar) */}
        <div className="border-t border-neutral-800/80 p-3 bg-neutral-900/40">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-neutral-900/80 p-2.5 border border-neutral-800">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={displayName}
                className="h-9 w-9 rounded-full object-cover border-2 border-amber-400/80 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white" title={displayName}>
                  {displayName}
                </p>
                <p className="truncate text-[11px] text-amber-400/90 font-medium">
                  {displayRole}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-neutral-400 truncate">
                    {displayStatus}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Đăng xuất tài khoản"
              className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-rose-400 transition-colors shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
