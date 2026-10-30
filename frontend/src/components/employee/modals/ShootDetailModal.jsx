import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  DoorOpen,
  User,
  Phone,
  FileText,
  CheckCircle2,
  Camera,
  Shirt,
  Sparkles,
  Package,
  Layers,
  Users,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import employeeBookingService from '../../../services/employee/bookingService';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xử lý', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'text-sky-700 bg-sky-50 border-sky-200' },
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
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-[#7A6C71] font-semibold">{label}</p>
        <p className="mt-0.5 text-xs font-bold text-[#261A1E] break-words">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

export default function ShootDetailModal({
  booking,
  onClose,
  onStatusChange,
}) {
  if (!booking) return null;

  const [currentStatus, setCurrentStatus] = useState(booking.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Dữ liệu chi tiết tác nghiệp
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [equipments, setEquipments] = useState([]);
  const [clothing, setClothing] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Active section tab trong modal: 'overview', 'equipment', 'clothing_accessory', 'package'
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let isMounted = true;
    const fetchBookingDetails = async () => {
      setLoadingDetails(true);
      try {
        const [pkgRes, assignRes] = await Promise.allSettled([
          employeeBookingService.getPackages(booking.id),
          employeeBookingService.getAssignments(booking.id),
        ]);

        if (!isMounted) return;

        setEquipments([]);
        setClothing([]);
        setAccessories([]);
        setServices([]);
        if (pkgRes.status === 'fulfilled' && Array.isArray(pkgRes.value)) {
          setPackages(pkgRes.value);
        }
        if (assignRes.status === 'fulfilled' && Array.isArray(assignRes.value)) {
          setAssignments(assignRes.value);
        }
      } catch (err) {
        console.warn('Lỗi khi tải dữ liệu phụ của booking:', err);
      } finally {
        if (isMounted) setLoadingDetails(false);
      }
    };

    fetchBookingDetails();

    return () => {
      isMounted = false;
    };
  }, [booking.id]);

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
  };

  const formatTime = (start, end) => {
    if (!start && !end) return 'Chưa xếp giờ';
    const s = String(start || '').slice(0, 5);
    const e = String(end || '').slice(0, 5);
    return `${s || '—'} - ${e || '—'}`;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl rounded-3xl border border-[#F0E4E6] bg-white p-6 sm:p-7 shadow-[0_20px_60px_rgb(184,80,100,0.2)] text-[#261A1E] max-h-[92vh] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#B85064] bg-[#FDF0F3] px-2.5 py-0.5 rounded-lg border border-[#F5D5DC]">
                Ca Chụp #{booking.id}
              </span>
              <h2 className="text-base font-extrabold text-[#261A1E]">
                Chi Tiết Toàn Bộ Buổi Chụp
              </h2>
            </div>
            <p className="text-xs text-[#7A6C71] mt-0.5">
              Thông tin chi tiết về thiết bị, trang phục, phụ kiện và gói dịch vụ.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#261A1E] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs bên trong Modal */}
        <div className="flex items-center gap-2 border-b border-[#F0E4E6] pb-2 shrink-0 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#FDF0F3] text-[#B85064] border border-[#F5D5DC]'
                : 'text-[#7A6C71] hover:text-[#261A1E] hover:bg-[#FAF5F5]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Thông Tin Ca Chụp</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'equipment'
                ? 'bg-[#FDF0F3] text-[#B85064] border border-[#F5D5DC]'
                : 'text-[#7A6C71] hover:text-[#261A1E] hover:bg-[#FAF5F5]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Thiết Bị ({equipments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clothing_accessory')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'clothing_accessory'
                ? 'bg-[#FDF0F3] text-[#B85064] border border-[#F5D5DC]'
                : 'text-[#7A6C71] hover:text-[#261A1E] hover:bg-[#FAF5F5]'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Trang Phục & Phụ Kiện ({clothing.length + accessories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('package')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'package'
                ? 'bg-[#FDF0F3] text-[#B85064] border border-[#F5D5DC]'
                : 'text-[#7A6C71] hover:text-[#261A1E] hover:bg-[#FAF5F5]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Gói & Nhân Sự</span>
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-[#F0E4E6] text-xs flex-1">
          {loadingDetails && (
            <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-2xl text-xs font-semibold border border-amber-200">
              <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
              <span>Đang tải thông tin thiết bị, trang phục và phụ kiện...</span>
            </div>
          )}

          {/* TAB 1: THÔNG TIN TỔNG QUAN CA CHỤP */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  icon={User}
                  label="Khách hàng"
                  value={booking.customerName}
                />
                <InfoCard
                  icon={Phone}
                  label="Số điện thoại liên hệ"
                  value={booking.customerPhone}
                />
                <InfoCard
                  icon={Calendar}
                  label="Ngày chụp tác nghiệp"
                  value={formatDate(booking.bookingDate)}
                />
                <InfoCard
                  icon={Clock}
                  label="Khung giờ ca chụp"
                  value={formatTime(booking.startTime, booking.endTime)}
                />
                <InfoCard
                  icon={DoorOpen}
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

              {/* Tóm tắt nhanh số lượng trang thiết bị */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] text-center">
                <div className="cursor-pointer hover:bg-white p-2 rounded-xl transition-all" onClick={() => setActiveTab('equipment')}>
                  <span className="text-[10px] text-[#7A6C71] font-semibold block">Thiết Bị</span>
                  <span className="text-sm font-extrabold text-[#B85064]">{equipments.length}</span>
                  <span className="text-[10px] text-[#9E8E93] block">Xem chi tiết →</span>
                </div>
                <div className="cursor-pointer hover:bg-white p-2 rounded-xl transition-all" onClick={() => setActiveTab('clothing_accessory')}>
                  <span className="text-[10px] text-[#7A6C71] font-semibold block">Trang Phục</span>
                  <span className="text-sm font-extrabold text-[#B85064]">{clothing.length}</span>
                  <span className="text-[10px] text-[#9E8E93] block">Xem chi tiết →</span>
                </div>
                <div className="cursor-pointer hover:bg-white p-2 rounded-xl transition-all" onClick={() => setActiveTab('clothing_accessory')}>
                  <span className="text-[10px] text-[#7A6C71] font-semibold block">Phụ Kiện</span>
                  <span className="text-sm font-extrabold text-[#B85064]">{accessories.length}</span>
                  <span className="text-[10px] text-[#9E8E93] block">Xem chi tiết →</span>
                </div>
              </div>

              {/* Ghi chú yêu cầu của khách */}
              <div className="p-4 rounded-2xl bg-[#FDF0F3]/60 border border-[#F5D5DC] space-y-1.5">
                <p className="font-bold text-[#B85064] flex items-center gap-1.5 text-xs">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Ghi Chú Yêu Cầu Của Khách Hàng:</span>
                </p>
                <p className="text-[#261A1E] leading-relaxed text-xs italic">
                  {booking.customerNote || 'Không có ghi chú thêm từ khách hàng.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CHI TIẾT THIẾT BỊ (EQUIPMENT) */}
          {activeTab === 'equipment' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#261A1E]">
                  Tổng số thiết bị phân công cho ca: {equipments.length} món
                </span>
                <span className="text-[11px] text-[#7A6C71]">
                  Body, Lens, Đèn Flash, Chân máy
                </span>
              </div>

              {equipments.length > 0 ? (
                <div className="space-y-2">
                  {equipments.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white border border-[#F0E4E6] flex items-center justify-center text-[#B85064] shrink-0 font-bold text-xs">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#261A1E] truncate">
                            {item.equipmentName || item.name || `Thiết bị #${item.equipmentId}`}
                          </p>
                          <p className="text-[11px] text-[#7A6C71] font-mono">
                            Loại: {item.equipmentType || item.type || 'Thiết bị chụp'}
                            {item.equipmentSerialNumber && ` • S/N: ${item.equipmentSerialNumber}`}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shrink-0">
                        {item.status || 'Đã phân bổ'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-[#9E8E93] bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
                  Chưa có thiết bị nào được gán riêng cho ca chụp này (hoặc dùng thiết bị mặc định của phòng).
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRANG PHỤC & PHỤ KIỆN */}
          {activeTab === 'clothing_accessory' && (
            <div className="space-y-4">
              {/* Trang phục */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#261A1E] flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-[#B85064]" />
                    Trang Phục Cho Buổi Chụp ({clothing.length})
                  </span>
                </div>

                {clothing.length > 0 ? (
                  <div className="space-y-2">
                    {clothing.map((cloth, idx) => (
                      <div
                        key={cloth.id || idx}
                        className="p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[#261A1E]">
                            {cloth.clothName || cloth.name || `Trang phục #${cloth.clothId || idx + 1}`}
                          </p>
                          <p className="text-[11px] text-[#7A6C71]">
                            Size: {cloth.size || 'Tiêu chuẩn'} • Màu: {cloth.color || 'Theo mẫu'} • Số lượng: {cloth.quantity || 1}
                          </p>
                        </div>
                        {cloth.note && (
                          <span className="text-[10px] text-[#7A6C71] bg-white px-2 py-0.5 rounded border border-[#F0E4E6]">
                            {cloth.note}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9E8E93] py-6 text-center bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
                    Khách hàng tự chuẩn bị trang phục (hoặc chưa chọn trang phục studio).
                  </p>
                )}
              </div>

              {/* Phụ kiện */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#261A1E] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B85064]" />
                    Phụ Kiện Đạo Cụ Đi Kèm ({accessories.length})
                  </span>
                </div>

                {accessories.length > 0 ? (
                  <div className="space-y-2">
                    {accessories.map((acc, idx) => (
                      <div
                        key={acc.id || idx}
                        className="p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[#261A1E]">
                            {acc.accessoryName || acc.name || `Phụ kiện #${acc.accessoryId || idx + 1}`}
                          </p>
                          <p className="text-[11px] text-[#7A6C71]">
                            Số lượng: {acc.quantity || 1} • {acc.type || 'Đạo cụ decor'}
                          </p>
                        </div>
                        {acc.note && (
                          <span className="text-[10px] text-[#7A6C71] bg-white px-2 py-0.5 rounded border border-[#F0E4E6]">
                            {acc.note}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9E8E93] py-6 text-center bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
                    Không có phụ kiện riêng lẻ.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GÓI CHỤP, DỊCH VỤ & NHÂN SỰ */}
          {activeTab === 'package' && (
            <div className="space-y-4">
              {/* Gói chụp */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#261A1E] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#B85064]" />
                  Gói Chụp Đã Đặt ({packages.length})
                </span>
                {packages.length > 0 ? (
                  <div className="space-y-2">
                    {packages.map((pkg, idx) => (
                      <div key={pkg.id || idx} className="p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]">
                        <p className="font-bold text-[#261A1E]">{pkg.packageName || pkg.name || `Gói #${pkg.packageId}`}</p>
                        {pkg.description && <p className="text-[11px] text-[#7A6C71] mt-0.5">{pkg.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9E8E93] py-4 text-center bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
                    Gói chụp cơ bản.
                  </p>
                )}
              </div>

              {/* Dịch vụ phát sinh */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#261A1E] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B85064]" />
                  Dịch Vụ Đi Kèm ({services.length})
                </span>
                {services.length > 0 ? (
                  <div className="space-y-2">
                    {services.map((srv, idx) => (
                      <div key={srv.id || idx} className="p-3 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex items-center justify-between">
                        <span className="font-bold text-[#261A1E]">{srv.serviceName || srv.name}</span>
                        <span className="text-[11px] text-[#7A6C71]">SL: {srv.quantity || 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9E8E93] py-4 text-center bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
                    Không có dịch vụ thêm.
                  </p>
                )}
              </div>

              {/* Phân công nhân sự */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#261A1E] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#B85064]" />
                  Nhân Sự Phân Công ({assignments.length})
                </span>
                {assignments.length > 0 ? (
                  <div className="space-y-2">
                    {assignments.map((asg, idx) => (
                      <div key={asg.id || idx} className="p-3 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#261A1E]">{asg.employeeName || `Nhân viên #${asg.employeeId}`}</p>
                          <p className="text-[11px] text-[#7A6C71]">Vai trò: {asg.role || 'Nhiếp ảnh gia'}</p>
                        </div>
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                          {asg.status || 'Đã phân công'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9E8E93] py-4 text-center bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6]">
                    Chưa có danh sách phân công cụ thể.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cập nhật tiến độ ca chụp 1 luồng duy nhất */}
          <div className="p-4 rounded-2xl border border-[#F0E4E6] bg-white space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-[#261A1E] block">
                Tiến Độ & Trạng Thái Tác Nghiệp:
              </label>
              <span className="text-[11px] text-[#7A6C71]">
                Cập nhật 1 chiều tránh nhảy trạng thái
              </span>
            </div>

            {/* 1. Khi đang ở 'pending' (Chờ xác nhận) */}
            {currentStatus === 'pending' && (
              <div className="space-y-2">
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                  Ca chụp mới được điều phối. Bạn cần xác nhận tiếp nhận hoặc từ chối ca:
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus('confirmed')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác nhận tiếp nhận ca</span>
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus('cancelled')}
                    className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Từ chối ca</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Khi đang ở 'confirmed' (Đã xác nhận) */}
            {currentStatus === 'confirmed' && (
              <div className="space-y-2">
                <p className="text-xs text-sky-800 bg-sky-50 border border-sky-200 p-2.5 rounded-xl">
                  Ca chụp đã xác nhận sẵn sàng. Khi bắt đầu tác nghiệp tại phòng chụp:
                </p>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('in_progress')}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  <span>Bắt đầu chụp (Chuyển sang "Đang chụp")</span>
                </button>
              </div>
            )}

            {/* 3. Khi đang ở 'in_progress' (Đang chụp) */}
            {currentStatus === 'in_progress' && (
              <div className="space-y-2">
                <p className="text-xs text-purple-800 bg-purple-50 border border-purple-200 p-2.5 rounded-xl">
                  Buổi chụp đang diễn ra. Khi chụp xong và bàn giao bối cảnh:
                </p>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('completed')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hoàn thành ca chụp (Chuyển sang "Hoàn thành")</span>
                </button>
              </div>
            )}

            {/* 4. Khi đã ở 'completed' (Hoàn thành) */}
            {currentStatus === 'completed' && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">Ca chụp đã hoàn thành xuất sắc!</p>
                  <p className="text-emerald-700 text-[11px] mt-0.5">Trạng thái đã được chốt và không thể thay đổi để tránh nhảy tiến độ.</p>
                </div>
              </div>
            )}

            {/* 5. Khi đã ở 'cancelled' (Đã từ chối / Đã hủy) */}
            {currentStatus === 'cancelled' && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">Ca chụp đã từ chối hoặc đã hủy.</p>
                  <p className="text-rose-700 text-[11px] mt-0.5">Đơn không còn hiệu lực tác nghiệp.</p>
                </div>
              </div>
            )}

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
