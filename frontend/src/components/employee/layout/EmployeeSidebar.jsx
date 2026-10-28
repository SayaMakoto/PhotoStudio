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
import { EMPLOYEE_PROFILE } from '../employeeData';
import employeeAuthService from '../../../services/employee/authService';
import { ROUTES } from '../../../routes/web';

const EMPLOYEE_NAV_ITEMS = [
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
        <div className="flex h-18 items-center justify-between border-b border-[#F0E4E6] px-6 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] font-bold shadow-sm">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-[#261A1E] flex items-center gap-1.5">
                PhotoStudio{' '}
                <span className="rounded-full bg-[#FDF0F3] px-2 py-0.5 text-[10px] font-bold text-[#B85064] border border-[#F5D5DC]">
                  STAFF
                </span>
              </h1>
              <p className="text-xs text-[#7A6C71]">Cổng tác nghiệp nhân viên</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#261A1E] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 scrollbar-thin scrollbar-thumb-[#F0E4E6]">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-[#9E8E93] uppercase">
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
                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FDF0F3] text-[#B85064] font-bold border border-[#F5D5DC] shadow-[0_2px_12px_rgb(184,80,100,0.08)]'
                    : 'text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#261A1E]'
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#B85064]' : 'text-[#9E8E93] group-hover:text-[#B85064]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User profile card & Logout button in Sidebar bottom */}
        <div className="border-t border-[#F0E4E6] p-4 bg-[#FAF5F5]/60">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 border border-[#F0E4E6] shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={displayName}
                className="h-9 w-9 rounded-full object-cover border-2 border-[#B85064]/30 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-[#261A1E]" title={displayName}>
                  {displayName}
                </p>
                <p className="truncate text-[11px] text-[#B85064] font-semibold">
                  {displayRole}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-[#7A6C71] truncate">
                    {displayStatus}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Đăng xuất tài khoản"
              className="rounded-xl p-2 text-[#9E8E93] hover:bg-[#FDF0F3] hover:text-[#B85064] transition-colors shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
