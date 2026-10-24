import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { ADMIN_MENU_CONFIG } from "./adminMenuConfig";
import { useState } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const [openGroupOverride, setOpenGroupOverride] = useState({
    locationKey: null,
    groupId: null,
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Time filter state
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(10);

  // Derive the default open menu from the route. A local override lets the
  // user toggle the accordion without synchronously updating state in an effect.
  const routeGroup = ADMIN_MENU_CONFIG.find((group) =>
    group.children?.some((child) => child.path === location.pathname),
  );
  const openGroup =
    openGroupOverride.locationKey === location.key
      ? openGroupOverride.groupId
      : routeGroup?.id ?? null;

  const handleToggleGroup = (groupId) => {
    // Single-open accordion: click active group closes it, click another closes prev and opens that one
    setOpenGroupOverride({
      locationKey: location.key,
      groupId: openGroup === groupId ? null : groupId,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* 1. Sidebar with routing links & Single-Open Accordion */}
      <AdminSidebar
        openGroup={openGroup}
        onToggleGroup={handleToggleGroup}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* 2. Main Admin Container */}
      <div className="flex-1 lg:pl-76 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-[1600px] w-full mx-auto">
          {/* Renders subpages or Dashboard */}
          <Outlet
            context={{
              selectedMonth,
              selectedYear,
              setSelectedMonth,
              setSelectedYear,
            }}
          />
        </main>
      </div>
    </div>
  );
}
