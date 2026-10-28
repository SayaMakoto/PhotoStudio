import { Camera, CalendarDays, DollarSign, Star } from 'lucide-react';
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
      tab: 'schedule',
    },
    {
      title: 'Ca Trực Đã Hoàn Thành',
      value: EMPLOYEE_KPIS.shiftsThisMonth,
      targetText: `/ ${EMPLOYEE_KPIS.targetShifts} ca trực`,
      progress: shiftProgress,
      progressLabel: 'Lịch trực tháng',
      icon: CalendarDays,
      tab: 'schedule',
    },
    {
      title: 'Hoa Hồng Tạm Tính',
      customValue: formatVND(EMPLOYEE_KPIS.commission),
      subtext: `Lương cứng: ${formatVND(EMPLOYEE_KPIS.baseSalary)}`,
      icon: DollarSign,
      tab: 'profile',
    },
    {
      title: 'Đánh Giá Khách Hàng',
      customValue: `${EMPLOYEE_KPIS.ratingScore} / 5.0`,
      subtext: `Từ ${EMPLOYEE_KPIS.ratingTotalCount} lượt đánh giá thực tế`,
      icon: Star,
      tab: 'reviews',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => onOpenTab && card.tab && onOpenTab(card.tab)}
            className="group relative p-6 rounded-3xl bg-white border border-[#F0E4E6] hover:border-[#B85064]/50 transition-all duration-300 shadow-[0_4px_20px_rgb(184,80,100,0.04)] hover:shadow-[0_12px_28px_rgb(184,80,100,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A6C71] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#B85064] group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon className="w-5 h-5 text-[#B85064] group-hover:text-white transition-colors" />
                </div>
              </div>

              <div className="mt-4">
                {card.customValue ? (
                  <div className="text-2xl lg:text-3xl font-extrabold text-[#261A1E] tracking-tight font-sans">
                    {card.customValue}
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl lg:text-4xl font-extrabold text-[#261A1E] tracking-tight font-sans">
                      <CountUp to={card.value} duration={1.2} />
                    </span>
                    <span className="text-xs font-semibold text-[#B85064]">
                      {card.targetText}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              {card.progress !== undefined ? (
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-[#7A6C71] mb-1.5">
                    <span>{card.progressLabel}</span>
                    <span className="text-[#B85064]">{card.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#FAF5F5] border border-[#F0E4E6] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#B85064] to-[#E28E9E] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(card.progress, 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-[#7A6C71] font-medium truncate">
                  {card.subtext}
                </p>
              )}
            </div>

            {/* Subtle bottom indicator on hover */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#B85064]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        );
      })}
    </div>
  );
}
