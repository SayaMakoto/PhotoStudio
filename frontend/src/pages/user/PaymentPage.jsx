import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CreditCardIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TicketIcon,
  ArrowRightIcon,
  UserIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';

import {
  FloralBranchCorner,
  FloralCardCorner,
} from '../../components/common/FloralDecorations';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import customerRoomService from '../../services/user/roomService';
import customerBookingService from '../../services/user/bookingService';
import customerPaymentService from '../../services/user/paymentService';
import { createVNPayPaymentUrl } from '../../lib/vnpay';

// Helper an toàn tuyệt đối định dạng tiền tệ Việt Nam (chống crash khi null/undefined)
const formatMoney = (val) => {
  const num = Number(val) || 0;
  return num.toLocaleString('vi-VN');
};

// Khung giờ chụp chuẩn đồng bộ 100% với trang Đặt Lịch (BookingPage)
const TIME_SLOTS = [
  { id: 'm1', label: '08:30 – 10:30 (Sáng)', start: '08:30:00', end: '10:30:00' },
  { id: 'm2', label: '10:30 – 12:30 (Trưa)', start: '10:30:00', end: '12:30:00' },
  { id: 'a1', label: '13:30 – 15:30 (Chiều)', start: '13:30:00', end: '15:30:00' },
  { id: 'a2', label: '16:00 – 18:00 (Hoàng hôn)', start: '16:00:00', end: '18:00:00' },
  { id: 'e1', label: '18:30 – 20:30 (Tối Studio)', start: '18:30:00', end: '20:30:00' },
];

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Nhận dữ liệu truyền từ trang Booking hoặc Packages (hỗ trợ cả location.state và sessionStorage)
  const stateData = useMemo(() => {
    if (location.state && typeof location.state === 'object' && Object.keys(location.state).length > 0) {
      return location.state;
    }
    try {
      const saved = sessionStorage.getItem('pending_payment_state') || sessionStorage.getItem('pending_booking_order');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, [location.state]);

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialPackageId = Number(queryParams.get('packageId') || stateData.packageId || 1);
  const initialRoomId = Number(queryParams.get('roomId') || stateData.roomId || 3);

  // User hiện tại
  const currentUser = customerAuth.getUser();

  // 1. STATE THÔNG TIN KHÁCH HÀNG
  const customerName = stateData.customerName || stateData.name || currentUser?.fullname || currentUser?.fullName || currentUser?.username || 'Khách hàng';
  const customerPhone = stateData.customerPhone || stateData.phone || currentUser?.phone || '';
  const customerEmail = stateData.customerEmail || stateData.email || currentUser?.email || '';
  const attendees = Number(stateData.attendees) || 1;
  const customerNote = stateData.customerNote || stateData.note || '';

  // 2. STATE PHÒNG CHỤP STUDIO
  const [roomsList] = useState([]);
  const selectedRoomId = initialRoomId;

  // 3. STATE THỜI GIAN & LỊCH HẸN
  const bookingDate = stateData.bookingDate || stateData.date || new Date().toISOString().split('T')[0];
  const selectedTimeSlot = useMemo(() => {
    if (stateData.selectedTimeSlot) return stateData.selectedTimeSlot;
    const match = TIME_SLOTS.find((s) => s.label === stateData.time);
    return match || TIME_SLOTS[0];
  }, [stateData]);

  // 4. STATE GÓI CHỤP STUDIO
  const [packagesList, setPackagesList] = useState([]);
  const selectedPackageId = initialPackageId;

  // 5. STATE HÌNH THỨC & PHƯƠNG THỨC THANH TOÁN (PHẦN MỞ RỘNG CỦA PAYMENT)
  const [paymentType, setPaymentType] = useState('deposit'); // 'deposit' | 'full'
  const [depositPercent, setDepositPercent] = useState(30); // 30 | 50
  const [paymentMethod, setPaymentMethod] = useState('vnpay'); // 'vnpay' | 'cash'

  // 6. STATE MÃ ƯU ĐÃI
  const [promoCodeInput, setPromoCodeInput] = useState(() => stateData.promoCode || 'STUDIO2026');
  const [appliedPromo, setAppliedPromo] = useState(() => {
    const rawCode = (stateData.promoCode || 'STUDIO2026') + '';
    const code = rawCode.trim().toUpperCase();
    const userId = currentUser?.id || currentUser?.username || stateData.customerPhone;
    const isAlreadyUsed = customerPaymentService.checkPromoCodeUsage(userId, code);
    if (!isAlreadyUsed && (code === 'STUDIO2026' || code === 'ONLINE2026' || code === 'VIP2026')) {
      return { code, discountPercent: 20 };
    }
    return null;
  });
  const [promoError, setPromoError] = useState('');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState(() => {
    const rawCode = (stateData.promoCode || 'STUDIO2026') + '';
    const code = rawCode.trim().toUpperCase();
    const userId = currentUser?.id || currentUser?.username || stateData.customerPhone;
    const isAlreadyUsed = customerPaymentService.checkPromoCodeUsage(userId, code);
    if (!isAlreadyUsed && (code === 'STUDIO2026' || code === 'ONLINE2026' || code === 'VIP2026')) {
      return `Đã áp mã ${code}: Giảm 20% trên giá gốc khi đặt lịch trực tuyến!`;
    }
    return '';
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);

  useEffect(() => {
    customerBookingService.getAllBookings()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        setExistingBookings(list);
      })
      .catch((err) => console.warn('Lỗi tải bookings tại PaymentPage:', err.message));
  }, []);


  
  // State được khởi tạo đồng bộ ngay từ queryParams và stateData

  // Load danh sách phòng từ CSDL
  useEffect(() => {
    customerRoomService
      .getAllRooms()
      .then((data) => {
        let rawList = [];
        if (Array.isArray(data)) rawList = data;
        else if (data && Array.isArray(data.data)) rawList = data.data;
        else if (data && Array.isArray(data.content)) rawList = data.content;

        if (rawList.length > 0) {
          const mapped = rawList
            .filter((p) => p.status?.toLowerCase() === 'active' || !p.status)
            .map((p) => {
              const price = Number(p.price) || 990000;
              const originalPrice = Number(p.originalPrice) || price;
              const packageDiscountPercent = Number(p.packageDiscountPercent) || 0;
              return {
                id: p.id,
                name: p.name || `Gói chụp #${p.id}`,
                category: p.category || 'portrait',
                originalPrice,
                price,
                packageDiscountPercent,
                duration: p.duration ? `${p.duration} phút` : '60 phút',
                description: p.description || 'Gói chụp ảnh chất lượng cao tại studio',
                image: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                primaryImage: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
              };
            });
          setPackagesList(mapped);
        }
      })
      .catch((err) => {
        console.warn('[PaymentPage] Dùng danh sách gói chuẩn:', err.message);
      });
  }, []);

  // Phòng chụp đang chọn
  const currentRoom = useMemo(() => {
    const found = roomsList.find((r) => Number(r.id) === Number(selectedRoomId));
    if (found) return found;
    if (stateData && (stateData.roomName || stateData.selectedRoom)) {
      return {
        id: Number(selectedRoomId) || 1,
        name: stateData.roomName || stateData.selectedRoom?.name || 'Phòng Studio',
        capacity: Number(stateData.roomCapacity) || stateData.selectedRoom?.capacity || 4,
        description: stateData.selectedRoom?.description || 'Không gian studio ánh sáng tự nhiên cao cấp',
        primaryImage: stateData.roomImage || stateData.selectedRoom?.image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
        image: stateData.roomImage || stateData.selectedRoom?.image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      };
    }
    return roomsList[0] || null;
  }, [roomsList, selectedRoomId, stateData]);

  // Gói chụp đang chọn
  const currentPackage = useMemo(() => {
    const found = packagesList.find((p) => Number(p.id) === Number(selectedPackageId));
    if (found) return found;
    if (stateData && (stateData.packageName || stateData.selectedPackage || stateData.package)) {
      const pkgObj = stateData.selectedPackage || stateData.package || {};
      return {
        id: Number(selectedPackageId) || 1,
        name: stateData.packageName || pkgObj.name || 'Gói Chụp Ảnh Studio',
        price: Number(stateData.packagePrice) || Number(pkgObj.price) || 990000,
        originalPrice: Number(pkgObj.originalPrice) || Number(stateData.packagePrice) || 990000,
        packageDiscountPercent: Number(pkgObj.packageDiscountPercent) || 0,
        duration: pkgObj.duration ? `${pkgObj.duration} phút` : '60 phút',
        description: pkgObj.description || 'Gói chụp ảnh chất lượng cao tại studio',
        image: stateData.packageImage || pkgObj.imageUrl || pkgObj.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      };
    }
    return packagesList[0] || null;
  }, [packagesList, selectedPackageId, stateData]);

  const isCurrentSlotBooked = useMemo(() => {
    if (!selectedTimeSlot || !currentRoom?.id || !bookingDate) return false;
    return existingBookings.some((b) => {
      if (b.status && b.status.toLowerCase() === 'cancelled') return false;
      if (Number(b.roomId) !== Number(currentRoom.id)) return false;
      const bDate = (b.bookingDate || '').split('T')[0];
      if (bDate !== bookingDate) return false;
      const bStart = b.startTime || (b.bookingDate ? b.bookingDate.split('T')[1]?.slice(0, 8) : null);
      const bEnd = b.endTime;
      if (bStart && bEnd && selectedTimeSlot.start && selectedTimeSlot.end) {
        return bStart < selectedTimeSlot.end && bEnd > selectedTimeSlot.start;
      }
      if (b.bookingTime && selectedTimeSlot.label && b.bookingTime.includes(selectedTimeSlot.label.split(' (')[0])) {
        return true;
      }
      return false;
    });
  }, [selectedTimeSlot, currentRoom, bookingDate, existingBookings]);

  // Xử lý áp mã ưu đãi
  const handleApplyPromoCode = (codeToApply = promoCodeInput) => {
    const code = (codeToApply || '').trim().toUpperCase();
    setPromoError('');
    setPromoSuccessMsg('');

    if (!code) {
      setAppliedPromo(null);
      return;
    }

    const validCodes = ['STUDIO2026', 'ONLINE2026', 'VIP2026'];
    if (!validCodes.includes(code)) {
      setAppliedPromo(null);
      setPromoError('Mã ưu đãi không hợp lệ. Vui lòng nhập mã STUDIO2026 từ trang chủ!');
      return;
    }

    const userId = currentUser?.id || currentUser?.username || customerPhone;
    const isAlreadyUsed = customerPaymentService.checkPromoCodeUsage(userId, code);
    if (isAlreadyUsed) {
      setAppliedPromo(null);
      setPromoError(`Bạn đã sử dụng mã ${code} trong đơn trước đó. Mỗi khách hàng chỉ được áp dụng mã này 01 lần duy nhất!`);
      return;
    }

    const pkgDiscount = Number(currentPackage?.packageDiscountPercent || 0);
    if (pkgDiscount > 20) {
      setAppliedPromo(null);
      setPromoError(`Gói chụp "${currentPackage.name}" hiện đang có ưu đãi ${pkgDiscount}% (>20%). Hệ thống giữ nguyên ưu đãi tốt nhất cho bạn, không thể áp dụng thêm mã ${code}!`);
      return;
    }

    setAppliedPromo({ code, discountPercent: 20 });
    if (pkgDiscount > 0 && pkgDiscount < 20) {
      setPromoSuccessMsg(`Áp dụng thành công mã ${code}: Giảm 20% tính trên giá gốc niêm yết (thay thế mức ưu đãi ${pkgDiscount}% có sẵn của gói).`);
    } else {
      setPromoSuccessMsg(`Áp dụng thành công mã ${code}: Giảm 20% tính trên giá gốc niêm yết.`);
    }
  };

  
  const selectedServices = useMemo(() => {
    if (Array.isArray(stateData?.selectedServices) && stateData.selectedServices.length > 0) {
      return stateData.selectedServices;
    }
    try {
      const stored = sessionStorage.getItem('pending_booking_order');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.selectedServices)) return parsed.selectedServices;
      }
    } catch {
      // Ignored: Bỏ qua lỗi nếu sessionStorage không khả dụng hoặc parse thất bại
    }
    return [];
  }, [stateData]);

  const servicesTotal = useMemo(() => {
    return Number(stateData?.servicesTotal) || selectedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  }, [stateData, selectedServices]);

  // Tính toán bảng giá chi tiết
  const calculation = useMemo(() => {
    const originalPrice = Number(currentPackage?.originalPrice || currentPackage?.price || 0);
    const packageDiscountPercent = Number(currentPackage?.packageDiscountPercent || 0);

    const promoDiscountAmount = appliedPromo ? Math.round(originalPrice * 0.20) : 0;
    const packageDiscountAmount = appliedPromo ? 0 : Math.round(originalPrice * (packageDiscountPercent / 100));
    const finalPackagePrice = appliedPromo
      ? Math.max(0, originalPrice - promoDiscountAmount)
      : Math.max(0, Number(currentPackage?.price ?? (originalPrice - packageDiscountAmount)));

    const totalOrderPrice = finalPackagePrice + servicesTotal;
    const amountToPay = paymentType === 'deposit'
      ? Math.round((totalOrderPrice * (Number(depositPercent) || 30)) / 100)
      : totalOrderPrice;
    const remainingAmount = paymentType === 'deposit'
      ? Math.max(0, totalOrderPrice - amountToPay)
      : 0;

    return {
      originalPrice,
      packageDiscountPercent,
      packageDiscountAmount,
      promoDiscountAmount,
      finalPackagePrice,
      servicesTotal,
      selectedServices,
      totalOrderPrice,
      amountToPay,
      remainingAmount,
    };
  }, [currentPackage, appliedPromo, paymentType, depositPercent, servicesTotal, selectedServices]);

  // Xử lý tạo đơn vào CSDL sau khi người dùng xác nhận thanh toán
  const handleProceedPayment = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ và tên và Số điện thoại!');
      return;
    }

    if (isCurrentSlotBooked) {
      alert(`⚠️ Phòng "${currentRoom?.name}" đã có khách đặt trước vào khung giờ ${selectedTimeSlot?.label} ngày ${bookingDate}.\n\nQuý khách vui lòng quay lại trang Đặt Lịch để chọn ngày hoặc khung giờ khác!`);
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Cổng VNPay Sandbox
      if (paymentMethod === 'vnpay') {
        const tempRefId = Math.floor(100000 + Math.random() * 900000);
        const orderInfo = `PhotoStudio ${paymentType === 'deposit' ? `Coc ${depositPercent}%` : 'Thanh toan'} ${formatMoney(calculation.amountToPay)}d`;
        const txnRef = `BK${tempRefId}_${Date.now()}`;

        sessionStorage.setItem(
          'vnpay_pending_order',
          JSON.stringify({
            customerId: Number(currentUser?.id) > 0 ? Number(currentUser.id) : (stateData.customerId || 2),
            roomId: currentRoom.id,
            roomName: currentRoom.name,
            roomImage: currentRoom.primaryImage || currentRoom.image,
            roomCapacity: currentRoom.capacity,
            packageId: selectedPackageId,
            packageName: currentPackage.name,
            packagePrice: currentPackage.price,
            packageOriginalPrice: currentPackage.originalPrice || currentPackage.price,
            packageDiscountPercent: currentPackage.packageDiscountPercent || 0,
            packageDuration: currentPackage.duration || '60 phút',
            packageImage: currentPackage.primaryImage || currentPackage.image,
            selectedServices: selectedServices,
            servicesTotal: servicesTotal,
            totalOrderPrice: calculation.totalOrderPrice,
            bookingDate,
            bookingTime: selectedTimeSlot?.label || '08:30 – 10:30 (Sáng)',
            startTime: selectedTimeSlot?.start || '08:30:00',
            endTime: selectedTimeSlot?.end || '10:30:00',
            customerName,
            customerPhone,
            customerEmail: customerEmail || currentUser?.email || '',
            attendees,
            customerNote,
            paymentType,
            depositPercent,
            amountToPay: calculation.amountToPay,
            finalPackagePrice: calculation.finalPackagePrice,
            remainingAmount: calculation.remainingAmount,
            appliedPromoCode: appliedPromo?.code || null,
            discountAmount: calculation.promoDiscountAmount || calculation.packageDiscountAmount || 0,
          })
        );

        const vnpUrl = await createVNPayPaymentUrl({
          amount: calculation.amountToPay,
          orderInfo,
          txnRef,
          returnUrl: `${window.location.origin}/payment/vnpay-return`,
        });

        window.location.href = vnpUrl;
        return;
      }

      // 2. Thanh toán tại Studio (Tiền mặt / Chuyển khoản trực tiếp):
      let createdBookingId = null;
      try {
        const customerId = Number(currentUser?.id) > 0 ? Number(currentUser.id) : (stateData.customerId || 2);
        const bookingPayload = {
          customerId,
          roomId: currentRoom.id,
          bookingDate: `${bookingDate}T${selectedTimeSlot?.start || '08:30:00'}`,
          startTime: selectedTimeSlot?.start || '08:30:00',
          endTime: selectedTimeSlot?.end || '10:30:00',
          status: 'pending',
          customerNote: (customerNote || '').slice(0, 255) || null,
        };

        const createdBooking = await customerBookingService.createBooking(bookingPayload);
        createdBookingId = createdBooking?.id;

        if (createdBookingId && selectedPackageId) {
          await customerBookingService.addPackage({
            bookingId: createdBookingId,
            packageId: selectedPackageId,
            quantity: 1,
            unitPrice: calculation.finalPackagePrice,
          }).catch((err) => console.warn('Lưu liên kết gói chụp:', err.message));
        }
      } catch (bookingErr) {
        console.warn('Lỗi lưu đơn đặt lịch trực tiếp:', bookingErr.message);
      }

      if (!createdBookingId) {
        createdBookingId = Math.floor(100000 + Math.random() * 900000);
      }

      try {
        await customerPaymentService.createPayment({
          bookingId: createdBookingId,
          paymentMethod: 'cash',
          amount: calculation.amountToPay,
          status: 'pending',
          note: `Thanh toán tại studio (${paymentType === 'deposit' ? `Cọc ${depositPercent}%` : 'Toàn bộ 100%'})`,
        });
      } catch (payErr) {
        console.warn('Lỗi ghi nhận payment:', payErr.message);
      }

      if (appliedPromo) {
        const userId = currentUser?.id || currentUser?.username || customerPhone;
        customerPaymentService.markPromoCodeUsed(userId, appliedPromo.code);
      }

      try {
        sessionStorage.removeItem('pending_booking_order');
        sessionStorage.removeItem('pending_payment_state');
      } catch {
        // Ignored: Bỏ qua lỗi nếu sessionStorage bị chặn trên môi trường trình duyệt
      }

      navigate(ROUTES.USER.HOME, {
        state: {
          bookingSuccess: true,
          bookingCode: `BK-${createdBookingId}`,
          message: `Đặt lịch thành công! Bạn đã chọn thanh toán ${paymentType === 'deposit' ? `cọc ${depositPercent}%` : 'toàn bộ'} tại studio.`,
        },
      });
    } catch (error) {
      alert('Có lỗi xảy ra trong quá trình xử lý: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  
  
  const renderSubmitButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Đang Xử Lý Giao Dịch...</span>
        </>
      );
    }
    if (paymentMethod === 'vnpay') {
      return (
        <>
          <CreditCardIcon className="w-5 h-5" />
          <span>Thanh Toán VNPay ({formatMoney(calculation.amountToPay)} đ)</span>
          <ArrowRightIcon className="w-4 h-4" />
        </>
      );
    }
    return (
      <>
        <CheckCircleIcon className="w-5 h-5" />
        <span>Xác Nhận Giữ Lịch & Trả Tại Studio</span>
        <ArrowRightIcon className="w-4 h-4" />
      </>
    );
  };

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#2A1D22] pb-20 relative overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Nền studio điện ảnh với breadcrumb và typography sang trọng */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[380px] lg:min-h-[420px] bg-[#141012] overflow-hidden flex items-center pt-24 pb-14 mb-10">
        {/* Background Image & Lighting Studio Effects với độ sáng rõ nét cao */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/90 via-[#141012]/65 to-[#141012]/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[#FAF5F5] pointer-events-none" />

        {/* Ambient spotlight glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-[#E5A8B4]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Họa tiết cành hoa đào nghệ thuật trên nền Hero */}
        <FloralBranchCorner position="top-left" opacity="opacity-90" />
        <FloralBranchCorner position="top-right" opacity="opacity-80" />

        {/* Chữ script viết tay góc phải */}
        <div className="absolute top-28 right-8 sm:right-16 text-white/50 font-handwriting text-2xl sm:text-3xl select-none pointer-events-none transform rotate-3 hidden sm:block">
          Không gian nghệ thuật của riêng bạn ♡
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-3.5 pt-2">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Link to={ROUTES.USER.HOME} className="hover:text-[#E899A8] transition-colors">
                Trang Chủ
              </Link>
              <span>/</span>
              <Link to={ROUTES.USER.BOOKING} className="hover:text-[#E899A8] transition-colors">
                Đặt Lịch
              </Link>
              <span>/</span>
              <span className="text-[#E899A8] font-semibold">Xác Nhận & Thanh Toán</span>
            </div>

            <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#E5A8B4]">
              HỆ THỐNG XÁC NHẬN ĐẶT LỊCH & THANH TOÁN AN TOÀN
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.25] font-serif-luxury">
              Xác Nhận Đơn Hàng &
              <br />
              <span className="italic font-normal text-[#E899A8] font-serif-luxury mr-2">
                Tiến Hành
              </span>
              Thanh Toán
            </h1>

            <p className="text-[#E2D5D9] text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed pt-1">
              Xem lại toàn bộ thông tin phòng chụp, thời gian và gói chụp đã chọn. Hỗ trợ đặt cọc giữ lịch hoặc thanh toán 100% an toàn trực tuyến hoặc tại studio.
            </p>

            {/* Banner ưu đãi 20% */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-xs sm:text-sm text-white">
                <TicketIcon className="w-4 h-4 text-[#E899A8] shrink-0 animate-bounce" />
                <span>
                  Áp dụng mã ưu đãi{' '}
                  <strong className="font-mono font-bold bg-[#B85064] text-white px-2 py-0.5 rounded-md">
                    STUDIO2026
                  </strong>{' '}
                  giảm 20% trực tiếp trên giá gốc niêm yết!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ========================================================================= */}
        {/* BỐ CỤC 2 CỘT CÂN BẰNG: TÓM TẮT ĐẶT LỊCH (TRÁI) & XÁC NHẬN THANH TOÁN (PHẢI) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">

          {/* CỘT TRÁI (6 PHẦN): BẢNG TÓM TẮT ĐẶT LỊCH, THÔNG TIN KHÁCH HÀNG & CHI TIẾT GIÁ */}
          <section className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
            <FloralCardCorner position="top-right" />
            <FloralCardCorner position="bottom-left" />

            <div className="space-y-6">
              {/* Header Tóm tắt */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0E4E6] gap-2">
                <div>
                  <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                    Bảng Tóm Tắt Đặt Lịch
                  </h2>
                  <p className="text-xs text-[#7A6C71]">
                    Toàn bộ thông tin phòng chụp, gói chụp và thông tin khách hàng
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#B85064] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#F0D5DA] self-start sm:self-auto shrink-0">
                  {paymentMethod === 'vnpay' ? 'VNPay Sandbox' : 'Thanh toán Studio'}
                </span>
              </div>

              {/* KHỐI 1: KHÔNG GIAN PHÒNG CHỤP & GÓI CHỤP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phòng Chụp */}
                <div className="p-3.5 rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5]/60 flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-900 shadow-xs">
                    <img
                      src={currentRoom?.primaryImage || currentRoom?.image}
                      alt={currentRoom?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#B85064] uppercase tracking-wider block">
                      Phòng Chụp Studio
                    </span>
                    <h3 className="font-bold text-xs text-[#2A1D22] truncate">
                      {currentRoom?.name}
                    </h3>
                    <p className="text-[11px] text-[#7A6C71] mt-0.5">
                      Sức chứa: {currentRoom?.capacity || 8} người
                    </p>
                  </div>
                </div>

                {/* Gói Chụp */}
                <div className="p-3.5 rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5]/60 flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-900 shadow-xs">
                    <img
                      src={currentPackage?.image || currentPackage?.primaryImage}
                      alt={currentPackage?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#B85064] uppercase tracking-wider block">
                      Gói Chụp Nghệ Thuật
                    </span>
                    <h3 className="font-bold text-xs text-[#2A1D22] truncate">
                      {currentPackage?.name}
                    </h3>
                    <p className="text-[11px] text-[#7A6C71] mt-0.5">
                      Thời lượng: {currentPackage?.duration || '60 phút'}
                    </p>
                  </div>
                </div>
              </div>

              {/* DỊCH VỤ NÂNG CAO ĐÍNH KÈM */}
              {selectedServices.length > 0 && (
                <div className="p-3.5 rounded-2xl border border-[#F0E4E6] bg-[#FFF0F2]/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#B85064] uppercase tracking-wider flex items-center gap-1.5">
                      <SparklesIcon className="w-3.5 h-3.5" />
                      <span>Dịch Vụ Nâng Cao ({selectedServices.length})</span>
                    </span>
                    <strong className="text-xs text-[#B85064]">
                      +{formatMoney(servicesTotal)} đ
                    </strong>
                  </div>
                  <div className="space-y-1">
                    {selectedServices.map((srv, idx) => (
                      <div key={srv.id || idx} className="flex justify-between text-xs text-[#55464B]">
                        <span>• {srv.name}</span>
                        <span className="font-semibold text-[#B85064]">+{formatMoney(Number(srv.price || 0))} đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* KHỐI 2: THỜI GIAN LỊCH HẸN & THÔNG TIN KHÁCH HÀNG */}
              <div className="p-4 rounded-2xl border border-[#F0E4E6] bg-[#FFFBFB] space-y-3">
                <div className="flex items-center gap-2 pb-2.5 border-b border-[#F5EAEB] text-xs text-[#2A1D22] font-bold">
                  <UserIcon className="w-4 h-4 text-[#B85064]" />
                  <span>Thông Tin Khách Hàng & Lịch Hẹn Đặt Chụp</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="text-[#7A6C71]">Khách hàng:</span>{' '}
                    <strong className="text-[#2A1D22]">{customerName}</strong>
                  </div>
                  <div>
                    <span className="text-[#7A6C71]">Số điện thoại:</span>{' '}
                    <strong className="text-[#2A1D22]">{customerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-[#7A6C71]">Email:</span>{' '}
                    <span className="text-[#2A1D22] font-medium">{customerEmail || 'Chưa cung cấp'}</span>
                  </div>
                  <div>
                    <span className="text-[#7A6C71]">Số người tham gia:</span>{' '}
                    <strong className="text-[#B85064]">{attendees} người</strong>
                  </div>
                  <div className="sm:col-span-2 pt-1 border-t border-[#F5EAEB]/80 flex items-center gap-2 text-[11px]">
                    <span className="text-[#7A6C71] shrink-0">Lịch chụp:</span>
                    <strong className="text-[#B85064] font-semibold">
                      {bookingDate} • {selectedTimeSlot?.label || '08:30 – 10:30 (Sáng)'}
                    </strong>
                  </div>
                  {customerNote && (
                    <div className="sm:col-span-2 text-[11px] text-[#7A6C71] italic">
                      <span className="font-semibold text-neutral-600">Ghi chú:</span> {customerNote}
                    </div>
                  )}
                </div>
              </div>

              {/* KHỐI 3: CHI TIẾT PHẦN GIÁ CỦA GÓI & TÍNH TOÁN */}
              <div className="p-4 rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DCDE]">
                  <span className="text-xs font-bold text-[#2A1D22] uppercase tracking-wider">
                    Dự Tính Chi Phí Gói Chụp
                  </span>
                  <span className="text-[11px] text-[#7A6C71]">
                    Đã bao gồm VAT & trang thiết bị
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#55464B]">
                  <div className="flex justify-between items-center">
                    <span>Giá niêm yết gói chụp:</span>
                    <span className="font-semibold text-[#2A1D22]">
                      {formatMoney(calculation.originalPrice)} đ
                    </span>
                  </div>

                  {calculation.packageDiscountAmount > 0 && !appliedPromo && (
                    <div className="flex justify-between items-center text-rose-600">
                      <span>Ưu đãi gói ({calculation.packageDiscountPercent}%):</span>
                      <span className="font-bold">
                        -{formatMoney(calculation.packageDiscountAmount)} đ
                      </span>
                    </div>
                  )}

                  {appliedPromo && (
                    <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      <span className="font-semibold flex items-center gap-1">
                        <TicketIcon className="w-3.5 h-3.5" />
                        Mã {appliedPromo.code} (Giảm 20%):
                      </span>
                      <strong className="font-bold">
                        -{formatMoney(calculation.promoDiscountAmount)} đ
                      </strong>
                    </div>
                  )}

                  {servicesTotal > 0 && (
                    <div className="flex justify-between items-center text-[#B85064] font-medium">
                      <span>Dịch vụ nâng cao ({selectedServices.length}):</span>
                      <strong>+{formatMoney(servicesTotal)} đ</strong>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-[#E8DCDE] font-bold text-sm text-[#2A1D22]">
                    <span>Tổng đơn đặt lịch:</span>
                    <span className="text-[#B85064]">
                      {formatMoney(calculation.totalOrderPrice || calculation.finalPackagePrice)} đ
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#E8DCDE] flex justify-between items-center text-sm font-bold text-[#B85064]">
                    <span>Cần thanh toán hôm nay ({paymentType === 'deposit' ? `Cọc ${depositPercent}%` : 'Toàn bộ 100%'}):</span>
                    <span className="text-base sm:text-lg">
                      {formatMoney(calculation.amountToPay)} đ
                    </span>
                  </div>

                  {paymentType === 'deposit' && (
                    <div className="flex justify-between items-center text-xs text-[#7A6C71] pt-1">
                      <span>Còn lại thanh toán tại Studio:</span>
                      <strong className="text-neutral-700">
                        {formatMoney(calculation.remainingAmount)} đ
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* KHỐI 4: KHUNG NHẬP MÃ KHUYẾN MÃI TRỰC TIẾP TRONG BẢNG TÓM TẮT */}

            </div>
          </section>

          {/* CỘT PHẢI (6 PHẦN): HÌNH THỨC & PHƯƠNG THỨC THANH TOÁN */}
          <section className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
            <FloralCardCorner position="top-right" />

            <div className="space-y-6">
              {/* Header Cột phải */}
              <div className="pb-4 border-b border-[#F0E4E6]">
                <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                  Hình Thức & Phương Thức Thanh Toán
                </h2>
                <p className="text-xs text-[#7A6C71]">
                  Lựa chọn cách thức thanh toán phù hợp nhất với bạn
                </p>
              </div>

              {/* 1. HÌNH THỨC THANH TOÁN (CỌC HOẶC 100%) */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6C71] block">
                  1. Chọn Hình Thức Thanh Toán:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Tùy chọn 1: Cọc */}
                  <div
                    onClick={() => setPaymentType('deposit')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${paymentType === 'deposit'
                      ? 'border-[#B85064] bg-[#FDF0F3]/50 shadow-sm ring-1 ring-[#B85064]'
                      : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/40'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064]">
                          Giữ Lịch Chụp
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentType === 'deposit' ? 'border-[#B85064] bg-[#B85064] text-white' : 'border-neutral-300'
                          }`}>
                          {paymentType === 'deposit' && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2A1D22] mb-1">
                        Thanh Toán Đặt Cọc
                      </h4>
                      <p className="text-[11px] text-[#7A6C71] font-light leading-relaxed mb-3">
                        Giữ phòng và ekip chụp. Phần còn lại trả tại studio vào ngày chụp.
                      </p>
                    </div>

                    {paymentType === 'deposit' && (
                      <div className="pt-2.5 border-t border-[#F5EAEB] flex items-center gap-1.5">
                        <span className="text-[11px] text-[#7A6C71]">Mức:</span>
                        {[30, 50].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDepositPercent(pct);
                            }}
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${depositPercent === pct
                              ? 'bg-[#B85064] text-white shadow-xs'
                              : 'bg-white border border-[#F0E4E6] text-[#7A6C71] hover:bg-neutral-50'
                              }`}
                          >
                            Cọc {pct}%
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tùy chọn 2: Trọn gói 100% */}
                  <div
                    onClick={() => setPaymentType('full')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${paymentType === 'full'
                      ? 'border-[#B85064] bg-[#FDF0F3]/50 shadow-sm ring-1 ring-[#B85064]'
                      : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/40'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                          Tiện Lợi Nhất
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentType === 'full' ? 'border-[#B85064] bg-[#B85064] text-white' : 'border-neutral-300'
                          }`}>
                          {paymentType === 'full' && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2A1D22] mb-1">
                        Trọn Gói 100%
                      </h4>
                      <p className="text-[11px] text-[#7A6C71] font-light leading-relaxed mb-3">
                        Thanh toán toàn bộ nhanh gọn. Đến ngày chỉ việc tới chụp và nhận ảnh!
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#F5EAEB] text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>Không phát sinh thêm tại studio</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. PHƯƠNG THỨC THANH TOÁN (VNPAY HOẶC TIỀN MẶT) */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6C71] block">
                  2. Chọn Phương Thức Thanh Toán:
                </span>

                {/* Cổng VNPay */}
                <div
                  onClick={() => setPaymentMethod('vnpay')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'vnpay'
                    ? 'border-[#B85064] bg-[#FDF0F3]/50 shadow-sm ring-1 ring-[#B85064]'
                    : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/40'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-xs shrink-0">
                        VNPAY
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-[#2A1D22]">
                            Cổng Thanh Toán Quốc Gia VNPAY
                          </h4>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Sandbox Test
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6C71] font-light">
                          Thẻ ATM nội địa (NCB, VCB,...), QR Code, Visa, MasterCard
                        </p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${paymentMethod === 'vnpay' ? 'border-[#B85064] bg-[#B85064] text-white' : 'border-neutral-300'
                      }`}>
                      {paymentMethod === 'vnpay' && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                </div>

                {/* Tiền mặt tại Studio */}
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${paymentMethod === 'cash'
                    ? 'border-[#B85064] bg-[#FDF0F3]/50 shadow-sm ring-1 ring-[#B85064]'
                    : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/40'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0">
                      CASH
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2A1D22]">
                        Thanh Toán Trực Tiếp Tại Studio
                      </h4>
                      <p className="text-[11px] text-[#7A6C71] font-light">
                        Thanh toán tiền mặt hoặc chuyển khoản tại quầy lễ tân studio vào ngày chụp
                      </p>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${paymentMethod === 'cash' ? 'border-[#B85064] bg-[#B85064] text-white' : 'border-neutral-300'
                    }`}>
                    {paymentMethod === 'cash' && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl border border-dashed border-[#B85064]/60 bg-[#FFF8F9] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2A1D22] flex items-center gap-1.5">
                      <TicketIcon className="w-4 h-4 text-[#B85064]" />
                      <span>Mã Ưu Đãi / Voucher Giảm Giá</span>
                    </label>
                    <span className="text-[10px] text-[#B85064] font-semibold">
                      Giảm 20% trên giá gốc
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã STUDIO2026..."
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#F0E4E6] text-xs font-mono font-bold text-[#2A1D22] uppercase focus:outline-none focus:border-[#B85064]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyPromoCode(promoCodeInput)}
                      className="px-4 py-2 rounded-xl bg-[#B85064] hover:bg-[#A8394C] text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
                    >
                      Áp Dụng
                    </button>
                  </div>

                  {promoSuccessMsg && (
                    <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircleIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{promoSuccessMsg}</span>
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1">
                      <ExclamationCircleIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{promoError}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Nút thanh toán hành động & bảo mật */}
            <div className="pt-6 border-t border-[#F0E4E6] space-y-3 mt-6">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProceedPayment}
                className="cursor-pointer w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#B85064]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {renderSubmitButtonContent()}
              </button>

              <div className="text-[11px] text-[#7A6C71] flex items-center justify-center gap-2 font-light">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bảo lưu lịch hẹn miễn phí trước 24h • Kết nối thanh toán bảo mật với cổng VNPay Sandbox</span>
              </div>
            </div>
          </section>

        </div>
      </div >
    </div >
  );
}
