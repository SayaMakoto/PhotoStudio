import { useState } from 'react';
import {
  X,
<<<<<<< HEAD
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
=======
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
>>>>>>> origin/main
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xác nhận', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'in_progress', label: 'Đang chụp', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { value: 'completed', label: 'Hoàn thành', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'cancelled', label: 'Đã hủy', color: 'text-rose-700 bg-rose-50 border-rose-200' },
];

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#F0E4E6] text-[#B85064] shrink-0 mt-0.5">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-[#7A6C71] font-semibold">{label}</p>
        <p className="mt-0.5 text-xs font-bold text-[#261A1E] break-words">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default function ShootDetailModal({
  booking,
  onClose,
  onStatusChange,
}) {
  if (!booking) return null;

  const [currentStatus, setCurrentStatus] = useState(booking.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa xếp ngày';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
=======
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
>>>>>>> origin/main
  };

  const formatTime = (start, end) => {
    if (!start && !end) return 'Chưa xếp giờ';
    return `${start || '—'} - ${end || '—'}`;
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === currentStatus) return;
    setIsUpdating(true);
    setSuccessMsg('');
    try {
      if (onStatusChange) {
        await onStatusChange(booking.id, newStatus);
      }
      setCurrentStatus(newStatus);
      setSuccessMsg('Đã cập nhật trạng thái ca chụp thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl rounded-3xl border border-[#F0E4E6] bg-white p-6 sm:p-7 shadow-[0_20px_60px_rgb(184,80,100,0.15)] text-[#261A1E] max-h-[90vh] flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#B85064] bg-[#FDF0F3] px-2.5 py-0.5 rounded-md border border-[#F5D5DC]">
                Mã đơn #{booking.id}
              </span>
              <h2 className="text-base font-bold text-[#261A1E]">
                Chi Tiết Ca Chụp
              </h2>
            </div>
            <p className="text-xs text-[#7A6C71] mt-0.5">
              Dữ liệu đơn đặt lịch thực tế từ bảng bookings trong CSDL.
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
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard
              icon={User}
              label="Khách hàng"
              value={booking.customerName}
            />
            <InfoCard
              icon={Phone}
              label="Số điện thoại"
              value={booking.customerPhone}
            />
            <InfoCard
              icon={Calendar}
              label="Ngày chụp"
              value={formatDate(booking.bookingDate)}
            />
            <InfoCard
              icon={Clock}
              label="Khung giờ ca chụp"
              value={formatTime(booking.startTime, booking.endTime)}
            />
            <InfoCard
              icon={MapPin}
              label="Phòng chụp / Bối cảnh"
              value={booking.roomName || (booking.roomId ? `Phòng #${booking.roomId}` : 'Chưa phân phòng')}
            />
            <InfoCard
              icon={CheckCircle2}
              label="Trạng thái hiện tại"
              value={
                STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label ||
                currentStatus
              }
            />
          </div>

          {/* Customer Specific Note */}
          <div className="p-4 rounded-2xl bg-[#FDF0F3]/60 border border-[#F5D5DC] space-y-1.5">
            <p className="font-bold text-[#B85064] flex items-center gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              <span>Ghi Chú Yêu Cầu Của Khách Hàng:</span>
            </p>
            <p className="text-[#261A1E] leading-relaxed text-xs italic">
              {booking.customerNote || 'Không có ghi chú thêm từ khách hàng.'}
            </p>
          </div>

          {/* Real-time Status Changer */}
          <div className="p-4 rounded-2xl border border-[#F0E4E6] bg-white space-y-3">
            <label className="font-bold text-xs text-[#261A1E] block">
              Cập Nhật Trạng Thái Ca Chụp (Lưu trực tiếp vào CSDL):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = currentStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(opt.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? `${opt.color} ring-2 ring-[#B85064]/30 shadow-sm`
                        : 'border-[#F0E4E6] bg-[#FAF5F5] text-[#7A6C71] hover:border-[#B85064] hover:bg-white hover:text-[#261A1E]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {successMsg && (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{successMsg}</span>
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-[#F0E4E6] shrink-0">
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
