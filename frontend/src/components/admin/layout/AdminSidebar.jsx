import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/web";
import { ChevronDown, Building2, X, LogOut } from "lucide-react";
import { ADMIN_MENU_CONFIG } from "./adminMenuConfig";
import adminAuthService from "../../../services/admin/authService";

export default function AdminSidebar({
  openGroup,
  onToggleGroup,
  isMobileOpen,
  onCloseMobile,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const admin = adminAuthService.getUser();

  const handleLogout = async () => {
    await adminAuthService.logout();
    navigate(ROUTES.AUTH.ADMIN_LOGIN, { replace: true });
  };

  const adminName = admin?.fullname || admin?.username || "Quản Trị Viên";
  const adminEmail = admin?.email || "Tài khoản quản trị";
  const initials = adminName
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleGroupClick = (groupId) => {
    onToggleGroup(groupId);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-76 flex-col border-r border-neutral-800 bg-neutral-950/95 text-neutral-300 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-18 items-center justify-between border-b border-neutral-800/80 px-6">
          <NavLink
            to={ROUTES.ADMIN.DASHBOARD}
            onClick={onCloseMobile}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-lg shadow-amber-500/20 font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                PhotoStudio{" "}
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/30">
                  ADMIN
                </span>
              </h1>
              <p className="text-xs text-neutral-400">
                Hệ thống quản trị studio
              </p>
            </div>
          </NavLink>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
          <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Menu Quản Trị
          </div>

          {ADMIN_MENU_CONFIG.map((item) => {
            const hasChildren = Boolean(
              item.children && item.children.length > 0,
            );
            const isGroupOpen = openGroup === item.id;
            const Icon = item.icon;

            if (!hasChildren) {
              const isDirectActive = currentPath === item.path;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                    isDirectActive
                      ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 shadow-inner border border-amber-500/30"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  {isDirectActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                  )}
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isDirectActive
                          ? "text-amber-400"
                          : "text-neutral-400 group-hover:text-amber-400"
                      }`}
                    />
                    <span className="whitespace-nowrap text-xs font-medium">
                      {item.title}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            }

            const isChildActive =
              hasChildren &&
              item.children.some((child) => child.path === currentPath);

            return (
              <div key={item.id} className="rounded-xl transition-all">
                {/* Parent Group Button */}
                <button
                  type="button"
                  onClick={() => handleGroupClick(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                    isChildActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-300 hover:bg-neutral-900/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isChildActive
                          ? "text-amber-400"
                          : "text-neutral-400 group-hover:text-amber-400"
                      }`}
                    />
                    <span className="whitespace-nowrap text-xs font-medium">
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-neutral-400 transition-transform duration-200 ${
                      isGroupOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>

                {/* Submenu Accordion */}
                {isGroupOpen && (
                  <div className="mt-1 ml-3.5 space-y-0.5 border-l border-neutral-800/80 pl-2 py-0.5">
                    {item.children.map((subItem) => {
                      const isSubActive = currentPath === subItem.path;
                      const SubIcon = subItem.icon;

                      return (
                        <NavLink
                          key={subItem.id}
                          to={subItem.path}
                          onClick={onCloseMobile}
                          className={`group relative flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200 ${
                            isSubActive
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                              : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                          }`}
                        >
                          {isSubActive && (
                            <span className="absolute -left-[9px] top-1.5 bottom-1.5 w-0.5 rounded-r bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                          )}
                          <SubIcon
                            className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                              isSubActive
                                ? "text-amber-400"
                                : "text-neutral-400 group-hover:text-amber-300"
                            }`}
                          />
                          <span className="whitespace-nowrap text-xs font-medium">
                            {subItem.title}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-neutral-800/80 p-4 bg-neutral-950/60">
          <div className="flex items-center gap-3 rounded-xl bg-neutral-900/80 p-2.5 border border-neutral-800/80">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-neutral-950 text-xs shadow-md">
                {initials || "AD"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-neutral-900 bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                {adminName}
              </p>
              <p className="truncate text-[11px] text-neutral-400">
                {adminEmail}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Đăng xuất admin"
              aria-label="Đăng xuất admin"
              className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
