<<<<<<< HEAD
import React, { useMemo } from 'react';
=======
>>>>>>> origin/main
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Camera,
  ChevronRight,
  User,
} from 'lucide-react';

export default function EmployeeDashboardOverview({
  onNavigateTab,
  bookings = [],
  equipments = [],
  onSelectBooking,
}) {
  // Ưu tiên ca đang chụp hoặc ca đã xác nhận gần nhất lên đầu
  const sortedShoots = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const order = { in_progress: 1, confirmed: 2, pending: 3, completed: 4, cancelled: 5 };
      const statusDiff = (order[a.status] || 99) - (order[b.status] || 99);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0);
    });
  }, [bookings]);

  const currentShoot = sortedShoots.length > 0 ? sortedShoots[0] : null;
  const nextShoots = sortedShoots.length > 1 ? sortedShoots.slice(1, 4) : [];
  const topEquipments = equipments.slice(0, 3);

  const formatTimeRange = (start, end) => {
    if (!start && !end) return 'Chưa xếp giờ';
    return `${start || '—'} - ${end || '—'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Ca Trực & Buổi Chụp Trọng Tâm Từ CSDL */}
      <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                <CalendarDays className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#261A1E]">
                Ca Chụp Gần Nhất
              </h3>
            </div>
            {currentShoot && (
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-semibold text-emerald-700">
                {currentShoot.status === 'in_progress' ? 'Đang chụp' : (currentShoot.status || 'Chờ chụp')}
              </span>
            )}
          </div>

          <div className="mt-4 space-y-3 text-xs">
            {currentShoot ? (
              <div className="p-4 rounded-2xl bg-[#FDF0F3]/60 border border-[#F5D5DC] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#B85064] bg-white px-2 py-0.5 rounded-md border border-[#F5D5DC] shadow-sm">
                    #{currentShoot.id}
                  </span>
                  <span className="text-[11px] font-bold text-[#261A1E] flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#B85064]" />
                    {formatTimeRange(currentShoot.startTime, currentShoot.endTime)}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-bold text-[#261A1E]">
                    {currentShoot.roomName || 'Studio Photo'}
                  </p>
                  <p className="text-xs text-[#7A6C71] mt-0.5 flex items-center gap-1">
                    <User className="h-3 w-3 text-[#9E8E93]" />
                    {currentShoot.customerName || 'Khách hàng'}
                    {currentShoot.customerPhone && (
                      <span className="text-[#9E8E93] font-mono">({currentShoot.customerPhone})</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#7A6C71]">
                  <MapPin className="h-3.5 w-3.5 text-[#9E8E93] shrink-0" />
                  <span>Ngày chụp: {formatDate(currentShoot.bookingDate)}</span>
                </div>

                {currentShoot.customerNote && (
                  <p className="text-[11px] text-[#7A6C71] bg-white/80 p-2 rounded-xl border border-[#F0E4E6] line-clamp-2">
                    Ghi chú: {currentShoot.customerNote}
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#9E8E93] bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6] p-4">
                Hiện tại chưa có ca chụp nào trong CSDL.
              </div>
            )}
          </div>
        </div>

        {currentShoot ? (
          <button
            onClick={() => onSelectBooking && onSelectBooking(currentShoot)}
            className="flex items-center justify-between w-full pt-3.5 border-t border-[#F0E4E6] text-xs text-[#B85064] hover:text-[#913B4D] font-bold group transition-colors"
          >
            <span>Xem chi tiết ca chụp này</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            onClick={() => onNavigateTab('schedule')}
            className="flex items-center justify-between w-full pt-3.5 border-t border-[#F0E4E6] text-xs text-[#B85064] hover:text-[#913B4D] font-bold group transition-colors"
          >
            <span>Mở danh sách lịch chụp</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* 2. Các Ca Chụp Tiếp Theo Từ CSDL */}
      <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#261A1E]">
                Lịch Chụp Khác Trong CSDL
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#7A6C71] bg-[#FAF5F5] px-2.5 py-0.5 rounded-full border border-[#F0E4E6]">
              {bookings.length} ca
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            {nextShoots.length > 0 ? (
              nextShoots.map((shoot) => (
                <div
                  key={shoot.id}
                  onClick={() => onSelectBooking && onSelectBooking(shoot)}
                  className="p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] hover:border-[#B85064]/50 hover:bg-[#FDF0F3]/40 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#261A1E] group-hover:text-[#B85064] transition-colors">
                      {shoot.customerName || `Đơn #${shoot.id}`}
                    </span>
                    <span className="font-mono text-[#7A6C71] text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#F0E4E6]">
                      {formatTimeRange(shoot.startTime, shoot.endTime)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6C71] truncate">
                    {shoot.roomName || 'Phòng chụp studio'} • {formatDate(shoot.bookingDate)}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#9E8E93] pt-0.5">
                    <span className="capitalize">{shoot.status || 'Chờ xử lý'}</span>
                    <ChevronRight className="h-3 w-3 text-[#9E8E93] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#9E8E93] py-8 text-center bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
                {bookings.length <= 1
                  ? 'Chưa có thêm ca chụp nào khác.'
                  : 'Không có ca chụp tiếp theo.'}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('schedule')}
          className="flex items-center justify-between w-full pt-3.5 border-t border-[#F0E4E6] text-xs text-[#B85064] hover:text-[#913B4D] font-bold group transition-colors"
        >
          <span>Xem toàn bộ lịch trong CSDL</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3. Thiết Bị Từ Bảng equipments Trong CSDL */}
      <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                <Camera className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#261A1E]">
                Thiết Bị Trong CSDL
              </h3>
            </div>
            <span className="rounded-full bg-[#FDF0F3] border border-[#F5D5DC] px-2.5 py-0.5 text-[11px] font-bold text-[#B85064]">
              {equipments.length} món
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            {topEquipments.length > 0 ? (
              topEquipments.map((eq) => (
                <div
                  key={eq.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Camera className="h-4 w-4 text-[#B85064] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#261A1E] truncate">{eq.name}</p>
                      <p className="text-[10px] text-[#7A6C71] font-mono">
                        {eq.serialNumber || eq.brand || eq.type}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      eq.status === 'available'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-amber-700 bg-amber-50 border-amber-200'
                    }`}
                  >
                    {eq.status === 'available' ? 'Sẵn sàng' : (eq.status || 'Đang dùng')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#9E8E93] py-8 text-center bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
                Chưa có thiết bị nào trong CSDL.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('equipment')}
          className="flex items-center justify-between w-full pt-3.5 border-t border-[#F0E4E6] text-xs text-[#B85064] hover:text-[#913B4D] font-bold group transition-colors"
        >
          <span>Xem tất cả thiết bị ({equipments.length})</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
