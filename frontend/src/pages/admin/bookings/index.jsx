import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Eye,
  ListChecks,
  XCircle,
} from "lucide-react";
import AdminFilterBar from "../../../components/admin/common/AdminFilterBar";
import AdminTable from "../../../components/admin/common/AdminTable";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import useAdminNotification from "../../../components/admin/common/useAdminNotification";
import adminBookingService from "../../../services/admin/bookingService";
import BookingDialog from "./BookingDialog";
import {
  BOOKING_STATUS_OPTIONS,
  canAdminUpdateBookingStatus,
  formatBookingDate,
  formatBookingTime,
  getBookingErrorMessage,
} from "./bookingConfig";

const asRows = (rows) => (Array.isArray(rows) ? rows : []);

function SummaryCard({ label, value, icon: Icon, tone = "rose" }) {
  const colors = {
    amber: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    blue: "border-sky-500/20 bg-sky-500/10 text-sky-300",
    red: "border-rose-500/20 bg-rose-500/10 text-rose-300",
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

export default function AdminBookingsPage() {
  const { notify } = useAdminNotification();
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setPageError("");
    try {
      setBookings(asRows(await adminBookingService.getAll()));
    } catch (error) {
      setPageError(getBookingErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    adminBookingService
      .getAll()
      .then((rows) => {
        if (mounted) setBookings(asRows(rows));
      })
      .catch((error) => {
        if (mounted) setPageError(getBookingErrorMessage(error));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return bookings
      .filter((booking) => {
        const bookingDay = booking.bookingDate?.slice?.(0, 10) || "";
        const matchesSearch =
          !keyword ||
          [
            booking.id,
            booking.customerName,
            booking.customerPhone,
            booking.roomName,
            booking.customerNote,
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword));
        return (
          matchesSearch &&
          (!status || booking.status === status) &&
          (!dateFrom || bookingDay >= dateFrom) &&
          (!dateTo || bookingDay <= dateTo)
        );
      })
      .sort(
        (a, b) =>
          (sortOrder === "oldest" ? 1 : -1) *
          ((Number(a.id) || 0) - (Number(b.id) || 0)),
      );
  }, [bookings, dateFrom, dateTo, search, sortOrder, status]);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === "pending")
        .length,
      active: bookings.filter((booking) =>
        ["confirmed", "in_progress"].includes(booking.status),
      ).length,
      completed: bookings.filter((booking) => booking.status === "completed")
        .length,
      cancelled: bookings.filter((booking) => booking.status === "cancelled")
        .length,
    }),
    [bookings],
  );

  const updateBookingStatus = async (booking, nextStatus) => {
    if (!canAdminUpdateBookingStatus(booking.status, nextStatus) || updatingId)
      return;
    const label =
      BOOKING_STATUS_OPTIONS.find((option) => option.value === nextStatus)
        ?.label || nextStatus;
    if (
      !window.confirm(
        `Cập nhật đơn #${booking.id} (${booking.customerName || "khách hàng"}) sang trạng thái “${label}”?`,
      )
    )
      return;
    setUpdatingId(booking.id);
    try {
      const updated = await adminBookingService.updateDecision(
        booking.id,
        nextStatus,
      );
      setBookings((current) =>
        current.map((item) => (item.id === booking.id ? updated : item)),
      );
      setSelectedBooking((current) =>
        current?.id === booking.id ? updated : current,
      );
      notify({
        type: "success",
        title: "Đã cập nhật trạng thái đơn",
        message: `Đơn #${booking.id} hiện ở trạng thái ${label.toLowerCase()}.`,
      });
    } catch (error) {
      notify({ type: "error", message: getBookingErrorMessage(error) });
    } finally {
      setUpdatingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setSortOrder("newest");
    setDateFrom("");
    setDateTo("");
  };
  const columns = [
    { key: "id", title: "Mã đơn", cellClassName: "font-mono text-neutral-400" },
    {
      key: "customerName",
      title: "Khách hàng",
      render: (name, booking) => (
        <div className="min-w-40">
          <p className="font-medium text-neutral-100">{name || "Khách hàng"}</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            {booking.customerPhone || `ID #${booking.customerId}`}
          </p>
        </div>
      ),
    },
    {
      key: "roomName",
      title: "Phòng chụp",
      render: (roomName, booking) => roomName || `Phòng #${booking.roomId}`,
    },
    {
      key: "bookingDate",
      title: "Ngày & giờ chụp",
      render: (date, booking) => (
        <div className="min-w-32">
          <p>{formatBookingDate(date)}</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            {formatBookingTime(booking.startTime)} –{" "}
            {formatBookingTime(booking.endTime)}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (value) => <StatusBadge status={value} domain="booking" />,
    },
    { key: "createdAt", title: "Ngày đặt", render: formatBookingDate },
  ];

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400">
            Vận hành
          </p>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <CalendarDays className="h-6 w-6 text-rose-400" />
            Quản lý đơn đặt lịch
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Theo dõi lịch chụp, thông tin khách hàng và các hạng mục đi kèm; chỉ
            xem và cập nhật trạng thái đơn.
          </p>
        </div>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard icon={ListChecks} label="Tổng đơn" value={stats.total} />
        <SummaryCard
          icon={CircleAlert}
          label="Chờ xác nhận"
          value={stats.pending}
        />
        <SummaryCard
          icon={Clock3}
          label="Đã xác nhận / đang chụp"
          value={stats.active}
          tone="blue"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Hoàn tất"
          value={stats.completed}
          tone="green"
        />
        <SummaryCard
          icon={XCircle}
          label="Đã hủy"
          value={stats.cancelled}
          tone="red"
        />
      </div>
      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm mã đơn, khách hàng, số điện thoại, phòng..."
        filters={[
          {
            key: "status",
            label: "Trạng thái đơn",
            value: status,
            onChange: setStatus,
            options: BOOKING_STATUS_OPTIONS,
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
            onClick={loadBookings}
            className="ml-auto whitespace-nowrap font-medium underline"
          >
            Tải lại
          </button>
        </div>
      )}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400">
          <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-rose-400" />
          Đang tải đơn đặt lịch...
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={filtered}
          emptyMessage="Không có đơn đặt lịch phù hợp với bộ lọc."
          onDetail={setSelectedBooking}
        />
      )}
      <p className="flex items-center gap-2 text-[11px] text-neutral-500">
        <Eye className="h-3.5 w-3.5 shrink-0" />
        Admin chỉ xem chi tiết và chuyển đơn sang mốc trạng thái kế tiếp. Việc
        hủy đơn do khách hàng thực hiện.
      </p>
      {selectedBooking && (
        <BookingDialog
          key={selectedBooking.id}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={updateBookingStatus}
          updating={updatingId === selectedBooking.id}
        />
      )}
    </section>
  );
}
