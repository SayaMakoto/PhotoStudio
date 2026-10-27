import React from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Camera,
  Sparkles
} from 'lucide-react';
import { EMPLOYEE_KPIS } from '../employeeData';

export default function EmployeeDashboardOverview({ profile, onNavigateTab }) {
  const displayName = profile?.fullname || profile?.username || 'Nhân viên';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Ca Trực & Buổi Chụp Hôm Nay */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-amber-400" />
              <span>Ca Trực Hôm Nay</span>
            </h3>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Đang trong ca
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            {/* Shift info */}
            <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-semibold text-white flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  14:00 - 20:00
                </span>
                <span className="text-amber-400 font-medium">Ca chiều</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                <span>Phòng Studio B • Hoa Cưới & Ánh Sáng Pastel</span>
              </div>
            </div>

            {/* Upcoming Shoot */}
            <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  BK-2026-1042
                </span>
                <span className="text-[11px] font-bold text-white">14:30 - 17:30</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">Gói Cưới Premium Hàn Quốc</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Khách: Nguyễn Thúy Hằng & Hoàng Nam</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>Thiết bị & bối cảnh đã chuẩn bị xong</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('schedule')}
          className="flex items-center justify-between w-full pt-3 border-t border-neutral-800/80 text-xs text-amber-400 hover:text-amber-300 font-semibold group transition-colors"
        >
          <span>Xem chi tiết danh sách ca chụp</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 2. Chỉ Tiêu & Hiệu Suất Tác Nghiệp Tháng */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>Tiến Độ Tháng 10</span>
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              Mục tiêu: 26 ca
            </span>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            {/* Progress metric 1 */}
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Ca hoàn thành chỉ tiêu</span>
                <span className="font-bold text-white font-mono">
                  {EMPLOYEE_KPIS.completedBookings} / {EMPLOYEE_KPIS.targetBookings} ca
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                  style={{ width: `${Math.round((EMPLOYEE_KPIS.completedBookings / EMPLOYEE_KPIS.targetBookings) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric Stats */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-center">
                <p className="text-[11px] text-neutral-400">Đánh giá khách</p>
                <p className="text-base font-bold text-amber-400 mt-0.5">★ 4.95 / 5.0</p>
                <p className="text-[10px] text-neutral-500">142 lượt chấm</p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-center">
                <p className="text-[11px] text-neutral-400">Trả ảnh đúng hẹn</p>
                <p className="text-base font-bold text-emerald-400 mt-0.5">100%</p>
                <p className="text-[10px] text-neutral-500">0 trễ deadline</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Hoa hồng dự kiến tháng:</span>
              <span className="font-bold font-mono text-emerald-400 text-xs">
                {new Intl.NumberFormat('vi-VN').format(EMPLOYEE_KPIS.commission)} đ
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('reviews')}
          className="flex items-center justify-between w-full pt-3 border-t border-neutral-800/80 text-xs text-amber-400 hover:text-amber-300 font-semibold group transition-colors"
        >
          <span>Xem đánh giá từ khách hàng</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3. Tình Trạng Thiết Bị & Quy Chuẩn Studio */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-sky-400" />
              <span>Thiết Bị Tác Nghiệp</span>
            </h3>
            <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-400">
              3 món đang giữ
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            {/* Gear item 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-white">Body Sony Alpha A7IV</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Sẵn sàng
              </span>
            </div>

            {/* Gear item 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-400 shrink-0" />
                <span className="font-semibold text-white">Lens Sony FE 50mm f/1.2 GM</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Hoàn hảo
              </span>
            </div>

            {/* Guidelines Reminder */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-[11px] text-neutral-300">
              <p className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>Quy chuẩn tác nghiệp Studio</span>
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Luôn kiểm tra pin dự phòng trước 15 phút và sao lưu file RAW vào máy chủ ngay sau khi kết thúc buổi chụp.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('equipment')}
          className="flex items-center justify-between w-full pt-3 border-t border-neutral-800/80 text-xs text-amber-400 hover:text-amber-300 font-semibold group transition-colors"
        >
          <span>Quản lý thiết bị & báo hỏng</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
