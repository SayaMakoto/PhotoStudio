import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCheck,
  Clock3,
  Plus,
  Send,
  Users,
} from "lucide-react";
import AdminFilterBar from "../../../components/admin/common/AdminFilterBar";
import AdminTable from "../../../components/admin/common/AdminTable";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import useAdminNotification from "../../../components/admin/common/useAdminNotification";
import adminNotificationService from "../../../services/admin/notificationService";
import NotificationDialog from "./NotificationDialog";
import {
  formatNotificationDate,
  getNotificationErrorMessage,
  NOTIFICATION_READ_OPTIONS,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPES,
} from "./notificationConfig";

const asRows = (rows) => (Array.isArray(rows) ? rows : []);

function SummaryCard({ label, value, icon: Icon, tone = "amber" }) {
  const colors = {
    amber: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    blue: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  };
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">{label}</p>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function AdminNotificationsPage() {
  const { notify } = useAdminNotification();
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [readState, setReadState] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [recipientUnreadCount, setRecipientUnreadCount] = useState(null);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadNotifications = async () => {
    setLoading(true);
    setPageError("");
    try {
      setNotifications(asRows(await adminNotificationService.getAll()));
    } catch (error) {
      setPageError(getNotificationErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    adminNotificationService
      .getAll()
      .then((rows) => {
        if (mounted) setNotifications(asRows(rows));
      })
      .catch((error) => {
        if (mounted) setPageError(getNotificationErrorMessage(error));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!recipientId) {
      setRecipientUnreadCount(null);
      return () => {
        mounted = false;
      };
    }
    adminNotificationService
      .getUnreadCount(recipientId)
      .then((result) => {
        if (mounted) setRecipientUnreadCount(Number(result?.unread) || 0);
      })
      .catch(() => {
        if (mounted) setRecipientUnreadCount(null);
      });
    return () => {
      mounted = false;
    };
  }, [recipientId, notifications]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return notifications
      .filter((item) => {
        const matchesSearch =
          !keyword ||
          [item.id, item.userId, item.userFullname, item.title, item.message]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword));
        const matchesType = !type || item.type === type;
        const matchesReadState =
          !readState ||
          (readState === "read" ? Boolean(item.readAt) : !item.readAt);
        const matchesRecipient =
          !recipientId || String(item.userId) === recipientId;
        return (
          matchesSearch && matchesType && matchesReadState && matchesRecipient
        );
      })
      .sort(
        (a, b) =>
          (sortOrder === "oldest" ? 1 : -1) *
          ((Number(a.id) || 0) - (Number(b.id) || 0)),
      );
  }, [notifications, readState, recipientId, search, sortOrder, type]);

  const recipientOptions = useMemo(() => {
    const recipients = new Map();
    notifications.forEach((item) => {
      if (item.userId == null) return;
      recipients.set(
        String(item.userId),
        item.userFullname || `Người dùng #${item.userId}`,
      );
    });
    return [...recipients.entries()].map(([value, label]) => ({
      value,
      label,
    }));
  }, [notifications]);

  const stats = useMemo(
    () => ({
      total: notifications.length,
      unread: notifications.filter((item) => !item.readAt).length,
      read: notifications.filter((item) => Boolean(item.readAt)).length,
      types: new Set(notifications.map((item) => item.type)).size,
    }),
    [notifications],
  );

  const saveNotification = async (payload) => {
    try {
      if (dialog.mode === "create") {
        await adminNotificationService.create(payload);
        notify({
          type: "success",
          title: "Tạo thông báo thành công",
          message: `Thông báo “${payload.title}” đã được tạo.`,
        });
      } else {
        await adminNotificationService.update(dialog.notification.id, payload);
        notify({
          type: "success",
          title: "Đã cập nhật thông báo",
          message: `Thông báo #${dialog.notification.id} đã được lưu.`,
        });
      }
      setDialog(null);
      await loadNotifications();
    } catch (error) {
      setPageError(getNotificationErrorMessage(error));
      throw error;
    }
  };

  const deleteNotification = async (item) => {
    if (
      !window.confirm(
        `Xóa vĩnh viễn thông báo #${item.id} gửi đến ${item.userFullname || `người dùng #${item.userId}`}?`,
      )
    )
      return;
    try {
      await adminNotificationService.delete(item.id);
      setNotifications((current) =>
        current.filter((notification) => notification.id !== item.id),
      );
      notify({
        type: "success",
        title: "Đã xóa thông báo",
        message: `Thông báo #${item.id} đã được xóa.`,
      });
    } catch (error) {
      notify({ type: "error", message: getNotificationErrorMessage(error) });
    }
  };

  const markAsRead = async (item) => {
    try {
      const updated = await adminNotificationService.markAsRead(item.id);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === item.id ? updated : notification,
        ),
      );
      notify({
        type: "success",
        title: "Đã đánh dấu đã đọc",
        message: `Thông báo #${item.id} đã được cập nhật.`,
      });
    } catch (error) {
      notify({ type: "error", message: getNotificationErrorMessage(error) });
    }
  };

  const markRecipientAllAsRead = async () => {
    if (!recipientId || !recipientUnreadCount) return;
    const recipientName =
      recipientOptions.find((option) => option.value === recipientId)?.label ||
      `người dùng #${recipientId}`;
    if (
      !window.confirm(
        `Đánh dấu ${recipientUnreadCount} thông báo chưa đọc của ${recipientName} là đã đọc?`,
      )
    )
      return;
    setMarkingAllRead(true);
    try {
      const result = await adminNotificationService.markAllAsRead(recipientId);
      notify({
        type: "success",
        title: "Đã cập nhật thông báo",
        message: `${Number(result?.updated) || 0} thông báo được đánh dấu đã đọc.`,
      });
      await loadNotifications();
    } catch (error) {
      notify({ type: "error", message: getNotificationErrorMessage(error) });
    } finally {
      setMarkingAllRead(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setType("");
    setReadState("");
    setRecipientId("");
    setSortOrder("newest");
  };
  const columns = [
    { key: "id", title: "Mã", cellClassName: "font-mono text-neutral-400" },
    {
      key: "userFullname",
      title: "Người nhận",
      render: (name, item) => (
        <div className="min-w-36">
          <p className="font-medium text-neutral-100">
            {name || `Người dùng #${item.userId}`}
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            ID: {item.userId}
          </p>
        </div>
      ),
    },
    {
      key: "title",
      title: "Tiêu đề & nội dung",
      render: (title, item) => (
        <div className="min-w-52 max-w-md">
          <p className="font-medium text-neutral-100">
            {title || "Chưa có tiêu đề"}
          </p>
          <p
            className="mt-1 truncate text-[11px] text-neutral-500"
            title={item.message}
          >
            {item.message || "Không có nội dung"}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      title: "Chức năng",
      render: (value) => (
        <span className="inline-flex rounded-full border border-neutral-700 bg-neutral-800/70 px-2.5 py-1 text-[11px] font-medium text-neutral-300">
          {NOTIFICATION_TYPE_LABELS[value] || value || "—"}
        </span>
      ),
    },
    {
      key: "readAt",
      title: "Trạng thái",
      render: (value, item) =>
        value ? (
          <StatusBadge status="read" domain="notification" />
        ) : (
          <button
            type="button"
            onClick={() => markAsRead(item)}
            title="Đánh dấu thông báo đã đọc"
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-400 transition hover:bg-rose-500/20"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Chưa đọc
          </button>
        ),
    },
    { key: "createdAt", title: "Ngày tạo", render: formatNotificationDate },
  ];

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400">
            Quản lý hệ thống
          </p>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <Bell className="h-6 w-6 text-rose-400" />
            Quản lý thông báo
          </h1>
          <p className="mt-1 max-w-3xl text-xs text-neutral-400">
            Theo dõi và chỉnh sửa các thông báo đã lưu theo chức năng: đặt lịch,
            thanh toán, phân công nhân viên, thiết bị và hệ thống.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ mode: "create", notification: null })}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-rose-500 px-4 text-xs font-semibold text-neutral-950 transition hover:bg-rose-600 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Tạo thông báo
        </button>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Bell} label="Tổng thông báo" value={stats.total} />
        <SummaryCard
          icon={Clock3}
          label={recipientId ? "Chưa đọc của người nhận" : "Chưa đọc"}
          value={recipientId ? (recipientUnreadCount ?? "—") : stats.unread}
        />
        <SummaryCard
          icon={CheckCheck}
          label="Đã đọc"
          value={stats.read}
          tone="green"
        />
        <SummaryCard
          icon={Send}
          label="Chức năng có thông báo"
          value={`${stats.types}/${NOTIFICATION_TYPES.length}`}
          tone="blue"
        />
      </div>
      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm mã, người nhận, tiêu đề hoặc nội dung..."
        filters={[
          {
            key: "recipient",
            label: "Người nhận",
            value: recipientId,
            onChange: setRecipientId,
            options: recipientOptions,
          },
          {
            key: "type",
            label: "Chức năng",
            value: type,
            onChange: setType,
            options: NOTIFICATION_TYPES,
          },
          {
            key: "readState",
            label: "Trạng thái đọc",
            value: readState,
            onChange: setReadState,
            options: NOTIFICATION_READ_OPTIONS,
          },
        ]}
        sortValue={sortOrder}
        onSortChange={setSortOrder}
        onReset={resetFilters}
      />
      {recipientId && (
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <Users className="h-4 w-4 text-rose-400" />
            <span>
              Người nhận:{" "}
              <strong className="font-semibold text-white">
                {recipientOptions.find((option) => option.value === recipientId)
                  ?.label || `Người dùng #${recipientId}`}
              </strong>
            </span>
            {recipientUnreadCount != null && (
              <span className="text-neutral-500">
                · {recipientUnreadCount} chưa đọc
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={!recipientUnreadCount || markingAllRead}
            onClick={markRecipientAllAsRead}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-rose-500/30 px-3 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {markingAllRead ? "Đang cập nhật..." : "Đánh dấu tất cả đã đọc"}
          </button>
        </div>
      )}
      {pageError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{pageError}</span>
          <button
            type="button"
            onClick={loadNotifications}
            className="ml-auto whitespace-nowrap font-medium underline"
          >
            Tải lại
          </button>
        </div>
      )}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400">
          <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-rose-400" />
          Đang tải thông báo...
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={filtered}
          emptyMessage="Không có thông báo phù hợp với bộ lọc."
          onDetail={(notification) =>
            setDialog({ mode: "detail", notification })
          }
          onEdit={(notification) => setDialog({ mode: "edit", notification })}
          onDelete={deleteNotification}
        />
      )}
      {dialog && (
        <NotificationDialog
          key={`${dialog.mode}-${dialog.notification?.id ?? "new"}`}
          notification={dialog.notification}
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onSave={saveNotification}
        />
      )}
    </section>
  );
}
