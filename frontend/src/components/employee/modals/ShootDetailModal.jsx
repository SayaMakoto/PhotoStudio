import { useState } from 'react';
import {
  X,
  Camera,
  Shirt,
  Sparkles,
  Users,
  CheckSquare,
  Square,
  Save,
  AlertTriangle,
  Image,
  CheckCircle2
} from 'lucide-react';

function InfoItem({ label, value, highlight = false }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-[#7A6C71] font-semibold">{label}</p>
      <p
        className={`mt-0.5 break-words text-xs font-bold ${
          highlight ? 'text-[#B85064]' : 'text-[#261A1E]'
        }`}
      >
        {value || '—'}
      </p>
    </div>
  );
}

export default function ShootDetailModal({ booking, onClose, onOpenIncidentReport }) {
  const [checklist, setChecklist] = useState(booking?.checklist || []);
  const [deliveryInput, setDeliveryInput] = useState(booking?.deliveryLink || '');
  const [retouchedCount, setRetouchedCount] = useState(
    booking?.photoSelection?.retouchedCount || 0
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!booking) return null;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#F0E4E6] bg-white p-6 sm:p-7 shadow-[0_20px_60px_rgb(184,80,100,0.15)] text-[#261A1E] max-h-[90vh] flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#B85064] bg-[#FDF0F3] px-2.5 py-0.5 rounded-md border border-[#F5D5DC]">
                {booking.id}
              </span>
              <h2 className="text-base font-bold text-[#261A1E]">
                Hồ Sơ Buổi Chụp: {booking.customerName}
              </h2>
            </div>
            <p className="text-xs text-[#7A6C71] mt-0.5">
              {booking.packageName} • {booking.time} ({booking.date})
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#261A1E] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-[#F0E4E6] text-xs">
          {/* Quick Info Grid + Commission & Deadline Warning */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] p-4">
            <InfoItem label="Khách hàng" value={booking.customerName} />
            <InfoItem label="Số điện thoại" value={booking.phone} />
            <InfoItem label="Email liên hệ" value={booking.email} />
            <InfoItem label="Phòng chụp" value={booking.room} />
            <InfoItem label="Concept bối cảnh" value={booking.background} />
            <InfoItem label="Thời gian ca" value={`${booking.time} • ${booking.date}`} />
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
            <InfoItem
              label="Trạng thái chọn ảnh"
              value={booking.photoSelection?.selectionStatus || 'Chưa chọn'}
            />
          </div>

          {/* Customer Specific Request Notes */}
          {booking.note && (
            <div className="p-3.5 rounded-2xl bg-[#FDF0F3]/60 border border-[#F5D5DC] space-y-1">
              <p className="font-bold text-[#B85064] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Yêu Cầu & Lưu Ý Của Khách Hàng:</span>
              </p>
              <p className="text-[#261A1E] leading-relaxed text-[11px]">
                {booking.note}
              </p>
            </div>
          )}

          {/* Assigned Gears, Clothes, Accessories */}
          {(booking.equipments?.length > 0 || booking.clothes?.length > 0) && (
            <div className="p-4 rounded-2xl border border-[#F0E4E6] bg-white space-y-3 shadow-sm">
              <h4 className="font-bold text-[#261A1E] text-xs">Vật Tư & Thiết Bị Phục Vụ Ca Chụp:</h4>
              <div className="space-y-2">
                {booking.equipments && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-[#7A6C71] flex items-center gap-1 shrink-0 w-24">
                      <Camera className="h-3.5 w-3.5 text-[#B85064]" />
                      Thiết bị:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.equipments.map((eq, i) => (
                        <span key={i} className="bg-[#FAF5F5] border border-[#F0E4E6] text-[#261A1E] px-2 py-0.5 rounded-md text-[11px] font-medium">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {booking.clothes && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-[#7A6C71] flex items-center gap-1 shrink-0 w-24">
                      <Shirt className="h-3.5 w-3.5 text-purple-600" />
                      Trang phục:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.clothes.map((cl, i) => (
                        <span key={i} className="bg-purple-50 border border-purple-200 text-purple-800 px-2 py-0.5 rounded-md text-[11px] font-medium">
                          {cl}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {booking.accessories && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-[#7A6C71] flex items-center gap-1 shrink-0 w-24">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      Phụ kiện:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.accessories.map((ac, i) => (
                        <span key={i} className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md text-[11px] font-medium">
                          {ac}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Retouch & Delivery Progress */}
          <div className="p-4 rounded-2xl border border-[#F0E4E6] bg-white space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#261A1E] flex items-center gap-1.5">
                <Image className="h-4 w-4 text-[#B85064]" />
                Tiến Độ Hậu Kỳ & Trả File ({retouchedCount}/{selectedCount} ảnh đã hoàn thiện)
              </span>
              <span className="font-bold text-[#B85064] text-xs font-mono">{progressPercent}%</span>
            </div>

            <div className="h-2 w-full rounded-full bg-[#FAF5F5] border border-[#F0E4E6] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B85064] to-[#E28E9E] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Slider or counter update */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#7A6C71]">
              <span>Ảnh thô gốc: <strong className="text-[#261A1E]">{rawCount} file</strong></span>
              <div className="flex items-center gap-2">
                <span>Số ảnh đã sửa xong:</span>
                <input
                  type="number"
                  min="0"
                  max={selectedCount}
                  value={retouchedCount}
                  onChange={(e) => setRetouchedCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 rounded-xl border border-[#F0E4E6] bg-[#FAF5F5] px-2 py-1 text-center font-bold text-[#261A1E] focus:border-[#B85064] focus:outline-none"
                />
              </div>
            </div>

            {/* Delivery Link Input */}
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-[#7A6C71] block mb-1">
                Link Drive / Cloud trả file ảnh hoàn thiện cho khách:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deliveryInput}
                  onChange={(e) => setDeliveryInput(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="flex-1 rounded-xl border border-[#F0E4E6] bg-[#FAF5F5] px-3 py-1.5 text-xs text-[#261A1E] placeholder-[#9E8E93] focus:border-[#B85064] focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveDelivery}
                  className="flex items-center gap-1.5 rounded-xl bg-[#B85064] hover:bg-[#913B4D] px-4 py-1.5 text-xs font-bold text-white transition-all shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{savedSuccess ? 'Đã lưu ✓' : 'Lưu'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Operational Checklist */}
          {checklist.length > 0 && (
            <div className="p-4 rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5]/60 space-y-2.5">
              <h4 className="font-bold text-[#261A1E] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Checklist Quy Trình Chuẩn Bị Ca Chụp:
              </h4>
              <div className="space-y-1.5">
                {checklist.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleChecklist(idx)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white cursor-pointer transition-colors"
                  >
                    {c.done ? (
                      <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-[#9E8E93] shrink-0" />
                    )}
                    <span className={`text-xs ${c.done ? 'line-through text-[#9E8E93]' : 'text-[#261A1E] font-medium'}`}>
                      {c.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Co-workers on shoot */}
          {booking.colleagues && booking.colleagues.length > 0 && (
            <div className="p-3.5 rounded-2xl border border-[#F0E4E6] bg-white space-y-2">
              <h4 className="font-bold text-[#261A1E] flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#B85064]" />
                Đồng Nghiệp Phối Hợp Trong Ca:
              </h4>
              <div className="flex flex-wrap gap-2">
                {booking.colleagues.map((col, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#FAF5F5] border border-[#F0E4E6]">
                    <img src={col.avatar} alt={col.name} className="h-6 w-6 rounded-full object-cover" />
                    <span className="font-bold text-[#261A1E] text-[11px]">{col.name}</span>
                    <span className="text-[10px] text-[#B85064]">({col.role})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F0E4E6] shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenIncidentReport) onOpenIncidentReport(booking);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            <span>Báo sự cố ca chụp</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#FAF5F5] border border-[#F0E4E6] px-5 py-2 text-xs font-bold text-[#261A1E] hover:bg-[#FDF0F3] hover:border-[#F5D5DC] transition-all"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
