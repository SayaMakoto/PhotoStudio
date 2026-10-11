import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Phone,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  FileEdit,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function BookingListAndSchedule({
  bookings,
  onSelectBooking,
  onOpenChat,
  onStatusChange,
}) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [calendarView, setCalendarView] = useState('day'); // 'day' | 'week' | 'month'

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_progress':
        return { text: 'Đang chụp', class: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'upcoming':
        return { text: 'Sắp diễn ra', class: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'retouched':
        return { text: 'Đã hậu kỳ', class: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'delivered':
        return { text: 'Đã bàn giao', class: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      default:
        return { text: status, class: 'bg-neutral-800 text-neutral-400' };
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-5">
      {/* Header with Switcher: Day/Week/Month */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarDays className="h-4.5 w-4.5 text-amber-400" />
            <span>Lịch Làm Việc & Danh Sách Ca Chụp Phân Công</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Xem lịch ngày / tuần / tháng, thông tin khách hàng, gói chụp, phòng chụp và cập nhật trạng thái.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                calendarView === 'day' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Hôm Nay
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                calendarView === 'week' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tuần Này
            </button>
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                calendarView === 'month' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tháng 10
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Card List */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            Không tìm thấy lịch chụp nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          bookings.map((booking) => {
            const statusInfo = getStatusBadge(booking.status);

            return (
              <div
                key={booking.id}
                className="group relative rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 hover:border-amber-500/40 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Time, Customer & Package */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {booking.id}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span>{booking.time} ({booking.date})</span>
                      </div>
                    </div>

                    {/* Customer & Location */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-neutral-400" />
                        <span className="font-bold text-white text-sm">{booking.customerName}</span>
                        <span className="text-neutral-500">({booking.phone})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-200/90 font-medium">
                        <Package className="h-3.5 w-3.5 text-amber-400" />
                        <span>{booking.packageName}</span>
                      </div>
                    </div>

                    {/* Room & Background */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                      <span>{booking.room}</span>
                      <span className="text-neutral-600">•</span>
                      <span className="truncate">{booking.background}</span>
                    </div>

                    {/* Customer Notes */}
                    {booking.note && (
                      <div className="text-[11.5px] text-neutral-400 bg-neutral-900/80 rounded-lg p-2.5 border border-neutral-800/80 italic">
                        💬 <strong className="text-neutral-300 not-italic">Ghi chú:</strong> {booking.note}
                      </div>
                    )}
                  </div>

                  {/* Right Actions & Status Update */}
                  <div className="flex flex-wrap lg:flex-col items-end gap-2 lg:border-l lg:border-neutral-800 lg:pl-5 shrink-0">
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                      {/* View Shoot Detail Modal Button */}
                      <button
                        onClick={() => onSelectBooking(booking)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-3.5 py-2 text-xs transition-colors shadow-sm"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Chi tiết buổi chụp</span>
                      </button>

                      {/* Chat by booking Button (Module B) */}
                      <button
                        onClick={() => onOpenChat(booking)}
                        className="flex items-center justify-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 hover:border-amber-400/50 hover:text-amber-300 text-neutral-300 px-3 py-2 text-xs transition-colors"
                        title="Chat nội bộ ca chụp này"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Trao đổi</span>
                      </button>
                    </div>

                    {/* Status change select */}
                    <div className="flex items-center gap-2 text-xs w-full lg:w-auto mt-1">
                      <span className="text-neutral-500 text-[11px]">Trạng thái:</span>
                      <select
                        value={booking.status}
                        onChange={(e) => onStatusChange(booking.id, e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-200 font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="upcoming">Sắp diễn ra</option>
                        <option value="in_progress">Đang chụp</option>
                        <option value="retouched">Đã hậu kỳ</option>
                        <option value="delivered">Đã bàn giao</option>
                      </select>
                    </div>

                    {/* Delivery link preview */}
                    {booking.deliveryLink && (
                      <a
                        href={booking.deliveryLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 mt-1 font-mono"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Link bàn giao file ảnh
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
