import { useState, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Search,
  Eye,
  RefreshCw,
  ArrowRight,
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
        if (b.date !== '2026-10-10') return false;
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
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
            Đang chụp
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700">
            Sắp diễn ra
          </span>
        );
      case 'retouched':
        return (
          <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
            Đã hậu kỳ
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
            Đã bàn giao
          </span>
        );
      default:
        return <StatusBadge status={status} />;
    }
  };

  return (
    <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] space-y-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-[#F0E4E6]">
        {showTitle && (
          <div>
            <h3 className="text-base font-bold text-[#261A1E] flex items-center gap-2">
              <CalendarDays className="h-4.5 w-4.5 text-[#B85064]" />
              <span>Lịch Chụp & Ca Phân Công Tác Nghiệp</span>
            </h3>
            <p className="text-xs text-[#7A6C71] mt-0.5">
              Danh sách tổng quan các ca chụp. Nhấp vào từng ca để xem chi tiết bối cảnh, thiết bị và tác nghiệp.
            </p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E8E93]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã BK, tên khách..."
              className="w-full rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] py-2 pl-9 pr-3 text-xs text-[#261A1E] placeholder-[#9E8E93] focus:border-[#B85064] focus:bg-white focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Date Segmented Controls */}
          <div className="flex items-center bg-[#FAF5F5] p-1 rounded-2xl border border-[#F0E4E6] text-xs">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3.5 py-1.5 font-bold rounded-xl transition-all ${
                dateFilter === 'today'
                  ? 'bg-[#B85064] text-white shadow-sm'
                  : 'text-[#7A6C71] hover:text-[#261A1E]'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3.5 py-1.5 font-bold rounded-xl transition-all ${
                dateFilter === 'all'
                  ? 'bg-[#B85064] text-white shadow-sm'
                  : 'text-[#7A6C71] hover:text-[#261A1E]'
              }`}
            >
              Tất cả
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] px-3.5 py-2 text-xs text-[#261A1E] font-semibold focus:border-[#B85064] focus:outline-none shadow-sm"
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
              className="flex items-center gap-1.5 rounded-2xl border border-[#F5D5DC] bg-[#FDF0F3] px-3.5 py-2 text-xs font-bold text-[#B85064] hover:bg-[#FBE4E9] transition-all shadow-sm"
              title="Gửi yêu cầu đổi ca trực hoặc xin nghỉ phép tới quản trị viên"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Đổi ca / Báo bận</span>
            </button>
          )}
        </div>
      </div>

      {/* Bookings List (Clean & Overview-only - No Information Overload) */}
      {filteredBookings.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#9E8E93]">
          Không tìm thấy ca chụp nào phù hợp với bộ lọc.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => onSelectBooking && onSelectBooking(booking)}
              className="group rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5]/60 hover:bg-white hover:border-[#F5D5DC] p-4 sm:p-5 transition-all duration-200 hover:shadow-[0_8px_24px_rgb(184,80,100,0.08)] cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              {/* Left Column: ID, Status, Time, Customer & Package */}
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#B85064] bg-[#FDF0F3] px-2.5 py-0.5 rounded-md border border-[#F5D5DC]">
                    {booking.id}
                  </span>
                  {renderStatus(booking.status)}

                  <span className="text-xs font-bold text-[#261A1E] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#B85064]" />
                    {booking.time} • {booking.date}
                  </span>

                  {booking.deadlineTag?.type === 'urgent' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 animate-pulse">
                      {booking.deadlineTag.label}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h4 className="text-sm font-bold text-[#261A1E] group-hover:text-[#B85064] transition-colors flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#9E8E93]" />
                    <span>{booking.customerName}</span>
                  </h4>
                  <span className="text-xs font-semibold text-[#B85064]">
                    — {booking.packageName}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#7A6C71]">
                  <MapPin className="h-3.5 w-3.5 text-[#9E8E93] shrink-0" />
                  <span className="truncate">{booking.room}</span>
                </div>
              </div>

              {/* Right Column: Quick Status Update & View Details Action */}
              <div
                className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0E4E6]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Status Switcher Dropdown */}
                <select
                  value={booking.status}
                  onChange={(e) => onStatusChange && onStatusChange(booking.id, e.target.value)}
                  className="rounded-xl border border-[#F0E4E6] bg-white px-3 py-1.5 text-xs text-[#261A1E] font-semibold focus:border-[#B85064] focus:outline-none shadow-sm cursor-pointer"
                  title="Cập nhật nhanh trạng thái"
                >
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="in_progress">Đang chụp</option>
                  <option value="retouched">Đã hậu kỳ</option>
                  <option value="delivered">Đã bàn giao</option>
                </select>

                {/* View Details Button */}
                <button
                  type="button"
                  onClick={() => onSelectBooking && onSelectBooking(booking)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#FDF0F3] hover:bg-[#B85064] text-[#B85064] hover:text-white border border-[#F5D5DC] hover:border-[#B85064] font-bold px-3.5 py-1.5 text-xs transition-all shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Chi tiết ca</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
