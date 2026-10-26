import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import AdminTable from "../../../components/admin/common/AdminTable";
import AdminFilterBar from "../../../components/admin/common/AdminFilterBar";
import adminUserService from "../../../services/admin/userService";
import UserDialog from "./UserDialog";
import { getErrorMessage, ROLE_LABELS } from "./userConfig";

const USER_COLUMNS = [
  {
    key: "id",
    title: "Mã",
    cellClassName: "font-mono text-neutral-400",
  },
  {
    key: "fullname",
    title: "Họ và tên",
    render: (value, user) => (
      <div className="min-w-36">
        <p className="font-medium text-neutral-100">
          {value || "Chưa cập nhật"}
        </p>
        <p className="mt-0.5 text-[11px] text-neutral-500">@{user.username}</p>
      </div>
    ),
  },
  { key: "email", title: "Email" },
  { key: "phone", title: "Số điện thoại" },
  {
    key: "role",
    title: "Vai trò",
    render: (role) => ROLE_LABELS[role] ?? role ?? "—",
  },
  {
    key: "status",
    title: "Trạng thái",
    type: "status",
    statusDomain: "user",
    toggleable: true,
    togglePair: { active: "banned", banned: "active" },
  },
];

function requestUsers() {
  return adminUserService
    .getAll()
    .then((result) => (Array.isArray(result) ? result : []));
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setPageError("");
    try {
      setUsers(await requestUsers());
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    requestUsers()
      .then((result) => {
        if (isMounted) setUsers(result);
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

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const result = users.filter((user) => {
      const matchesSearch =
        !keyword ||
        [user.fullname, user.username, user.email, user.phone]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword));
      const matchesStatus = !statusFilter || user.status === statusFilter;
      const matchesRole =
        !roleFilter || user.role?.toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesRole;
    });

    return result.sort((left, right) => {
      const leftId = Number(left.id) || 0;
      const rightId = Number(right.id) || 0;
      return sortOrder === "oldest"
        ? leftId - rightId
        : rightId - leftId;
    });
  }, [users, search, statusFilter, roleFilter, sortOrder]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setRoleFilter("");
    setSortOrder("newest");
  };

  const updateUserStatus = async (user, status) => {
    const actionLabel = status === "banned" ? "khóa" : "mở khóa";
    const confirmed = window.confirm(
      `Bạn có chắc muốn ${actionLabel} tài khoản ${user.fullname || user.username}?`,
    );
    if (!confirmed) return;

    setPageError("");
    try {
      const updatedUser = await adminUserService.updateStatus(user.id, status);
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, ...updatedUser } : item,
        ),
      );
    } catch (error) {
      setPageError(getErrorMessage(error));
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Quản lý người dùng
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Danh sách tài khoản và thông tin liên hệ của người dùng.
          </p>
        </div>
      </header>

      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm tên, email, số điện thoại…"
        filters={[
          {
            key: "status",
            label: "Trạng thái",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: "active", label: "Đang hoạt động" },
              { value: "banned", label: "Đã khóa" },
            ],
          },
          {
            key: "role",
            label: "Vai trò",
            value: roleFilter,
            onChange: setRoleFilter,
            options: Object.entries(ROLE_LABELS)
              .filter(([value]) => value !== "ADMIN")
              .map(([value, label]) => ({ value, label })),
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
            onClick={loadUsers}
            className="ml-auto whitespace-nowrap font-medium underline underline-offset-2"
          >
            Tải lại
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-16 text-center text-sm text-neutral-400">
          Đang tải danh sách người dùng…
        </div>
      ) : (
        <AdminTable
          columns={USER_COLUMNS}
          data={filteredUsers}
          rowKey="id"
          emptyMessage={
            search
              ? "Không tìm thấy người dùng phù hợp."
              : "Chưa có người dùng nào."
          }
          actions={{ detail: true, edit: false, delete: false }}
          handleDetail={(user) => setDialog(user)}
          onStatusChange={updateUserStatus}
        />
      )}

      {dialog && (
        <UserDialog
          key={dialog.id}
          user={dialog}
          onClose={() => setDialog(null)}
        />
      )}
    </section>
  );
}
