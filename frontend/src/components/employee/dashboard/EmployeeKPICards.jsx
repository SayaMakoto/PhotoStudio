import React from 'react';
import { Camera, Target, DollarSign, Star, Bell, TrendingUp, Award, Clock } from 'lucide-react';
import SpotlightCard from '../../cards/SpotlightCard';
import CountUp from '../../animations/CountUp';
import { EMPLOYEE_KPIS } from '../employeeData';

export default function EmployeeKPICards({ onOpenTab }) {
  const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num) + ' đ';

  const shiftProgress = Math.round((EMPLOYEE_KPIS.shiftsThisMonth / EMPLOYEE_KPIS.targetShifts) * 100);
  const bookingProgress = Math.round((EMPLOYEE_KPIS.completedBookings / EMPLOYEE_KPIS.targetBookings) * 100);

  return (
    <div className="space-y-4">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Ca Chụp & Tiến Độ */}
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.15)"
          className="p-5 border-neutral-800 bg-neutral-900/60"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Ca chụp hoàn thành</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Camera className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              <CountUp to={EMPLOYEE_KPIS.completedBookings} duration={1.5} />
            </span>
            <span className="text-xs text-neutral-400 font-mono">/ {EMPLOYEE_KPIS.targetBookings} ca</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Tiến độ chỉ tiêu</span>
              <span className="font-semibold text-amber-400">{bookingProgress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                style={{ width: `${Math.min(bookingProgress, 100)}%` }}
              />
            </div>
          </div>
        </SpotlightCard>

        {/* 2. Hoa Hồng Tạm Tính */}
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.15)"
          className="p-5 border-neutral-800 bg-neutral-900/60"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Hoa hồng tháng 10</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              <CountUp to={EMPLOYEE_KPIS.commission / 1000000} duration={1.5} />
            </span>
            <span className="text-sm font-bold text-emerald-400">Triệu đ</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-400 pt-2 border-t border-neutral-800 flex items-center justify-between">
            <span>Lương cứng: 12.0M</span>
            <span className="text-emerald-400 font-medium">+3.5M dự kiến thưởng</span>
          </p>
        </SpotlightCard>

        {/* 3. Điểm Đánh Giá & Uy Tín */}
        <SpotlightCard
          spotlightColor="rgba(234, 179, 8, 0.15)"
          className="p-5 border-neutral-800 bg-neutral-900/60"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Điểm đánh giá trung bình</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-300 font-mono">
              {EMPLOYEE_KPIS.ratingScore}
            </span>
            <span className="text-xs text-neutral-400">/ 5.0 (Tuyệt vời)</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-400 pt-2 border-t border-neutral-800 flex items-center justify-between">
            <span>142 lượt feedback</span>
            <span className="text-amber-300 font-medium">99.2% hài lòng</span>
          </p>
        </SpotlightCard>

        {/* 4. Thông Báo & Chỉ Đạo Chưa Đọc */}
        <SpotlightCard
          spotlightColor="rgba(59, 130, 246, 0.15)"
          className="p-5 border-neutral-800 bg-neutral-900/60 cursor-pointer hover:border-neutral-700 transition-colors"
          onClick={() => onOpenTab && onOpenTab('notifications')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Chỉ đạo & Thông báo</span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Bell className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {EMPLOYEE_KPIS.unreadNotifications}
            </span>
            <span className="text-xs text-amber-400 font-semibold">tin mới cần xử lý</span>
          </div>
          <p className="mt-3 text-[11px] text-blue-400 pt-2 border-t border-neutral-800 hover:underline">
            Xem ngay chỉ đạo từ Admin & Điều phối →
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}
