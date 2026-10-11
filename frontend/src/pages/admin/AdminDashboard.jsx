import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SummaryCards from '../../components/admin/dashboard/SummaryCards';
import RevenueTable from '../../components/admin/dashboard/RevenueTable';
import AccountStaffTable from '../../components/admin/dashboard/AccountStaffTable';
import ResourceStatusTable from '../../components/admin/dashboard/ResourceStatusTable';
import BlurText from '../../components/animations/BlurText';
import { RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const context = useOutletContext() || {};
  const selectedMonth = context.selectedMonth ?? 10;
  const selectedYear = context.selectedYear ?? 2026;
  const setSelectedMonth = context.setSelectedMonth || (() => {});
  const setSelectedYear = context.setSelectedYear || (() => {});

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              Hệ Thống Trực Tuyến
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            <BlurText
              text="Trang Chủ Thống Kê & Quản Trị Studio"
              delay={40}
              animateBy="words"
              direction="top"
              className="inline-block"
            />
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400">
            Thống kê hoạt động, kiểm soát doanh thu, tài nguyên chụp và nhân sự studio.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedMonth(10);
              setSelectedYear(2026);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-all shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
            <span>Làm mới dữ liệu</span>
          </button>
        </div>
      </div>

      {/* 1. Quick KPI Metrics with React Bits SpotlightCard & CountUp */}
      <SummaryCards
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        totalRevenue={330000000}
        activeUsers={1248}
        activeEmployees={36}
        activeResources={527}
        revenueGrowth={6.1}
      />

      {/* 2. Monthly Revenue Breakdown Table */}
      <RevenueTable
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      {/* 3. Active Resources Status Table (Equipments, Backgrounds, Rooms, Clothes, Accessories) */}
      <ResourceStatusTable />

      {/* 4. Active Accounts & Staff Teams Table */}
      <AccountStaffTable />
    </div>
  );
}
