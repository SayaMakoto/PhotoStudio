import React, { useState, useMemo } from 'react';
import {
  Layers,
  Camera,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  Search,
} from 'lucide-react';

const TYPE_LABELS = {
  all: 'Tất cả phân loại',
  camera: 'Body máy ảnh',
  lens: 'Ống kính (Lens)',
  lighting: 'Đèn & Ánh sáng',
  tripod: 'Chân máy & Gimbal',
  other: 'Thiết bị khác',
};

const STATUS_LABELS = {
  all: 'Tất cả trạng thái',
  available: 'Sẵn sàng',
  in_use: 'Đang sử dụng',
  maintenance: 'Đang bảo trì',
  broken: 'Hỏng hóc',
  retired: 'Ngừng sử dụng',
};

export default function EquipmentAndCostumesSection({
  equipments = [],
  showHeader = true,
}) {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEquipments = useMemo(() => {
    return equipments.filter((item) => {
      // Type match
      if (filterType !== 'all' && item.type !== filterType) {
        return false;
      }

      // Status match
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false;
      }

      // Search match
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchName = item.name && item.name.toLowerCase().includes(query);
        const matchBrand = item.brand && item.brand.toLowerCase().includes(query);
        const matchModel = item.model && item.model.toLowerCase().includes(query);
        const matchSerial = item.serialNumber && item.serialNumber.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchModel && !matchSerial) {
          return false;
        }
      }

      return true;
    });
  }, [equipments, filterType, filterStatus, searchTerm]);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Sẵn sàng
          </span>
        );
      case 'in_use':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
            <Clock className="h-3 w-3" />
            Đang sử dụng
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
            <Wrench className="h-3 w-3" />
            Đang bảo trì
          </span>
        );
      case 'broken':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
            <AlertCircle className="h-3 w-3" />
            Hỏng hóc
          </span>
        );
      case 'retired':
        return (
          <span className="inline-flex items-center rounded-full border border-[#F0E4E6] bg-[#FAF5F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#7A6C71]">
            Ngừng sử dụng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-[#F0E4E6] bg-[#FAF5F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#7A6C71]">
            {status || 'Không xác định'}
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] space-y-5">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F0E4E6]">
        {showHeader ? (
          <div>
            <h3 className="text-base font-bold text-[#261A1E] flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-[#B85064]" />
              <span>Thiết Bị Tác Nghiệp Studio ({equipments.length} thiết bị)</span>
            </h3>
            <p className="text-xs text-[#7A6C71] mt-0.5">
              Dữ liệu máy ảnh, ống kính, thiết bị ánh sáng thực tế từ bảng equipments trong CSDL.
            </p>
          </div>
        ) : (
          <div className="text-xs text-[#7A6C71]">
            Tổng số: <strong className="text-[#261A1E] font-bold">{equipments.length}</strong> thiết bị trong CSDL
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E8E93]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên, serial, model..."
              className="w-48 sm:w-56 rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] py-2 pl-9 pr-3 text-xs text-[#261A1E] placeholder-[#9E8E93] focus:border-[#B85064] focus:bg-white focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] px-3.5 py-2 text-xs text-[#261A1E] font-semibold focus:border-[#B85064] focus:outline-none shadow-sm"
          >
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] px-3.5 py-2 text-xs text-[#261A1E] font-semibold focus:border-[#B85064] focus:outline-none shadow-sm"
          >
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment List from DB */}
      {filteredEquipments.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#9E8E93] bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
          {equipments.length === 0
            ? 'Hiện tại chưa có thiết bị nào trong CSDL (Bảng equipments đang trống).'
            : 'Không tìm thấy thiết bị nào khớp với bộ lọc tìm kiếm.'}
        </div>
      ) : (
        <div className="divide-y divide-[#F0E4E6] rounded-2xl border border-[#F0E4E6] bg-white overflow-hidden shadow-sm">
          {filteredEquipments.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3.5 hover:bg-[#FAF5F5]/60 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] shrink-0 mt-0.5 sm:mt-0">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#261A1E]">
                      {item.name}
                    </h4>
                    {item.serialNumber && (
                      <span className="font-mono text-[10px] text-[#B85064] bg-[#FDF0F3] border border-[#F5D5DC] px-2 py-0.5 rounded-md font-semibold">
                        S/N: {item.serialNumber}
                      </span>
                    )}
                    {item.type && (
                      <span className="text-[10px] bg-[#FAF5F5] border border-[#F0E4E6] text-[#7A6C71] px-2 py-0.5 rounded-md font-medium">
                        {TYPE_LABELS[item.type] || item.type}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A6C71] mt-1">
                    {item.brand && (
                      <>Thương hiệu: <strong className="text-[#261A1E] font-medium">{item.brand}</strong></>
                    )}
                    {item.model && (
                      <> • Model: <strong className="text-[#261A1E] font-medium">{item.model}</strong></>
                    )}
                    {item.description && (
                      <> • <span className="italic text-[#9E8E93]">{item.description}</span></>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 pt-2 sm:pt-0">
                {renderStatusBadge(item.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
