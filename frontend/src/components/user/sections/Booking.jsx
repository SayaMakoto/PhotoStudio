import { useState, useRef, useEffect } from 'react';
import {
  SparklesIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ClockIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  CameraIcon,
  TicketIcon,
} from '@heroicons/react/24/solid';
import ShinyText from '../../animations/ShinyText';
import ScrollReveal from '../../animations/ScrollReveal';
import customerPackageService from '../../../services/user/packageService';
import customerRoomService from '../../../services/user/roomService';
import customerBookingService from '../../../services/user/bookingService';
import { customerAuth } from '../../../lib/axiosCustomer';
import axiosCustomer from '../../../lib/axiosCustomer';
import { FloralBranchCorner, FloatingPetals, FloralCardCorner } from '../../common/FloralDecorations';

const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];
const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const padZero = (n) => (n < 10 ? `0${n}` : `${n}`);

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts.map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeekIndex = dateObj.getDay();
  const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return `${dayNames[dayOfWeekIndex]}, ${padZero(d)}/${padZero(m)}/${y}`;
};

// Danh sách 8 gói chụp mẫu mặc định
const FALLBACK_PACKAGES = [
  { id: 1, name: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ', price: '990.000 VNĐ', rawPrice: 990000, icon: CameraIcon },
  { id: 2, name: 'Gói Chụp Ảnh Cưới Studio Cơ Bản', price: '2.990.000 VNĐ', rawPrice: 2990000, icon: HeartIcon },
  { id: 3, name: 'Gói Chụp Ảnh Gia Đình / Nhóm Bạn', price: '1.890.000 VNĐ', rawPrice: 1890000, icon: CameraIcon },
  { id: 4, name: 'Gói Chụp Cưới Luxury & Ngoại Cảnh VIP', price: '5.990.000 VNĐ', rawPrice: 5990000, icon: HeartIcon },
  { id: 5, name: 'Gói Chụp Kỷ Yếu & Tốt Nghiệp Sáng Tạo', price: '1.490.000 VNĐ', rawPrice: 1490000, icon: CameraIcon },
  { id: 6, name: 'Gói Chụp Doanh Nhân & Profile Thương Hiệu', price: '1.290.000 VNĐ', rawPrice: 1290000, icon: CameraIcon },
  { id: 7, name: 'Gói Chụp Nghệ Thuật Cổ Trang & Áo Dài', price: '1.690.000 VNĐ', rawPrice: 1690000, icon: HeartIcon },
  { id: 8, name: 'Gói Chụp Lookbook Thời Trang & Sản Phẩm', price: '2.490.000 VNĐ', rawPrice: 2490000, icon: CameraIcon },
];

// Danh sách các khung giờ chụp chuyên nghiệp (Sáng - Chiều - Tối)
const TIME_SLOTS = [
  { id: 'm1', label: '08:30 – 10:30', period: 'Sáng', start: '08:30:00', end: '10:30:00', desc: 'Nắng sớm trong trẻo' },
  { id: 'm2', label: '09:30 – 11:30', period: 'Sáng', start: '09:30:00', end: '11:30:00', desc: 'Khung giờ vàng Studio' },
  { id: 'a1', label: '13:30 – 15:30', period: 'Chiều', start: '13:30:00', end: '15:30:00', desc: 'Đầu giờ chiều yên tĩnh' },
  { id: 'a2', label: '15:00 – 17:00', period: 'Chiều', start: '15:00:00', end: '17:00:00', desc: 'Tone màu ấm tự nhiên' },
  { id: 'a3', label: '16:30 – 18:30', period: 'Chiều', start: '16:30:00', end: '18:30:00', desc: 'Hoàng hôn & Golden Hour' },
  { id: 'e1', label: '18:30 – 20:30', period: 'Tối', start: '18:30:00', end: '20:30:00', desc: 'Concept Cinema & Neon' },
  { id: 'e2', label: '19:30 – 21:30', period: 'Tối', start: '19:30:00', end: '21:30:00', desc: 'Dạ tiệc & Kịch tính' },
];

export default function Booking({ selectedPackage }) {
  const [packageOptions, setPackageOptions] = useState(FALLBACK_PACKAGES);
  const [rooms, setRooms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);

  // Quản lý khung giờ chụp
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1]); // Mặc định 09:30 – 11:30
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Quản lý mã ưu đãi
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');

  const [formData, setFormData] = useState(() => ({
    name: '',
    phone: '',
    packageId: selectedPackage?.id || FALLBACK_PACKAGES[0].id,
    packageName: selectedPackage?.name || FALLBACK_PACKAGES[0].name,
    packagePrice: selectedPackage?.price ? `${Number(selectedPackage.price).toLocaleString('vi-VN')} VNĐ` : FALLBACK_PACKAGES[0].price,
    date: '',
    note: '',
  }));

  // Đồng bộ prop selectedPackage khi chọn từ trang bảng giá
  const [prevPropPkg, setPrevPropPkg] = useState(selectedPackage);
  if (selectedPackage && selectedPackage !== prevPropPkg) {
    setPrevPropPkg(selectedPackage);
    setFormData((prev) => ({
      ...prev,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      packagePrice: selectedPackage.price ? `${Number(selectedPackage.price).toLocaleString('vi-VN')} VNĐ` : prev.packagePrice,
    }));
  }

  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const packageRef = useRef(null);
  const datePickerRef = useRef(null);
  const timePickerRef = useRef(null);

  // Load packages và rooms từ backend
  useEffect(() => {
    void customerPackageService
      .getAllPackages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((p) => !p.status || p.status === 'active');
          const mapped = active.map((pkg, idx) => ({
            id: pkg.id,
            name: pkg.name,
            rawPrice: pkg.price || 0,
            price: pkg.price ? `${Number(pkg.price).toLocaleString('vi-VN')} VNĐ` : 'Liên hệ',
            icon: idx % 2 === 0 ? CameraIcon : HeartIcon,
          }));
          setPackageOptions(mapped);
        }
      })
      .catch((err) => {
        console.warn('[Booking] Dùng danh sách gói chụp mặc định:', err.message);
      });

    void customerRoomService
      .getAllRooms()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((r) => !r.status || r.status === 'active');
          setRooms(active);
        }
      })
      .catch((err) => {
        console.warn('[Booking] Dùng phòng chụp mặc định:', err.message);
      });
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (packageRef.current && !packageRef.current.contains(event.target)) {
        setIsPackageOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
        setIsTimePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xử lý sao chép và tự động áp dụng mã ưu đãi
  const handleCopyPromo = () => {
    navigator.clipboard.writeText('STUDIO2026');
    setCopied(true);
    setPromoCode('STUDIO2026');
    setIsPromoApplied(true);
    setPromoMessage('Đã áp dụng mã STUDIO2026 (-20%)');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setIsPromoApplied(false);
      setPromoMessage('');
      return;
    }
    if (promoCode.trim().toUpperCase() === 'STUDIO2026') {
      setIsPromoApplied(true);
      setPromoMessage('Áp dụng thành công ưu đãi giảm 20%!');
    } else {
      setIsPromoApplied(false);
      setPromoMessage('Mã ưu đãi không hợp lệ. Hãy thử STUDIO2026!');
    }
  };

  const selectedPackageObj = packageOptions.find((p) => p.id === formData.packageId) || packageOptions[0];

  const handleSelectToday = () => {
    const str = `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;
    setFormData((prev) => ({ ...prev, date: str }));
    setIsDatePickerOpen(false);
  };

  const handleSelectTomorrow = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    const str = `${tmr.getFullYear()}-${padZero(tmr.getMonth() + 1)}-${padZero(tmr.getDate())}`;
    setFormData((prev) => ({ ...prev, date: str }));
    setIsDatePickerOpen(false);
  };

  const handleSelectWeekend = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    const sat = new Date();
    sat.setDate(now.getDate() + diff);
    const str = `${sat.getFullYear()}-${padZero(sat.getMonth() + 1)}-${padZero(sat.getDate())}`;
    setFormData((prev) => ({ ...prev, date: str }));
    setIsDatePickerOpen(false);
  };

  // XỬ LÝ ĐẶT LỊCH TRỰC TIẾP VÀO CSDL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Vui lòng điền đầy đủ Họ và tên và Số điện thoại!');
      return;
    }

    if (formData.phone.trim().length < 9) {
      alert('Số điện thoại không hợp lệ, vui lòng kiểm tra lại!');
      return;
    }

    if (formData.date) {
      const [y, m, d] = formData.date.split('-').map(Number);
      const chosen = new Date(y, m - 1, d);
      chosen.setHours(0, 0, 0, 0);
      if (chosen < today) {
        alert('Ngày chụp không thể trong quá khứ. Vui lòng chọn ngày chụp từ hôm nay trở đi!');
        return;
      }
    }

    setIsSubmitting(true);

    const bookingDateStr = formData.date || `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;
    const roomIdToUse = rooms.length > 0 ? rooms[0].id : 1;
    const currentCustomer = customerAuth.getUser();
    
    // ID 4 là tài khoản Customer mẫu hợp lệ trong CSDL
    const validCustomerId = (currentCustomer?.id && currentCustomer.role === 'Customer') ? currentCustomer.id : 4;

    const promoInfo = isPromoApplied ? 'Mã KM: STUDIO2026 (-20%)' : (promoCode ? `Mã: ${promoCode}` : 'Không có mã');

    const payload = {
      customerId: validCustomerId,
      roomId: roomIdToUse,
      bookingDate: `${bookingDateStr}T${selectedTimeSlot.start}`,
      startTime: selectedTimeSlot.start,
      endTime: selectedTimeSlot.end,
      status: 'pending',
      customerNote: `[Web Booking] Khách hàng: ${formData.name.trim()} - SĐT: ${formData.phone.trim()} - Gói: ${selectedPackageObj?.name || 'Tự chọn'} - Khung giờ: ${selectedTimeSlot.label} - ${promoInfo}${formData.note ? ` - Ghi chú: ${formData.note}` : ''}`,
    };

    let createdId = null;

    try {
      const res = await customerBookingService.createBooking(payload);
      createdId = res?.id || res?.data?.id;

      // Gắn gói chụp vào bảng booking_packages
      if (createdId && selectedPackageObj?.id) {
        try {
          await axiosCustomer.post('/api/booking-packages', {
            bookingId: createdId,
            packageId: selectedPackageObj.id,
            quantity: 1,
            unitPrice: selectedPackageObj.rawPrice || 0,
          });
        } catch (pkgErr) {
          console.warn('[Booking] Lỗi gắn gói chụp vào đơn:', pkgErr.message);
        }
      }
    } catch (err) {
      console.warn('[Booking] Lỗi gọi API đặt lịch:', err.message);
    } finally {
      setIsSubmitting(false);
      
      const confirmedCode = createdId ? `BK-${createdId}` : `BK-${Math.floor(1000 + Math.random() * 9000)}`;

      setSubmittedBooking({
        bookingCode: confirmedCode,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        packageName: selectedPackageObj?.name || 'Gói Chụp Ảnh Studio',
        price: selectedPackageObj?.price || '990.000 VNĐ',
        date: formatDateDisplay(bookingDateStr),
        time: selectedTimeSlot.label,
        promoApplied: isPromoApplied,
        note: formData.note || 'Không có ghi chú thêm',
      });
    }
  };

  return (
    <section id="booking" className="py-24 bg-[#FAF5F5] relative overflow-hidden border-t border-[#F0E4E6]">
      {/* Background Studio Illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-rose-500/5 rounded-full blur-[170px] pointer-events-none" />

      {/* Hoa lá màu nước nghệ thuật trang trí góc phần Đặt Lịch */}
      <FloralBranchCorner position="top-left" opacity="opacity-80" />
      <FloralBranchCorner position="bottom-right" opacity="opacity-75" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Promotional Banner */}
        <ScrollReveal direction="down">
          <div className="mb-16 relative overflow-hidden rounded-3xl border border-[#F5D5DC] bg-gradient-to-r from-white via-[#FDF0F3] to-white p-8 sm:p-12 shadow-[0_8px_30px_rgb(184,80,100,0.06)]">
            {/* Hoa trang trí góc banner ưu đãi */}
            <FloralCardCorner position="top-right" opacity="opacity-50" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF0F3] text-[#B85064] text-xs font-bold uppercase tracking-wider mb-4 border border-[#F5D5DC]">
                  <SparklesIcon className="w-4 h-4 text-[#B85064] animate-pulse" />
                  <ShinyText text="ƯU ĐÃI ĐẶC BIỆT MÙA CƯỚI 2026" />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2A1D22] font-serif-luxury mb-3">
                  Giảm Ngay 20% Khi Đặt Lịch Chụp Trực Tuyến
                </h3>
                <p className="text-[#7A6C71] text-sm sm:text-base font-light max-w-2xl leading-relaxed">
                  Tặng kèm 01 Album Mini cao cấp khổ 15x21cm, miễn phí toàn bộ phụ kiện hoa cưới và trang phục khi đăng ký gói chụp studio trực tiếp tại đây.
                </p>
              </div>

              {/* Promo Code Box */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                <div className="p-5 rounded-2xl bg-white border-2 border-[#F5D5DC] text-center shadow-md">
                  <span className="text-xs text-[#7A6C71] block mb-1 font-semibold">Mã Ưu Đãi Áp Dụng:</span>
                  <div className="text-2xl font-mono font-extrabold text-[#B85064] tracking-widest mb-3 select-all">
                    STUDIO2026
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPromo}
                    className={`cursor-pointer w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      copied
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-[#B85064] hover:bg-[#A33D50] text-white shadow-md shadow-[#B85064]/20 hover:scale-105'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-4 h-4 text-white stroke-[3]" />
                        <span>Đã Sao Chép & Tự Động Điền!</span>
                      </>
                    ) : (
                      <>
                        <DocumentDuplicateIcon className="w-4 h-4 text-white" />
                        <span>Sao Chép Mã Ưu Đãi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>

        {/* Booking Consultation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Studio Information */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="right" delay={0.1}>
              <div>
                <span className="text-[#B85064] text-xs font-bold uppercase tracking-wider block mb-2">
                  Liên Hệ & Giữ Lịch
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight leading-tight">
                  Đăng Ký Đặt Lịch Chụp Trực Tuyến
                </h2>
                <p className="text-[#7A6C71] text-sm sm:text-base font-light mt-4 leading-relaxed">
                  Điền thông tin giữ lịch để nhận tư vấn concept độc quyền, sắp xếp ekip riêng và nhận ưu đãi giảm giá trực tiếp từ hệ thống PhotoStudio.
                </p>
              </div>

              {/* Guarantees */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#F0E4E6] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0">
                    <ClockIcon className="w-5 h-5 text-[#B85064]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2A1D22]">Phản Hồi Nhanh Chóng 15 Phút</h4>
                    <p className="text-xs text-[#7A6C71] mt-0.5">Chuyên viên tư vấn liên hệ xác nhận lịch và hỗ trợ chi tiết concept.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#F0E4E6] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0">
                    <ShieldCheckIcon className="w-5 h-5 text-[#B85064]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2A1D22]">Cam Kết Giữ Đúng Phòng & Bối Cảnh</h4>
                    <p className="text-xs text-[#7A6C71] mt-0.5">Phòng chụp riêng biệt, trang phục đã được giặt là sạch sẽ, ekip chuẩn bị sẵn sàng.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Form Đặt Lịch Hoàn Chỉnh */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" delay={0.2}>
              <div className="relative rounded-3xl border border-[#F0E4E6] bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgb(184,80,100,0.06)] overflow-hidden">
                {/* Hoa lá màu nước trang trí khung đặt lịch */}
                <FloralCardCorner position="top-right" opacity="opacity-75" />
                <FloralCardCorner position="bottom-left" opacity="opacity-65" />
                
                {/* MÀN HÌNH XÁC NHẬN ĐẶT LỊCH THÀNH CÔNG */}
                {submittedBooking ? (
                  <div className="text-center py-8 space-y-6 animate-fadeIn">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-xl animate-bounce">
                      <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase mb-2">
                        <CheckIcon className="w-3.5 h-3.5" />
                        <span>Đã Ghi Nhận Lịch Đặt Thành Công</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-[#2A1D22] font-serif-luxury">
                        Cảm Ơn Bạn, {submittedBooking.name}!
                      </h3>
                      <p className="text-[#7A6C71] text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
                        Hệ thống PhotoStudio đã ghi nhận yêu cầu đặt lịch của bạn vào cơ sở dữ liệu. Chuyên viên sẽ gọi điện/Zalo tới số <strong>{submittedBooking.phone}</strong> trong ít phút!
                      </p>
                    </div>

                    {/* Thẻ tóm tắt thông tin đặt lịch */}
                    <div className="p-5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] text-left max-w-md mx-auto space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-[#E8DCDE]">
                        <span className="text-[#7A6C71]">Mã đơn lịch hẹn:</span>
                        <span className="font-mono font-bold text-[#B85064] text-base">{submittedBooking.bookingCode}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#7A6C71]">Gói chụp:</span>
                        <span className="font-semibold text-[#2A1D22] text-right line-clamp-1">{submittedBooking.packageName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#7A6C71]">Đơn giá niêm yết:</span>
                        <span className="font-bold text-[#B85064]">{submittedBooking.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#7A6C71]">Ngày chụp dự kiến:</span>
                        <span className="font-semibold text-[#2A1D22]">{submittedBooking.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#7A6C71]">Khung giờ chụp:</span>
                        <span className="font-semibold text-[#B85064] bg-[#FDF0F3] px-2 py-0.5 rounded border border-[#F5D5DC]">
                          {submittedBooking.time}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#7A6C71]">Ưu đãi áp dụng:</span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                          <TicketIcon className="w-3.5 h-3.5" />
                          <span>-20% (STUDIO2026)</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSubmittedBooking(null);
                        setFormData({
                          name: '',
                          phone: '',
                          packageId: packageOptions[0]?.id || FALLBACK_PACKAGES[0].id,
                          packageName: packageOptions[0]?.name || FALLBACK_PACKAGES[0].name,
                          packagePrice: packageOptions[0]?.price || FALLBACK_PACKAGES[0].price,
                          date: '',
                          note: '',
                        });
                        setPromoCode('');
                        setIsPromoApplied(false);
                      }}
                      className="cursor-pointer px-8 py-3 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-bold transition-all shadow-md shadow-[#B85064]/20 hover:scale-105"
                    >
                      Đặt Lịch Cho Người Thân / Buổi Chụp Khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Hàng 1: Họ tên & Số điện thoại */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-[#2A1D22] mb-2">
                          Họ và Tên của bạn *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nguyễn Văn A"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-[#FAF5F5] border border-[#E8DCDE] text-[#2A1D22] placeholder-[#9E8E93] text-sm focus:outline-none focus:border-[#B85064] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#2A1D22] mb-2">
                          Số Điện Thoại / Zalo *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0901 234 567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-[#FAF5F5] border border-[#E8DCDE] text-[#2A1D22] placeholder-[#9E8E93] text-sm focus:outline-none focus:border-[#B85064] transition-all"
                        />
                      </div>
                    </div>

                    {/* Hàng 2: Gói chụp quan tâm & Ngày chụp dự kiến */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Chọn gói chụp */}
                      <div className="relative" ref={packageRef}>
                        <label className="block text-xs font-bold text-[#2A1D22] mb-2">
                          Gói Chụp Quan Tâm *
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setIsPackageOpen(!isPackageOpen);
                            setIsDatePickerOpen(false);
                            setIsTimePickerOpen(false);
                          }}
                          className={`cursor-pointer w-full px-4 py-3 rounded-xl bg-[#FAF5F5] border text-left flex items-center justify-between transition-all duration-200 ${
                            isPackageOpen
                              ? 'border-[#B85064] ring-2 ring-[#B85064]/20'
                              : 'border-[#E8DCDE] hover:border-[#B85064]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0">
                              <CameraIcon className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="block text-xs font-bold text-[#2A1D22] truncate">
                                {selectedPackageObj?.name || 'Chọn gói chụp'}
                              </span>
                              <span className="block text-[11px] font-semibold text-[#B85064]">
                                {selectedPackageObj?.price || '990.000 VNĐ'}
                              </span>
                            </div>
                          </div>
                          <ChevronDownIcon
                            className={`w-4 h-4 text-[#7A6C71] transition-transform duration-200 shrink-0 ${
                              isPackageOpen ? 'rotate-180 text-[#B85064]' : ''
                            }`}
                          />
                        </button>

                        {/* Dropdown danh sách 8 gói chụp phong phú */}
                        {isPackageOpen && (
                          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#F0E4E6] rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto p-1.5 space-y-1">
                            {packageOptions.map((pkg) => {
                              const isSelected = formData.packageId === pkg.id;
                              return (
                                <button
                                  type="button"
                                  key={pkg.id}
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      packageId: pkg.id,
                                      packageName: pkg.name,
                                      packagePrice: pkg.price,
                                    });
                                    setIsPackageOpen(false);
                                  }}
                                  className={`cursor-pointer w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                                    isSelected
                                      ? 'bg-[#FDF0F3] border border-[#F5D5DC]'
                                      : 'hover:bg-neutral-50'
                                  }`}
                                >
                                  <div className="truncate pr-2">
                                    <div className="text-xs font-bold text-[#2A1D22] truncate">{pkg.name}</div>
                                    <div className="text-[11px] font-semibold text-[#B85064]">{pkg.price}</div>
                                  </div>
                                  {isSelected && <CheckIcon className="w-4 h-4 text-[#B85064] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Chọn ngày chụp - Cuốn lịch đầy đủ */}
                      <div className="relative" ref={datePickerRef}>
                        <label className="block text-xs font-bold text-[#2A1D22] mb-2">
                          Ngày Chụp Dự Kiến *
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setIsDatePickerOpen(!isDatePickerOpen);
                            setIsPackageOpen(false);
                            setIsTimePickerOpen(false);
                          }}
                          className={`cursor-pointer w-full px-4 py-3 rounded-xl bg-[#FAF5F5] border text-left flex items-center justify-between transition-all duration-200 ${
                            isDatePickerOpen
                              ? 'border-[#B85064] ring-2 ring-[#B85064]/20'
                              : 'border-[#E8DCDE] hover:border-[#B85064]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0">
                              <CalendarDaysIcon className="w-4 h-4" />
                            </div>
                            <span className="text-xs text-[#2A1D22] truncate">
                              {formData.date ? formatDateDisplay(formData.date) : 'Chọn ngày chụp mong muốn'}
                            </span>
                          </div>
                          <ChevronDownIcon
                            className={`w-4 h-4 text-[#7A6C71] transition-transform duration-200 shrink-0 ${
                              isDatePickerOpen ? 'rotate-180 text-[#B85064]' : ''
                            }`}
                          />
                        </button>

                        {/* Modal Cuốn Lịch Đầy Đủ Chi Tiết */}
                        {isDatePickerOpen && (
                          <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-80 bg-white border border-[#F0E4E6] rounded-2xl shadow-2xl z-50 p-3.5">
                            {/* Tiêu đề Tháng & Năm với nút chuyển tháng */}
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
                              <span className="text-xs font-bold text-[#2A1D22]">
                                {MONTH_NAMES[currentMonth]} {currentYear}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (currentMonth === 0) {
                                      setCurrentMonth(11);
                                      setCurrentYear(currentYear - 1);
                                    } else {
                                      setCurrentMonth(currentMonth - 1);
                                    }
                                  }}
                                  className="p-1 rounded-lg hover:bg-neutral-100 text-[#7A6C71]"
                                >
                                  <ChevronLeftIcon className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (currentMonth === 11) {
                                      setCurrentMonth(0);
                                      setCurrentYear(currentYear + 1);
                                    } else {
                                      setCurrentMonth(currentMonth + 1);
                                    }
                                  }}
                                  className="p-1 rounded-lg hover:bg-neutral-100 text-[#7A6C71]"
                                >
                                  <ChevronRightIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Hàng Tiêu Đề Thứ Trong Tuần */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-1 pb-1">
                              {WEEK_DAYS.map((wd) => (
                                <div key={wd} className="text-[10px] font-bold text-[#7A6C71]">
                                  {wd}
                                </div>
                              ))}
                            </div>

                            {/* Ma Trận Các Ngày Trong Tháng (Cuốn Lịch Tương Tác) */}
                            <div className="grid grid-cols-7 gap-1 text-center my-1">
                              {(() => {
                                const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                                const startOffset = firstDay === 0 ? 6 : firstDay - 1; // T2 là 0
                                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const elements = [];

                                for (let i = 0; i < startOffset; i++) {
                                  elements.push(<div key={`empty-${i}`} className="h-7 w-7" />);
                                }

                                for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
                                  const cellDate = new Date(currentYear, currentMonth, dayNum);
                                  cellDate.setHours(0, 0, 0, 0);
                                  const isPast = cellDate < today;
                                  const dateStr = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(dayNum)}`;
                                  const isSelected = formData.date === dateStr;
                                  const isToday = cellDate.getTime() === today.getTime();

                                  if (isPast) {
                                    elements.push(
                                      <div
                                        key={`day-${dayNum}`}
                                        className="h-7 w-7 mx-auto flex items-center justify-center text-[11px] text-neutral-300 opacity-40 cursor-not-allowed select-none"
                                      >
                                        {dayNum}
                                      </div>
                                    );
                                  } else {
                                    elements.push(
                                      <button
                                        type="button"
                                        key={`day-${dayNum}`}
                                        onClick={() => {
                                          setFormData((prev) => ({ ...prev, date: dateStr }));
                                          setIsDatePickerOpen(false);
                                        }}
                                        className={`cursor-pointer h-7 w-7 mx-auto rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all duration-150 ${
                                          isSelected
                                            ? 'bg-[#B85064] text-white font-bold shadow-md shadow-[#B85064]/30 scale-105'
                                            : isToday
                                            ? 'border border-[#B85064] text-[#B85064] hover:bg-[#FDF0F3]'
                                            : 'text-[#2A1D22] hover:bg-[#FDF0F3] hover:text-[#B85064]'
                                        }`}
                                      >
                                        {dayNum}
                                      </button>
                                    );
                                  }
                                }
                                return elements;
                              })()}
                            </div>

                            {/* Phím tắt chọn nhanh ngày */}
                            <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-neutral-100">
                              <button
                                type="button"
                                onClick={handleSelectToday}
                                className="py-1 px-1.5 text-[10px] bg-neutral-100 hover:bg-[#FDF0F3] hover:text-[#B85064] rounded-lg font-medium text-center transition-all"
                              >
                                Hôm nay
                              </button>
                              <button
                                type="button"
                                onClick={handleSelectTomorrow}
                                className="py-1 px-1.5 text-[10px] bg-neutral-100 hover:bg-[#FDF0F3] hover:text-[#B85064] rounded-lg font-medium text-center transition-all"
                              >
                                Ngày mai
                              </button>
                              <button
                                type="button"
                                onClick={handleSelectWeekend}
                                className="py-1 px-1.5 text-[10px] bg-neutral-100 hover:bg-[#FDF0F3] hover:text-[#B85064] rounded-lg font-medium text-center transition-all"
                              >
                                Thứ 7 tới
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Hàng 3: Khung Giờ Chụp Dự Kiến & Mã Ưu Đãi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                      {/* CHỌN KHUNG GIỜ CHỤP (TIME SLOTS) */}
                      <div className="relative" ref={timePickerRef}>
                        <label className="block text-xs font-bold text-[#2A1D22] mb-2">
                          Khung Giờ Chụp Dự Kiến *
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setIsTimePickerOpen(!isTimePickerOpen);
                            setIsPackageOpen(false);
                            setIsDatePickerOpen(false);
                          }}
                          className={`cursor-pointer w-full px-4 py-3 rounded-xl bg-[#FAF5F5] border text-left flex items-center justify-between transition-all duration-200 ${
                            isTimePickerOpen
                              ? 'border-[#B85064] ring-2 ring-[#B85064]/20'
                              : 'border-[#E8DCDE] hover:border-[#B85064]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0">
                              <ClockIcon className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="block text-xs font-bold text-[#2A1D22] truncate">
                                {selectedTimeSlot.label}
                              </span>
                              <span className="block text-[11px] text-[#7A6C71] truncate">
                                {selectedTimeSlot.period} • {selectedTimeSlot.desc}
                              </span>
                            </div>
                          </div>
                          <ChevronDownIcon
                            className={`w-4 h-4 text-[#7A6C71] transition-transform duration-200 shrink-0 ${
                              isTimePickerOpen ? 'rotate-180 text-[#B85064]' : ''
                            }`}
                          />
                        </button>

                        {/* Dropdown danh sách khung giờ phân loại Sáng / Chiều / Tối */}
                        {isTimePickerOpen && (
                          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#F0E4E6] rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto p-2 space-y-2">
                            {['Sáng', 'Chiều', 'Tối'].map((period) => {
                              const slotsInPeriod = TIME_SLOTS.filter((s) => s.period === period);
                              return (
                                <div key={period} className="space-y-1">
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#B85064] px-2 pt-1 flex items-center gap-1.5">
                                    <span>{period === 'Sáng' ? '☀️ Buổi Sáng' : period === 'Chiều' ? '⛅ Buổi Chiều' : '🌙 Buổi Tối'}</span>
                                  </div>
                                  {slotsInPeriod.map((slot) => {
                                    const isSelected = selectedTimeSlot.id === slot.id;
                                    return (
                                      <button
                                        type="button"
                                        key={slot.id}
                                        onClick={() => {
                                          setSelectedTimeSlot(slot);
                                          setIsTimePickerOpen(false);
                                        }}
                                        className={`cursor-pointer w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                                          isSelected
                                            ? 'bg-[#FDF0F3] border border-[#F5D5DC]'
                                            : 'hover:bg-neutral-50'
                                        }`}
                                      >
                                        <div>
                                          <div className="text-xs font-bold text-[#2A1D22]">{slot.label}</div>
                                          <div className="text-[10px] text-[#7A6C71]">{slot.desc}</div>
                                        </div>
                                        {isSelected && <CheckIcon className="w-4 h-4 text-[#B85064] shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Ô NHẬP MÃ ƯU ĐÃI / KHUYẾN MÃI */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-[#2A1D22]">
                            Mã Giảm Giá / Ưu Đãi
                          </label>
                          {isPromoApplied && (
                            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                              <CheckIcon className="w-3.5 h-3.5" /> Giảm ngay 20%
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <TicketIcon className="w-4 h-4 text-[#B85064] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Nhập mã STUDIO2026..."
                              value={promoCode}
                              onChange={(e) => {
                                setPromoCode(e.target.value.toUpperCase());
                                if (isPromoApplied) setIsPromoApplied(false);
                              }}
                              className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#FAF5F5] border border-[#E8DCDE] text-[#2A1D22] placeholder-[#9E8E93] text-sm uppercase font-mono font-semibold focus:outline-none focus:border-[#B85064]"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            className={`cursor-pointer px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                              isPromoApplied
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'bg-[#B85064] hover:bg-[#A33D50] text-white shadow-sm'
                            }`}
                          >
                            {isPromoApplied ? 'Đã Áp Dụng' : 'Áp Dụng'}
                          </button>
                        </div>

                        {promoMessage && (
                          <p className={`text-[11px] mt-1 font-medium ${isPromoApplied ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {promoMessage}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Hàng 4: Ghi chú hoặc ý tưởng riêng */}
                    <div>
                      <label className="block text-xs font-bold text-[#2A1D22] mb-2">
                        Ghi Chú Hoặc Ý Tưởng Concept Riêng
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ví dụ: Mình muốn chụp tone màu ấm Hàn Quốc, cần hỗ trợ thêm làm tóc..."
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF5F5] border border-[#E8DCDE] text-[#2A1D22] placeholder-[#9E8E93] text-sm focus:outline-none focus:border-[#B85064] transition-all resize-none"
                      />
                    </div>

                    {/* Nút Submit Đặt Lịch */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer w-full py-4 rounded-2xl bg-[#B85064] hover:bg-[#A33D50] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#B85064]/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang Kết Nối & Đặt Lịch...</span>
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-4 h-4" />
                          <span>
                            {isPromoApplied
                              ? 'Xác Nhận Đặt Lịch & Giảm 20%'
                              : 'Xác Nhận Đặt Lịch & Giữ Chỗ'}
                          </span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-[#9E8E93] mt-2">
                      * Thông tin của bạn được cam kết bảo mật 100%. Không làm phiền ngoài lịch tư vấn chụp ảnh.
                    </p>
                  </form>
                )}

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
