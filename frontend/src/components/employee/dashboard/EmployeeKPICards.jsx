import React from 'react';
import { Camera, CalendarDays, DollarSign, Star, TrendingUp, Award } from 'lucide-react';
import SpotlightCard from '../../cards/SpotlightCard';
import CountUp from '../../animations/CountUp';
import { EMPLOYEE_KPIS } from '../employeeData';

export default function EmployeeKPICards({ onOpenTab }) {
  const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num) + ' đ';

  const bookingProgress = Math.round(
    (EMPLOYEE_KPIS.completedBookings / EMPLOYEE_KPIS.targetBookings) * 100
  );
  const shiftProgress = Math.round(
    (EMPLOYEE_KPIS.shiftsThisMonth / EMPLOYEE_KPIS.targetShifts) * 100
  );

  const cards = [
    {
      title: 'Ca Chụp Hoàn Thành',
      value: EMPLOYEE_KPIS.completedBookings,
      targetText: `/ ${EMPLOYEE_KPIS.targetBookings} ca`,
      progress: bookingProgress,
      progressLabel: 'Tiến độ chỉ tiêu',
      icon: Camera,
      color: 'amber',
      spotlight: 'rgba(245, 158, 11, 0.15)',
      tab: 'schedule',
    },
    {
      title: 'Ca Trực Đã Hoàn Thành',
      value: EMPLOYEE_KPIS.shiftsThisMonth,
      targetText: `/ ${EMPLOYEE_KPIS.targetShifts} ca trực`,
      progress: shiftProgress,
      progressLabel: 'Lịch trực tháng',
      icon: CalendarDays,
      color: 'blue',
      spotlight: 'rgba(59, 130, 246, 0.15)',
      tab: 'schedule',
    },
    {
      title: 'Hoa Hồng Tạm Tính',
      customValue: formatVND(EMPLOYEE_KPIS.commission),
      subtext: `Lương cứng: ${formatVND(EMPLOYEE_KPIS.baseSalary)}`,
      icon: DollarSign,
      color: 'emerald',
      spotlight: 'rgba(16, 185, 129, 0.15)',
      tab: 'profile',
    },
    {
      title: 'Đánh Giá Khách Hàng',
      customValue: `${EMPLOYEE_KPIS.ratingScore} / 5.0`,
      subtext: `Từ ${EMPLOYEE_KPIS.ratingTotalCount} lượt đánh giá thực tế`,
      icon: Star,
      color: 'purple',
      spotlight: 'rgba(168, 85, 247, 0.15)',
      tab: 'reviews',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <SpotlightCard
            key={idx}
            spotlightColor={card.spotlight}
            className="p-5 border-neutral-800 bg-neutral-900/60 backdrop-blur-md cursor-pointer hover:border-neutral-700 transition-colors"
            onClick={() => onOpenTab && card.tab && onOpenTab(card.tab)}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">{card.title}</span>
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center border ${
                  card.color === 'amber'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : card.color === 'blue'
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    : card.color === 'emerald'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              {card.customValue ? (
                <div className="text-2xl font-bold font-mono tracking-tight text-white">
                  {card.customValue}
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    <CountUp to={card.value} duration={1.2} />
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">{card.targetText}</span>
                </div>
              )}
            </div>

            {card.progress !== undefined ? (
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>{card.progressLabel}</span>
                  <span className="font-semibold text-amber-400">{card.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(card.progress, 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-[11px] text-neutral-400 truncate">{card.subtext}</p>
            )}
          </SpotlightCard>
        );
      })}
    </div>
  );
}
