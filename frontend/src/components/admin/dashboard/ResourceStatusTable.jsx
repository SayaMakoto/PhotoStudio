import React from 'react';
import { Camera, Image, DoorOpen, Shirt, Sparkles, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';

export default function ResourceStatusTable() {
  const resourceCategories = [
    {
      id: 'equipments',
      category: 'Quản lý thiết bị (Equipments)',
      icon: Camera,
      total: 120,
      active: 108,
      inUse: 45,
      maintenance: 12,
      utilizationRate: '90%',
      sampleItems: 'Sony A7IV, Canon R5, Godox AD600Pro, Nanlite Pavotube',
      status: 'Ổn định',
    },
    {
      id: 'backgrounds',
      category: 'Quản lý bối cảnh (Backgrounds)',
      icon: Image,
      total: 35,
      active: 32,
      inUse: 18,
      maintenance: 3,
      utilizationRate: '91.4%',
      sampleItems: 'Vintage Retro, Cyberpunk Neon, Minimal Hàn Quốc, Giáng Sinh',
      status: 'Ổn định',
    },
    {
      id: 'rooms',
      category: 'Quản lý phòng chụp (Rooms)',
      icon: DoorOpen,
      total: 8,
      active: 7,
      inUse: 5,
      maintenance: 1,
      utilizationRate: '87.5%',
      sampleItems: 'Studio Room A (Chân dung), Studio B (Thời trang), VIP Lounge',
      status: 'Bảo dưỡng 1 phòng',
    },
    {
      id: 'clothes',
      category: 'Quản lý trang phục (Clothes)',
      icon: Shirt,
      total: 260,
      active: 242,
      inUse: 68,
      maintenance: 18,
      utilizationRate: '93%',
      sampleItems: 'Váy cưới công chúa, Vest Hàn Quốc, Hanbok, Áo dài truyền thống',
      status: 'Đang giặt sấy 18 bộ',
    },
    {
      id: 'accessories',
      category: 'Quản lý phụ kiện (Accessories)',
      icon: Sparkles,
      total: 145,
      active: 138,
      inUse: 52,
      maintenance: 7,
      utilizationRate: '95.1%',
      sampleItems: 'Vương miện, Kính mắt thời trang, Bó hoa lụa, Đạo cụ sách báo cổ',
      status: 'Ổn định',
    },
  ];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Camera className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Bảng Trạng Thái Tài Nguyên Đang Hoạt Động
            </h3>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Chi tiết 5 nhóm tài nguyên: Thiết bị, Bối cảnh, Phòng chụp, Trang phục và Phụ kiện studio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            527 / 568 Tài nguyên khả dụng
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-neutral-950/80 uppercase text-[11px] font-semibold text-neutral-400 tracking-wider border-b border-neutral-800">
            <tr>
              <th scope="col" className="px-4 py-3.5">Loại tài nguyên</th>
              <th scope="col" className="px-4 py-3.5 text-center">Tổng số</th>
              <th scope="col" className="px-4 py-3.5 text-center">Đang hoạt động / Khả dụng</th>
              <th scope="col" className="px-4 py-3.5 text-center">Đang sử dụng (Buổi chụp)</th>
              <th scope="col" className="px-4 py-3.5 text-center">Bảo trì / Giặt / Sửa</th>
              <th scope="col" className="px-4 py-3.5 text-center">Tỷ lệ khả dụng</th>
              <th scope="col" className="px-4 py-3.5">Ghi chú vận hành</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 font-sans">
            {resourceCategories.map((res) => {
              const Icon = res.icon;
              return (
                <tr key={res.id} className="hover:bg-neutral-850/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-amber-400 border border-neutral-700/60">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{res.category}</div>
                        <div className="text-[11px] text-neutral-400 truncate max-w-xs">{res.sampleItems}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-mono font-bold text-neutral-200">
                    {res.total}
                  </td>
                  <td className="px-4 py-4 text-center font-mono">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      {res.active}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-amber-300 font-medium">
                    {res.inUse}
                  </td>
                  <td className="px-4 py-4 text-center font-mono">
                    <span className={`inline-flex items-center gap-1 ${res.maintenance > 0 ? 'text-rose-400' : 'text-neutral-500'}`}>
                      {res.maintenance > 0 && <Wrench className="h-3 w-3" />}
                      {res.maintenance}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                          style={{ width: res.utilizationRate }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold text-neutral-200">
                        {res.utilizationRate}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block rounded-md bg-neutral-800/80 px-2.5 py-1 text-[11px] text-neutral-300 border border-neutral-700/60">
                      {res.status}
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
