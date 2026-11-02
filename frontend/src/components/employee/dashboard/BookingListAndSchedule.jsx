import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  DoorOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  CalendarRange,
  ListFilter,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';

const STATUS_LABELS = {
  all: 'Tất cả trạng thái',
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  in_progress: 'Đang chụp',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

// Cấu hình màu sắc biểu thị trạng thái cho thẻ tuần (chỉ dùng màu, không hiện chữ trạng thái)
const getStatusTheme = (status) => {
  switch (status) {
    case 'in_progress':
      return {
        label: 'Đang chụp',
        cardClass: 'bg-purple-50 border-purple-300 hover:border-purple-500 hover:bg-purple-100/90 text-purple-900',
        dotClass: 'bg-purple-600 animate-pulse',
        timeClass: 'text-purple-700 font-bold',
      };
    case 'confirmed':
      return {
        label: 'Đã xác nhận',
        cardClass: 'bg-sky-50 border-sky-300 hover:border-sky-500 hover:bg-sky-100/90 text-sky-900',
        dotClass: 'bg-sky-600',
        timeClass: 'text-sky-700 font-bold',
      };
    case 'completed':
      return {
        label: 'Hoàn thành',
        cardClass: 'bg-emerald-50 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-100/90 text-emerald-900',
        dotClass: 'bg-emerald-600',
        timeClass: 'text-emerald-700 font-bold',
      };
    case 'cancelled':
      return {
        label: 'Đã hủy',
        cardClass: 'bg-rose-50 border-rose-300 hover:border-rose-500 hover:bg-rose-100/90 text-rose-900',
        dotClass: 'bg-rose-600',
        timeClass: 'text-rose-700 font-bold',
      };
    default:
      return {
        label: 'Chờ xử lý',
        cardClass: 'bg-amber-50 border-amber-300 hover:border-amber-500 hover:bg-amber-100/90 text-amber-900',
        dotClass: 'bg-amber-600',
        timeClass: 'text-amber-700 font-bold',
      };
  }
};

// Hàm lấy ngày đầu tuần (Thứ 2) của 1 ngày bất kỳ
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

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

// Phân loại ca theo khung giờ: Sáng, Chiều, Tối
function getShiftType(startTime) {
  if (!startTime) return 'morning';
  const hour = parseInt(String(startTime).slice(0, 2), 10);
  if (isNaN(hour) || hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default function BookingListAndSchedule({
  bookings = [],
  onSelectBooking,
}) {
  // MẶC ĐỊNH LÀ THEO NGÀY theo yêu cầu người dùng
  const [viewMode, setViewMode] = useState('day');

  // Tuần hiện tại đang xem (bắt đầu từ Thứ 2)
  const [currentWeekMonday, setCurrentWeekMonday] = useState(() => getMonday(new Date()));

  // Ngày hiện tại đang chọn cho chế độ 'day' (mặc định hôm nay)
  const [selectedDay, setSelectedDay] = useState(() => new Date());

  // Lọc trạng thái
  const [statusFilter, setStatusFilter] = useState('all');

  // Điều hướng tuần
  const handlePrevWeek = () => {
    setCurrentWeekMonday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekMonday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleTodayWeek = () => {
    const today = new Date();
    setCurrentWeekMonday(getMonday(today));
    setSelectedDay(today);
  };

  // 7 ngày trong tuần
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekMonday);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentWeekMonday]);

  // Lọc bookings theo trạng thái (bỏ ca đã hủy)
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (b.status === 'cancelled') return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      return true;
    });
  }, [bookings, statusFilter]);

  // Gom bookings theo ngày và phân theo ca (morning, afternoon, evening)
  const bookingsByDateAndShift = useMemo(() => {
    const map = {};
    filteredBookings.forEach((b) => {
      if (!b.bookingDate) return;
      const key = toDateKey(b.bookingDate);
      if (!map[key]) {
        map[key] = { morning: [], afternoon: [], evening: [] };
      }
      const shift = getShiftType(b.startTime);
      map[key][shift].push(b);
    });

    // Sắp xếp ca theo giờ
    Object.keys(map).forEach((k) => {
      ['morning', 'afternoon', 'evening'].forEach((s) => {
        map[k][s].sort((a, b) => String(a.startTime || '').localeCompare(String(b.startTime || '')));
      });
    });

    return map;
  }, [filteredBookings]);

  // Format giờ gọn gàng
  const formatTimeRange = (start, end) => {
    if (!start && !end) return 'Chưa xếp giờ';
    const s = String(start || '').slice(0, 5);
    const e = String(end || '').slice(0, 5);
    return `${s || '—'} - ${e || '—'}`;
  };

  const todayKey = toDateKey(new Date());
  const selectedDayKey = toDateKey(selectedDay);
  const selectedDayData = bookingsByDateAndShift[selectedDayKey] || {
    morning: [],
    afternoon: [],
    evening: [],
  };
  const totalDayShoots =
    selectedDayData.morning.length +
    selectedDayData.afternoon.length +
    selectedDayData.evening.length;

  return (
    <div className="space-y-6">
      {/* Thanh điều khiển: Chuyển đổi Theo Ngày / Theo Tuần & Lọc */}
      <div className="rounded-3xl border border-[#F0E4E6] bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Switcher Chế độ xem: Mặc định Theo Ngày */}
          <div className="flex items-center bg-[#FAF5F5] p-1 rounded-2xl border border-[#F0E4E6] self-start">
            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-[#B85064] shadow-sm border border-[#F0E4E6]'
                  : 'text-[#7A6C71] hover:text-[#261A1E]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Xem Theo Ngày</span>
            </button>

            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-[#B85064] shadow-sm border border-[#F0E4E6]'
                  : 'text-[#7A6C71] hover:text-[#261A1E]'
              }`}
            >
              <CalendarRange className="w-4 h-4" />
              <span>Xem Theo Tuần</span>
            </button>
          </div>

          {/* Điều hướng thời gian */}
          {viewMode === 'day' ? (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <input
                type="date"
                value={selectedDayKey}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDay(new Date(e.target.value));
                  }
                }}
                className="rounded-xl border border-[#F0E4E6] bg-[#FAF5F5] px-3 py-1.5 text-xs font-bold text-[#261A1E] focus:outline-none focus:ring-1 focus:ring-[#B85064]"
              />
              <button
                onClick={() => setSelectedDay(new Date())}
                className="px-3 py-1.5 rounded-xl border border-[#F5D5DC] bg-[#FDF0F3] text-xs font-bold text-[#B85064] hover:bg-rose-100/60 transition-all"
              >
                Hôm Nay
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={handlePrevWeek}
                className="p-2 rounded-xl border border-[#F0E4E6] bg-[#FAF5F5] hover:bg-white text-[#261A1E] transition-all"
                title="Tuần trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleTodayWeek}
                className="px-3 py-1.5 rounded-xl border border-[#F5D5DC] bg-[#FDF0F3] text-xs font-bold text-[#B85064] hover:bg-rose-100/60 transition-all"
              >
                Tuần Này
              </button>

              <span className="text-xs font-bold text-[#261A1E] px-2">
                Tuần: {weekDays[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} –{' '}
                {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>

              <button
                onClick={handleNextWeek}
                className="p-2 rounded-xl border border-[#F0E4E6] bg-[#FAF5F5] hover:bg-white text-[#261A1E] transition-all"
                title="Tuần sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Lọc trạng thái */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <ListFilter className="w-4 h-4 text-[#7A6C71]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#F0E4E6] bg-[#FAF5F5] px-3 py-1.5 text-xs font-semibold text-[#261A1E] focus:border-[#B85064] focus:bg-white focus:outline-none transition-all"
            >
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CHẾ ĐỘ 1: XEM THEO NGÀY (MẶC ĐỊNH) */}
      {viewMode === 'day' && (
        <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E6]">
            <div>
              <h3 className="text-base font-bold text-[#261A1E]">
                Lịch Chụp Ngày {selectedDay.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </h3>
              <p className="text-xs text-[#7A6C71]">
                {totalDayShoots > 0 ? `Tổng cộng ${totalDayShoots} ca chụp trong ngày.` : 'Không có ca chụp nào trong ngày.'}
              </p>
            </div>
            {selectedDayKey === todayKey && (
              <span className="rounded-full bg-[#FDF0F3] border border-[#F5D5DC] px-3 py-1 text-xs font-bold text-[#B85064]">
                Hôm Nay
              </span>
            )}
          </div>

          {/* Phân 3 ca Sáng - Chiều - Tối */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Ca Sáng */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF5F5]/70 border border-[#F0E4E6]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0E4E6] text-amber-700">
                <Sun className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Ca Sáng (Trước 12:00)
                </span>
                <span className="ml-auto text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#F0E4E6] text-[#7A6C71]">
                  {selectedDayData.morning.length} ca
                </span>
              </div>

              {selectedDayData.morning.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedDayData.morning.map((shoot) => (
                    <div
                      key={shoot.id}
                      onClick={() => onSelectBooking && onSelectBooking(shoot)}
                      className="p-3.5 rounded-2xl bg-white border border-[#F0E4E6] hover:border-[#B85064] hover:shadow-sm cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-[#B85064] font-bold font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimeRange(shoot.startTime, shoot.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#261A1E] font-semibold truncate">
                        <DoorOpen className="w-3.5 h-3.5 text-[#9E8E93]" />
                        <span>{shoot.roomName || (shoot.roomId ? `Phòng #${shoot.roomId}` : 'Studio Photo')}</span>
                      </div>
                      <div className="pt-1.5 border-t border-[#F0E4E6] flex items-center justify-between text-[11px] font-bold text-[#B85064]">
                        <span>Xem chi tiết</span>
                        <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-[#9E8E93] italic">
                  Trống ca sáng
                </p>
              )}
            </div>

            {/* 2. Ca Chiều */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF5F5]/70 border border-[#F0E4E6]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0E4E6] text-rose-700">
                <Sunset className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Ca Chiều (12:00 - 18:00)
                </span>
                <span className="ml-auto text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#F0E4E6] text-[#7A6C71]">
                  {selectedDayData.afternoon.length} ca
                </span>
              </div>

              {selectedDayData.afternoon.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedDayData.afternoon.map((shoot) => (
                    <div
                      key={shoot.id}
                      onClick={() => onSelectBooking && onSelectBooking(shoot)}
                      className="p-3.5 rounded-2xl bg-white border border-[#F0E4E6] hover:border-[#B85064] hover:shadow-sm cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-[#B85064] font-bold font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimeRange(shoot.startTime, shoot.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#261A1E] font-semibold truncate">
                        <DoorOpen className="w-3.5 h-3.5 text-[#9E8E93]" />
                        <span>{shoot.roomName || (shoot.roomId ? `Phòng #${shoot.roomId}` : 'Studio Photo')}</span>
                      </div>
                      <div className="pt-1.5 border-t border-[#F0E4E6] flex items-center justify-between text-[11px] font-bold text-[#B85064]">
                        <span>Xem chi tiết</span>
                        <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-[#9E8E93] italic">
                  Trống ca chiều
                </p>
              )}
            </div>

            {/* 3. Ca Tối */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF5F5]/70 border border-[#F0E4E6]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0E4E6] text-indigo-700">
                <Moon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Ca Tối (Sau 18:00)
                </span>
                <span className="ml-auto text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#F0E4E6] text-[#7A6C71]">
                  {selectedDayData.evening.length} ca
                </span>
              </div>

              {selectedDayData.evening.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedDayData.evening.map((shoot) => (
                    <div
                      key={shoot.id}
                      onClick={() => onSelectBooking && onSelectBooking(shoot)}
                      className="p-3.5 rounded-2xl bg-white border border-[#F0E4E6] hover:border-[#B85064] hover:shadow-sm cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-[#B85064] font-bold font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimeRange(shoot.startTime, shoot.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#261A1E] font-semibold truncate">
                        <DoorOpen className="w-3.5 h-3.5 text-[#9E8E93]" />
                        <span>{shoot.roomName || (shoot.roomId ? `Phòng #${shoot.roomId}` : 'Studio Photo')}</span>
                      </div>
                      <div className="pt-1.5 border-t border-[#F0E4E6] flex items-center justify-between text-[11px] font-bold text-[#B85064]">
                        <span>Xem chi tiết</span>
                        <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-[#9E8E93] italic">
                  Trống ca tối
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHẾ ĐỘ 2: XEM THEO TUẦN (MA TRẬN CỐ ĐỊNH 3 HÀNG SÁNG - CHIỀU - TỐI X 7 CỘT THUẬN MẮT) */}
      {viewMode === 'week' && (
        <div className="space-y-4">
          {/* Chú thích màu sắc nhỏ gọn (Legend) */}
          <div className="flex flex-wrap items-center justify-end gap-3 px-1 text-[11px] font-semibold text-[#7A6C71]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
              Đang chụp
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              Đã xác nhận
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              Chờ xử lý
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Hoàn thành
            </span>
          </div>

          {/* Ma trận bảng lịch cố định */}
          <div className="overflow-x-auto rounded-3xl border border-[#F0E4E6] bg-white shadow-sm">
            <table className="w-full border-collapse text-left min-w-[850px]">
              {/* Header: 7 Cột Ngày */}
              <thead>
                <tr className="border-b border-[#F0E4E6] bg-[#FAF5F5]">
                  <th className="w-28 p-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#7A6C71] border-r border-[#F0E4E6]">
                    Ca / Ngày
                  </th>
                  {weekDays.map((day) => {
                    const dateKey = toDateKey(day);
                    const isToday = dateKey === todayKey;
                    const dayName = day.toLocaleDateString('vi-VN', { weekday: 'short' });
                    const dateDisplay = day.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

                    return (
                      <th
                        key={dateKey}
                        className={`p-3 text-center border-r border-[#F0E4E6] last:border-r-0 transition-colors ${
                          isToday ? 'bg-[#FDF0F3]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6C71]">
                            {dayName}
                          </span>
                          {isToday && (
                            <span className="text-[9px] font-extrabold text-[#B85064] bg-white px-1.5 py-0.2 rounded-full border border-[#F5D5DC]">
                              Hôm nay
                            </span>
                          )}
                        </div>
                        <p className={`text-sm font-extrabold mt-0.5 ${isToday ? 'text-[#B85064]' : 'text-[#261A1E]'}`}>
                          {dateDisplay}
                        </p>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Body: 3 Hàng Cố Định: Sáng, Chiều, Tối */}
              <tbody className="divide-y divide-[#F0E4E6]">
                {/* HÀNG 1: CA SÁNG */}
                <tr>
                  <td className="p-3.5 border-r border-[#F0E4E6] bg-[#FAF5F5]/60 text-center align-middle">
                    <div className="flex flex-col items-center gap-1 text-amber-700">
                      <Sun className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase">Sáng</span>
                      <span className="text-[10px] text-[#9E8E93] font-medium">&lt; 12:00</span>
                    </div>
                  </td>
                  {weekDays.map((day) => {
                    const dateKey = toDateKey(day);
                    const shoots = bookingsByDateAndShift[dateKey]?.morning || [];
                    const isToday = dateKey === todayKey;

                    return (
                      <td
                        key={dateKey}
                        className={`p-2 border-r border-[#F0E4E6] last:border-r-0 align-top min-w-[105px] h-24 ${
                          isToday ? 'bg-[#FDF0F3]/20' : ''
                        }`}
                      >
                        {shoots.length > 0 ? (
                          <div className="space-y-1.5">
                            {shoots.map((shoot) => {
                              const theme = getStatusTheme(shoot.status);
                              return (
                                <div
                                  key={shoot.id}
                                  onClick={() => onSelectBooking && onSelectBooking(shoot)}
                                  className={`px-2 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs group flex items-center justify-center gap-1.5 ${theme.cardClass}`}
                                  title={`Ca chụp: ${theme.label} (Bấm xem chi tiết)`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dotClass}`}></span>
                                  <span className={`font-mono text-[11px] ${theme.timeClass}`}>
                                    {formatTimeRange(shoot.startTime, shoot.endTime)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[#D0C4C7] font-mono text-xs select-none">
                            —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* HÀNG 2: CA CHIỀU */}
                <tr>
                  <td className="p-3.5 border-r border-[#F0E4E6] bg-[#FAF5F5]/60 text-center align-middle">
                    <div className="flex flex-col items-center gap-1 text-rose-700">
                      <Sunset className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase">Chiều</span>
                      <span className="text-[10px] text-[#9E8E93] font-medium">12h - 18h</span>
                    </div>
                  </td>
                  {weekDays.map((day) => {
                    const dateKey = toDateKey(day);
                    const shoots = bookingsByDateAndShift[dateKey]?.afternoon || [];
                    const isToday = dateKey === todayKey;

                    return (
                      <td
                        key={dateKey}
                        className={`p-2 border-r border-[#F0E4E6] last:border-r-0 align-top min-w-[105px] h-24 ${
                          isToday ? 'bg-[#FDF0F3]/20' : ''
                        }`}
                      >
                        {shoots.length > 0 ? (
                          <div className="space-y-1.5">
                            {shoots.map((shoot) => {
                              const theme = getStatusTheme(shoot.status);
                              return (
                                <div
                                  key={shoot.id}
                                  onClick={() => onSelectBooking && onSelectBooking(shoot)}
                                  className={`px-2 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs group flex items-center justify-center gap-1.5 ${theme.cardClass}`}
                                  title={`Ca chụp: ${theme.label} (Bấm xem chi tiết)`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dotClass}`}></span>
                                  <span className={`font-mono text-[11px] ${theme.timeClass}`}>
                                    {formatTimeRange(shoot.startTime, shoot.endTime)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[#D0C4C7] font-mono text-xs select-none">
                            —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* HÀNG 3: CA TỐI */}
                <tr>
                  <td className="p-3.5 border-r border-[#F0E4E6] bg-[#FAF5F5]/60 text-center align-middle">
                    <div className="flex flex-col items-center gap-1 text-indigo-700">
                      <Moon className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase">Tối</span>
                      <span className="text-[10px] text-[#9E8E93] font-medium">&gt; 18:00</span>
                    </div>
                  </td>
                  {weekDays.map((day) => {
                    const dateKey = toDateKey(day);
                    const shoots = bookingsByDateAndShift[dateKey]?.evening || [];
                    const isToday = dateKey === todayKey;

                    return (
                      <td
                        key={dateKey}
                        className={`p-2 border-r border-[#F0E4E6] last:border-r-0 align-top min-w-[105px] h-24 ${
                          isToday ? 'bg-[#FDF0F3]/20' : ''
                        }`}
                      >
                        {shoots.length > 0 ? (
                          <div className="space-y-1.5">
                            {shoots.map((shoot) => {
                              const theme = getStatusTheme(shoot.status);
                              return (
                                <div
                                  key={shoot.id}
                                  onClick={() => onSelectBooking && onSelectBooking(shoot)}
                                  className={`px-2 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs group flex items-center justify-center gap-1.5 ${theme.cardClass}`}
                                  title={`Ca chụp: ${theme.label} (Bấm xem chi tiết)`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dotClass}`}></span>
                                  <span className={`font-mono text-[11px] ${theme.timeClass}`}>
                                    {formatTimeRange(shoot.startTime, shoot.endTime)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[#D0C4C7] font-mono text-xs select-none">
                            —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
