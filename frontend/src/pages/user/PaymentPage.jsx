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
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/solid';

import BlurText from '../../components/animations/BlurText';
import ShinyText from '../../components/animations/ShinyText';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { FloralBranchCorner, ScatteredPetals } from '../../components/common/FloralDecorations';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import customerPackageService from '../../services/user/packageService';
import customerBookingService from '../../services/user/bookingService';
import customerPaymentService from '../../services/user/paymentService';
import { createVNPayPaymentUrl, VNPAY_TEST_ACCOUNTS } from '../../lib/vnpay';

// Danh sách gói chụp chuẩn đồng bộ 100% CSDL kèm giá gốc & % khuyến mãi niêm yết
const PACKAGES_WITH_PRICING = [
  {
    id: 1,
    name: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
    category: 'portrait',
    originalPrice: 1200000,
    price: 990000,
    packageDiscountPercent: 15, // 15% < 20% -> Áp được mã 20% (thay thế 15%)
    duration: '60 phút',
    description: 'Chụp studio tone Pastel Hàn Quốc, hỗ trợ 1 set trang phục Vintage, makeup cơ bản',
  },
  {
    id: 2,
    name: 'Gói Chụp Ảnh Cưới Studio Cơ Bản',
    category: 'wedding',
    originalPrice: 3750000,
    price: 2990000,
    packageDiscountPercent: 20, // 20% == 20%
    duration: '120 phút',
    description: '2 bối cảnh Cung Điện & Cổ Điển, 1 váy cưới ren Pháp, 1 tuxedo nam, makeup cô dâu',
  },
  {
    id: 3,
    name: 'Gói Chụp Ảnh Gia Đình / Nhóm Bạn',
    category: 'family',
    originalPrice: 2200000,
    price: 1990000,
    packageDiscountPercent: 10, // 10% < 20% -> Áp được mã 20% (thay thế 10%)
    duration: '90 phút',
    description: 'Phòng chụp vintage gia đình 4-8 người, sofa da cổ điển, in ép gỗ cao cấp',
  },
  {
    id: 4,
    name: 'Gói Cưới Luxury & Ngoại Cảnh VIP',
    category: 'wedding',
    originalPrice: 12000000,
    price: 8990000,
    packageDiscountPercent: 25, // 25% > 20% -> KHÔNG THỂ ÁP MÃ 20%
    duration: '240 phút',
    description: 'Trọn gói xe đưa đón riêng, 2 váy cưới cao cấp, dặm phấn ngoại cảnh hoàng hôn',
  },
  {
    id: 5,
    name: 'Gói Chụp Kỷ Yếu & Tốt Nghiệp',
    category: 'concept',
    originalPrice: 1490000,
    price: 1490000,
    packageDiscountPercent: 0, // 0% < 20% -> Áp được mã 20%
    duration: '90 phút',
    description: 'Dành cho nhóm bạn và sinh viên, bằng tốt nghiệp, bóng bay và phụ kiện đầy đủ',
  },
  {
    id: 6,
    name: 'Gói Chụp Doanh Nhân / Profile',
    category: 'business',
    originalPrice: 2000000,
    price: 1690000,
    packageDiscountPercent: 15, // 15% < 20% -> Áp được mã 20%
    duration: '60 phút',
    description: 'Ánh sáng Rembrandt kịch tính, phong thái đĩnh đạc chuẩn ảnh tạp chí Forbes',
  },
  {
    id: 7,
    name: 'Gói Chụp Lookbook & Thương Mại',
    category: 'business',
    originalPrice: 7000000,
    price: 4900000,
    packageDiscountPercent: 30, // 30% > 20% -> KHÔNG THỂ ÁP MÃ 20%
    duration: '180 phút',
    description: 'Chụp lookbook thời trang thương hiệu cao cấp, tethering xem ảnh trực tiếp 4K',
  },
  {
    id: 8,
    name: 'Gói Cổ Trang & Áo Dài Nghệ Thuật',
    category: 'concept',
    originalPrice: 1890000,
    price: 1890000,
    packageDiscountPercent: 0, // 0% < 20% -> Áp được mã 20%
    duration: '90 phút',
    description: 'Cổ phục Nhật Bình hoàng gia, áo dài lụa tơ tằm thêu sen, trâm cài mạ vàng',
  },
];

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Nhận dữ liệu truyền từ trang Booking hoặc Packages nếu có
  const stateData = location.state || {};
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialPackageId = Number(queryParams.get('packageId') || stateData.packageId || 1);

  // User hiện tại
  const currentUser = customerAuth.getUser();

  // State thông tin khách hàng & lịch hẹn
  const [customerName, setCustomerName] = useState(
    stateData.name || currentUser?.fullname || currentUser?.username || 'Nguyễn Văn A'
  );
  const [customerPhone, setCustomerPhone] = useState(
    stateData.phone || currentUser?.phone || '0901234567'
  );
  const [bookingDate, setBookingDate] = useState(
    stateData.date || new Date().toISOString().split('T')[0]
  );
  const [bookingTime, setBookingTime] = useState(stateData.time || '09:30 – 11:30');
  const [customerNote, setCustomerNote] = useState(stateData.note || '');

  // State chọn gói chụp
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId);
  const [packagesList, setPackagesList] = useState(PACKAGES_WITH_PRICING);

  // State hình thức thanh toán: 'deposit' (Đặt cọc) | 'full' (Thanh toán hết 100%)
  const [paymentType, setPaymentType] = useState('deposit');
  // Mức cọc: 30% hoặc 50%
  const [depositPercent, setDepositPercent] = useState(30);

  // State phương thức thanh toán: 'vnpay' (Cổng VNPay Sandbox) | 'cash' (Tại Studio)
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  // State Mã ưu đãi trực tuyến từ trang chủ (Tự động tính mã STUDIO2026 20% khi chuyển từ Đặt Lịch sang)
  const [promoCodeInput, setPromoCodeInput] = useState(stateData.promoCode || 'STUDIO2026');
  const [appliedPromo, setAppliedPromo] = useState(() => {
    const code = (stateData.promoCode || 'STUDIO2026').trim().toUpperCase();
    const pkg = PACKAGES_WITH_PRICING.find((p) => p.id === initialPackageId) || PACKAGES_WITH_PRICING[0];
    const pkgDiscount = pkg.packageDiscountPercent || 0;
    const userId = currentUser?.id || currentUser?.username || stateData.customerPhone;
    const isAlreadyUsed = customerPaymentService.checkPromoCodeUsage(userId, code);
    if (!isAlreadyUsed && pkgDiscount <= 20 && (code === 'STUDIO2026' || code === 'ONLINE2026' || code === 'VIP2026')) {
      return { code, discountPercent: 20 };
    }
    return null;
  });
  const [promoError, setPromoError] = useState('');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState(() => {
    const code = (stateData.promoCode || 'STUDIO2026').trim().toUpperCase();
    const pkg = PACKAGES_WITH_PRICING.find((p) => p.id === initialPackageId) || PACKAGES_WITH_PRICING[0];
    const pkgDiscount = pkg.packageDiscountPercent || 0;
    const userId = currentUser?.id || currentUser?.username || stateData.customerPhone;
    const isAlreadyUsed = customerPaymentService.checkPromoCodeUsage(userId, code);
    if (!isAlreadyUsed && pkgDiscount <= 20 && (code === 'STUDIO2026' || code === 'ONLINE2026' || code === 'VIP2026')) {
      return pkgDiscount > 0
        ? `Đã tự động tính mã ${code}: Giảm 20% trên giá gốc niêm yết (thay thế ưu đãi ${pkgDiscount}% của gói).`
        : `Đã tự động tính mã ${code}: Giảm 20% trên giá gốc niêm yết khi đặt lịch trực tuyến!`;
    }
    return '';
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Lấy gói chụp đang chọn
  const currentPackage = useMemo(() => {
    return packagesList.find((p) => p.id === selectedPackageId) || packagesList[0];
  }, [packagesList, selectedPackageId]);

  // Load packages thực tế từ backend nếu có
  useEffect(() => {
    customerPackageService
      .getAllPackages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const merged = PACKAGES_WITH_PRICING.map((p) => {
            const apiPkg = data.find((d) => d.id === p.id);
            if (apiPkg) {
              return {
                ...p,
                name: apiPkg.name || p.name,
                price: apiPkg.price || p.price,
                description: apiPkg.description || p.description,
              };
            }
            return p;
          });
          setPackagesList(merged);
        }
      })
      .catch((err) => {
        console.warn('[PaymentPage] Dùng bảng giá gói chuẩn:', err.message);
      });
  }, []);

  // =========================================================================
  // XỬ LÝ ÁP DỤNG MÃ ƯU ĐÃI (STUDIO2026 / 20% GIÁ GỐC / DÙNG 1 LẦN / CHECK % GÓI)
  // =========================================================================
  const handleApplyPromoCode = (codeToApply = promoCodeInput) => {
    const code = codeToApply.trim().toUpperCase();
    setPromoError('');
    setPromoSuccessMsg('');

    if (!code) {
      setAppliedPromo(null);
      return;
    }

    // 1. Kiểm tra mã hợp lệ
    const validCodes = ['STUDIO2026', 'ONLINE2026', 'VIP2026'];
    if (!validCodes.includes(code)) {
      setAppliedPromo(null);
      setPromoError('Mã ưu đãi không hợp lệ. Vui lòng nhập mã STUDIO2026 từ trang chủ!');
      return;
    }

    // 2. Kiểm tra quy tắc: MỖI NGƯỜI DÙNG CHỈ ĐƯỢC ÁP MÃ 1 LẦN
    const userId = currentUser?.id || currentUser?.username || customerPhone;
    const isAlreadyUsed = customerPaymentService.checkPromoCodeUsage(userId, code);
    if (isAlreadyUsed) {
      setAppliedPromo(null);
      setPromoError(
        `Bạn đã sử dụng mã ${code} trong đơn đặt lịch trước đó. Mỗi khách hàng chỉ được áp dụng mã này 01 lần duy nhất!`
      );
      return;
    }

    // 3. Kiểm tra quy tắc giá khuyến mãi của gói:
    // - Tính 20% là tính trên GIÁ GỐC.
    // - Nếu phần khuyến mãi có sẵn của gói > 20% -> KHÔNG THỂ ÁP MÃ ĐƯỢC.
    // - Nếu phần khuyến mãi có sẵn của gói < 20% -> ĐƯỢC ÁP MÃ, và giá khuyến mãi của gói sẽ KHÔNG ĐƯỢC TÍNH (thay bằng 20% giá gốc).
    const pkgDiscount = currentPackage.packageDiscountPercent || 0;

    if (pkgDiscount > 20) {
      setAppliedPromo(null);
      setPromoError(
        `Gói chụp "${currentPackage.name}" hiện đang có ưu đãi ${pkgDiscount}% (lớn hơn 20%). Hệ thống giữ nguyên ưu đãi tốt nhất cho bạn, không thể áp dụng thêm mã ${code}!`
      );
      return;
    }

    // Đạt điều kiện áp dụng thành công
    setAppliedPromo({
      code,
      discountPercent: 20,
    });

    if (pkgDiscount > 0 && pkgDiscount < 20) {
      setPromoSuccessMsg(
        `Áp dụng thành công mã ${code}: Giảm 20% tính trên giá gốc niêm yết (thay thế mức ưu đãi ${pkgDiscount}% có sẵn của gói).`
      );
    } else {
      setPromoSuccessMsg(
        `Áp dụng thành công mã ${code}: Giảm 20% tính trên giá gốc niêm yết.`
      );
    }
  };

  const handleSelectPackage = (pkgId) => {
    setSelectedPackageId(pkgId);
    const targetPkg = packagesList.find((p) => p.id === pkgId);
    if (appliedPromo && targetPkg) {
      if ((targetPkg.packageDiscountPercent || 0) > 20) {
        setAppliedPromo(null);
        setPromoSuccessMsg('');
        setPromoError(
          `Gói chụp "${targetPkg.name}" hiện đang có ưu đãi ${targetPkg.packageDiscountPercent}% (>20%). Hệ thống đã hủy mã giảm giá để giữ nguyên ưu đãi tốt nhất cho bạn.`
        );
      }
    }
  };

  // =========================================================================
  // TÍNH TOÁN BẢNG GIÁ CHI TIẾT
  // =========================================================================
  const calculation = useMemo(() => {
    const originalPrice = currentPackage.originalPrice || currentPackage.price;
    const packageDiscountPercent = currentPackage.packageDiscountPercent || 0;

    let finalPackagePrice;
    let promoDiscountAmount;
    let packageDiscountAmount;

    if (appliedPromo) {
      // Khi áp mã 20%: Giá khuyến mãi có sẵn của gói KHÔNG được tính dồn
      // Thay vào đó giảm 20% tính thẳng trên GIÁ GỐC
      promoDiscountAmount = Math.round(originalPrice * 0.20);
      packageDiscountAmount = 0; // Hủy mức giảm có sẵn của gói
      finalPackagePrice = originalPrice - promoDiscountAmount;
    } else {
      // Khi không áp mã: Giữ nguyên giá khuyến mãi có sẵn của gói
      packageDiscountAmount = Math.round(originalPrice * (packageDiscountPercent / 100));
      promoDiscountAmount = 0;
      finalPackagePrice = currentPackage.price;
    }

    // Tính số tiền cần thanh toán hôm nay (Cọc hoặc Toàn bộ)
    let amountToPay;
    let remainingAmount;

    if (paymentType === 'deposit') {
      amountToPay = Math.round((finalPackagePrice * depositPercent) / 100);
      remainingAmount = finalPackagePrice - amountToPay;
    } else {
      amountToPay = finalPackagePrice;
      remainingAmount = 0;
    }

    return {
      originalPrice,
      packageDiscountPercent,
      packageDiscountAmount,
      promoDiscountAmount,
      finalPackagePrice,
      amountToPay,
      remainingAmount,
    };
  }, [currentPackage, appliedPromo, paymentType, depositPercent]);

  // =========================================================================
  // XỬ LÝ THANH TOÁN
  // =========================================================================
  const handleProceedPayment = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ và tên và Số điện thoại!');
      return;
    }

    setIsProcessing(true);

    try {
      // BookingPage đã tạo đơn và liên kết gói chụp. Dùng đúng đơn đó để tránh
      // tạo một booking thứ hai chỉ để thanh toán.
      let bookingId = Number(stateData.bookingId) || null;
      if (!bookingId) throw new Error('Không tìm thấy đơn đặt lịch. Vui lòng quay lại trang đặt lịch để tạo đơn trước khi thanh toán.');

      // 2. Nếu chọn Cổng thanh toán VNPay Sandbox:
      if (paymentMethod === 'vnpay') {
        const orderInfo = `PhotoStudio Coc ${calculation.amountToPay.toLocaleString('vi-VN')}d cho don BK-${bookingId}`;
        const txnRef = `BK${bookingId}_${Date.now()}`;

        // Lưu thông tin đơn hàng tạm thời vào sessionStorage để phục vụ trang Return đối soát
        sessionStorage.setItem(
          'vnpay_pending_order',
          JSON.stringify({
            bookingId,
            customerName,
            customerPhone,
            packageName: currentPackage.name,
            bookingDate,
            bookingTime,
            paymentType,
            depositPercent,
            amountToPay: calculation.amountToPay,
            remainingAmount: calculation.remainingAmount,
            appliedPromoCode: appliedPromo?.code || null,
          })
        );

        // Tạo URL thanh toán VNPay Sandbox có chữ ký SHA-512
        const vnpUrl = await createVNPayPaymentUrl({
          amount: calculation.amountToPay,
          orderInfo,
          txnRef,
          returnUrl: `${window.location.origin}/payment/vnpay-return`,
        });

        // Chuyển hướng người dùng đến Cổng VNPay Sandbox
        window.location.href = vnpUrl;
        return;
      }

      // 3. Nếu chọn Thanh toán tại Studio (Tiền mặt / Chuyển khoản trực tiếp):
      try {
        await customerPaymentService.createPayment({
          bookingId,
          paymentMethod: 'cash',
          amount: calculation.amountToPay,
          status: 'pending',
          note: `Thanh toán tại studio (${paymentType === 'deposit' ? `Cọc ${depositPercent}%` : 'Toàn bộ 100%'})`,
        });
      } catch (payErr) {
        console.warn('Lỗi ghi nhận payment:', payErr.message);
      }

      // Đánh dấu mã ưu đãi đã sử dụng nếu có
      if (appliedPromo) {
        const userId = currentUser?.id || currentUser?.username || customerPhone;
        customerPaymentService.markPromoCodeUsed(userId, appliedPromo.code);
      }

      // Chuyển sang trang hoàn tất đặt lịch
      navigate(ROUTES.USER.HOME, {
        state: {
          bookingSuccess: true,
          bookingCode: `BK-${bookingId}`,
          message: 'Đặt lịch và chọn hình thức thanh toán tại studio thành công!',
        },
      });
    } catch (error) {
      alert('Có lỗi xảy ra trong quá trình xử lý: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyTestAccount = () => {
    const acc = VNPAY_TEST_ACCOUNTS[0];
    navigator.clipboard.writeText(`${acc.cardNumber} | ${acc.cardHolder} | ${acc.issueDate} | OTP: ${acc.otp}`);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#2A1D22] pt-24 pb-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-rose-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#B85064]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Decorative Floral elements */}
      <FloralBranchCorner position="top-right" className="opacity-20 pointer-events-none" />
      <FloralBranchCorner position="bottom-left" className="opacity-15 pointer-events-none rotate-180" />
      <ScatteredPetals count={8} className="opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#7A6C71] mb-8 font-medium">
          <Link to={ROUTES.USER.HOME} className="hover:text-[#B85064] transition-colors">
            Trang Chủ
          </Link>
          <span>/</span>
          <Link to={ROUTES.USER.PACKAGES} className="hover:text-[#B85064] transition-colors">
            Gói Chụp
          </Link>
          <span>/</span>
          <span className="text-[#B85064] font-semibold">Thanh Toán & Đặt Cọc</span>
        </nav>

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <ScrollReveal direction="down">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-[#B85064] animate-pulse" />
              <ShinyText text="CỔNG THANH TOÁN & ĐẶT CỌC TRỰC TUYẾN" speed={4} />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury tracking-tight text-[#2A1D22] mb-4">
              <BlurText text="Xác Nhận Đơn Hàng &" delay={40} className="inline" />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B85064] via-[#D46B81] to-[#8C3A4B]">
                Thanh Toán An Toàn
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#7A6C71] font-light leading-relaxed">
              Hỗ trợ thanh toán đặt cọc giữ lịch hoặc thanh toán trọn gói 100% qua cổng quốc gia VNPay Sandbox hoặc tiền mặt tại studio.
            </p>
          </ScrollReveal>
        </div>

        {/* MAIN 2-COLUMN CHECKOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI (8 CỘT): FORM THÔNG TIN, CHỌN GÓI & PHƯƠNG THỨC THANH TOÁN */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* KHỐI 1: THÔNG TIN KHÁCH HÀNG & LỊCH HẸN */}
            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#F5EAEB]">
                <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] text-[#B85064] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="text-base font-bold text-[#2A1D22] font-serif-luxury">
                  Thông Tin Khách Hàng & Buổi Chụp
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A1D22] mb-1.5">
                    Họ và Tên khách hàng *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#FAF5F5] border border-[#F0E4E6] rounded-xl text-xs focus:outline-none focus:border-[#B85064] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A1D22] mb-1.5">
                    Số Điện Thoại / Zalo *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0901 234 567"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#FAF5F5] border border-[#F0E4E6] rounded-xl text-xs focus:outline-none focus:border-[#B85064] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A1D22] mb-1.5">
                    Ngày Chụp Dự Kiến *
                  </label>
                  <div className="relative">
                    <CalendarDaysIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#FAF5F5] border border-[#F0E4E6] rounded-xl text-xs focus:outline-none focus:border-[#B85064] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A1D22] mb-1.5">
                    Khung Giờ Chụp
                  </label>
                  <div className="relative">
                    <ClockIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#FAF5F5] border border-[#F0E4E6] rounded-xl text-xs focus:outline-none focus:border-[#B85064] font-medium"
                    >
                      <option value="08:30 – 10:30">08:30 – 10:30 (Sáng sớm)</option>
                      <option value="09:30 – 11:30">09:30 – 11:30 (Sáng chuẩn)</option>
                      <option value="13:30 – 15:30">13:30 – 15:30 (Đầu giờ chiều)</option>
                      <option value="15:00 – 17:00">15:00 – 17:00 (Nắng hoàng hôn)</option>
                      <option value="18:30 – 20:30">18:30 – 20:30 (Buổi tối ấm cúng)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-[#2A1D22] mb-1.5">
                  Ghi chú riêng về concept (không bắt buộc)
                </label>
                <textarea
                  rows={2}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Ví dụ: Mình thích tone ảnh Hàn Quốc nhẹ nhàng, cần chuẩn bị thêm hoa cưới..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF5F5] border border-[#F0E4E6] rounded-xl text-xs focus:outline-none focus:border-[#B85064] resize-none"
                />
              </div>
            </div>

            {/* KHỐI 2: CHỌN GÓI CHỤP STUDIO */}
            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F5EAEB]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] text-[#B85064] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="text-base font-bold text-[#2A1D22] font-serif-luxury">
                    Gói Chụp Ảnh Được Chọn
                  </h3>
                </div>
                <Link
                  to={ROUTES.USER.PACKAGES}
                  className="text-xs text-[#B85064] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Xem chi tiết 8 gói</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {packagesList.map((pkg) => {
                  const isSelected = pkg.id === selectedPackageId;
                  const discountPercent = pkg.packageDiscountPercent || 0;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#B85064] bg-[#FDF0F3]/50 shadow-sm ring-1 ring-[#B85064]'
                          : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/40 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-[#B85064] bg-[#B85064] text-white'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-[#2A1D22]">
                              {pkg.name}
                            </h4>
                            {discountPercent > 0 && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                Giảm {discountPercent}% có sẵn
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#7A6C71] font-light mt-0.5 line-clamp-1">
                            {pkg.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 sm:pl-4">
                        <div className="text-sm sm:text-base font-bold text-[#B85064]">
                          {pkg.price.toLocaleString('vi-VN')} đ
                        </div>
                        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                          <div className="text-[11px] text-neutral-400 line-through">
                            {pkg.originalPrice.toLocaleString('vi-VN')} đ
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KHỐI 3: HÌNH THỨC THANH TOÁN (CỌC HOẶC THANH TOÁN HẾT) */}
            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#F5EAEB]">
                <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] text-[#B85064] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="text-base font-bold text-[#2A1D22] font-serif-luxury">
                  Hình Thức Thanh Toán (Đặt Cọc Hay Trọn Gói)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tùy chọn 1: Thanh toán đặt cọc */}
                <div
                  onClick={() => setPaymentType('deposit')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    paymentType === 'deposit'
                      ? 'border-[#B85064] bg-[#FDF0F3]/40 shadow-sm ring-1 ring-[#B85064]'
                      : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#B85064]">
                        Giữ Lịch Chụp
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentType === 'deposit'
                            ? 'border-[#B85064] bg-[#B85064] text-white'
                            : 'border-neutral-300'
                        }`}
                      >
                        {paymentType === 'deposit' && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-[#2A1D22] mb-1">
                      Thanh Toán Đặt Cọc
                    </h4>
                    <p className="text-[11px] text-[#7A6C71] font-light leading-relaxed mb-4">
                      Đặt cọc để giữ phòng chụp riêng, trang phục và ekip. Số tiền còn lại thanh toán tại studio vào ngày chụp.
                    </p>
                  </div>

                  {/* Nút chọn mức cọc 30% hoặc 50% */}
                  {paymentType === 'deposit' && (
                    <div className="pt-3 border-t border-[#F5EAEB] flex items-center gap-2">
                      <span className="text-[11px] text-[#7A6C71] font-medium">Mức cọc:</span>
                      {[30, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDepositPercent(pct);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            depositPercent === pct
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

                {/* Tùy chọn 2: Thanh toán hết (100%) */}
                <div
                  onClick={() => setPaymentType('full')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    paymentType === 'full'
                      ? 'border-[#B85064] bg-[#FDF0F3]/40 shadow-sm ring-1 ring-[#B85064]'
                      : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Tiện Lợi Nhất
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentType === 'full'
                            ? 'border-[#B85064] bg-[#B85064] text-white'
                            : 'border-neutral-300'
                        }`}
                      >
                        {paymentType === 'full' && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-[#2A1D22] mb-1">
                      Thanh Toán Trọn Gói 100%
                    </h4>
                    <p className="text-[11px] text-[#7A6C71] font-light leading-relaxed mb-4">
                      Thanh toán hết một lần nhanh gọn. Không phát sinh thanh toán thêm khi đến studio, chỉ việc tới chụp và nhận ảnh!
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F5EAEB] text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    <span>Không còn số dư nợ khi đến studio</span>
                  </div>
                </div>

              </div>
            </div>

            {/* KHỐI 4: PHƯƠNG THỨC THANH TOÁN (VNPAY SANDBOX HOẶC TẠI STUDIO) */}
            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#F5EAEB]">
                <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] text-[#B85064] flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <h3 className="text-base font-bold text-[#2A1D22] font-serif-luxury">
                  Phương Thức Thanh Toán
                </h3>
              </div>

              <div className="space-y-4">
                
                {/* 1. VNPay Sandbox */}
                <div
                  onClick={() => setPaymentMethod('vnpay')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'vnpay'
                      ? 'border-[#B85064] bg-[#FDF0F3]/40 shadow-sm ring-1 ring-[#B85064]'
                      : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                        VNPAY
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#2A1D22]">
                            Cổng Thanh Toán Quốc Gia VNPAY
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Sandbox Test
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6C71] font-light">
                          Thẻ ATM nội địa (NCB, VCB,...), Quét mã QR, Visa, MasterCard qua VNPay Sandbox
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === 'vnpay'
                          ? 'border-[#B85064] bg-[#B85064] text-white'
                          : 'border-neutral-300'
                      }`}
                    >
                      {paymentMethod === 'vnpay' && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Hộp gợi ý thẻ test Sandbox của VNPay devreg */}
                  {paymentMethod === 'vnpay' && (
                    <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          <BuildingLibraryIcon className="w-4 h-4 text-blue-600" />
                          Thông tin thẻ Test Sandbox (VNPay Devreg):
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyTestAccount();
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-blue-100 rounded-lg text-[11px] font-bold text-blue-700 border border-blue-300 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                          <span>{copiedAccount ? 'Đã Sao Chép!' : 'Sao Chép Thẻ'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
                        <div className="bg-white p-2 rounded-lg border border-blue-100">
                          <span className="block text-[10px] text-neutral-500 font-sans">Ngân hàng:</span>
                          <strong>NCB</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-blue-100">
                          <span className="block text-[10px] text-neutral-500 font-sans">Số thẻ:</span>
                          <strong>9704198526191432198</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-blue-100">
                          <span className="block text-[10px] text-neutral-500 font-sans">Tên chủ thẻ:</span>
                          <strong>NGUYEN VAN A</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-blue-100">
                          <span className="block text-[10px] text-neutral-500 font-sans">Ngày phát hành / OTP:</span>
                          <strong>07/15 | 123456</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Tiền mặt / Chuyển khoản trực tiếp tại Studio */}
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'cash'
                      ? 'border-[#B85064] bg-[#FDF0F3]/40 shadow-sm ring-1 ring-[#B85064]'
                      : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0">
                      CASH
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2A1D22]">
                        Thanh Toán Trực Tiếp Tại Studio
                      </h4>
                      <p className="text-[11px] text-[#7A6C71] font-light">
                        Thanh toán tiền mặt hoặc chuyển khoản QR trực tiếp khi bạn đến quầy lễ tân studio vào ngày chụp
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMethod === 'cash'
                        ? 'border-[#B85064] bg-[#B85064] text-white'
                        : 'border-neutral-300'
                    }`}
                  >
                    {paymentMethod === 'cash' && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* CỘT PHẢI (5 CỘT): Ô NHẬP MÃ ƯU ĐÃI & BẢNG TỔNG KẾT HÓA ĐƠN */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            {/* KHỐI MÃ ƯU ĐÃI (Áp mã code trực tuyến 20% giá gốc, 1 lần duy nhất) */}
            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-[#2A1D22] flex items-center gap-1.5">
                  <TicketIcon className="w-4 h-4 text-[#B85064]" />
                  <span>Mã Khuyến Mãi / Đặt Trực Tuyến</span>
                </label>
                <span className="text-[10px] text-[#7A6C71]">
                  Mỗi khách hàng 01 lần
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã STUDIO2026..."
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5F5] border border-[#F0E4E6] text-xs font-mono font-bold text-[#2A1D22] uppercase focus:outline-none focus:border-[#B85064]"
                />
                <button
                  type="button"
                  onClick={() => handleApplyPromoCode(promoCodeInput)}
                  className="px-4 py-2.5 rounded-xl bg-[#B85064] hover:bg-[#A8394C] text-white text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  Áp Dụng
                </button>
              </div>

              {/* Thông báo thành công */}
              {promoSuccessMsg && (
                <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">{promoSuccessMsg}</p>
                </div>
              )}

              {/* Thông báo lỗi / từ chối */}
              {promoError && (
                <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <ExclamationCircleIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">{promoError}</p>
                </div>
              )}

              {/* Gợi ý quy tắc áp mã */}
              <div className="mt-3 text-[11px] text-[#7A6C71] font-light space-y-1 bg-[#FAF5F5] p-3 rounded-xl border border-[#F0E4E6]">
                <p>• Mã <strong>STUDIO2026</strong> giảm ngay 20% tính trên giá gốc niêm yết.</p>
                <p>• Khi áp mã này, giá khuyến mãi có sẵn của gói sẽ không được tính.</p>
                <p>• Nếu gói đang có ưu đãi lớn hơn 20%, hệ thống giữ nguyên giá ưu đãi của gói.</p>
              </div>
            </div>

            {/* HÓA ĐƠN CHI TIẾT (ORDER SUMMARY) */}
            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2A1D22] font-serif-luxury pb-3 border-b border-[#F5EAEB] mb-4">
                Chi Tiết Thanh Toán
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                
                {/* Tên gói */}
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[#7A6C71]">Gói chụp:</span>
                  <span className="font-bold text-[#2A1D22] text-right line-clamp-1">
                    {currentPackage.name}
                  </span>
                </div>

                {/* Giá gốc niêm yết */}
                <div className="flex justify-between items-center">
                  <span className="text-[#7A6C71]">Giá gốc niêm yết:</span>
                  <span className="font-semibold text-neutral-500">
                    {calculation.originalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Khuyến mãi có sẵn của gói (nếu không áp mã 20%) */}
                {!appliedPromo && calculation.packageDiscountAmount > 0 && (
                  <div className="flex justify-between items-center text-rose-600">
                    <span>Ưu đãi gói ({calculation.packageDiscountPercent}%):</span>
                    <span className="font-semibold">
                      -{calculation.packageDiscountAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                )}

                {/* Giảm giá từ mã trực tuyến 20% giá gốc */}
                {appliedPromo && (
                  <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1">
                      <TicketIcon className="w-3.5 h-3.5" />
                      Mã {appliedPromo.code} (-20% giá gốc):
                    </span>
                    <span>
                      -{calculation.promoDiscountAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                )}

                {/* Tổng tiền dịch vụ sau ưu đãi */}
                <div className="flex justify-between items-center pt-2 border-t border-[#F5EAEB] font-bold text-sm text-[#2A1D22]">
                  <span>Tổng tiền dịch vụ:</span>
                  <span className="text-[#B85064]">
                    {calculation.finalPackagePrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Chi tiết hình thức thanh toán đợt này */}
                <div className="p-3.5 rounded-xl bg-[#FAF5F5] border border-[#F0E4E6] space-y-2 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#7A6C71]">Hình thức thanh toán:</span>
                    <strong className="text-[#2A1D22]">
                      {paymentType === 'deposit'
                        ? `Đặt cọc (${depositPercent}%)`
                        : 'Thanh toán trọn gói (100%)'}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-[#B85064] pt-1 border-t border-[#E8DCDE]">
                    <span>Số tiền cần trả hôm nay:</span>
                    <span className="text-lg">
                      {calculation.amountToPay.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  {paymentType === 'deposit' && (
                    <div className="flex justify-between items-center text-xs text-[#7A6C71] pt-1">
                      <span>Còn lại trả tại Studio:</span>
                      <strong className="text-neutral-700">
                        {calculation.remainingAmount.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                  )}
                </div>

              </div>

              {/* Nút hành động Thanh Toán */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProceedPayment}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white font-bold text-sm shadow-lg shadow-[#B85064]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang Xử Lý Giao Dịch...</span>
                    </div>
                  ) : paymentMethod === 'vnpay' ? (
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="w-5 h-5" />
                      <span>
                        Thanh Toán VNPay ({calculation.amountToPay.toLocaleString('vi-VN')} đ)
                      </span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Xác Nhận Giữ Lịch & Trả Tại Studio</span>
                    </div>
                  )}
                </button>

                <p className="text-[11px] text-center text-[#7A6C71] flex items-center justify-center gap-1.5 font-light">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                  <span>Giao dịch được bảo mật bởi VNPay và PhotoStudio</span>
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
