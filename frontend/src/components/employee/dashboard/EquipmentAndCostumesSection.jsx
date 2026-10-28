import { useState } from 'react';
import {
  Layers,
  Camera,
  AlertTriangle,
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
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
            Đang giữ
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center rounded-full border border-[#F0E4E6] bg-[#FAF5F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#7A6C71]">
            Đã hoàn kho
          </span>
        );
      case 'reported':
        return (
          <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
            Đang báo hỏng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-[#F0E4E6] bg-[#FAF5F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#7A6C71]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] space-y-5">
      {/* Header & Action */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F0E4E6]">
          <div>
            <h3 className="text-base font-bold text-[#261A1E] flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-[#B85064]" />
              <span>Thiết Bị & Đạo Cụ Tác Nghiệp Đang Quản Lý</span>
            </h3>
            <p className="text-xs text-[#7A6C71] mt-0.5">
              Theo dõi máy ảnh, ống kính, đèn flash đang mượn; cập nhật tình trạng và gửi báo cáo sự cố hư hỏng.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Category Filter */}
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] px-3.5 py-2 text-xs text-[#261A1E] font-semibold focus:border-[#B85064] focus:outline-none shadow-sm"
            >
              <option value="all">Tất cả phân loại</option>
              <option value="body">Body Máy Ảnh</option>
              <option value="ống kính">Ống Kính (Lens)</option>
              <option value="đèn">Đèn & Ánh Sáng</option>
            </select>

            {/* Quick Report Button */}
            <button
              onClick={() => onReportIncident && onReportIncident(null)}
              className="flex items-center gap-1.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold px-3.5 py-2 text-xs transition-all shadow-sm"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Báo hỏng thiết bị</span>
            </button>
          </div>
        </div>
      )}

      {/* Equipment List */}
      <div className="divide-y divide-[#F0E4E6] rounded-2xl border border-[#F0E4E6] bg-white overflow-hidden shadow-sm">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-[#FAF5F5]/60 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] shrink-0">
                <Camera className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#261A1E]">{item.name}</h4>
                  <span className="font-mono text-[10px] text-[#B85064] bg-[#FDF0F3] border border-[#F5D5DC] px-2 py-0.5 rounded-md font-semibold">
                    {item.code}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A6C71] mt-0.5">
                  Phân loại: <span className="text-[#261A1E] font-medium">{item.category}</span> • Tình trạng: <span className="text-[#261A1E] font-medium">{item.condition}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
              {renderStatusBadge(item.status)}

              <button
                type="button"
                onClick={() => handleToggleStatus(item.id)}
                className="rounded-xl border border-[#F0E4E6] bg-[#FAF5F5] px-3 py-1.5 text-xs font-semibold text-[#261A1E] hover:border-[#B85064] hover:bg-white transition-all shadow-sm"
                title="Đổi trạng thái giữ / hoàn kho"
              >
                {item.status === 'holding' ? 'Hoàn trả kho' : 'Mượn thiết bị'}
              </button>

              <button
                type="button"
                onClick={() => onReportIncident && onReportIncident({ id: item.code, customerName: item.name })}
                className="rounded-xl p-2 text-[#9E8E93] hover:bg-rose-50 hover:text-rose-600 transition-colors"
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
