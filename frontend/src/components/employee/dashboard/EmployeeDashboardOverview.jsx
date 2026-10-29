import React, { useMemo } from 'react';
import {
  Clock,
  DoorOpen,
  ArrowRight,
  CalendarCheck2,
} from 'lucide-react';

// Format YYYY-MM-DD
function toDateKey(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function EmployeeDashboardOverview({
  onNavigateTab,
  bookings = [],
  onSelectBooking,
}) {
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const formatTimeRange = (start, end) => {
    if (!start && !end) return 'Chưa xếp giờ';
    const s = String(start || '').slice(0, 5);
    const e = String(end || '').slice(0, 5);
    return `${s || '—'} - ${e || '—'}`;
  };

  // Các ca chụp trong ngày hôm nay (không tính ca đã hủy)
  const todayShoots = useMemo(() => {
    return bookings
      .filter((b) => toDateKey(b.bookingDate) === todayKey && b.status !== 'cancelled')
      .sort((a, b) => String(a.startTime || '').localeCompare(String(b.startTime || '')));
  }, [bookings, todayKey]);

  return (
    <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-sm space-y-5">
      {/* Header khối ca chụp trong ngày */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#F0E4E6]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
            <CalendarCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#261A1E]">
              Ca Chụp Trong Ngày
            </h2>
            <p className="text-[11px] text-[#7A6C71]">
              Hôm nay: {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Đường dẫn sang phần lịch chụp */}
        <button
          onClick={() => onNavigateTab && onNavigateTab('schedule')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B85064] hover:text-[#913B4D] hover:underline self-start sm:self-auto group"
        >
          <span>Xem trang lịch chụp</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Danh sách các ca chụp trong ngày - Chỉ hiện 2 thông tin: Thời gian & Phòng chụp */}
      {todayShoots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayShoots.map((shoot) => (
            <div
              key={shoot.id}
              onClick={() => onSelectBooking && onSelectBooking(shoot)}
              className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] hover:border-[#B85064] hover:bg-[#FDF0F3]/40 cursor-pointer transition-all space-y-2.5 group shadow-sm"
            >
              {/* 1. Thời gian */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B85064] shrink-0" />
                <span className="font-mono text-sm font-bold text-[#261A1E]">
                  {formatTimeRange(shoot.startTime, shoot.endTime)}
                </span>
              </div>

              {/* 2. Phòng chụp */}
              <div className="flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-[#9E8E93] shrink-0" />
                <span className="text-xs font-semibold text-[#261A1E] truncate">
                  {shoot.roomName || (shoot.roomId ? `Phòng #${shoot.roomId}` : 'Studio Photo')}
                </span>
              </div>

              <div className="pt-2 border-t border-[#F0E4E6] flex items-center justify-between text-[11px] font-bold text-[#B85064]">
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-xs text-[#9E8E93] bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
          Hôm nay không có ca chụp nào được xếp lịch.
        </div>
      )}
    </div>
  );
}
