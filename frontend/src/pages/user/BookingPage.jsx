import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  SparklesIcon,
  ClockIcon,
  UserGroupIcon,
  CheckIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  TicketIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingLibraryIcon,
  CameraIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

import {
  FloralBranchCorner,
  FloralCardCorner,
} from "../../components/common/FloralDecorations";
import { ROUTES } from "../../routes/web";
import { customerAuth } from "../../lib/axiosCustomer";
import customerRoomService from "../../services/user/roomService";
import customerPackageService from "../../services/user/packageService";
import userImageService from "../../services/user/imageService";
import customerBookingService from "../../services/user/bookingService";
import customerPaymentService from "../../services/user/paymentService";
import customerServiceService from "../../services/user/serviceService";

const TIME_SLOTS = [
  {
    id: "m1",
    label: "08:30 – 10:30 (Sáng)",
    start: "08:30:00",
    end: "10:30:00",
  },
  {
    id: "m2",
    label: "10:30 – 12:30 (Trưa)",
    start: "10:30:00",
    end: "12:30:00",
  },
  {
    id: "a1",
    label: "13:30 – 15:30 (Chiều)",
    start: "13:30:00",
    end: "15:30:00",
  },
  {
    id: "a2",
    label: "16:00 – 18:00 (Hoàng hôn)",
    start: "16:00:00",
    end: "18:00:00",
  },
  {
    id: "e1",
    label: "18:30 – 20:30 (Tối Studio)",
    start: "18:30:00",
    end: "20:30:00",
  },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra đăng nhập bắt buộc
  const isAuthenticated = customerAuth.isAuthenticated();
  const currentUser = useMemo(() => customerAuth.getUser(), []);

  // Đọc query parameters và location.state
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const initialPackageId = Number(
    searchParams.get("packageId") || location.state?.packageId || 1,
  );
  const initialRoomId = Number(
    searchParams.get("roomId") || location.state?.roomId || 1,
  );

  // Danh sách phòng, gói và dịch vụ nâng cao
  const [rooms, setRooms] = useState([]);
  const [packages, setPackages] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");

  // Lựa chọn đặt lịch
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId);

  // Đọc danh sách dịch vụ đã chọn (từ trang chi tiết nếu có)
  const [selectedServiceIds, setSelectedServiceIds] = useState(() => {
    if (Array.isArray(location.state?.selectedServiceIds)) {
      return location.state.selectedServiceIds.map(Number);
    }
    const sParam = searchParams.get("services");
    if (sParam) {
      return sParam.split(",").map(Number).filter(Boolean);
    }
    try {
      const stored = sessionStorage.getItem("preselected_service_ids");
      if (stored) return JSON.parse(stored).map(Number);
    } catch {
      // Ignored: Bỏ qua lỗi nếu sessionStorage không khả dụng hoặc parse thất bại
    }
    return [];
  });

  const handleToggleService = (serviceId) => {
    const sId = Number(serviceId);
    setSelectedServiceIds((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };
  const [bookingDate, setBookingDate] = useState(() => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split("T")[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);
  const [existingBookings, setExistingBookings] = useState([]);

  // Thông tin khách hàng (hỗ trợ fullname, fullName, name, username)
  const [customerInfo, setCustomerInfo] = useState({
    name:
      currentUser?.fullname ||
      currentUser?.fullName ||
      currentUser?.name ||
      currentUser?.username ||
      "",
    phone: currentUser?.phone || currentUser?.phoneNumber || "",
    email: currentUser?.email || "",
    attendees: 1,
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Nếu người dùng chưa đăng nhập, tự động chuyển sang trang đăng nhập (chỉ kiểm tra khi truy cập trang này)
  useEffect(() => {
    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        replace: true,
        state: {
          from: ROUTES.USER.BOOKING,
          message:
            "Quý khách vui lòng đăng nhập tài khoản để tiến hành đặt lịch chụp trực tuyến!",
        },
      });
    }
  }, [navigate]);

  // Load danh sách phòng & gói thực tế từ CSDL
  useEffect(() => {
    let active = true;
    async function loadData() {
      const [roomsResult, packagesResult, imagesResult, servicesResult] = await Promise.allSettled([
        customerRoomService.getAllRooms(),
        customerPackageService.getAllPackages(),
        userImageService.getAllImages(),
        customerServiceService.getAllServices(),
      ]);
      if (!active) return;

      const getList = (result) => {
        if (result.status !== "fulfilled") return [];
        const value = result.value;
        if (Array.isArray(value)) return value;
        if (Array.isArray(value?.data)) return value.data;
        return [];
      };
      const allImages = getList(imagesResult);
      const rawRooms = getList(roomsResult);
      const rawPackages = getList(packagesResult);
      const rawServices = getList(servicesResult);

      const mappedServices = rawServices
        .filter((s) => s.status?.toLowerCase() === "active" && !s.deletedAt)
        .map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description || "",
          price: Number(s.price) || 0,
        }));
      setServicesList(mappedServices);

      const mappedRooms = rawRooms
        .filter((room) => room.status?.toLowerCase() === "active" && !room.deletedAt)
        .map((room) => {
          const image = allImages.find((item) =>
            ["room", "rooms"].includes((item.imageableType || item.imageable_type || "").toLowerCase()) &&
            Number(item.imageableId ?? item.imageable_id) === Number(room.id),
          );
          const imageUrl = image?.imageUrl || image?.image_url || room.imageUrl || room.image;
          return { ...room, capacity: Number(room.capacity) || 1, primaryImage: imageUrl, image: imageUrl };
        });
      const mappedPackages = rawPackages
        .filter((pkg) => pkg.status?.toLowerCase() === "active" && !pkg.deletedAt)
        .map((pkg) => {
          const image = allImages.find((item) =>
            ["package", "packages"].includes((item.imageableType || item.imageable_type || "").toLowerCase()) &&
            Number(item.imageableId ?? item.imageable_id) === Number(pkg.id),
          );
          const imageUrl = image?.imageUrl || image?.image_url || pkg.imageUrl || pkg.image;
          const price = Number(pkg.price) || 0;
          return {
            ...pkg,
            price,
            originalPrice: price,
            packageDiscountPercent: 0,
            duration: pkg.duration ? `${pkg.duration} phút` : "",
            equipments: Array.isArray(pkg.equipments) ? pkg.equipments : [],
            image: imageUrl,
            primaryImage: imageUrl,
          };
        });

      setRooms(mappedRooms);
      setPackages(mappedPackages);
      if (!mappedRooms.some((room) => Number(room.id) === initialRoomId)) {
        setSelectedRoomId(mappedRooms[0]?.id ?? null);
      }
      if (!mappedPackages.some((pkg) => Number(pkg.id) === initialPackageId)) {
        setSelectedPackageId(mappedPackages[0]?.id ?? null);
      }

      const failedResources = [];
      if (roomsResult.status === "rejected") failedResources.push("phòng chụp");
      if (packagesResult.status === "rejected") failedResources.push("gói chụp");
      if (!mappedRooms.length) failedResources.push("phòng chụp đang hoạt động");
      if (!mappedPackages.length) failedResources.push("gói chụp đang hoạt động");
      if (failedResources.length) {
        setOptionsError(`Không tải được ${[...new Set(failedResources)].join(" và ")} từ cơ sở dữ liệu.`);
      }
      setOptionsLoading(false);
    }

    void loadData();
    return () => { active = false; };
  }, [initialPackageId, initialRoomId]);

  // Tải danh sách đơn đặt lịch từ CSDL để phát hiện trùng phòng/khung giờ
  useEffect(() => {
    let active = true;
    const loadBookings = async () => {
      try {
        const res = await customerBookingService.getAllBookings();
        if (!active) return;
        let list = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        }
        setExistingBookings(list);
      } catch (err) {
        console.error("Lỗi khi tải danh sách booking:", err);
      }
    };

    void loadBookings();
    const timer = setInterval(() => { void loadBookings(); }, 8000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  // Lấy chi tiết phòng và gói đang chọn
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => Number(r.id) === Number(selectedRoomId)) || rooms[0] || null;
  }, [rooms, selectedRoomId]);

  const selectedPackage = useMemo(() => {
    return packages.find((p) => Number(p.id) === Number(selectedPackageId)) || packages[0] || null;
  }, [packages, selectedPackageId]);

  // Danh sách các dịch vụ nâng cao đang được chọn
  const selectedServices = useMemo(() => {
    return servicesList.filter((s) => selectedServiceIds.includes(Number(s.id)));
  }, [servicesList, selectedServiceIds]);

  const servicesTotal = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  }, [selectedServices]);

  // =========================================================================
  // TÍNH TOÁN GIÁ & MÃ GIẢM GIÁ TRỰC TUYẾN 20% TỪ TRANG CHỦ (STUDIO2026)
  // =========================================================================
  const pricingSummary = useMemo(() => {
    const originalPrice = Number(selectedPackage?.originalPrice || selectedPackage?.price || 0);
    const pkgDiscountPercent = selectedPackage?.packageDiscountPercent || 0;
    const regularPackagePrice = Number(selectedPackage?.price || 0);

    const userId =
      currentUser?.id || currentUser?.username || customerInfo.phone;
    const isPromoUsed = customerPaymentService.checkPromoCodeUsage(
      userId,
      "STUDIO2026",
    );

    let canApplyPromo;
    let promoReason;
    let packageFinalPrice;
    let promoDiscountAmount;

    if (isPromoUsed) {
      canApplyPromo = false;
      promoReason =
        "Mã STUDIO2026 bạn đã từng sử dụng trước đó (mỗi tài khoản được dùng 1 lần).";
      promoDiscountAmount = 0;
      packageFinalPrice = regularPackagePrice;
    } else if (pkgDiscountPercent > 20) {
      canApplyPromo = false;
      promoReason = `Gói chụp đang có ưu đãi ${pkgDiscountPercent}% (>20%), hệ thống tự động giữ mức ưu đãi cao nhất cho bạn.`;
      promoDiscountAmount = 0;
      packageFinalPrice = regularPackagePrice;
    } else {
      canApplyPromo = true;
      promoReason =
        "Áp dụng mã STUDIO2026: Giảm 20% trên giá gốc niêm yết dành cho khách đặt lịch trực tuyến!";
      promoDiscountAmount = Math.round(originalPrice * 0.2);
      packageFinalPrice = originalPrice - promoDiscountAmount;
    }

    // Tổng tiền bao gồm Gói chụp + Dịch vụ nâng cao
    const finalTotal = packageFinalPrice + servicesTotal;
    const depositAmount = Math.round(finalTotal * 0.3);
    const remainingAmount = finalTotal - depositAmount;

    return {
      originalPrice,
      pkgDiscountPercent,
      regularPackagePrice,
      packageFinalPrice,
      servicesTotal,
      selectedServices,
      canApplyPromo,
      promoReason,
      promoDiscountAmount,
      finalTotal,
      depositAmount,
      remainingAmount,
    };
  }, [selectedPackage, currentUser, customerInfo.phone, servicesTotal, selectedServices]);


  const normalizeTimeStr = (t) => {
    if (!t) return null;
    if (Array.isArray(t)) {
      const hh = String(t[0] ?? 0).padStart(2, "0");
      const mm = String(t[1] ?? 0).padStart(2, "0");
      const ss = String(t[2] ?? 0).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }
    if (typeof t === "string") {
      const clean = t.trim();
      const parts = clean.split(":");
      if (parts.length >= 2) {
        const hh = parts[0].padStart(2, "0");
        const mm = parts[1].padStart(2, "0");
        const ss = (parts[2] || "00").slice(0, 2).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
      }
      return clean;
    }
    return null;
  };

  // Kiểm tra xem một khung giờ cụ thể đã có ai đặt phòng chưa
  const isSlotConflict = useCallback((slot, roomId, dateStr) => {
    if (!slot || !roomId || !dateStr) return false;
    return existingBookings.some((b) => {
      const bStatus = (b.status || "").toLowerCase();
      if (bStatus === "cancelled" || bStatus === "canceled" || bStatus === "da_huy") return false;
      const bRoomId = Number(b.roomId || b.room?.id);
      if (bRoomId !== Number(roomId)) return false;

      const bDateOnly = (b.bookingDate || "").split("T")[0];
      if (bDateOnly !== dateStr) return false;

      const bStart = normalizeTimeStr(b.startTime) || (b.bookingDate && b.bookingDate.includes("T") ? normalizeTimeStr(b.bookingDate.split("T")[1]?.slice(0, 8)) : null);
      const bEnd = normalizeTimeStr(b.endTime);
      const slotStart = normalizeTimeStr(slot.start);
      const slotEnd = normalizeTimeStr(slot.end);

      if (bStart && bEnd && slotStart && slotEnd) {
        return bStart < slotEnd && bEnd > slotStart;
      }
      if (b.bookingTime && slot.label && b.bookingTime.includes(slot.label.split(" (")[0])) {
        return true;
      }
      return false;
    });
  }, [existingBookings]);

  const isCurrentSlotBooked = useMemo(() => {
    return isSlotConflict(selectedTimeSlot, selectedRoomId, bookingDate);
  }, [selectedTimeSlot, selectedRoomId, bookingDate, isSlotConflict]);

  // Xử lý xác nhận đặt lịch: CHUYỂN NGAY SANG TRANG THANH TOÁN (Chưa tạo đơn vào CSDL)
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    if (!selectedRoom || !selectedPackage) {
      setIsSubmitting(false);
      setSubmitError("Không có phòng chụp hoặc gói chụp khả dụng trong cơ sở dữ liệu.");
      return;
    }

    // KIỂM TRA TRÙNG LỊCH: Nếu phòng đã có người đặt, cảnh báo ngay tại trang Đặt Lịch và chặn chuyển trang
    if (isCurrentSlotBooked) {
      setIsSubmitting(false);
      const conflictMsg = `⚠️ Cảnh Báo: Phòng "${selectedRoom?.name}" đã có khách đặt trước vào khung giờ ${selectedTimeSlot?.label} ngày ${bookingDate}. Quý khách vui lòng chọn ngày hoặc khung giờ khác!`;
      setSubmitError(conflictMsg);
      const timeSection = document.getElementById("time-slot-section");
      if (timeSection) {
        timeSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Kiểm tra thông tin nhập an toàn
    const safeName = (customerInfo?.name || "").trim();
    const safePhone = (customerInfo?.phone || "").trim();
    const safeEmail = (customerInfo?.email || "").trim();
    const safeNotes = (customerInfo?.notes || "").trim();

    const errors = {};
    if (!safeName) errors.name = "Vui lòng nhập họ và tên của bạn.";
    if (!safePhone) {
      errors.phone = "Vui lòng nhập số điện thoại liên hệ.";
    } else if (!/^[0-9+ ]{9,15}$/.test(safePhone)) {
      errors.phone = "Số điện thoại không hợp lệ (tối thiểu 9 chữ số).";
    }
    if (!bookingDate) errors.date = "Vui lòng chọn ngày chụp.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitError("Vui lòng điền đầy đủ thông tin: " + Object.values(errors).join(" • "));
      const errorSection = document.getElementById("customer-info-section");
      if (errorSection) {
        errorSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Chuẩn bị dữ liệu lịch hẹn để chuyển sang trang thanh toán
    // Lưu ý: Đơn CHƯA được tạo vào CSDL ở bước này; chỉ được tạo sau khi thanh toán cọc hoặc thanh toán hết
    const customerIdToUse = Number(currentUser?.id) > 0 ? Number(currentUser.id) : 2;

    const paymentData = {
      customerId: customerIdToUse,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      roomImage: selectedRoom.primaryImage || selectedRoom.image,
      roomCapacity: selectedRoom.capacity || 1,
      selectedRoom: {
        id: selectedRoom.id,
        name: selectedRoom.name,
        capacity: selectedRoom.capacity || 1,
        image: selectedRoom.primaryImage || selectedRoom.image,
        description: selectedRoom.description || '',
      },
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      packagePrice: selectedPackage.price,
      packageOriginalPrice: selectedPackage.originalPrice || selectedPackage.price,
      packageDiscountPercent: selectedPackage.packageDiscountPercent || 0,
      packageDuration: selectedPackage.duration || '60 phút',
      packageImage: selectedPackage.primaryImage || selectedPackage.image,
      selectedPackage: {
        id: selectedPackage.id,
        name: selectedPackage.name,
        price: selectedPackage.price,
        originalPrice: selectedPackage.originalPrice || selectedPackage.price,
        packageDiscountPercent: selectedPackage.packageDiscountPercent || 0,
        duration: selectedPackage.duration || '60 phút',
        image: selectedPackage.primaryImage || selectedPackage.image,
        description: selectedPackage.description || '',
      },
      bookingDate: bookingDate,
      date: bookingDate,
      startTime: selectedTimeSlot?.start || "08:30:00",
      endTime: selectedTimeSlot?.end || "10:30:00",
      time: selectedTimeSlot?.label || "08:30 – 10:30 (Sáng)",
      selectedTimeSlot: selectedTimeSlot,
      customerName: safeName,
      name: safeName,
      customerPhone: safePhone,
      phone: safePhone,
      customerEmail: safeEmail,
      email: safeEmail,
      attendees: Number(customerInfo?.attendees) || 1,
      customerNote: safeNotes,
      note: safeNotes,
      promoCode: pricingSummary?.canApplyPromo ? "STUDIO2026" : "",
      autoApplyPromo: Boolean(pricingSummary?.canApplyPromo),
      selectedServices: selectedServices,
      selectedServiceIds: selectedServiceIds,
      servicesTotal: servicesTotal,
      pricingSummary: pricingSummary,
      finalTotal: pricingSummary?.finalTotal || selectedPackage.price,
    };

    try {
      sessionStorage.setItem("pending_booking_order", JSON.stringify(paymentData));
      sessionStorage.setItem("pending_payment_state", JSON.stringify(paymentData));
    } catch {
      // Bỏ qua lỗi sessionStorage nếu có
    }

    // Chuyển hướng trực tiếp ngay lập tức sang trang thanh toán
    window.location.href = `${ROUTES.USER.PAYMENT}?packageId=${selectedPackage.id}`;
  };

  if (!isAuthenticated) {
    return null; // Đang chuyển hướng sang /login
  }

  if (optionsLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAF5F5] text-sm font-medium text-[#7A6C71]">Đang tải phòng chụp và gói chụp từ cơ sở dữ liệu...</div>;
  }

  if (optionsError || !selectedRoom || !selectedPackage) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAF5F5] px-4"><div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm"><p className="font-semibold text-[#2A1D22]">Chưa thể mở chức năng đặt lịch</p><p className="mt-2 text-sm text-rose-600">{optionsError || "Không có phòng chụp hoặc gói chụp đang hoạt động trong cơ sở dữ liệu."}</p><button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-full bg-[#B85064] px-4 py-2 text-sm font-semibold text-white">Tải lại</button></div></div>;
  }

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative overflow-hidden pb-20">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Nền studio điện ảnh với breadcrumb và typography sang trọng */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[380px] lg:min-h-[420px] bg-[#141012] overflow-hidden flex items-center pt-24 pb-14">
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
              <span className="text-[#E899A8] font-semibold">Đặt Lịch Chụp Studio</span>
            </div>

            <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#E5A8B4]">
              HỆ THỐNG ĐẶT LỊCH TRỰC TUYẾN PHOTOSTUDIO
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.25] font-serif-luxury">
              Khám Phá Phòng &
              <br />
              <span className="italic font-normal text-[#E899A8] font-serif-luxury mr-2">
                Đặt Lịch
              </span>
              Studio Của Bạn
            </h1>

            <p className="text-[#E2D5D9] text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed pt-1">
              Điền thông tin đặt lịch, chọn không gian studio yêu thích và nhận ngay ưu đãi{' '}
              <strong className="text-[#E899A8] font-semibold">20% trực tuyến</strong> khi thanh toán hôm nay.
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

      {/* Main Booking Content: Bố cục 2 cột 50/50 ở trên và 100% full-width tóm tắt ở dưới */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <form onSubmit={handleConfirmBooking} className="space-y-10">
          {/* HÀNG TRÊN: 4 KHUNG ĐỀU NHAU (LƯỚI 2x2 TRÊN DESKTOP: 50% TRÁI & 50% PHẢI) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* [HÀNG 1 - TRÁI 50%]: KHUNG 1 - THÔNG TIN NGƯỜI DÙNG */}
            <section id="customer-info-section" className="order-1 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
              <FloralCardCorner position="top-right" />

              <div>
                <div className="flex items-center gap-2.5 pb-5 border-b border-[#F0E4E6] mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#B85064] text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                      Thông Tin Người Dùng Đặt Lịch
                    </h2>
                    <p className="text-xs text-[#7A6C71]">
                      Thông tin liên hệ xác nhận lịch chụp và nhận bộ ảnh hoàn
                      thiện
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Họ và tên */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5 flex items-center gap-1">
                      <span>Họ Và Tên Khách Hàng *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => {
                          setCustomerInfo({
                            ...customerInfo,
                            name: e.target.value,
                          });
                          if (formErrors.name)
                            setFormErrors({ ...formErrors, name: "" });
                        }}
                        placeholder="VD: Nguyễn Thúy Vi"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22]"
                      />
                      <UserIcon className="w-4 h-4 text-[#A6979B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {formErrors.name && (
                      <p className="text-xs text-rose-500 mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5">
                      Số Điện Thoại (Zalo) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => {
                          setCustomerInfo({
                            ...customerInfo,
                            phone: e.target.value,
                          });
                          if (formErrors.phone)
                            setFormErrors({ ...formErrors, phone: "" });
                        }}
                        placeholder="VD: 0912345678"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22]"
                      />
                      <PhoneIcon className="w-4 h-4 text-[#A6979B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-rose-500 mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5">
                      Email Nhận Biên Lai
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            email: e.target.value,
                          })
                        }
                        placeholder="email@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22]"
                      />
                      <EnvelopeIcon className="w-4 h-4 text-[#A6979B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Số người */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5">
                      Số Lượng Người Tham Gia Buổi Chụp
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max={selectedRoom.capacity || 10}
                        value={customerInfo.attendees}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            attendees: Number(e.target.value) || 1,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22]"
                      />
                      <UserGroupIcon className="w-4 h-4 text-[#A6979B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[11px] text-[#7A6C71] mt-1 block">
                      Phòng {selectedRoom.name.split(" - ")[0]} có sức chứa tối
                      đa {selectedRoom.capacity} người.
                    </span>
                  </div>

                  {/* Ghi chú */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5">
                      Ghi Chú Đặc Biệt / Yêu Cầu Concept Riêng
                    </label>
                    <textarea
                      rows="3"
                      value={customerInfo.notes}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          notes: e.target.value,
                        })
                      }
                      placeholder="VD: Cần hỗ trợ mượn áo dài trắng size M, mong muốn chụp layout hoàng hôn, makeup tự nhiên..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22] resize-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* [HÀNG 1 - PHẢI 50%]: KHUNG 3 - CHỌN PHÒNG CHỤP STUDIO */}
            <section className="order-3 lg:order-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
              <FloralCardCorner position="top-right" />

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0E4E6] mb-4 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#B85064] text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                      <BuildingLibraryIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                        Chọn Phòng Chụp Studio
                      </h2>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#B85064] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#F0D5DA] self-start sm:self-auto shrink-0">
                    Đang chọn:{" "}
                    <strong>{selectedRoom.name.split(" - ")[0]}</strong>
                  </span>
                </div>

                {/* ẢNH ĐẠI DIỆN LỚN CỦA PHÒNG ĐANG CHỌN */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 border border-[#F0E4E6] shadow-md bg-neutral-900 group">
                  <img
                    src={selectedRoom.primaryImage || selectedRoom.image}
                    alt={selectedRoom.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85";
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      Phòng #{selectedRoom.id}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-[#B85064] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>Đang Chọn</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h3 className="font-bold text-sm sm:text-base font-serif-luxury drop-shadow-md">
                      {selectedRoom.name}
                    </h3>
                    <p className="text-[11px] text-white/80 line-clamp-1">
                      {selectedRoom.description}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6C71] mb-2 flex items-center justify-between">
                  <span>Danh Sách {rooms.length} Không Gian Studio:</span>
                  <span className="text-[#B85064]">Nhấn ảnh để đổi phòng</span>
                </div>

                {/* Danh sách phòng: Grid 2 cột cuộn mượt mà có ảnh rõ nét */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[240px] overflow-y-auto pr-1">
                  {rooms.map((room) => {
                    const isSelected =
                      Number(selectedRoomId) === Number(room.id);
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 flex flex-col relative group ${isSelected
                          ? "border-[#B85064] bg-[#FFF7F8] shadow-md ring-2 ring-[#B85064]/20"
                          : "border-[#F0E4E6] bg-white hover:border-[#B85064]/50 hover:shadow-sm"
                          }`}
                      >
                        {/* Ảnh phòng */}
                        <div className="relative h-24 w-full overflow-hidden bg-neutral-900">
                          <img
                            src={room.primaryImage || room.image}
                            alt={room.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85";
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                          {/* Badges */}
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                            <span className="text-[9px] font-bold text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20">
                              Phòng #{room.id}
                            </span>
                            <span className="text-[9px] font-bold text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20 flex items-center gap-0.5">
                              <UserGroupIcon className="w-2.5 h-2.5 text-[#E899A8]" />
                              <span>{room.capacity}</span>
                            </span>
                          </div>

                          {/* Checkmark active */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B85064] text-white flex items-center justify-center shadow-md">
                              <CheckCircleIcon className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        {/* Thông tin vắn tắt */}
                        <div className="p-2 text-xs flex-1 flex flex-col justify-between space-y-1">
                          <p className="text-[#2A1D22] text-[11px] font-semibold line-clamp-2 leading-relaxed">
                            {room.name}
                          </p>

                          <div className="pt-1 border-t border-[#F0E4E6] flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-[#B85064]">
                              Sức chứa: {room.capacity} người
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isSelected
                                ? "bg-[#B85064] text-white"
                                : "bg-neutral-100 text-[#55464B] group-hover:bg-[#B85064]/10 group-hover:text-[#B85064]"
                                }`}
                            >
                              {isSelected ? "Đã Chọn" : "Chọn"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* [HÀNG 2 - TRÁI 50%]: KHUNG 2 - CHỌN NGÀY VÀ GIỜ CHỤP */}
            <section className="order-2 lg:order-3 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
              <FloralCardCorner position="top-right" />

              <div>
                <div className="flex items-center gap-2.5 pb-5 border-b border-[#F0E4E6] mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#B85064] text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                    <CalendarDaysIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                      Chọn Ngày Và Giờ Chụp
                    </h2>
                    <p className="text-xs text-[#7A6C71]">
                      Lịch mở cửa phục vụ từ 08:30 đến 21:00 hàng ngày, kể cả
                      Thứ 7 và Chủ Nhật
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Chọn Ngày */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-2">
                      Ngày Chụp Studio *
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingDate}
                      onChange={(e) => {
                        setBookingDate(e.target.value);
                        if (formErrors.date)
                          setFormErrors({ ...formErrors, date: "" });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-sm text-[#2A1D22] bg-white cursor-pointer font-medium"
                    />
                    {formErrors.date && (
                      <p className="text-xs text-rose-500 mt-1">
                        {formErrors.date}
                      </p>
                    )}
                  </div>

                  {/* Chọn Khung Giờ */}
                  <div id="time-slot-section">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22]">
                        Khung Giờ Chụp *
                      </label>
                      {isCurrentSlotBooked && (
                        <span className="text-[11px] font-bold text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <ExclamationCircleIcon className="w-3.5 h-3.5" />
                          <span>Đã kín lịch</span>
                        </span>
                      )}
                    </div>

                    {/* Cảnh báo nổi bật khi khung giờ hiện tại bị trùng */}
                    {isCurrentSlotBooked && (
                      <div className="mb-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2.5 shadow-sm animate-pulse">
                        <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-rose-900 block mb-0.5">
                            ⚠️ Cảnh Báo: Phòng chụp đã có người đặt!
                          </strong>
                          <span className="leading-relaxed">
                            Phòng <strong>{selectedRoom?.name}</strong> đã có khách đặt trước vào khung giờ <strong>{selectedTimeSlot?.label}</strong> ngày <strong>{bookingDate}</strong>. Quý khách vui lòng chọn khung giờ khác hoặc đổi ngày chụp.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TIME_SLOTS.map((slot) => {
                        const isSlotSelected = selectedTimeSlot.id === slot.id;
                        const isSlotBooked = isSlotConflict(slot, selectedRoomId, bookingDate);

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => {
                              setSelectedTimeSlot(slot);
                              if (isSlotBooked) {
                                setSubmitError(
                                  `Phòng "${selectedRoom?.name}" đã có khách đặt trước vào khung giờ "${slot.label}" ngày ${bookingDate}. Vui lòng chọn khung giờ hoặc ngày khác!`
                                );
                              } else {
                                setSubmitError("");
                              }
                            }}
                            className={`px-3.5 py-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${(() => {
                              if (isSlotBooked) {
                                return isSlotSelected
                                  ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-300"
                                  : "border-rose-200 bg-rose-50/50 text-neutral-400 hover:border-rose-300";
                              }
                              return isSlotSelected
                                ? "border-[#B85064] bg-[#FFF0F2] text-[#B85064] ring-2 ring-[#B85064]/20 shadow-sm"
                                : "border-[#F0E4E6] bg-white text-[#55464B] hover:border-[#B85064]/40 hover:bg-[#FAF5F5]";
                            })()}`}
                          >
                            <div className="flex items-center gap-2">
                              <ClockIcon className={`w-4 h-4 ${isSlotBooked ? "text-rose-400" : "text-[#B85064]"}`} />
                              <span className={isSlotBooked ? "line-through text-neutral-400" : ""}>{slot.label}</span>
                            </div>
                            {isSlotBooked && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                                Đã Đặt
                              </span>
                            )}
                            {!isSlotBooked && isSlotSelected && (
                              <CheckCircleIcon className="w-4 h-4 text-[#B85064]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* KHUNG ÁP MÃ ƯU ĐÃI (LẤP ĐẦY KHOẢNG TRỐNG DƯỚI KHUNG GIỜ) */}
                  <div className="pt-3 border-t border-[#F0E4E6]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22]">
                        Mã Ưu Đãi Thanh Toán
                      </label>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                        Giảm 20% online
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          readOnly
                          value="STUDIO2026"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-dashed border-[#B85064] bg-[#FFF8F9] text-xs font-mono font-bold text-[#B85064] uppercase outline-none"
                        />
                        <TicketIcon className="w-4 h-4 text-[#B85064] absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      <span className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#BE4B5E] to-[#A8394C] text-white text-xs font-bold flex items-center gap-1 shadow-sm shrink-0">
                        <CheckIcon className="w-3.5 h-3.5" />
                        Đã Áp Dụng
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6C71] mt-1.5 flex items-center gap-1 font-light">
                      <PlusCircleIcon className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                      <span>Hệ thống tự động áp mã <strong>STUDIO2026</strong> giảm 20% khi thanh toán trực tuyến!</span>
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* [HÀNG 2 - PHẢI 50%]: KHUNG 4 - CHỌN GÓI CHỤP NGHỆ THUẬT */}
            <section className="order-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
              <FloralCardCorner position="top-right" />

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0E4E6] mb-4 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#B85064] text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                      <CameraIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                        Chọn Gói Chụp Nghệ Thuật
                      </h2>
                      <p className="text-xs text-[#7A6C71]">
                        Các gói chụp đang được studio cung cấp, lấy trực tiếp từ cơ sở dữ liệu
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#B85064] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#F0D5DA] self-start sm:self-auto shrink-0">
                    Đang chọn: <strong>{selectedPackage.name}</strong>
                  </span>
                </div>

                {/* ẢNH ĐẠI DIỆN LỚN CỦA GÓI ĐANG CHỌN */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 border border-[#F0E4E6] shadow-md bg-neutral-900 group">
                  <img
                    src={selectedPackage.image || selectedPackage.primaryImage}
                    alt={selectedPackage.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white bg-[#B85064] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>
                        {selectedPackage.duration || "Thời lượng chưa cập nhật"} • Đang Chọn
                      </span>
                    </span>
                    {selectedPackage.packageDiscountPercent > 0 && (
                      <span className="text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full shadow-sm">
                        Giảm {selectedPackage.packageDiscountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-end justify-between">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base font-serif-luxury drop-shadow-md">
                        {selectedPackage.name}
                      </h3>
                      <p className="text-[11px] text-white/80 line-clamp-1">
                        {selectedPackage.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-bold text-[#F3ACB8]">
                        {selectedPackage.price.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6C71] mb-2 flex items-center justify-between">
                  <span>Danh Sách {packages.length} Gói Chụp Nghệ Thuật:</span>
                  <span className="text-[#B85064]">Nhấn ảnh để đổi gói</span>
                </div>

                {/* Danh sách gói chụp lấy từ API */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[240px] overflow-y-auto pr-1">
                  {packages.map((pkg) => {
                    const isSelected =
                      Number(selectedPackageId) === Number(pkg.id);
                    const hasDiscount =
                      pkg.originalPrice && pkg.originalPrice > pkg.price;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 flex flex-col relative group ${isSelected
                          ? "border-[#B85064] bg-[#FFF7F8] shadow-md ring-2 ring-[#B85064]/20"
                          : "border-[#F0E4E6] bg-white hover:border-[#B85064]/50 hover:shadow-sm"
                          }`}
                      >
                        {/* Ảnh gói */}
                        <div className="relative h-24 w-full overflow-hidden bg-neutral-900">
                          <img
                            src={pkg.image || pkg.primaryImage}
                            alt={pkg.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                          {/* Badges */}
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                            {hasDiscount && (
                              <span className="text-[9px] font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded shadow-sm">
                                Giảm {pkg.packageDiscountPercent}%
                              </span>
                            )}
                            <span className="text-[9px] font-bold text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20">
                              {pkg.duration || "60 phút"}
                            </span>
                          </div>

                          {/* Checkmark active */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B85064] text-white flex items-center justify-center shadow-md">
                              <CheckCircleIcon className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        {/* Thông tin vắn tắt */}
                        <div className="p-2 text-xs flex-1 flex flex-col justify-between space-y-1">
                          <p className="text-[#2A1D22] text-[11px] font-semibold line-clamp-2 leading-relaxed">
                            {pkg.name}
                          </p>

                          <div className="pt-1 border-t border-[#F0E4E6] flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#B85064]">
                              {pkg.price ? pkg.price.toLocaleString("vi-VN") + " đ" : ""}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isSelected
                                ? "bg-[#B85064] text-white"
                                : "bg-neutral-100 text-[#55464B] group-hover:bg-[#B85064]/10 group-hover:text-[#B85064]"
                                }`}
                            >
                              {isSelected ? "Đã Chọn" : "Chọn"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* ========================================================================= */}
          {/* KHUNG 5: TÙY CHỌN DỊCH VỤ NÂNG CAO (Makeup, Thuê trang phục, Retouch...) */}
          {/* ========================================================================= */}
          {servicesList.length > 0 && (
            <div className="w-full">
              <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F0E4E6] shadow-sm relative overflow-hidden">
                <FloralCardCorner position="top-right" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0E4E6] gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#B85064] text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                      <SparklesIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                        Khung 5: Tùy Chọn Dịch Vụ Nâng Cao (Không Bắt Buộc)
                      </h2>
                      <p className="text-xs text-[#7A6C71]">
                        Chọn thêm các dịch vụ bổ trợ chuyên nghiệp (Makeup, làm tóc, trang phục, chỉnh sửa cao cấp...)
                      </p>
                    </div>
                  </div>

                  {selectedServiceIds.length > 0 && (
                    <span className="text-xs font-bold text-[#B85064] bg-[#FFF0F2] px-3.5 py-1.5 rounded-full border border-[#B85064]/20 self-start sm:self-auto animate-pulse">
                      Đã chọn {selectedServiceIds.length} dịch vụ (+{servicesTotal.toLocaleString("vi-VN")} đ)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-5">
                  {servicesList.map((service) => {
                    const isSelected = selectedServiceIds.includes(Number(service.id));
                    return (
                      <div
                        key={service.id}
                        onClick={() => handleToggleService(service.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${isSelected
                          ? "border-[#B85064] bg-[#FFF0F2] text-[#B85064] shadow-md ring-2 ring-[#B85064]/30"
                          : "border-[#F0E4E6] bg-white text-[#261A1E] hover:border-[#B85064]/40 hover:bg-[#FAF5F5] shadow-xs"
                          }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${isSelected
                              ? "bg-[#B85064] border-[#B85064] text-white"
                              : "border-[#D9C8CC] bg-white"
                              }`}
                          >
                            {isSelected && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <div className="min-w-0">
                            <strong className="font-bold block text-xs sm:text-sm text-[#261A1E] truncate">
                              {service.name}
                            </strong>
                            {service.description && (
                              <p className="text-[11px] text-[#7A6C71] mt-0.5 line-clamp-2 leading-relaxed">
                                {service.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-[#B85064] shrink-0 text-xs sm:text-sm whitespace-nowrap">
                          +{Number(service.price || 0).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* HÀNG DƯỚI: BẢNG TÓM TẮT ĐẶT LỊCH CHIẾM 100% NẰM Ở DƯỚI 4 CÁI KHUNG KIA */}
          {/* ========================================================================= */}
          <div className="w-full">
            <section className="bg-white rounded-3xl p-6 sm:p-9 border border-[#F0E4E6] shadow-xl relative overflow-hidden">
              <FloralCardCorner position="top-right" />
              <FloralCardCorner position="bottom-left" />

              {/* Header của bảng tóm tắt */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0E4E6] gap-3">
                <div>
                  <h3 className="text-2xl font-bold font-serif-luxury text-[#2A1D22]">
                    Bảng Tóm Tắt Đặt Lịch & Dự Tính Chi Phí
                  </h3>
                  <p className="text-xs text-[#7A6C71] mt-1">
                    Vui lòng kiểm tra kỹ thông tin phòng chụp, gói chụp và ngày
                    giờ trước khi chuyển sang thanh toán
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F2] border border-[#F0D5DA] text-xs font-semibold text-[#B85064] self-start sm:self-auto">
                  <ShieldCheckIcon className="w-4 h-4 text-[#B85064]" />
                  <span>Bước Tiếp Theo: Cổng Thanh Toán VNPay Sandbox</span>
                </div>
              </div>

              {/* Bố cục 4 cột rộng rãi cho toàn bộ bảng tóm tắt */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-[#F0E4E6]">
                {/* CỘT 1: PHÒNG CHỤP ĐÃ CHỌN */}
                <div className="bg-[#FAF5F5] rounded-2xl p-4 border border-[#F0E4E6] flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064] block">
                      Không Gian Studio
                    </span>
                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-neutral-900 border border-[#F0E4E6]">
                      <img
                        src={selectedRoom.primaryImage || selectedRoom.image}
                        alt={selectedRoom.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85";
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white font-bold">
                        Phòng #{selectedRoom.id}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#2A1D22]">
                        {selectedRoom.name}
                      </h4>
                      <p className="text-xs text-[#7A6C71] mt-0.5">
                        Tối đa{" "}
                        {selectedRoom.capacity} người
                      </p>
                    </div>
                  </div>
                </div>

                {/* CỘT 2: GÓI CHỤP ĐÃ CHỌN */}
                <div className="bg-[#FAF5F5] rounded-2xl p-4 border border-[#F0E4E6] flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064] block">
                      Gói Chụp Nghệ Thuật
                    </span>
                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-neutral-900 border border-[#F0E4E6]">
                      <img
                        src={
                          selectedPackage.image || selectedPackage.primaryImage
                        }
                        alt={selectedPackage.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-[#B85064] px-2 py-0.5 rounded-md text-[10px] text-white font-bold">
                        {selectedPackage.duration || "Thời lượng chưa cập nhật"}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#2A1D22]">
                        {selectedPackage.name}
                      </h4>
                      <p className="text-xs text-[#7A6C71] mt-0.5">
                        Trọn gói makeup & trang phục thiết kế
                      </p>
                    </div>
                  </div>
                </div>

                {/* CỘT 3: THỜI GIAN & KHÁCH HÀNG */}
                <div className="bg-[#FAF5F5] rounded-2xl p-4 border border-[#F0E4E6] flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064] block">
                      Lịch Hẹn & Khách Hàng
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#F0E4E6] space-y-1">
                        <span className="text-[11px] text-[#7A6C71] block">
                          Thời gian chụp:
                        </span>
                        <strong className="text-xs text-[#2A1D22] block font-semibold">
                          {bookingDate}
                        </strong>
                        <span className="text-[11px] text-[#B85064] font-medium block">
                          {selectedTimeSlot.label}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#F0E4E6] space-y-1">
                        <span className="text-[11px] text-[#7A6C71] block">
                          Khách hàng liên hệ:
                        </span>
                        <strong className="text-xs text-[#2A1D22] block">
                          {customerInfo.name || "Chưa nhập họ tên"}
                        </strong>
                        <span className="text-[11px] text-[#55464B] block">
                          SĐT: {customerInfo.phone || "Chưa nhập SĐT"}
                        </span>
                        <span className="text-[10px] text-[#7A6C71] block">
                          Số người: {customerInfo.attendees} người
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CỘT 4: CHI TIẾT TÍNH GIÁ & MÃ GIẢM GIÁ */}
                <div className="bg-[#FAF5F5] rounded-2xl p-4 border border-[#F0E4E6] flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064] block">
                      Dự Tính Chi Phí
                    </span>

                    <div className="flex justify-between text-[#7A6C71]">
                      <span>Giá niêm yết:</span>
                      <strong className="text-[#2A1D22]">
                        {pricingSummary.originalPrice.toLocaleString("vi-VN")} đ
                      </strong>
                    </div>

                    {servicesTotal > 0 && (
                      <div className="flex justify-between text-[#B85064] font-medium">
                        <span>Dịch vụ nâng cao ({selectedServices.length}):</span>
                        <strong>
                          +{servicesTotal.toLocaleString("vi-VN")} đ
                        </strong>
                      </div>
                    )}

                    {pricingSummary.canApplyPromo ? (
                      <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-200">
                        <span className="font-semibold flex items-center gap-1">
                          <TicketIcon className="w-3.5 h-3.5" />
                          Mã STUDIO2026:
                        </span>
                        <strong className="font-bold">
                          -
                          {pricingSummary.promoDiscountAmount.toLocaleString(
                            "vi-VN",
                          )}{" "}
                          đ
                        </strong>
                      </div>
                    ) : (
                      pricingSummary.pkgDiscountPercent > 0 && (
                        <div className="flex justify-between items-center text-[#B85064] bg-[#FFF0F2] px-2 py-1.5 rounded-lg border border-[#F0D5DA]">
                          <span>
                            Ưu đãi gói ({pricingSummary.pkgDiscountPercent}%):
                          </span>
                          <strong>
                            -
                            {(
                              pricingSummary.originalPrice -
                              pricingSummary.regularPackagePrice
                            ).toLocaleString("vi-VN")}{" "}
                            đ
                          </strong>
                        </div>
                      )
                    )}

                    <div className="pt-2 border-t border-[#E8DCDE] flex justify-between items-baseline">
                      <span className="font-bold text-xs text-[#2A1D22]">
                        Tổng tiền dự kiến:
                      </span>
                      <strong className="text-base font-bold text-[#B85064]">
                        {pricingSummary.finalTotal.toLocaleString("vi-VN")} đ
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-[#F0E4E6] text-[10px] space-y-1">
                      <div className="flex justify-between text-[#55464B]">
                        <span>Đặt cọc giữ lịch (30%):</span>
                        <strong className="text-[#2A1D22]">
                          {pricingSummary.depositAmount.toLocaleString("vi-VN")}{" "}
                          đ
                        </strong>
                      </div>
                      <div className="flex justify-between text-[#55464B]">
                        <span>Còn lại thanh toán tại studio:</span>
                        <strong className="text-[#B85064]">
                          {pricingSummary.remainingAmount.toLocaleString(
                            "vi-VN",
                          )}{" "}
                          đ
                        </strong>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#7A6C71] italic leading-tight">
                      * {pricingSummary.promoReason}
                    </p>
                  </div>
                </div>
              </div>

              {isCurrentSlotBooked && (
                <div className="mt-4 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs sm:text-sm flex items-start gap-3 shadow-md animate-pulse">
                  <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-rose-900 block text-sm mb-1">
                      ⚠️ Cảnh Báo: Phòng chụp đã có người đặt!
                    </strong>
                    <span className="leading-relaxed">
                      Phòng <strong>{selectedRoom?.name}</strong> đã có khách đặt trước vào khung giờ <strong>{selectedTimeSlot?.label}</strong> ngày <strong>{bookingDate}</strong>. Quý khách vui lòng chọn ngày hoặc khung giờ khác ở Khung 2 phía trên.
                    </span>
                  </div>
                </div>
              )}

              {submitError && !isCurrentSlotBooked && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
                  <ExclamationCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Footer hành động: Nút xác nhận đặt lịch full-width nổi bật */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#7A6C71]">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Bảo lưu lịch hẹn miễn phí trước 24h • Kết nối thanh toán bảo
                    mật với cổng VNPay Sandbox
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white font-bold text-sm shadow-xl shadow-[#B85064]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin text-white" />
                      <span>Đang Tạo Đơn Đặt Lịch...</span>
                    </>
                  ) : (
                    <>
                      <span>Xác Nhận Đặt Lịch & Tiến Hành Thanh Toán</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}
