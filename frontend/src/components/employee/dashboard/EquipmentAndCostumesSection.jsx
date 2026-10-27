import React, { useState } from 'react';
import {
  Layers,
  Camera,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { EQUIPMENT_ITEMS } from '../employeeData';

export default function EquipmentAndCostumesSection({ onReportIncident, showHeader = true }) {
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

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'holding':
        return (
          <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            Đang giữ
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/70 px-2.5 py-1 text-[11px] font-medium text-neutral-400">
            Đã hoàn kho
          </span>
        );
      case 'reported':
        return (
          <span className="inline-flex items-center rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-300">
            Đang báo hỏng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/70 px-2.5 py-1 text-[11px] font-medium text-neutral-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-4">
      {/* Header & Action */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-amber-400" />
              <span>Thiết Bị & Đạo Cụ Tác Nghiệp Đang Quản Lý</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Theo dõi máy ảnh, ống kính, đèn flash đang mượn; cập nhật tình trạng và gửi báo cáo sự cố hư hỏng.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Category Filter */}
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 font-medium focus:border-amber-400 focus:outline-none"
            >
              <option value="all">Tất cả phân loại</option>
              <option value="body">Body Máy Ảnh</option>
              <option value="ống kính">Ống Kính (Lens)</option>
              <option value="đèn">Đèn & Ánh Sáng</option>
            </select>

            {/* Quick Report Button */}
            <button
              onClick={() => onReportIncident && onReportIncident(null)}
              className="flex items-center gap-1.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white font-bold px-3 py-1.5 text-xs transition-colors shadow-sm"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Báo hỏng thiết bị</span>
            </button>
          </div>
        </div>
      )}

      {/* Equipment List */}
      <div className="divide-y divide-neutral-800/80 rounded-xl border border-neutral-800 bg-neutral-950/70 overflow-hidden">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-3 hover:bg-neutral-900/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 shrink-0">
                <Camera className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.name}</h4>
                  <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
                    {item.code}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Phân loại: <span className="text-neutral-300">{item.category}</span> • Tình trạng: <span className="text-neutral-300">{item.condition}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {renderStatusBadge(item.status)}

              <button
                type="button"
                onClick={() => handleToggleStatus(item.id)}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
                title="Đổi trạng thái giữ / hoàn kho"
              >
                {item.status === 'holding' ? 'Hoàn trả kho' : 'Mượn thiết bị'}
              </button>

              <button
                type="button"
                onClick={() => onReportIncident && onReportIncident({ id: item.code, customerName: item.name })}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                title="Báo sự cố thiết bị này"
              >
                <AlertTriangle className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
