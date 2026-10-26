import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import SummaryCards from "../../components/admin/dashboard/SummaryCards";
import RevenueTable from "../../components/admin/dashboard/RevenueTable";
import AccountStaffTable from "../../components/admin/dashboard/AccountStaffTable";
import ResourceStatusTable from "../../components/admin/dashboard/ResourceStatusTable";
import BlurText from "../../components/animations/BlurText";
import adminUserService from "../../services/admin/userService";
import adminEmployeeService from "../../services/admin/employeeService";

const EMPLOYEE_POSITIONS = [
  { key: "photographer", label: "Nhiếp ảnh gia" },
  { key: "makeup", label: "Chuyên viên trang điểm" },
  { key: "logistics", label: "Hậu cần" },
];

function countStatus(items, status) {
  return items.filter((item) => item.status === status).length;
}

export default function AdminDashboard() {
  const [accountData, setAccountData] = useState(null);
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountError, setAccountError] = useState("");
  const context = useOutletContext() || {};
  const selectedMonth = context.selectedMonth ?? 10;
  const selectedYear = context.selectedYear ?? 2026;

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      adminUserService.getAll(),
      adminEmployeeService.getAll(),
      adminEmployeeService.getReviews(),
    ])
      .then(([users, employees, employeeReviews]) => {
        if (!isMounted) return;
        setAccountData({
          users: Array.isArray(users) ? users : [],
          employees: Array.isArray(employees) ? employees : [],
          employeeReviews: Array.isArray(employeeReviews) ? employeeReviews : [],
        });
      })
      .catch((error) => {
        if (!isMounted) return;
        setAccountError(
          error.response?.data?.message ||
            error.message ||
            "Không thể tải thống kê người dùng và nhân viên.",
        );
      })
      .finally(() => {
        if (isMounted) setAccountLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const accountStats = useMemo(() => {
    if (!accountData) return null;
    return {
      total: accountData.users.length,
      active: countStatus(accountData.users, "active"),
      inactive: countStatus(accountData.users, "inactive"),
      locked: countStatus(accountData.users, "banned"),
    };
  }, [accountData]);

  const employeeStats = useMemo(() => {
    if (!accountData) return null;

    return EMPLOYEE_POSITIONS.map(({ key, label }) => {
      const positionEmployees = accountData.employees.filter(
        (employee) => employee.position === key,
      );
      const employeeIds = new Set(positionEmployees.map((employee) => String(employee.id)));
      const ratings = accountData.employeeReviews
        .filter((review) => employeeIds.has(String(review.employeeId)))
        .map((review) => Number(review.rating))
        .filter(Number.isFinite);

      return {
        role: label,
        total: positionEmployees.length,
        active: countStatus(positionEmployees, "active"),
        onLeave: countStatus(positionEmployees, "on_leave"),
        inactive: countStatus(positionEmployees, "inactive"),
        rating: ratings.length
          ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
          : null,
      };
    }).filter((employeeGroup) => employeeGroup.total > 0);
  }, [accountData]);

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
        activeUsers={accountStats?.active ?? null}
        activeEmployees={
          accountStats ? countStatus(accountData.employees, "active") : null
        }
        activeResources={527}
        revenueGrowth={6.1}
      />

      <RevenueTable selectedMonth={selectedMonth} selectedYear={selectedYear} />

      <ResourceStatusTable />

      <AccountStaffTable
        accountStats={accountStats}
        employeeStats={employeeStats}
        loading={accountLoading}
        error={accountError}
      />
    </div>
  );
}
