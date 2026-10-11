import React, { useState } from 'react';
import {
  X,
  Camera,
  Layers,
  Shirt,
  Sparkles,
  Users,
  CheckSquare,
  Square,
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  Send,
  AlertTriangle
} from 'lucide-react';

export default function ShootDetailModal({ booking, onClose, onOpenIncidentReport }) {
  if (!booking) return null;

  const [checklist, setChecklist] = useState(booking.checklist || []);
  const [deliveryInput, setDeliveryInput] = useState(booking.deliveryLink || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleChecklist = (index) => {
    setChecklist((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, done: !item.done } : item))
    );
  };

  const handleSaveDelivery = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl text-neutral-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                {booking.id}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Chi Tiết Buổi Chụp: {booking.customerName}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {booking.packageName} • {booking.time} ({booking.date})
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
          {/* 1. Thông tin Bối Cảnh & Phòng Chụp */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>Phòng Chụp & Bối Cảnh Concept</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-500">Phòng chụp:</span>
                <p className="font-semibold text-white mt-0.5">{booking.room}</p>
              </div>
              <div>
                <span className="text-neutral-500">Bối cảnh concept:</span>
                <p className="font-semibold text-white mt-0.5">{booking.background}</p>
              </div>
            </div>
          </div>

          {/* 2. Đồng Nghiệp Cùng Ca Chụp */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-400" />
              <span>Đồng Nghiệp Phối Hợp Trong Ca</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {booking.colleagues?.map((col, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <img src={col.avatar} alt={col.name} className="h-9 w-9 rounded-full object-cover border border-amber-400/40" />
                  <div>
                    <p className="text-xs font-bold text-white">{col.name}</p>
                    <p className="text-[11px] text-amber-300 font-medium">{col.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Phục Trang, Phụ Kiện & Thiết Bị */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Thiết bị */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-3.5 space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5" /> Thiết bị chụp
              </span>
              <ul className="text-[11.5px] space-y-1 text-neutral-300">
                {booking.equipments?.map((eq, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-amber-400" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trang phục */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-3.5 space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Shirt className="h-3.5 w-3.5" /> Trang phục
              </span>
              <ul className="text-[11.5px] space-y-1 text-neutral-300">
                {booking.clothes?.map((cl, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-amber-400" />
                    <span>{cl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phụ kiện */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-3.5 space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Phụ kiện & Đạo cụ
              </span>
              <ul className="text-[11.5px] space-y-1 text-neutral-300">
                {booking.accessories?.map((ac, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-amber-400" />
                    <span>{ac}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Checklist Chuẩn Bị Trước & Sau Buổi Chụp */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-amber-400" />
              <span>Checklist Chuẩn Bị & Bàn Giao Tác Nghiệp</span>
            </h4>
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleChecklist(idx)}
                  className="flex items-center gap-3 w-full text-left p-2 rounded-lg bg-neutral-950/60 hover:bg-neutral-850 transition-colors border border-neutral-800/60"
                >
                  {item.done ? (
                    <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="h-4 w-4 text-neutral-500 shrink-0" />
                  )}
                  <span className={`text-xs ${item.done ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                    {item.task}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Cập Nhật Link Bàn Giao File Ảnh & Deadline */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Link Bàn Giao File Ảnh (Google Drive / Cloud Studio)
              </h4>
              <span className="text-xs text-rose-400 font-semibold">Deadline: {booking.deadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={deliveryInput}
                onChange={(e) => setDeliveryInput(e.target.value)}
                placeholder="Nhập đường dẫn Google Drive / OneDrive bàn giao ảnh..."
                className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
              />
              <button
                onClick={handleSaveDelivery}
                className="rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-4 py-2 text-xs transition-colors"
              >
                Lưu link
              </button>
            </div>
            {savedSuccess && (
              <p className="text-[11px] text-emerald-400">✓ Đã cập nhật link bàn giao cho quản trị viên và khách hàng.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              if (onOpenIncidentReport) onOpenIncidentReport(booking);
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Báo cáo sự cố thiết bị tại ca này</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-5 py-2 text-xs font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
