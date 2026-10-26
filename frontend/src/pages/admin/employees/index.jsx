import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import AdminFilterBar from "../../../components/admin/common/AdminFilterBar";
import AdminTable from "../../../components/admin/common/AdminTable";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import adminUserService from "../../../services/admin/userService";
import adminEmployeeService from "../../../services/admin/employeeService";
import EmployeeDetailDialog from "./EmployeeDetailDialog";
import {
  EMPLOYEE_POSITION_LABELS,
  EMPLOYEE_STATUS_OPTIONS,
  getErrorMessage,
} from "./employeeConfig";

const EMPLOYEE_COLUMNS = [
  {
    key: "id",
    title: "Mã NV",
    cellClassName: "font-mono text-neutral-400",
  },
  {
    key: "fullname",
    title: "Nhân viên",
    render: (value, employee) => (
      <div className="min-w-36">
        <p className="font-medium text-neutral-100">{value || "Chưa cập nhật"}</p>
        <p className="mt-0.5 text-[11px] text-neutral-500">@{employee.username}</p>
      </div>
    ),
  },
  { key: "email", title: "Email" },
  {
    key: "position",
    title: "Vị trí",
    render: (position) => EMPLOYEE_POSITION_LABELS[position] || position || "—",
  },
  { key: "hireDate", title: "Ngày tuyển dụng" },
  {
    key: "employeeStatus",
    title: "Trạng thái",
    render: (status) => <StatusBadge status={status} domain="employee" />,
  },
  {
    key: "averageRating",
    title: "Đánh giá",
    render: (rating, employee) => (
      <span className="whitespace-nowrap">
        {rating == null ? "Chưa có" : `${rating.toFixed(1)} / 5`}
        <span className="ml-1 text-neutral-500">({employee.reviews.length})</span>
      </span>
    ),
  },
];

async function loadEmployeesWithReviews() {
  const [employees, users, reviews] = await Promise.all([
    adminEmployeeService.getAll(),
    adminUserService.getAll(),
    adminEmployeeService.getReviews(),
  ]);
  const userById = new Map(users.map((user) => [String(user.id), user]));
  const reviewsByEmployeeId = new Map();

  reviews.forEach((review) => {
    const key = String(review.employeeId);
    const items = reviewsByEmployeeId.get(key) || [];
    items.push(review);
    reviewsByEmployeeId.set(key, items);
  });

  return employees.map((employee) => {
    const user = userById.get(String(employee.userId)) || {};
    const employeeReviews = reviewsByEmployeeId.get(String(employee.id)) || [];
    const ratings = employeeReviews
      .map((review) => Number(review.rating))
      .filter(Number.isFinite);
    const averageRating = ratings.length
      ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
      : null;

    return {
      ...employee,
      username: user.username,
      fullname: employee.fullname || user.fullname,
      email: employee.email || user.email,
      phone: employee.phone || user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      avatar: user.avatar,
      role: user.role,
      accountStatus: user.status,
      employeeStatus: employee.status,
      reviews: employeeReviews,
      averageRating,
    };
  });
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setPageError("");
    try {
      setEmployees(await loadEmployeesWithReviews());
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadEmployeesWithReviews()
      .then((result) => {
        if (isMounted) setEmployees(result);
      })
      .catch((error) => {
        if (isMounted) setPageError(getErrorMessage(error));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const result = employees.filter((employee) => {
      const matchesSearch =
        !keyword ||
        [employee.fullname, employee.username, employee.email, employee.phone]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword));
      const matchesPosition = !positionFilter || employee.position === positionFilter;
      const matchesStatus = !statusFilter || employee.employeeStatus === statusFilter;
      return matchesSearch && matchesPosition && matchesStatus;
    });

    return result.sort((left, right) => {
      const leftId = Number(left.id) || 0;
      const rightId = Number(right.id) || 0;
      return sortOrder === "oldest" ? leftId - rightId : rightId - leftId;
    });
  }, [employees, search, positionFilter, statusFilter, sortOrder]);

  const resetFilters = () => {
    setSearch("");
    setPositionFilter("");
    setStatusFilter("");
    setSortOrder("newest");
  };

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-white">Quản lý nhân viên</h1>
        <p className="mt-1 text-xs text-neutral-400">
          Thông tin tài khoản, hồ sơ nhân viên và đánh giá từ khách hàng.
        </p>
      </header>

      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm tên, tài khoản, email, số điện thoại…"
        filters={[
          {
            key: "position",
            label: "Vị trí",
            value: positionFilter,
            onChange: setPositionFilter,
            options: Object.entries(EMPLOYEE_POSITION_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          },
          {
            key: "status",
            label: "Trạng thái nhân viên",
            value: statusFilter,
            onChange: setStatusFilter,
            options: EMPLOYEE_STATUS_OPTIONS,
          },
        ]}
        sortValue={sortOrder}
        onSortChange={setSortOrder}
        onReset={resetFilters}
      />

      {pageError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{pageError}</span>
          <button
            type="button"
            onClick={loadData}
            className="ml-auto whitespace-nowrap font-medium underline underline-offset-2"
          >
            Tải lại
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-16 text-center text-sm text-neutral-400">
          Đang tải danh sách nhân viên…
        </div>
      ) : (
        <AdminTable
          columns={EMPLOYEE_COLUMNS}
          data={filteredEmployees}
          rowKey="id"
          emptyMessage={search || positionFilter || statusFilter
            ? "Không tìm thấy nhân viên phù hợp."
            : "Chưa có hồ sơ nhân viên nào."}
          actions={{ detail: true, edit: false, delete: false }}
          handleDetail={setSelectedEmployee}
        />
      )}

      {selectedEmployee && (
        <EmployeeDetailDialog
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </section>
  );
}
