import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Phone,
  Search,
  AlertTriangle,
  ExternalLink,
  Eye,
  CheckCircle2,
  DollarSign,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import StatusBadge from '../../admin/common/StatusBadge';

const STATUS_LABELS = {
  all: 'Tất cả trạng thái',
  upcoming: 'Sắp diễn ra',
  in_progress: 'Đang chụp',
  retouched: 'Đã hậu kỳ',
  delivered: 'Đã bàn giao',
};

export default function BookingListAndSchedule({
  bookings = [],
  onSelectBooking,
  onOpenIncident,
  onOpenShiftSwap,
  onStatusChange,
  showTitle = true,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'week'
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search match
      const query = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        b.id.toLowerCase().includes(query) ||
        b.customerName.toLowerCase().includes(query) ||
        b.packageName.toLowerCase().includes(query) ||
        (b.phone && b.phone.includes(query));

      if (!matchSearch) return false;

      // Date match
      if (dateFilter === 'today') {
        if (b.date !== '2026-10-10') return false; // Mock today
      }

      // Status match
      if (statusFilter !== 'all') {
        if (b.status !== statusFilter) return false;
      }

      return true;
    });
  }, [bookings, searchTerm, dateFilter, statusFilter]);

  const renderStatus = (status) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
            Đang chụp
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-300">
            Sắp diễn ra
          </span>
        );
      case 'retouched':
        return (
          <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-300">
            Đã hậu kỳ
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            Đã bàn giao
          </span>
        );
      default:
        return <StatusBadge status={status} />;
    }
  };

  const renderDeadlineTag = (tag) => {
    if (!tag) return null;
    let colorClass = 'border-amber-500/40 bg-amber-500/15 text-amber-300';
    if (tag.type === 'urgent') {
      colorClass = 'border-orange-500/40 bg-orange-500/20 text-orange-300 animate-pulse';
    } else if (tag.type === 'done') {
      colorClass = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    } else if (tag.type === 'expired') {
      colorClass = 'border-rose-500/40 bg-rose-500/20 text-rose-300';
    }

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${colorClass}`}
        title="Thời hạn hoàn thiện & trả ảnh cho khách"
      >
        <Clock className="h-3 w-3" />
        <span>{tag.label}</span>
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-4">
      {/* Header & Filter Controls (Cleaned & Unified) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-neutral-800">
        {showTitle && (
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarDays className="h-4.5 w-4.5 text-amber-400" />
              <span>Lịch Chụp & Ca Phân Công Tác Nghiệp</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Quản lý các ca chụp được phân công, hạn trả ảnh, tiến độ chọn ảnh và hoa hồng ca.
            </p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã BK, tên khách..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-1.5 pl-8 pr-3 text-xs text-neutral-200 placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Date Segmented Controls */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                dateFilter === 'today'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                dateFilter === 'all'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tất cả
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 font-medium focus:border-amber-400 focus:outline-none"
          >
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Shift Swap Button */}
          {onOpenShiftSwap && (
            <button
              type="button"
              onClick={onOpenShiftSwap}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="Gửi yêu cầu đổi ca trực hoặc xin nghỉ phép tới quản trị viên"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Đổi ca / Báo bận</span>
            </button>
          )}
        </div>
      </div>

      {/* Bookings List / Table */}
      {filteredBookings.length === 0 ? (
        <div className="py-12 text-center text-xs text-neutral-500">
          Không tìm thấy ca chụp nào phù hợp với bộ lọc.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="group rounded-xl border border-neutral-800/90 bg-neutral-950/60 p-4 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-950 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              {/* Left Column: ID, Status, Deadline countdown, Customer, Package & Commission */}
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {booking.id}
                  </span>
                  {renderStatus(booking.status)}
                  {renderDeadlineTag(booking.deadlineTag)}

                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    {booking.time} • {booking.date}
                  </span>

                  {/* Commission Tag */}
                  {booking.commission && (
                    <span
                      className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded"
                      title="Hoa hồng tạm tính cho ca chụp này"
                    >
                      +{new Intl.NumberFormat('vi-VN').format(booking.commission)} đ
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-200 font-medium">
                    <User className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{booking.customerName}</span>
                    {booking.phone && (
                      <span className="text-neutral-500 font-mono">({booking.phone})</span>
                    )}
                  </div>
                  <span className="text-neutral-600 hidden sm:inline">•</span>
                  <div className="text-neutral-300 font-semibold">{booking.packageName}</div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-neutral-500" />
                    {booking.room}
                  </span>

                  {/* Photo Selection Status */}
                  {booking.photoSelection && (
                    <span className="text-neutral-300 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-sky-400" />
                      <span>{booking.photoSelection.selectionStatus}</span>
                      <span className="text-neutral-500">
                        ({booking.photoSelection.retouchedCount}/{booking.photoSelection.selectedCount} đã sửa)
                      </span>
                    </span>
                  )}

                  {booking.colleagues && booking.colleagues.length > 0 && (
                    <span className="text-neutral-500">
                      Ekip: {booking.colleagues.map((c) => `${c.name} (${c.role})`).join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-800/80">
                {/* Status Switcher Dropdown */}
                <select
                  value={booking.status}
                  onChange={(e) => onStatusChange && onStatusChange(booking.id, e.target.value)}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
                  title="Cập nhật trạng thái ca chụp"
                >
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="in_progress">Đang chụp</option>
                  <option value="retouched">Đã hậu kỳ</option>
                  <option value="delivered">Đã bàn giao</option>
                </select>

                {/* Report Incident button */}
                <button
                  type="button"
                  onClick={() => onOpenIncident && onOpenIncident(booking)}
                  className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                  title="Báo sự cố thiết bị/ca chụp"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Báo sự cố</span>
                </button>

                {/* Detail Button */}
                <button
                  type="button"
                  onClick={() => onSelectBooking && onSelectBooking(booking)}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-3 py-1.5 text-xs transition-colors shadow-sm"
                  title="Xem chi tiết ca chụp"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Chi tiết ca</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
