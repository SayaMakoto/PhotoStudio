import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar, { ADMIN_MENU_CONFIG } from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Time filter state
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(10);

  // When on Admin root (/admin), close all menus. When on subroute, open its parent group only.
  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      setOpenGroup(null);
      return;
    }

    const parentGroup = ADMIN_MENU_CONFIG.find((group) =>
      group.children?.some((child) => child.path === location.pathname)
    );
    if (parentGroup) {
      setOpenGroup(parentGroup.id);
    } else {
      setOpenGroup(null);
    }
  }, [location.pathname]);

  const handleToggleGroup = (groupId) => {
    // Single-open accordion: click active group closes it, click another closes prev and opens that one
    setOpenGroup((prev) => (prev === groupId ? null : groupId));
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
        <AdminHeader
          onOpenMobile={() => setIsMobileOpen(true)}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onChangeYear={setSelectedYear}
          onChangeMonth={setSelectedMonth}
        />

        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-[1600px] w-full mx-auto">
          {/* Renders subpages or Dashboard */}
          <Outlet context={{ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }} />
        </main>
      </div>
    </div>
  );
}
