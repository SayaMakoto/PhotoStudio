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
  Save,
  AlertTriangle,
  User,
  Phone,
  DollarSign,
  Image,
  CheckCircle2
} from 'lucide-react';

function InfoItem({ label, value, highlight = false }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-neutral-500 font-medium">{label}</p>
      <p
        className={`mt-0.5 break-words text-xs font-semibold ${
          highlight ? 'text-amber-400 font-bold' : 'text-neutral-200'
        }`}
      >
        {value || '—'}
      </p>
    </div>
  );
}

export default function ShootDetailModal({ booking, onClose, onOpenIncidentReport }) {
  if (!booking) return null;

  const [checklist, setChecklist] = useState(booking.checklist || []);
  const [deliveryInput, setDeliveryInput] = useState(booking.deliveryLink || '');
  const [retouchedCount, setRetouchedCount] = useState(
    booking.photoSelection?.retouchedCount || 0
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedCount = booking.photoSelection?.selectedCount || 30;
  const rawCount = booking.photoSelection?.rawCount || 350;
  const progressPercent = Math.min(Math.round((retouchedCount / selectedCount) * 100), 100);

  const toggleChecklist = (index) => {
    setChecklist((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, done: !item.done } : item))
    );
  };

  const handleSaveDelivery = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl shadow-black/80 text-neutral-200 max-h-[90vh] flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {booking.id}
              </span>
              <h2 className="text-base font-bold text-white">
                Hồ Sơ Buổi Chụp: {booking.customerName}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {booking.packageName} • {booking.time} ({booking.date})
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-neutral-800 text-xs">
          {/* Quick Info Grid + Commission & Deadline Warning */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 p-3.5">
            <InfoItem label="Khách hàng" value={booking.customerName} />
            <InfoItem label="Số điện thoại" value={booking.phone} />
            <InfoItem label="Phòng chụp" value={booking.room} />
            <InfoItem label="Thời gian ca" value={`${booking.time} - ${booking.date}`} />
            <InfoItem
              label="Hạn chót trả ảnh"
              value={
                booking.deadlineTag
                  ? `${booking.deadline} (${booking.deadlineTag.label})`
                  : booking.deadline || 'Chưa cập nhật'
              }
              highlight={booking.deadlineTag?.type === 'urgent'}
            />
            <InfoItem
              label="Hoa hồng ca chụp"
              value={
                booking.commission
                  ? `+${new Intl.NumberFormat('vi-VN').format(booking.commission)} đ`
                  : 'Theo quy chế studio'
              }
              highlight={true}
            />
          </div>

          {/* Tiến độ chọn ảnh & retouch (Feature mới) */}
          <div className="rounded-xl border border-neutral-800/90 bg-neutral-900/40 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-neutral-300 uppercase flex items-center gap-1.5">
                <Image className="h-3.5 w-3.5 text-sky-400" />
                <span>Tiến Độ Khách Chấm & Hậu Kỳ Ảnh</span>
              </h4>
              <span className="font-mono text-xs font-bold text-amber-400">
                {retouchedCount} / {selectedCount} ảnh ({progressPercent}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
              <div className="text-neutral-400">
                Ảnh gốc chụp được: <strong className="text-white">{rawCount} RAW</strong> • Đã duyệt: <strong className="text-white">{selectedCount} ảnh</strong>
              </div>

              {/* Quick Counter */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Số ảnh đã photoshop:</span>
                <div className="flex items-center border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950">
                  <button
                    type="button"
                    onClick={() => setRetouchedCount((c) => Math.max(0, c - 1))}
                    className="px-2 py-0.5 hover:bg-neutral-800 text-neutral-300"
                  >
                    -
                  </button>
                  <span className="px-2 font-mono font-bold text-white text-xs">
                    {retouchedCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRetouchedCount((c) => Math.min(selectedCount, c + 1))}
                    className="px-2 py-0.5 hover:bg-neutral-800 text-neutral-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ghi chú & Moodboard khách hàng */}
          {booking.note && (
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Yêu cầu & Phong cách khách mong muốn
              </span>
              <p className="text-neutral-300 leading-relaxed italic">{booking.note}</p>
            </div>
          )}

          {/* Ekip hỗ trợ & Thiết bị */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Ekip */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-3 space-y-2">
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-amber-400" />
                <span>Ekip Cùng Ca Trực</span>
              </h4>
              <div className="space-y-1.5">
                {booking.colleagues && booking.colleagues.length > 0 ? (
                  booking.colleagues.map((col, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <img src={col.avatar} alt={col.name} className="h-5 w-5 rounded-full object-cover" />
                      <span className="font-semibold text-white">{col.name}</span>
                      <span className="text-neutral-500 text-[10px]">({col.role})</span>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500">Chưa chỉ định thêm nhân sự</p>
                )}
              </div>
            </div>

            {/* Thiết bị chỉ định */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-3 space-y-2">
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-amber-400" />
                <span>Thiết Bị Cần Dùng</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-neutral-300">
                {booking.equipments && booking.equipments.length > 0 ? (
                  booking.equipments.map((eq, idx) => <li key={idx}>{eq}</li>)
                ) : (
                  <li className="text-neutral-500 list-none">Thiết bị studio cơ bản</li>
                )}
              </ul>
            </div>
          </div>

          {/* Checklist Tác Nghiệp Trước Khi Bấm Máy */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-neutral-300 uppercase flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                <span>Checklist Tác Nghiệp</span>
              </h4>
              <span className="text-[10px] text-neutral-400">
                {checklist.filter((i) => i.done).length} / {checklist.length} hoàn thành
              </span>
            </div>

            <div className="space-y-1.5">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklist(idx)}
                  className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-neutral-850 transition-colors"
                >
                  {item.done ? (
                    <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="h-4 w-4 text-neutral-600 shrink-0" />
                  )}
                  <span className={item.done ? 'line-through text-neutral-500' : 'text-neutral-200'}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cập nhật link sản phẩm trả khách */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-3.5 space-y-2">
            <h4 className="text-[11px] font-bold text-neutral-300 uppercase flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
              <span>Link Lưu Trữ File Ảnh (Google Drive / Server Studio)</span>
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={deliveryInput}
                onChange={(e) => setDeliveryInput(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveDelivery}
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-3 py-1.5 text-xs transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{savedSuccess ? 'Đã lưu' : 'Lưu link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenIncidentReport) onOpenIncidentReport(booking);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Báo Sự Cố Ca Này</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
