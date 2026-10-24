import { useOutletContext } from "react-router-dom";
import SummaryCards from "../../components/admin/dashboard/SummaryCards";
import RevenueTable from "../../components/admin/dashboard/RevenueTable";
import AccountStaffTable from "../../components/admin/dashboard/AccountStaffTable";
import ResourceStatusTable from "../../components/admin/dashboard/ResourceStatusTable";
import BlurText from "../../components/animations/BlurText";

export default function AdminDashboard() {
  const context = useOutletContext() || {};
  const selectedMonth = context.selectedMonth ?? 10;
  const selectedYear = context.selectedYear ?? 2026;

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
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
            Thống kê hoạt động, kiểm soát doanh thu, tài nguyên chụp và nhân sự
            studio.
          </p>
        </div>
      </div>

      <SummaryCards
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        totalRevenue={330000000}
        activeUsers={1248}
        activeEmployees={36}
        activeResources={527}
        revenueGrowth={6.1}
      />

      <RevenueTable selectedMonth={selectedMonth} selectedYear={selectedYear} />

      <ResourceStatusTable />

      <AccountStaffTable />
    </div>
  );
}
