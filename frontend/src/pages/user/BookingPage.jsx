import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  ClockIcon,
  UserGroupIcon,
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
} from "@heroicons/react/24/solid";

import BlurText from "../../components/animations/BlurText";
import {
  FloralBranchCorner,
  ScatteredPetals,
  FloralCardCorner,
} from "../../components/common/FloralDecorations";
import { ROUTES } from "../../routes/web";
import { customerAuth } from "../../lib/axiosCustomer";
import customerRoomService from "../../services/user/roomService";
import customerPackageService from "../../services/user/packageService";
import customerEquipmentService from "../../services/user/equipmentService";
import userImageService from "../../services/user/imageService";
import customerBookingService from "../../services/user/bookingService";
import customerPaymentService from "../../services/user/paymentService";

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
  const currentUser = customerAuth.getUser();

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

  // Danh sách phòng và gói
  const [rooms, setRooms] = useState([]);
  const [packages, setPackages] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");

  // Lựa chọn đặt lịch
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId);
  const [bookingDate, setBookingDate] = useState(() => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split("T")[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);

  // Thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.fullName || currentUser?.name || "",
    phone: currentUser?.phone || currentUser?.phoneNumber || "",
    email: currentUser?.email || "",
    attendees: 1,
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Nếu người dùng chưa đăng nhập, tự động chuyển sang trang đăng nhập kèm trạng thái chuyển hướng
  useEffect(() => {
    if (!isAuthenticated) {
      const returnUrl = location.pathname + location.search;
      navigate(ROUTES.AUTH.LOGIN, {
        replace: true,
        state: {
          from: returnUrl,
          message:
            "Quý khách vui lòng đăng nhập tài khoản để tiến hành đặt lịch chụp trực tuyến!",
        },
      });
    }
  }, [isAuthenticated, navigate, location.pathname, location.search]);

  // Load danh sách phòng & gói thực tế từ CSDL
  useEffect(() => {
    let active = true;
    async function loadData() {
      const [roomsResult, packagesResult, imagesResult] = await Promise.allSettled([
        customerRoomService.getAllRooms(),
        customerPackageService.getAllPackages(),
        userImageService.getAllImages(),
      ]);
      if (!active) return;

      const getList = (result) => {
        if (result.status !== "fulfilled") return [];
        const value = result.value;
        return Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : [];
      };
      const allImages = getList(imagesResult);
      const rawRooms = getList(roomsResult);
      const rawPackages = getList(packagesResult);

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

  // Lấy chi tiết phòng và gói đang chọn
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => Number(r.id) === Number(selectedRoomId)) || rooms[0] || null;
  }, [rooms, selectedRoomId]);

  const selectedPackage = useMemo(() => {
    return packages.find((p) => Number(p.id) === Number(selectedPackageId)) || packages[0] || null;
  }, [packages, selectedPackageId]);

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
    let finalTotal;
    let promoDiscountAmount;

    if (isPromoUsed) {
      canApplyPromo = false;
      promoReason =
        "Mã STUDIO2026 bạn đã từng sử dụng trước đó (mỗi tài khoản được dùng 1 lần).";
      promoDiscountAmount = 0;
      finalTotal = regularPackagePrice;
    } else if (pkgDiscountPercent > 20) {
      canApplyPromo = false;
      promoReason = `Gói chụp đang có ưu đãi ${pkgDiscountPercent}% (>20%), hệ thống tự động giữ mức ưu đãi cao nhất cho bạn.`;
      promoDiscountAmount = 0;
      finalTotal = regularPackagePrice;
    } else {
      canApplyPromo = true;
      promoReason =
        "Áp dụng mã STUDIO2026: Giảm 20% trên giá gốc niêm yết dành cho khách đặt lịch trực tuyến!";
      promoDiscountAmount = Math.round(originalPrice * 0.2);
      finalTotal = originalPrice - promoDiscountAmount;
    }

    // Tiền cọc (mặc định 30% tổng thanh toán)
    const depositAmount = Math.round(finalTotal * 0.3);
    const remainingAmount = finalTotal - depositAmount;

    return {
      originalPrice,
      pkgDiscountPercent,
      regularPackagePrice,
      canApplyPromo,
      promoReason,
      promoDiscountAmount,
      finalTotal,
      depositAmount,
      remainingAmount,
    };
  }, [selectedPackage, currentUser, customerInfo.phone]);

  // Xử lý xác nhận đặt lịch
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!selectedRoom || !selectedPackage) {
      setSubmitError("Không có phòng chụp hoặc gói chụp khả dụng trong cơ sở dữ liệu.");
      return;
    }

    // Kiểm tra thông tin nhập
    const errors = {};
    if (!customerInfo.name.trim())
      errors.name = "Vui lòng nhập họ và tên của bạn.";
    if (!customerInfo.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại liên hệ.";
    } else if (!/^[0-9+ ]{9,15}$/.test(customerInfo.phone.trim())) {
      errors.phone = "Số điện thoại không hợp lệ.";
    }
    if (!bookingDate) errors.date = "Vui lòng chọn ngày chụp.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Tạo đơn đặt lịch trong CSDL qua backend API
      if (customerAuth.getToken()?.startsWith("mock-jwt-token")) {
        throw new Error(
          "Bạn đang đăng nhập bằng tài khoản demo khi máy chủ chưa xác thực. Hãy đăng nhập lại khi backend đang chạy để gửi đơn vào cơ sở dữ liệu.",
        );
      }

      const customerIdToUse = Number(currentUser?.id);
      if (!Number.isInteger(customerIdToUse) || customerIdToUse <= 0) {
        throw new Error(
          "Không xác định được tài khoản khách hàng đang đăng nhập. Vui lòng đăng xuất và đăng nhập lại.",
        );
      }

      const normalizeList = (value) =>
        Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : [];
      const [packageServices, packageBackgrounds, equipmentResponse] = await Promise.all([
        customerPackageService.getPackageServices(selectedPackage.id),
        customerPackageService.getPackageBackgrounds(selectedPackage.id),
        customerEquipmentService.getAllEquipments(),
      ]);
      const includedServices = normalizeList(packageServices);
      const includedBackgrounds = normalizeList(packageBackgrounds);
      const allEquipments = normalizeList(equipmentResponse);

      // Gói chỉ lưu loại và số lượng thiết bị; chọn thiết bị thật đang khả dụng trước
      // khi tạo booking để tránh tạo đơn khi không thể đáp ứng gói.
      const equipmentPlan = [];
      const claimedEquipmentIds = new Set();
      for (const packageEquipment of selectedPackage.equipments || []) {
        const type = String(packageEquipment.equipmentType || "").toLowerCase();
        const quantity = Math.max(1, Number(packageEquipment.quantity) || 1);
        const matches = allEquipments.filter((equipment) =>
          String(equipment.type || "").toLowerCase() === type &&
          String(equipment.status || "").toLowerCase() === "available" &&
          !equipment.deletedAt &&
          !claimedEquipmentIds.has(Number(equipment.id)),
        );
        if (matches.length < quantity) {
          throw new Error(`Gói chụp cần ${quantity} thiết bị loại "${type}" nhưng hiện không đủ thiết bị khả dụng. Vui lòng chọn gói khác hoặc liên hệ studio.`);
        }
        const selectedEquipment = matches.slice(0, quantity);
        selectedEquipment.forEach((equipment) => claimedEquipmentIds.add(Number(equipment.id)));
        equipmentPlan.push(...selectedEquipment);
      }

      if (includedServices.some((item) => !Number(item.serviceId))) {
        throw new Error("Cấu hình dịch vụ của gói chụp chưa hợp lệ; vui lòng liên hệ studio.");
      }
      if (includedBackgrounds.some((item) => !Number(item.backgroundId))) {
        throw new Error("Cấu hình bối cảnh của gói chụp chưa hợp lệ; vui lòng liên hệ studio.");
      }

      const customerNote = customerInfo.notes.trim().slice(0, 255) || null;

      const bookingPayload = {
        customerId: customerIdToUse,
        roomId: selectedRoom.id,
        bookingDate: `${bookingDate}T${selectedTimeSlot.start}`,
        startTime: selectedTimeSlot.start,
        endTime: selectedTimeSlot.end,
        status: "pending",
        customerNote,
      };

      let createdBooking;
      try {
        createdBooking =
          await customerBookingService.createBooking(bookingPayload);
      } catch (apiError) {
        const serverMessage =
          apiError.response?.data?.message || apiError.response?.data?.error;
        throw new Error(
          serverMessage ||
            apiError.message ||
            "Máy chủ không thể lưu đơn đặt lịch.",
        );
      }
      const createdBookingId = createdBooking?.id;
      if (!createdBookingId) {
        throw new Error("Backend không trả về mã đơn đặt lịch.");
      }

      // Lưu gói vào bảng liên kết booking_packages để chi tiết đơn có dữ liệu thật.
      try {
        await customerBookingService.addPackage({
          bookingId: createdBookingId,
          packageId: selectedPackage.id,
          quantity: 1,
          unitPrice: pricingSummary.finalTotal,
        });
      } catch (apiError) {
        const serverMessage =
          apiError.response?.data?.message || apiError.response?.data?.error;
        throw new Error(
          `Đơn #${createdBookingId} đã được lưu, nhưng chưa lưu được gói chụp${serverMessage ? `: ${serverMessage}` : "."} Vui lòng liên hệ studio, không gửi lại đơn.`,
        );
      }

      const childWrites = [
        ...includedServices.map((item) => ({
          label: `Dịch vụ ${item.serviceName || `#${item.serviceId}`}`,
          request: customerBookingService.addService({
            bookingId: createdBookingId,
            serviceId: item.serviceId,
            quantity: Math.max(1, Number(item.quantity) || 1),
            unitPrice: Number(item.servicePrice ?? (Number(item.subtotal) / Math.max(1, Number(item.quantity) || 1))) || 0,
          }),
        })),
        ...includedBackgrounds.map((item) => ({
          label: `Bối cảnh ${item.backgroundName || `#${item.backgroundId}`}`,
          request: customerBookingService.addBackground({
            bookingId: createdBookingId,
            backgroundId: item.backgroundId,
          }),
        })),
        ...equipmentPlan.map((equipment) => ({
          label: `Thiết bị ${equipment.name || `#${equipment.id}`}`,
          request: customerBookingService.addEquipment({
            bookingId: createdBookingId,
            equipmentId: equipment.id,
            status: "assigned",
            note: `Thiết bị đi kèm gói ${selectedPackage.name}`.slice(0, 255),
          }),
        })),
      ];
      const childResults = await Promise.allSettled(childWrites.map(({ request }) => request));
      const childFailures = childResults.flatMap((result, index) => {
        if (result.status === "fulfilled") return [];
        const reason = result.reason;
        const message = reason?.response?.data?.message || reason?.response?.data?.error || reason?.message;
        return [`${childWrites[index].label}: ${message || "API từ chối yêu cầu"}`];
      });
      if (childFailures.length) {
        throw new Error(`Đơn #${createdBookingId} và gói chụp đã được lưu, nhưng chưa liên kết được một số mục: ${childFailures.join("; ")}. Vui lòng liên hệ studio; không gửi lại toàn bộ đơn.`);
      }

      // 2. Chuyển hướng sang trang thanh toán kèm thông tin gói, phòng và tự động tính mã giảm giá
      navigate(ROUTES.USER.PAYMENT, {
        state: {
          bookingId: createdBookingId || 1,
          packageId: selectedPackage.id,
          roomId: selectedRoom.id,
          date: bookingDate,
          time: selectedTimeSlot.label,
          customerName: customerInfo.name.trim(),
          customerPhone: customerInfo.phone.trim(),
          customerEmail: customerInfo.email.trim(),
          customerNote: customerInfo.notes.trim(),
          promoCode: pricingSummary.canApplyPromo ? "STUDIO2026" : "",
          autoApplyPromo: pricingSummary.canApplyPromo,
        },
      });
    } catch (error) {
      setSubmitError(
        error.message ||
          "Có lỗi xảy ra khi tạo lịch hẹn. Vui lòng thử lại hoặc liên hệ hotline studio.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Họa tiết hoa trang trí góc */}
      <FloralBranchCorner
        position="top-right"
        opacity="opacity-50"
        className="top-24 z-10"
      />
      <FloralBranchCorner
        position="bottom-left"
        opacity="opacity-40"
        className="bottom-40 z-10"
      />
      <ScatteredPetals className="z-10 pointer-events-none" />

      {/* Hero Header */}
      <div className="relative pt-12 pb-10 bg-gradient-to-b from-[#FFF5F6] via-[#FAF5F5] to-[#FAF5F5] border-b border-[#F0E4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B85064]/10 text-[#B85064] text-xs font-bold uppercase tracking-wider mb-3 border border-[#B85064]/20">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Hệ Thống Đặt Lịch Chụp Trực Tuyến</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury text-[#2A1D22] tracking-tight">
              <BlurText text="Khám Phá Phòng & Đặt Lịch Studio" delay={30} />
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#7A6C71] font-light leading-relaxed">
              Điền thông tin đặt lịch, chọn không gian studio yêu thích và nhận
              ngay ưu đãi{" "}
              <strong className="text-[#B85064] font-semibold">
                20% trực tuyến
              </strong>{" "}
              khi thanh toán hôm nay.
            </p>

            {/* Banner ưu đãi 20% */}
            <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FFF0F2] via-white to-[#FFF0F2] border border-[#F0D5DA] shadow-sm text-xs sm:text-sm text-[#8E3447]">
              <TicketIcon className="w-4 h-4 text-[#B85064] shrink-0 animate-bounce" />
              <span>
                Áp dụng mã ưu đãi{" "}
                <strong className="font-mono font-bold bg-[#B85064] text-white px-2 py-0.5 rounded-md">
                  STUDIO2026
                </strong>{" "}
                giảm 20% trực tiếp trên giá gốc niêm yết!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Booking Content: Bố cục 2 cột 50/50 ở trên và 100% full-width tóm tắt ở dưới */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <form onSubmit={handleConfirmBooking} className="space-y-10">
          {/* HÀNG TRÊN: 4 KHUNG ĐỀU NHAU (LƯỚI 2x2 TRÊN DESKTOP: 50% TRÁI & 50% PHẢI) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* [HÀNG 1 - TRÁI 50%]: KHUNG 1 - THÔNG TIN NGƯỜI DÙNG */}
            <section className="order-1 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
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
                        className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 flex flex-col relative group ${
                          isSelected
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
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                isSelected
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
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-2">
                      Khung Giờ Chụp *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TIME_SLOTS.map((slot) => {
                        const isSlotSelected = selectedTimeSlot.id === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`px-3.5 py-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                              isSlotSelected
                                ? "border-[#B85064] bg-[#FFF0F2] text-[#B85064] ring-2 ring-[#B85064]/20 shadow-sm"
                                : "border-[#F0E4E6] bg-white text-[#55464B] hover:border-[#B85064]/40 hover:bg-[#FAF5F5]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4 text-[#B85064]" />
                              <span>{slot.label}</span>
                            </div>
                            {isSlotSelected && (
                              <CheckCircleIcon className="w-4 h-4 text-[#B85064]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
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
                <div className="grid max-h-[65vh] min-h-[360px] grid-cols-1 auto-rows-[minmax(190px,auto)] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                  {packages.map((pkg) => {
                    const isSelected =
                      Number(selectedPackageId) === Number(pkg.id);
                    const hasDiscount =
                      pkg.originalPrice && pkg.originalPrice > pkg.price;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`min-h-[190px] cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 flex flex-col relative group ${
                          isSelected
                            ? "border-[#B85064] bg-[#FFF7F8] shadow-md ring-2 ring-[#B85064]/20"
                            : "border-[#F0E4E6] bg-white hover:border-[#B85064]/50 hover:shadow-sm"
                        }`}
                      >
                        {/* Ảnh gói */}
                        <div className="relative h-32 w-full shrink-0 overflow-hidden bg-neutral-900">
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

                          {/* Discount Badge */}
                          {hasDiscount && (
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold shadow-md">
                              Giảm {pkg.packageDiscountPercent}%
                            </div>
                          )}

                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B85064] text-white flex items-center justify-center shadow-md">
                              <CheckCircleIcon className="w-3 h-3" />
                            </div>
                          )}

                          <div className="absolute bottom-1 left-1.5 right-1.5 text-white">
                            <span className="text-[9px] uppercase font-bold text-[#F3ACB8] block">
                              {pkg.duration || "Thời lượng chưa cập nhật"}
                            </span>
                            <h4 className="font-bold text-[11px] drop-shadow-md truncate">
                              {pkg.name}
                            </h4>
                          </div>
                        </div>

                        {/* Thông tin giá và nút chọn */}
                        <div className="p-2 text-xs flex-1 flex flex-col justify-between space-y-1">
                          <p className="min-h-8 text-[#7A6C71] text-[11px] line-clamp-2 leading-relaxed">
                            {pkg.description}
                          </p>

                          <div className="pt-1 border-t border-[#F0E4E6] flex items-center justify-between">
                            <div>
                              {hasDiscount && (
                                <span className="text-[9px] text-[#A6979B] line-through block leading-none">
                                  {pkg.originalPrice.toLocaleString("vi-VN")} đ
                                </span>
                              )}
                              <span className="text-[11px] font-bold text-[#B85064]">
                                {pkg.price.toLocaleString("vi-VN")} đ
                              </span>
                            </div>

                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                isSelected
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

              {submitError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600">
                  {submitError}
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
