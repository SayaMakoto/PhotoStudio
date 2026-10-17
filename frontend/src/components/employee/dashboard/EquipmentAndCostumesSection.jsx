import React, { useState } from 'react';
import {
  Layers,
  Camera,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  Search,
  Filter,
  CheckSquare
} from 'lucide-react';
import { EQUIPMENT_ITEMS } from '../employeeData';

export default function EquipmentAndCostumesSection({ onReportIncident }) {
  const [items, setItems] = useState(EQUIPMENT_ITEMS);
  const [filterCat, setFilterCat] = useState('all');

  const handleToggleStatus = (id) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'holding' ? 'returned' : 'holding';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const filteredItems = items.filter((item) => {
    if (filterCat === 'all') return true;
    return item.category.toLowerCase().includes(filterCat.toLowerCase());
  });

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-amber-400" />
            <span>Quản Lý Thiết Bị, Trang Phục & Phụ Kiện Đang Giữ</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Xác nhận nhận/trả máy ảnh, ống kính, đèn flash; checklist trước ca chụp và gửi báo hỏng.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 font-medium focus:border-amber-400 focus:outline-none"
          >
            <option value="all">Tất cả phân loại</option>
            <option value="máy ảnh">Body Máy Ảnh</option>
            <option value="ống kính">Ống Kính (Lens)</option>
            <option value="đèn">Đèn & Ánh Sáng</option>
          </select>

          <button
            onClick={() => onReportIncident && onReportIncident(null)}
            className="flex items-center gap-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Báo sự cố thiết bị</span>
          </button>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-neutral-950 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
            <tr>
              <th className="px-4 py-3">Mã & Tên thiết bị</th>
              <th className="px-4 py-3">Phân loại</th>
              <th className="px-4 py-3">Tình trạng vật lý</th>
              <th className="px-4 py-3 text-center">Trạng thái giữ đồ</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 font-sans">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-850/40 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="font-mono text-[11px] text-amber-400/80">{item.code}</div>
                </td>
                <td className="px-4 py-3.5 text-neutral-400">
                  {item.category}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                    item.status === 'reported'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    item.status === 'holding'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : item.status === 'returned'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}>
                    {item.status === 'holding' && '● Đang giữ'}
                    {item.status === 'returned' && '✓ Đã hoàn trả kho'}
                    {item.status === 'reported' && '⚠ Báo hỏng'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 text-[11px] font-semibold transition-colors"
                  >
                    <RotateCcw className="h-3 w-3 text-amber-400" />
                    <span>{item.status === 'holding' ? 'Bấm Trả Kho' : 'Bấm Nhận Lại'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
