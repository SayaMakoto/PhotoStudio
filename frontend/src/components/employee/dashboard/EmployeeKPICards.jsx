import React, { useMemo } from 'react';
import { Camera, CalendarDays, Layers, Star } from 'lucide-react';
import CountUp from '../../animations/CountUp';

const POSITION_LABELS = {
  photographer: 'Nhiếp ảnh gia',
  makeup: 'Chuyên viên trang điểm',
  logistics: 'Hậu cần & Ánh sáng',
};

// Lấy Thứ 2 đầu tuần hiện tại
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function EmployeeKPICards({
  onOpenTab,
  bookings = [],
  equipments = [],
  reviews = [],
  employeeDetails = null,
}) {
  // 1. Thống kê ca chụp trong tuần này từ CSDL
  const weekStats = useMemo(() => {
    const monday = getMonday(new Date());
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const thisWeek = bookings.filter((b) => {
      if (!b.bookingDate || b.status === 'cancelled') return false;
      const bDate = new Date(b.bookingDate);
      return bDate >= monday && bDate <= sunday;
    });

    const total = thisWeek.length;
    const inProgress = thisWeek.filter((b) => b.status === 'in_progress').length;
    const completed = thisWeek.filter((b) => b.status === 'completed').length;

    return { total, inProgress, completed };
  }, [bookings]);

  // 2. Thống kê thiết bị thật từ CSDL
  const totalEquipments = equipments.length;
  const availableEquipments = equipments.filter((e) => e.status === 'available').length;

  // 3. Vị trí chuyên môn thật từ bảng employees
  const positionLabel = employeeDetails?.position
    ? (POSITION_LABELS[employeeDetails.position] || employeeDetails.position)
    : 'Nhân viên tác nghiệp';
  const hireDate = employeeDetails?.hireDate
    ? `Vào làm: ${employeeDetails.hireDate}`
    : 'Đang hoạt động';

  // 4. Thống kê đánh giá thật từ bảng reviews
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / totalReviews).toFixed(1)
    : '5.0';

  const cards = [
    {
      title: 'Số Ca Chụp Trong Tuần',
      value: weekStats.total,
      targetText: 'ca chụp',
      subtext: weekStats.total > 0
        ? `${weekStats.inProgress} đang chụp • ${weekStats.completed} hoàn thành`
        : 'Tuần này chưa có ca chụp',
      icon: CalendarDays,
      tab: 'schedule',
    },
    {
      title: 'Thiết Bị Studio',
      value: totalEquipments,
      targetText: 'thiết bị',
      subtext: `${availableEquipments} sẵn sàng sử dụng`,
      icon: Camera,
      tab: 'equipment',
    },
    {
      title: 'Vị Trí Tác Nghiệp',
      customValue: positionLabel,
      subtext: hireDate,
      icon: Layers,
      tab: 'profile',
    },
    {
      title: 'Đánh Giá Khách Hàng',
      customValue: totalReviews > 0 ? `★ ${avgRating} / 5.0` : 'Chưa có',
      subtext: totalReviews > 0 ? `Từ ${totalReviews} lượt đánh giá thực tế` : 'Chưa có đánh giá',
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
                  <div className="text-xl lg:text-2xl font-extrabold text-[#261A1E] tracking-tight font-sans">
                    {card.customValue}
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl lg:text-4xl font-extrabold text-[#261A1E] font-sans">
                      <CountUp to={card.value} duration={1.2} />
                    </span>
                    <span className="text-sm font-bold text-[#B85064]">
                      {card.targetText}
                    </span>
                  </div>
                )}
                <p className="mt-1 text-xs text-[#7A6C71] font-medium">
                  {card.subtext}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
