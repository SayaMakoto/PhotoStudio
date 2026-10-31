import React, { useState, useEffect, useMemo } from 'react';
import { Camera, CalendarDays, Layers, Wallet, ArrowRight, Coins, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import CountUp from '../../animations/CountUp';
import employeeSalaryService from '../../../services/employee/salaryService';

const POSITION_LABELS = {
  photographer: 'Nhiếp ảnh gia',
  makeup: 'Chuyên viên trang điểm',
  logistics: 'Hậu cần & Ánh sáng',
};

function formatVND(amount) {
  return Number(amount || 0).toLocaleString('vi-VN') + ' đ';
}

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
  employeeDetails = null,
}) {
  const [salaryData, setSalaryData] = useState(null);

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

  // 1b. KPI trong tháng hiện tại
  const monthStats = useMemo(() => {
    const now = new Date();
    const inMonth = bookings.filter((b) => {
      if (!b.bookingDate || b.status === 'cancelled') return false;
      const d = new Date(b.bookingDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const total = inMonth.length;
    const completed = inMonth.filter((b) => b.status === 'completed').length;
    const remaining = inMonth.filter((b) => b.status !== 'completed').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percent, label: `${now.getMonth() + 1}/${now.getFullYear()}` };
  }, [bookings]);

  // Tải dữ liệu lương & hoa hồng thật của nhân viên
  useEffect(() => {
    let mounted = true;
    const fetchSalary = async () => {
      try {
        const data = await employeeSalaryService.getMySalaries(
          employeeDetails?.userId,
          employeeDetails?.id
        );
        if (mounted && Array.isArray(data) && data.length > 0) {
          setSalaryData(data[0]);
        }
      } catch (err) {
        console.warn('Lỗi tải bảng lương trong KPICards:', err);
      }
    };
    fetchSalary();
    return () => {
      mounted = false;
    };
  }, [employeeDetails?.id, employeeDetails?.userId]);

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

  const topCards = [
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
  ];

  // Tính các chỉ số lương (nếu có salaryData thì dùng từ DB, nếu chưa có thì ước tính từ bookings)
  const isPhotographer = !employeeDetails?.position || employeeDetails?.position === 'photographer';
  const dailyRate = salaryData?.dailyRate || (isPhotographer ? 250000 : 200000);
  const workDays = salaryData?.workDays || 22;
  const baseSalary = salaryData?.baseSalary || (workDays * dailyRate);
  const totalCommission = salaryData?.totalCommission || (monthStats.completed * 299000); // 10% ước tính
  const bonus = salaryData?.bonus || 500000;
  const netSalary = salaryData?.netSalary || (baseSalary + totalCommission + bonus);
  const totalShoots = salaryData?.totalShoots || monthStats.completed;

  const monthKpi = (
    <div
      onClick={() => onOpenTab && onOpenTab('salary')}
      className="p-6 rounded-3xl bg-white border border-[#F0E4E6] hover:border-[#B85064]/50 transition-all shadow-[0_4px_20px_rgb(184,80,100,0.04)] cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#7A6C71] uppercase tracking-wider">
          KPI Trong Tháng {monthStats.label}
        </span>
        <span className="text-sm font-extrabold text-[#B85064]">{monthStats.percent}%</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-extrabold text-[#261A1E]">{monthStats.total}</div>
          <p className="text-xs text-[#7A6C71] font-medium">Tổng ca chụp</p>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-emerald-600">{monthStats.completed}</div>
          <p className="text-xs text-[#7A6C71] font-medium">Đã hoàn thành</p>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-amber-600">{monthStats.remaining}</div>
          <p className="text-xs text-[#7A6C71] font-medium">Còn lại</p>
        </div>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-[#FAF5F5] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#E28E9E] to-[#B85064] transition-all duration-700"
          style={{ width: `${monthStats.percent}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {monthKpi}

      {/* Hàng 1: 3 thẻ chỉ số công việc */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topCards.map((card, idx) => {
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

      {/* Hàng 2: Khung BẢNG LƯƠNG & HOA HỒNG chiếm trọn chiều ngang còn lại và hiển thị nhiều thông tin chi tiết */}
      <div
        onClick={() => onOpenTab && onOpenTab('salary')}
        className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-white to-[#FDF4F6] border border-[#F0E4E6] hover:border-[#B85064]/60 transition-all duration-300 shadow-[0_4px_20px_rgb(184,80,100,0.05)] hover:shadow-[0_12px_32px_rgb(184,80,100,0.12)] cursor-pointer"
      >
        {/* Header khung lương */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E4E6]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FDF0F3] to-[#FCE7EC] border border-[#F5D5DC] text-[#B85064] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Wallet className="w-6 h-6 text-[#B85064]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#B85064] uppercase tracking-wider">
                  Bảng Lương & Hoa Hồng Tác Nghiệp
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    salaryData?.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {salaryData?.status === 'paid'
                    ? `✓ Admin đã cấp phát: ${formatVND(salaryData.netSalary || netSalary)}`
                    : `⏳ Chờ Admin cấp phát (Dự kiến: ${formatVND(netSalary)})`}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#261A1E] mt-0.5">
                Kỳ Lương Tháng {salaryData?.month || monthStats.label}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#B85064] group-hover:translate-x-1 transition-transform self-start sm:self-center">
            <span>Xem chi tiết bảng lương & in phiếu</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 4 Thống kê chi tiết tiền lương & hoa hồng */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Lương cơ bản */}
          <div className="p-4 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#7A6C71] font-medium">
              <span>Lương Cơ Bản</span>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-extrabold text-[#261A1E] mt-1.5">
              {formatVND(baseSalary)}
            </div>
            <p className="text-[11px] text-[#7A6C71] mt-1">
              <strong>{workDays} ngày công</strong> × {formatVND(dailyRate)}/ngày
            </p>
          </div>

          {/* Hoa hồng ca chụp */}
          <div className="p-4 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#7A6C71] font-medium">
              <span>Tổng Hoa Hồng Gói</span>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-extrabold text-emerald-600 mt-1.5">
              +{formatVND(totalCommission)}
            </div>
            <p className="text-[11px] text-[#7A6C71] mt-1">
              Hưởng <strong>10%/gói</strong> từ <strong>{totalShoots} gói chụp</strong>
            </p>
          </div>

          {/* Thưởng KPI */}
          <div className="p-4 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#7A6C71] font-medium">
              <span>Thưởng KPI & Chuyên Cần</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-extrabold text-amber-600 mt-1.5">
              +{formatVND(bonus)}
            </div>
            <p className="text-[11px] text-[#7A6C71] mt-1">
              Đạt chỉ tiêu hoàn thành ca chụp
            </p>
          </div>

          {/* Số lương đã được cấp phát */}
          <div
            className={`p-4 rounded-2xl border shadow-xs ${
              salaryData?.status === 'paid'
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span
                className={
                  salaryData?.status === 'paid'
                    ? 'text-emerald-700'
                    : 'text-amber-800'
                }
              >
                SỐ LƯƠNG ĐÃ CẤP PHÁT
              </span>
              <TrendingUp
                className={`w-4 h-4 ${
                  salaryData?.status === 'paid'
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              />
            </div>
            <div
              className={`text-xl sm:text-2xl font-extrabold mt-1.5 ${
                salaryData?.status === 'paid'
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}
            >
              {salaryData?.status === 'paid'
                ? formatVND(salaryData.netSalary || netSalary)
                : '0 đ'}
            </div>
            <p
              className={`text-[11px] font-medium mt-1 ${
                salaryData?.status === 'paid'
                  ? 'text-emerald-700'
                  : 'text-amber-800'
              }`}
            >
              {salaryData?.status === 'paid'
                ? '✓ Đã nhận chi trả từ Admin'
                : `Chờ Admin phát (Dự kiến: ${formatVND(netSalary)})`}
            </p>
          </div>
        </div>

        {/* Ghi chú chính sách */}
        <div className="mt-4 pt-3 border-t border-[#F0E4E6]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#7A6C71]">
          <span>
            💡 Chính sách: <strong>250.000 đ/ngày</strong> làm việc + <strong>10% hoa hồng</strong> trên mỗi gói chụp hoàn thành.
          </span>
          <span className="text-[#B85064] font-semibold">
            Bấm vào để mở bảng kê chi tiết từng gói và xuất file PDF →
          </span>
        </div>
      </div>
    </div>
  );
}
