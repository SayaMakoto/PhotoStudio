import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Camera,
  Sparkles,
  ChevronRight,
  User,
} from 'lucide-react';

export default function EmployeeDashboardOverview({
  onNavigateTab,
  bookings = [],
  onSelectBooking,
  onOpenIncident,
  onOpenShiftSwap,
}) {
  // Focus shoot today (e.g. first booking or default)
  const currentShoot = bookings[0] || {
    id: 'BK-2026-1042',
    customerName: 'Nguyễn Thúy Hằng & Hoàng Nam',
    packageName: 'Gói Cưới Premium Hàn Quốc',
    room: 'Phòng Studio B • Hoa Cưới & Pastel',
    time: '14:30 - 17:30',
  };

  // Next upcoming shoots (2nd and 3rd bookings)
  const nextShoots = bookings.slice(1, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Ca Trực & Buổi Chụp Trọng Tâm Hôm Nay */}
      <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                <CalendarDays className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#261A1E]">
                Ca Trực Hôm Nay
              </h3>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-semibold text-emerald-700">
              Đang trong ca
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            {/* Shift info badge */}
            <div className="p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#7A6C71]">
                <span className="font-bold text-[#261A1E] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#B85064]" />
                  14:00 - 20:00
                </span>
                <span className="text-[#B85064] font-semibold">Ca chiều</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#7A6C71]">
                <MapPin className="h-3.5 w-3.5 text-[#9E8E93] shrink-0" />
                <span className="truncate">{currentShoot.room}</span>
              </div>
            </div>

            {/* Current Shoot Card */}
            <div className="p-4 rounded-2xl bg-[#FDF0F3]/60 border border-[#F5D5DC] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#B85064] bg-white px-2 py-0.5 rounded-md border border-[#F5D5DC] shadow-sm">
                  {currentShoot.id}
                </span>
                <span className="text-[11px] font-bold text-[#261A1E] flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#B85064]" />
                  {currentShoot.time}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#261A1E]">{currentShoot.packageName}</p>
                <p className="text-xs text-[#7A6C71] mt-0.5 flex items-center gap-1">
                  <User className="h-3 w-3 text-[#9E8E93]" />
                  {currentShoot.customerName}
                </p>
              </div>
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>Thiết bị & bối cảnh đã sẵn sàng</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (onSelectBooking && bookings[0]) {
              onSelectBooking(bookings[0]);
            } else {
              onNavigateTab('schedule');
            }
          }}
          className="flex items-center justify-between w-full pt-3.5 border-t border-[#F0E4E6] text-xs text-[#B85064] hover:text-[#913B4D] font-bold group transition-colors"
        >
          <span>Xem chi tiết ca chụp này</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 2. Ca Chụp Tiếp Theo */}
      <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#261A1E]">
                Ca Chụp Tiếp Theo
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#7A6C71] bg-[#FAF5F5] px-2.5 py-0.5 rounded-full border border-[#F0E4E6]">
              Tuần này
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
                      {shoot.customerName}
                    </span>
                    <span className="font-mono text-[#7A6C71] text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#F0E4E6]">
                      {shoot.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6C71] truncate">
                    {shoot.packageName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#9E8E93] pt-0.5">
                    <span className="truncate">{shoot.room}</span>
                    <ChevronRight className="h-3 w-3 text-[#9E8E93] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#9E8E93] py-6 text-center">
                Chưa có ca chụp nào tiếp theo.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('schedule')}
          className="flex items-center justify-between w-full pt-3.5 border-t border-[#F0E4E6] text-xs text-[#B85064] hover:text-[#913B4D] font-bold group transition-colors"
        >
          <span>Xem toàn bộ lịch phân công</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3. Thiết Bị & Phím Tắt Tác Nghiệp Khẩn */}
      <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                <Camera className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#261A1E]">
                Thiết Bị Đang Giữ
              </h3>
            </div>
            <span className="rounded-full bg-[#FDF0F3] border border-[#F5D5DC] px-2.5 py-0.5 text-[11px] font-bold text-[#B85064]">
              2 món
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            {/* Gear item 1 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#B85064] shrink-0" />
                <span className="font-semibold text-[#261A1E]">Sony Alpha A7IV</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Pin 95%
              </span>
            </div>

            {/* Gear item 2 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B85064] shrink-0" />
                <span className="font-semibold text-[#261A1E]">Lens 50mm f/1.2 GM</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Sẵn sàng
              </span>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 gap-2 pt-1.5">
              <button
                onClick={() => onOpenIncident && onOpenIncident(bookings[0] || null)}
                type="button"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-rose-50/70 border border-rose-200 hover:bg-rose-100/70 text-rose-700 transition-all text-[11px] font-bold"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                <span>Báo sự cố</span>
              </button>

              <button
                onClick={() => onOpenShiftSwap && onOpenShiftSwap()}
                type="button"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] hover:bg-[#FDF0F3] hover:border-[#F5D5DC] text-[#261A1E] transition-all text-[11px] font-bold"
              >
                <RefreshCw className="h-3.5 w-3.5 text-[#B85064]" />
                <span>Đổi ca trực</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('equipment')}
          className="flex items-center justify-between w-full pt-3.5 border-t border-[#F0E4E6] text-xs text-[#B85064] hover:text-[#913B4D] font-bold group transition-colors"
        >
          <span>Xem kho thiết bị & đạo cụ</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
