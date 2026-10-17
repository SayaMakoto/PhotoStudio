import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Download, Filter } from 'lucide-react';

export default function RevenueTable({ selectedYear, selectedMonth }) {
  // Static 12-month revenue breakdown for selected year
  const monthlyData = [
    {
      month: 1,
      totalOrders: 142,
      packageRevenue: 185000000,
      resourceRentRevenue: 32000000,
      extraRevenue: 15000000,
      totalRevenue: 232000000,
      growth: '+8.4%',
      status: 'Đã quyết toán',
    },
    {
      month: 2,
      totalOrders: 168,
      packageRevenue: 220000000,
      resourceRentRevenue: 41000000,
      extraRevenue: 19000000,
      totalRevenue: 280000000,
      growth: '+20.6%',
      status: 'Đã quyết toán',
    },
    {
      month: 3,
      totalOrders: 155,
      packageRevenue: 198000000,
      resourceRentRevenue: 36000000,
      extraRevenue: 14000000,
      totalRevenue: 248000000,
      growth: '-11.4%',
      status: 'Đã quyết toán',
    },
    {
      month: 4,
      totalOrders: 178,
      packageRevenue: 235000000,
      resourceRentRevenue: 44000000,
      extraRevenue: 21000000,
      totalRevenue: 300000000,
      growth: '+21.0%',
      status: 'Đã quyết toán',
    },
    {
      month: 5,
      totalOrders: 164,
      packageRevenue: 210000000,
      resourceRentRevenue: 39000000,
      extraRevenue: 16000000,
      totalRevenue: 265000000,
      growth: '-11.6%',
      status: 'Đã quyết toán',
    },
    {
      month: 6,
      totalOrders: 190,
      packageRevenue: 250000000,
      resourceRentRevenue: 48000000,
      extraRevenue: 24000000,
      totalRevenue: 322000000,
      growth: '+21.5%',
      status: 'Đã quyết toán',
    },
    {
      month: 7,
      totalOrders: 182,
      packageRevenue: 238000000,
      resourceRentRevenue: 43000000,
      extraRevenue: 18000000,
      totalRevenue: 299000000,
      growth: '-7.1%',
      status: 'Đã quyết toán',
    },
    {
      month: 8,
      totalOrders: 175,
      packageRevenue: 228000000,
      resourceRentRevenue: 42000000,
      extraRevenue: 17000000,
      totalRevenue: 287000000,
      growth: '-4.0%',
      status: 'Đã quyết toán',
    },
    {
      month: 9,
      totalOrders: 189,
      packageRevenue: 245000000,
      resourceRentRevenue: 46000000,
      extraRevenue: 20000000,
      totalRevenue: 311000000,
      growth: '+8.3%',
      status: 'Đã quyết toán',
    },
    {
      month: 10,
      totalOrders: 195,
      packageRevenue: 258000000,
      resourceRentRevenue: 49000000,
      extraRevenue: 23000000,
      totalRevenue: 330000000,
      growth: '+6.1%',
      status: 'Đang theo dõi',
    },
    {
      month: 11,
      totalOrders: 180,
      packageRevenue: 230000000,
      resourceRentRevenue: 44000000,
      extraRevenue: 18000000,
      totalRevenue: 292000000,
      growth: '-11.5%',
      status: 'Kế hoạch',
    },
    {
      month: 12,
      totalOrders: 215,
      packageRevenue: 290000000,
      resourceRentRevenue: 55000000,
      extraRevenue: 35000000,
      totalRevenue: 380000000,
      growth: '+30.1%',
      status: 'Kế hoạch',
    },
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const currentMonthData = monthlyData.find((d) => d.month === selectedMonth) || monthlyData[9];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
      {/* Table Header & Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Bảng Doanh Thu Chi Tiết Theo Tháng (Năm {selectedYear})
            </h3>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Dữ liệu tổng hợp từ các gói chụp, phụ thu trang phục, bối cảnh và dịch vụ phát sinh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-850 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
            <Download className="h-3.5 w-3.5" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-neutral-950/80 uppercase text-[11px] font-semibold text-neutral-400 tracking-wider border-b border-neutral-800">
            <tr>
              <th scope="col" className="px-4 py-3.5">Tháng/Năm</th>
              <th scope="col" className="px-4 py-3.5 text-center">Tổng đơn</th>
              <th scope="col" className="px-4 py-3.5 text-right">Doanh thu Gói Chụp</th>
              <th scope="col" className="px-4 py-3.5 text-right">Thuê Đồ & Bối Cảnh</th>
              <th scope="col" className="px-4 py-3.5 text-right">Phí Dịch Vụ Khác</th>
              <th scope="col" className="px-4 py-3.5 text-right">Tổng Doanh Thu</th>
              <th scope="col" className="px-4 py-3.5 text-center">Tăng trưởng</th>
              <th scope="col" className="px-4 py-3.5 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 font-sans">
            {monthlyData.map((row) => {
              const isSelected = row.month === selectedMonth;
              const isPos = row.growth.startsWith('+');

              return (
                <tr
                  key={row.month}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-amber-500/10 font-medium text-white'
                      : 'hover:bg-neutral-850/50'
                  }`}
                >
                  <td className="px-4 py-3.5 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-200">
                        Tháng {row.month.toString().padStart(2, '0')}/{selectedYear}
                      </span>
                      {isSelected && (
                        <span className="rounded bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.5 border border-amber-400/30">
                          Đang chọn
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center text-neutral-300 font-mono">
                    {row.totalOrders}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-neutral-300">
                    {formatCurrency(row.packageRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-neutral-300">
                    {formatCurrency(row.resourceRentRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-neutral-400">
                    {formatCurrency(row.extraRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-400">
                    {formatCurrency(row.totalRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono">
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isPos
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {isPos ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {row.growth}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        row.status === 'Đã quyết toán'
                          ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                          : row.status === 'Đang theo dõi'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-neutral-800/40 text-neutral-500'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
