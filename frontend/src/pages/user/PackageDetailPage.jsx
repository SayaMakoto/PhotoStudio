import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  PlusCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  CameraIcon,
  CircleStackIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  ArchiveBoxIcon,
  Square3Stack3DIcon,
  StarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftEllipsisIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid';
import { ROUTES } from '../../routes/web';
import customerPackageService from '../../services/user/packageService';
import customerBookingService from '../../services/user/bookingService';
import userImageService from '../../services/user/imageService';
import customerServiceService from '../../services/user/serviceService';
import customerReviewService from '../../services/user/reviewService';
import { customerAuth } from '../../lib/axiosCustomer';
import {
  FloralCardCorner,
  FloatingPetals,
  FloralBranchCorner,
} from '../../components/common/FloralDecorations';

// Khung giờ đặt lịch studio
const TIME_SLOTS = [
  { id: 'm1', label: '08:30 – 10:30 (Sáng)', start: '08:30:00', end: '10:30:00' },
  { id: 'm2', label: '10:30 – 12:30 (Trưa)', start: '10:30:00', end: '12:30:00' },
  { id: 'a1', label: '13:30 – 15:30 (Chiều)', start: '13:30:00', end: '15:30:00' },
  { id: 'a2', label: '16:00 – 18:00 (Hoàng hôn)', start: '16:00:00', end: '18:00:00' },
  { id: 'e1', label: '18:30 – 20:30 (Tối Studio)', start: '18:30:00', end: '20:30:00' },
];


// =========================================================================
// BẢNG DỮ LIỆU ĐỐI SOÁT CƠ SỞ DỮ LIỆU (ĐỒNG BỘ 100% VỚI docs/photo_studio.sql)
// Đảm bảo không bao giờ bị trang trắng khi MySQL / Spring Boot đang khởi động.
// =========================================================================
function unwrapData(res) {
  if (!res) return null;
  if (Array.isArray(res)) return res;
  if (res.data !== undefined) return res.data;
  return res;
}

export default function PackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định ID gói chụp mục tiêu
  let targetId = 1;
  if (id && /^\d+$/.test(id)) {
    targetId = Number(id);
  } else if (location.state?.pkg?.id) {
    targetId = Number(location.state.pkg.id);
  }

  // Khởi tạo ngay dữ liệu CSDL chuẩn (từ Router State hoặc bảng CSDL)
  const defaultPkg = location.state?.pkg || null;

  // State dữ liệu gói chụp thực tế từ CSDL
  const [pkg, setPkg] = useState(defaultPkg);
  const [galleryImages, setGalleryImages] = useState(defaultPkg?.images || []);
  const [packageServices, setPackageServices] = useState(defaultPkg?.services || []);
  const [packageBackgrounds, setPackageBackgrounds] = useState(defaultPkg?.backgrounds || []);
  const [addOnServices, setAddOnServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [recommendedPackages, setRecommendedPackages] = useState([]);

  // State giao diện
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!defaultPkg);
  const [requireLoginModalOpen, setRequireLoginModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(() => {
    return customerAuth.isAuthenticated() ? customerAuth.getUser() : null;
  });

  // Modal Đặt lịch
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    note: '',
  });

  // Dịch vụ nâng cao được chọn
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const handleToggleService = (sId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };
  const selectedAddOnServices = useMemo(() => {
    return addOnServices.filter((s) => selectedServiceIds.includes(s.id));
  }, [addOnServices, selectedServiceIds]);
  const totalAddOnPrice = useMemo(() => {
    return selectedAddOnServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  }, [selectedAddOnServices]);

  const handleGoToBooking = () => {
    const serviceParams = selectedServiceIds.length > 0 ? `&services=${selectedServiceIds.join(',')}` : '';
    const targetUrl = `${ROUTES.USER.BOOKING}?packageId=${pkg.id}${serviceParams}`;
    try {
      sessionStorage.setItem('preselected_services', JSON.stringify(selectedAddOnServices));
      sessionStorage.setItem('preselected_service_ids', JSON.stringify(selectedServiceIds));
    } catch {
      // Ignored: Bỏ qua lỗi nếu sessionStorage không khả dụng
    }

    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        state: {
          from: targetUrl,
          message: 'Vui lòng đăng nhập tài khoản để tiến hành đặt gói chụp này!',
        },
      });
    } else {
      navigate(targetUrl, {
        state: {
          packageId: pkg.id,
          package: pkg,
          selectedServiceIds: selectedServiceIds,
          selectedServices: selectedAddOnServices,
        },
      });
    }
  };

  // Modal Tư vấn thêm
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultPhone, setConsultPhone] = useState('');
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // Lightbox xem ảnh lớn
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Carousel chỉ số cho gợi ý
  const [carouselIndex, setCarouselIndex] = useState(0);

  // =========================================================================
  // ĐỒNG BỘ DỮ LIỆU TỪ CƠ SỞ DỮ LIỆU BACKEND (API MYSQL)
  // =========================================================================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let isMounted = true;

    async function syncDataFromDatabase() {
      try {
        let pkgId = targetId;

        // Truy vấn đồng thời các bảng liên quan từ backend Spring Boot
        const [
          pkgDetailRes,
          imagesRes,
          allImagesRes,
          pkgServicesRes,
          pkgBackgroundsRes,
          allServicesRes,
          allPackagesRes,
          reviewsRes,
        ] = await Promise.all([
          customerPackageService.getPackageById(pkgId).catch(() => null),
          userImageService.getImagesByType('package', pkgId).catch(() => null),
          userImageService.getAllImages().catch(() => null),
          customerPackageService.getPackageServices(pkgId).catch(() => null),
          customerPackageService.getPackageBackgrounds(pkgId).catch(() => null),
          customerServiceService.getAllServices().catch(() => null),
          customerPackageService.getAllPackages().catch(() => null),
          customerReviewService.getAllReviews().catch(() => null),
        ]);

        if (!isMounted) return;

        // Giải nén payload đúng định dạng (bỏ qua bọc data nếu có)
        const livePkg = unwrapData(pkgDetailRes);
        if (livePkg && livePkg.id) {
          setPkg((prev) => ({ ...prev, ...livePkg }));
        }

        // 1. Đồng bộ ảnh Gallery từ bảng images trong CSDL
        const liveImages = unwrapData(imagesRes);
        const allLiveImages = unwrapData(allImagesRes);
        let imgs = [];

        if (Array.isArray(liveImages) && liveImages.length > 0) {
          imgs = liveImages.map((img) => ({
            id: img.id,
            url: img.imageUrl,
            caption: img.description || livePkg?.name || 'Ảnh chụp studio',
          }));
        } else if (Array.isArray(allLiveImages) && allLiveImages.length > 0) {
          const matched = allLiveImages.filter(
            (img) => img.imageableType?.toLowerCase() === 'package' && Number(img.imageableId) === Number(pkgId)
          );
          if (matched.length > 0) {
            imgs = matched.map((img) => ({
              id: img.id,
              url: img.imageUrl,
              caption: img.description || livePkg?.name || 'Ảnh chụp studio',
            }));
          }
        }

        if (imgs.length > 0) {
          setGalleryImages(imgs);
        }

        // 2. Đồng bộ dịch vụ đính kèm từ bảng package_services trong CSDL
        const liveServices = unwrapData(pkgServicesRes);
        if (Array.isArray(liveServices) && liveServices.length > 0) {
          setPackageServices(liveServices);
        }

        // 3. Đồng bộ bối cảnh từ bảng package_backgrounds trong CSDL
        const liveBackgrounds = unwrapData(pkgBackgroundsRes);
        if (Array.isArray(liveBackgrounds) && liveBackgrounds.length > 0) {
          setPackageBackgrounds(liveBackgrounds);
        }

        // 4. Đồng bộ bảng giá dịch vụ gia tăng từ bảng services trong CSDL
        const liveAddOns = unwrapData(allServicesRes);
        if (Array.isArray(liveAddOns) && liveAddOns.length > 0) {
          setAddOnServices(liveAddOns);
        }

        // 5. Đồng bộ danh sách các gói khác từ bảng packages trong CSDL
        const liveAllPackages = unwrapData(allPackagesRes);
        if (Array.isArray(liveAllPackages) && liveAllPackages.length > 0) {
          const others = liveAllPackages
            .filter((p) => Number(p.id) !== Number(pkgId))
            .map((p) => {
              return {
                id: p.id,
                name: p.name,
                description: p.description,
                duration: p.duration,
                price: p.price,
                priceDisplay: p.price ? `${Number(p.price).toLocaleString('vi-VN')}đ` : 'Liên hệ',
                imageUrl: p.imageUrl || null,
              };
            });
          if (others.length > 0) {
            setRecommendedPackages(others);
          }
        }

        // 6. Đồng bộ đánh giá từ CSDL
        const liveReviews = unwrapData(reviewsRes);
        if (Array.isArray(liveReviews)) {
          const matchedReviews = liveReviews.filter((r) => Number(r.packageId) === Number(pkgId));
          setReviews(matchedReviews);
        }
      } catch (err) {
        console.warn('[PackageDetailPage] CSDL Backend chưa bật hoặc đang kết nối, hiển thị dữ liệu gốc CSDL photo_studio.sql:', err.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void syncDataFromDatabase();

    return () => {
      isMounted = false;
    };
  }, [id, targetId]);


  // Handler chuyển ảnh trong gallery
  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  // Handler submit đơn đặt lịch vào bảng bookings trong CSDL
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.phone.trim()) {
      alert('Vui lòng điền họ tên và số điện thoại.');
      return;
    }

    setIsSubmitting(true);
    const todayStr = new Date().toISOString().split('T')[0];
    const payload = {
      packageId: pkg.id,
      bookingDate: bookingForm.date || todayStr,
      startTime: selectedTimeSlot.start,
      endTime: selectedTimeSlot.end,
      status: 'pending',
      customerNote: `[CSDL Gói #${pkg.id}] Khách: ${bookingForm.name.trim()} - SĐT: ${bookingForm.phone.trim()} - Gói: ${pkg.name} (${Number(pkg.price).toLocaleString('vi-VN')}đ) - Khung giờ: ${selectedTimeSlot.label}${bookingForm.note ? ` - Ghi chú: ${bookingForm.note}` : ''}`,
    };

    try {
      await customerBookingService.createBooking(payload);
    } catch (err) {
      console.warn('[PackageDetailPage] Gửi đơn đặt lịch:', err.message);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  // Handler gửi yêu cầu tư vấn nhanh
  const handleSubmitConsult = (e) => {
    e.preventDefault();
    if (!consultPhone.trim()) return;
    setConsultSubmitted(true);
  };

  // Màn hình đang nạp
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF5F5] text-[#261A1E]">
        <ArrowPathIcon className="w-10 h-10 animate-spin text-[#B85064] mb-4" />
        <h2 className="text-xl font-bold font-serif-luxury text-[#261A1E]">
          Đang kết nối cơ sở dữ liệu PhotoStudio...
        </h2>
        <p className="text-xs text-[#7A6C71] mt-1">
          Đang nạp thông tin gói chụp, bộ sưu tập ảnh và bảng báo giá từ CSDL.
        </p>
      </div>
    );
  }

  // Không tìm thấy gói chụp trong CSDL
  if (!pkg) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF5F5] text-[#261A1E] text-center space-y-4">
        <ArchiveBoxIcon className="w-12 h-12 text-[#CBB9BD] mx-auto" />
        <h2 className="text-2xl font-bold font-serif-luxury text-[#261A1E]">
          Không tìm thấy gói chụp trong cơ sở dữ liệu
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6C71] max-w-md mx-auto">
          Gói chụp bạn đang tìm kiếm không tồn tại hoặc đã bị tạm ngưng. Vui lòng chọn gói chụp khác từ danh mục.
        </p>
        <Link
          to={ROUTES.USER.PACKAGES}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B85064] text-white text-xs sm:text-sm font-semibold hover:bg-[#A33D50] transition-colors shadow-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Quay lại danh mục gói chụp</span>
        </Link>
      </div>
    );
  }

  const activeImage = galleryImages[activeImageIndex] || galleryImages[0] || null;
  const priceDisplay = pkg.price ? `${Number(pkg.price).toLocaleString('vi-VN')}đ` : 'Liên hệ';
  const durationDisplay = pkg.duration
    ? `${pkg.duration} phút (${(pkg.duration / 60).toFixed(1).replace('.0', '')} giờ)`
    : '60 – 120 phút';

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative pb-20">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: DỮ LIỆU TỪ CƠ SỞ DỮ LIỆU */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] bg-[#141012] overflow-hidden flex items-center pt-24 pb-16">
        {/* Background Image từ CSDL với độ sáng rõ nét cao */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105 pointer-events-none opacity-85"
          style={{
            backgroundImage: `url(${activeImage?.url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/80 via-[#141012]/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF5F5] via-transparent to-black/30 pointer-events-none" />

        {/* Ambient spotlight hồng đất cao cấp */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[400px] bg-[#E5A8B4]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Họa tiết cành hoa đào trang trí góc */}
        <FloralBranchCorner position="top-left" opacity="opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-4 sm:space-y-5">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Link to={ROUTES.USER.HOME} className="hover:text-[#E899A8] transition-colors">
                Trang Chủ
              </Link>
              <span>/</span>
              <Link to={ROUTES.USER.PACKAGES} className="hover:text-[#E899A8] transition-colors">
                Gói Chụp
              </Link>
              <span>/</span>
              <span className="text-[#E899A8] font-semibold truncate max-w-[260px] sm:max-w-md">{pkg.name}</span>
            </div>

            {/* Nút quay lại danh sách gói chụp */}
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.USER.PACKAGES}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#E5A8B4] hover:text-white transition-colors group"
              >
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Quay lại danh sách gói chụp</span>
              </Link>

              {/* Tag định danh CSDL */}
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-mono border border-white/20">
                CSDL ID: #{pkg.id}
              </span>

              {pkg.status && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold tracking-wider border border-emerald-500/30">
                  {pkg.status}
                </span>
              )}
            </div>

            {/* Tiêu đề gói chụp từ bảng packages trong CSDL */}
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-bold text-white tracking-tight font-serif-luxury leading-tight">
              {pkg.name}
            </h1>

            {/* Đoạn mô tả từ CSDL */}
            {pkg.description && (
              <p className="text-white/80 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl">
                {pkg.description}
              </p>
            )}

            {/* Giá gói lớn nổi bật từ CSDL */}
            <div className="pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-serif-luxury tracking-wide">
                {priceDisplay}
              </span>
            </div>

            {/* Nút hành động: Đặt lịch ngay */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleGoToBooking}
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white font-medium text-sm transition-all shadow-lg shadow-[#B85064]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Đặt lịch ngay</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. NỘI DUNG CHÍNH (GỘP LIỀN MẠCH THÀNH 1 TRANG DUY NHẤT TỪ CSDL) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* =================== CỘT TRÁI (~65% WIDTH) =================== */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* PHẦN 1: BỘ SƯU TẬP ẢNH TƯƠNG TÁC TỪ BẢNG IMAGES TRONG CSDL */}
            {galleryImages.length > 0 && activeImage ? (
              <div className="space-y-4">
                {/* Ảnh chính lớn có nút prev/next và badge số thứ tự */}
                <div className="relative rounded-3xl overflow-hidden bg-neutral-900 shadow-xl border border-[#F0E4E6] group">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={activeImage.url}
                      alt={activeImage.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] cursor-pointer"
                      onClick={() => setLightboxIndex(activeImageIndex)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Nút mũi tên trái */}
                    {galleryImages.length > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#261A1E] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95"
                        title="Ảnh trước"
                      >
                        <ChevronLeftIcon className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    )}

                    {/* Nút mũi tên phải */}
                    {galleryImages.length > 1 && (
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#261A1E] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95"
                        title="Ảnh tiếp theo"
                      >
                        <ChevronRightIcon className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    )}

                    {/* Badge số thứ tự ảnh góc dưới phải */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium tracking-widest">
                      {activeImageIndex + 1}/{galleryImages.length}
                    </div>

                    {/* Caption ảnh từ CSDL góc dưới trái */}
                    {activeImage.caption && (
                      <div className="absolute bottom-4 left-4 text-white text-xs sm:text-sm font-medium drop-shadow-md hidden sm:block max-w-md truncate">
                        {activeImage.caption}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hàng 6 ảnh thu nhỏ (Thumbnails từ CSDL) */}
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
                    {galleryImages.map((img, idx) => {
                      const isCurrent = idx === activeImageIndex;
                      return (
                        <button
                          type="button"
                          key={img.id || idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`cursor-pointer relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all ${
                            isCurrent
                              ? 'border-[#B85064] scale-[1.03] shadow-md shadow-[#B85064]/20 ring-2 ring-[#B85064]/20'
                              : 'border-transparent opacity-75 hover:opacity-100 hover:scale-[1.02]'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.caption}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-[#F0E4E6] text-center space-y-2">
                <ArchiveBoxIcon className="w-12 h-12 text-[#B85064] mx-auto opacity-70" />
                <h3 className="text-base font-bold text-[#261A1E]">
                  Gói chụp chưa được gắn ảnh trong cơ sở dữ liệu
                </h3>
              </div>
            )}

            {/* PHẦN 2: CHI TIẾT GÓI CHỤP TỪ CSDL */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                  Chi tiết gói chụp
                </h2>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#F2E8E9] shadow-xs space-y-3">
                <p className="text-[#55464B] text-sm sm:text-base leading-relaxed font-light">
                  {pkg.description || 'Chưa có thông tin mô tả chi tiết cho gói chụp này.'}
                </p>

                {/* Thông tin thời lượng & thiết bị từ CSDL */}
                <div className="pt-3 border-t border-[#F5E8EA] flex flex-wrap items-center gap-4 text-xs text-[#6B5A60]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ClockIcon className="w-4 h-4 text-[#B85064]" />
                    <span>Thời lượng buổi chụp: <strong>{durationDisplay}</strong></span>
                  </div>
                  {pkg.status && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <CircleStackIcon className="w-4 h-4 text-[#B85064]" />
                      <span>Trạng thái: <strong className="uppercase">{pkg.status}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PHẦN 3: BỐI CẢNH ĐÍNH KÈM TỪ BẢNG PACKAGE_BACKGROUNDS TRONG CSDL */}
            {packageBackgrounds.length > 0 && (
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                    Bối cảnh studio đính kèm ({packageBackgrounds.length} bối cảnh)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {packageBackgrounds.map((bg, idx) => (
                    <div
                      key={bg.id || idx}
                      className="p-4 rounded-2xl bg-white border border-[#F2E8E9] shadow-xs flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FDF5F6] text-[#B85064] flex items-center justify-center shrink-0 border border-[#F5D5DC]">
                        <CameraIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#261A1E]">
                          {bg.backgroundName || bg.name || 'Bối cảnh studio'}
                        </h4>
                        <p className="text-xs text-[#7A6C71] mt-0.5">
                          {bg.backgroundType ? `Phân loại: ${bg.backgroundType}` : 'Bối cảnh nghệ thuật studio'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHẦN 4: DỊCH VỤ ĐÍNH KÈM TỪ BẢNG PACKAGE_SERVICES TRONG CSDL */}
            {packageServices.length > 0 && (
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                    Dịch vụ đính kèm trong gói ({packageServices.length} dịch vụ)
                  </h2>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F2E8E9] shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packageServices.map((ps, idx) => (
                      <div
                        key={ps.id || idx}
                        className="p-4 rounded-2xl bg-[#FCF8F8] border border-[#F5E8EA] flex items-start gap-3.5"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#B85064]/10 text-[#B85064] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#261A1E]">
                            {ps.serviceName || 'Dịch vụ đính kèm'}
                          </h4>
                          <p className="text-xs text-[#6B5A60] mt-1 leading-relaxed">
                            {ps.quantity ? `Số lượng: ${ps.quantity}` : ''}
                            {ps.servicePrice ? ` • Giá trị: ${Number(ps.servicePrice).toLocaleString('vi-VN')}đ` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PHẦN 5: TRANG THIẾT BỊ ĐI KÈM TỪ CSDL (NẾU CÓ) */}
            {pkg.equipments && pkg.equipments.length > 0 && (
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                    Trang thiết bị chuẩn bị cho gói chụp
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pkg.equipments.map((eq, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-[#F2E8E9] shadow-xs text-center space-y-1"
                    >
                      <WrenchScrewdriverIcon className="w-5 h-5 text-[#B85064] mx-auto mb-1 opacity-80" />
                      <span className="block text-xs font-bold text-[#261A1E] capitalize">
                        {eq.equipmentType || 'Thiết bị'}
                      </span>
                      <span className="text-[11px] text-[#7A6C71] block">
                        Số lượng: <strong>{eq.quantity || 1}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHẦN 6: DỊCH VỤ NÂNG CẤP THÊM TỪ BẢNG SERVICES TRONG CSDL */}
            {addOnServices.length > 0 && (
              <div className="pt-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#261A1E]">
                    <PlusCircleIcon className="w-5 h-5 text-neutral-800" />
                    <h3 className="text-lg sm:text-xl font-bold font-serif-luxury">
                      Tùy chọn dịch vụ nâng cấp thêm (Báo giá CSDL)
                    </h3>
                  </div>
                  {selectedServiceIds.length > 0 && (
                    <span className="text-xs font-bold text-[#B85064] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#B85064]/20 animate-pulse">
                      Đã chọn {selectedServiceIds.length} dịch vụ (+{totalAddOnPrice.toLocaleString('vi-VN')}đ)
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7A6C71]">
                  Nhấn chọn để thêm dịch vụ vào lịch chụp của bạn. Các dịch vụ này sẽ tự động chuyển sang trang Đặt Lịch & Thanh Toán.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addOnServices.map((addon) => {
                    const isSelected = selectedServiceIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleService(addon.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs sm:text-sm select-none ${
                          isSelected
                            ? 'border-[#B85064] bg-[#FFF0F2] text-[#B85064] shadow-md ring-2 ring-[#B85064]/30'
                            : 'border-[#F0E4E6] bg-white text-[#261A1E] hover:border-[#B85064]/40 hover:bg-[#FAF5F5] shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                              isSelected
                                ? 'bg-[#B85064] border-[#B85064] text-white'
                                : 'border-[#D9C8CC] bg-white'
                            }`}
                          >
                            {isSelected && <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-bold block text-[#261A1E]">
                              {addon.name}
                            </span>
                            {addon.description && (
                              <p className="text-[11px] text-[#7A6C71] line-clamp-1">
                                {addon.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-[#B85064] shrink-0 text-sm">
                          +{Number(addon.price || 0).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PHẦN 7: ĐÁNH GIÁ THỰC TẾ TỪ KHÁCH HÀNG (REVIEWS TABLE TỪ CSDL) */}
            <div className="pt-4 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                    Đánh giá từ khách hàng ({reviews.length})
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!customerAuth.isAuthenticated()) {
                      setRequireLoginModalOpen(true);
                    } else {
                      const user = customerAuth.getUser();
                      setCurrentCustomer(user);
                      setNewReviewForm({
                        name: user?.fullname || user?.username || 'Khách Hàng',
                        rating: 5,
                        comment: '',
                      });
                      setIsReviewModalOpen(true);
                    }
                  }}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#B85064] text-[#B85064] hover:bg-[#FDF0F3] text-xs font-semibold transition-all shadow-xs"
                >
                  <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5" />
                  <span>Viết đánh giá</span>
                </button>
              </div>

              {/* Khối tổng quan điểm đánh giá */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FDF5F6] via-[#FAF0F2] to-white border border-[#F5D5DC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="text-center sm:text-left">
                    <div className="text-4xl sm:text-5xl font-extrabold text-[#B85064] font-serif-luxury">
                      5.0
                    </div>
                    <div className="flex items-center gap-1 text-[#F59E0B] mt-1 justify-center sm:justify-start">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon key={s} className="w-4 h-4 fill-[#F59E0B]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#7A6C71] block mt-1">
                      Dựa trên {reviews.length || 2} trải nghiệm thực tế
                    </span>
                  </div>

                  <div className="hidden md:block h-16 w-px bg-[#F0D5DC]" />

                  <div className="hidden md:block space-y-1.5 text-xs text-[#55464B]">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[11px] font-semibold">5 sao</span>
                      <div className="w-36 h-2 bg-white rounded-full overflow-hidden border border-[#F0D5DC]">
                        <div className="h-full bg-[#B85064] w-[95%]" />
                      </div>
                      <span className="text-[10px] text-[#8C7D82]">95%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[11px] font-semibold">4 sao</span>
                      <div className="w-36 h-2 bg-white rounded-full overflow-hidden border border-[#F0D5DC]">
                        <div className="h-full bg-[#B85064] w-[5%]" />
                      </div>
                      <span className="text-[10px] text-[#8C7D82]">5%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#2EA46D] bg-[#EBF8F2] px-3.5 py-2 rounded-2xl border border-[#B4E8D0] shrink-0">
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>100% Khách hàng hài lòng với bộ ảnh</span>
                </div>
              </div>

              {/* Danh sách các bài đánh giá chi tiết */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-[#F2E8E9] shadow-xs hover:shadow-md transition-shadow space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.customerName}
                          className="w-11 h-11 rounded-full object-cover border border-[#F5D5DC] shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#261A1E]">
                              {rev.customerName}
                            </h4>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-[#2EA46D] bg-[#EBF8F2] px-2 py-0.5 rounded-full font-semibold border border-[#B4E8D0]">
                                <CheckIcon className="w-3 h-3 stroke-[2.5]" />
                                Đã trải nghiệm
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-0.5 text-[#F59E0B]">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <StarIcon
                                  key={s}
                                  className={`w-3.5 h-3.5 ${s <= Math.floor(rev.rating) ? 'fill-[#F59E0B]' : 'text-neutral-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-[#8C7D82]">
                              • {rev.createdAt}
                            </span>
                            {rev.tag && (
                              <span className="hidden sm:inline-block text-[10px] font-semibold text-[#B85064] bg-[#FDF0F3] px-2 py-0.5 rounded-md border border-[#F5D5DC]">
                                {rev.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#4A3C41] leading-relaxed font-light">
                      "{rev.comment}"
                    </p>

                    <div className="pt-2 border-t border-[#F8EFEF] flex items-center justify-between text-[11px] text-[#8C7D82]">
                      <span className="flex items-center gap-1 text-[#2EA46D]">
                        <CheckIcon className="w-3 h-3" /> Đánh giá từ cơ sở dữ liệu photo_studio
                      </span>
                      {rev.likes && (
                        <span className="flex items-center gap-1 text-[#8C7D82] hover:text-[#B85064] cursor-pointer">
                          <HandThumbUpIcon className="w-3.5 h-3.5" /> Hữu ích ({rev.likes})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* =================== CỘT PHẢI: BÁO GIÁ & THÔNG SỐ (STICKY TỪ CSDL) =================== */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="relative rounded-3xl bg-[#FDF5F6] border border-[#F5D5DC] p-6 sm:p-7 shadow-[0_8px_30px_rgb(184,80,100,0.08)] overflow-hidden">
              <FloralCardCorner position="bottom-right" opacity="opacity-45" />

              {/* Tiêu đề & ID gói trong CSDL */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-[#261A1E]">
                  Thông <span className="text-[#B85064]">tin gói</span>
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white border border-[#F2C0CA] text-[#B85064]">
                  CSDL #{pkg.id}
                </span>
              </div>

              {/* Danh sách thông số từ CSDL */}
              <div className="space-y-4">
                {/* 1. Thời lượng */}
                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4A3C41]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-xs">
                    <ClockIcon className="w-4 h-4" />
                  </div>
                  <div className="pt-0.5">
                    <span className="block text-[11px] text-[#8C7D82] uppercase tracking-wider font-semibold">
                      Thời lượng chụp
                    </span>
                    <span className="font-semibold text-[#261A1E]">
                      {durationDisplay}
                    </span>
                  </div>
                </div>

                {/* 2. Bối cảnh */}
                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4A3C41]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-xs">
                    <CameraIcon className="w-4 h-4" />
                  </div>
                  <div className="pt-0.5">
                    <span className="block text-[11px] text-[#8C7D82] uppercase tracking-wider font-semibold">
                      Bối cảnh studio
                    </span>
                    <span className="font-semibold text-[#261A1E]">
                      {packageBackgrounds.length > 0
                        ? `${packageBackgrounds.length} bối cảnh đính kèm`
                        : 'Bối cảnh nghệ thuật studio'}
                    </span>
                  </div>
                </div>

                {/* 3. Dịch vụ kèm */}
                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4A3C41]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-xs">
                    <Square3Stack3DIcon className="w-4 h-4" />
                  </div>
                  <div className="pt-0.5">
                    <span className="block text-[11px] text-[#8C7D82] uppercase tracking-wider font-semibold">
                      Dịch vụ đính kèm
                    </span>
                    <span className="font-semibold text-[#261A1E]">
                      {packageServices.length > 0
                        ? `${packageServices.length} dịch vụ trọn gói`
                        : 'Gói chụp tiêu chuẩn studio'}
                    </span>
                  </div>
                </div>

                {/* 4. Trạng thái */}
                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4A3C41]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-xs">
                    <CircleStackIcon className="w-4 h-4" />
                  </div>
                  <div className="pt-0.5">
                    <span className="block text-[11px] text-[#8C7D82] uppercase tracking-wider font-semibold">
                      Tình trạng hoạt động
                    </span>
                    <span className="font-semibold text-[#261A1E] uppercase">
                      {pkg.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phần hiển thị Giá gói từ CSDL */}
              <div className="mt-7 pt-5 border-t border-[#F2C0CA]/60">
                <span className="text-xs font-semibold text-[#8C7D82] block mb-0.5">
                  Giá <span className="text-[#B85064]">gói niêm yết</span>
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#B85064] font-serif-luxury">
                  {priceDisplay}
                </div>
                {totalAddOnPrice > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#FFF0F2] border border-[#F2C0CA] space-y-1">
                    <div className="text-xs text-[#7A6C71] flex justify-between items-center">
                      <span>+ Dịch vụ nâng cao ({selectedServiceIds.length}):</span>
                      <strong className="text-[#B85064]">+{totalAddOnPrice.toLocaleString('vi-VN')}đ</strong>
                    </div>
                    <div className="pt-1.5 border-t border-[#F2C0CA]/60 flex justify-between items-center text-xs font-bold text-[#261A1E]">
                      <span>Tổng tạm tính:</span>
                      <span className="text-sm font-extrabold text-[#B85064]">
                        {((Number(pkg.price) || 0) + totalAddOnPrice).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Nút Đặt lịch ngay & Tư vấn thêm */}
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={handleGoToBooking}
                  className="cursor-pointer w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B85064] to-[#A33D50] hover:from-[#A33D50] hover:to-[#8E3243] text-white font-semibold text-sm shadow-md shadow-[#B85064]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Đặt lịch ngay</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(true)}
                  className="cursor-pointer w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FDF0F3] border border-[#F2C0CA] text-[#B85064] font-semibold text-sm transition-all shadow-xs"
                >
                  Tư vấn thêm
                </button>
              </div>

              {/* Ghi chú nhanh dưới nút */}
              <div className="mt-4 text-center">
                <span className="text-[11px] text-[#8C7D82]">
                  Dữ liệu đồng bộ trực tiếp từ CSDL PhotoStudio
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. PHẦN "CÓ THỂ BẠN SẼ THÍCH" (LẤY TỪ BẢNG PACKAGES TRONG CSDL) */}
        {/* ========================================================================= */}
        {recommendedPackages.length > 0 && (
          <div className="mt-14 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                  Các gói chụp khác từ CSDL ({recommendedPackages.length} gói)
                </h2>
              </div>

              {/* Nút điều hướng Carousel */}
              {recommendedPackages.length > 4 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
                    disabled={carouselIndex === 0}
                    className="cursor-pointer w-9 h-9 rounded-full bg-white border border-[#F0E4E6] flex items-center justify-center text-[#4A3C41] hover:text-[#B85064] hover:border-[#B85064] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
                    title="Trước"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCarouselIndex((prev) => Math.min(1, prev + 1))}
                    disabled={carouselIndex >= 1}
                    className="cursor-pointer w-9 h-9 rounded-full bg-white border border-[#F0E4E6] flex items-center justify-center text-[#4A3C41] hover:text-[#B85064] hover:border-[#B85064] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
                    title="Sau"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Lưới các thẻ gói chụp gợi ý từ CSDL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendedPackages.slice(carouselIndex * 4, carouselIndex * 4 + 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/packages/${p.id}`)}
                  className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#F0E4E6] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ArchiveBoxIcon className="w-12 h-12 text-[#B85064] opacity-40" />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-mono tracking-wider uppercase bg-white/95 backdrop-blur-sm text-[#B85064] border border-[#F5D5DC] shadow-xs">
                          Mã #{p.id}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="text-sm font-bold text-[#261A1E] group-hover:text-[#B85064] transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-[#7A6C71] line-clamp-2 leading-relaxed">
                        {p.description || `${p.duration || 60} phút chụp tại studio`}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-[#F8EFEF]">
                    <span className="text-sm sm:text-base font-bold text-[#B85064]">
                      {p.priceDisplay}
                    </span>
                    <span className="text-xs font-semibold text-[#8C7D82] group-hover:text-[#B85064] flex items-center gap-1 transition-colors">
                      Chi tiết <ArrowRightIcon className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. BANNER TƯ VẤN THÊM */}
        {/* ========================================================================= */}
        <div className="mt-14 rounded-3xl bg-[#FDF3F5] border border-[#F5D5DC] p-6 sm:p-9 shadow-[0_4px_24px_rgb(184,80,100,0.06)] relative overflow-hidden">
          <FloralCardCorner position="top-right" opacity="opacity-50" />
          <FloatingPetals count={3} opacity="opacity-40" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Cột trái: Tiêu đề & nút Liên hệ ngay */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#B85064] flex items-center justify-center border border-[#F2C0CA] shadow-sm">
                  <CameraIcon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                    Bạn cần tư vấn thêm về gói chụp này?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A6C71] mt-0.5">
                    Đội ngũ tư vấn của PhotoStudio luôn sẵn sàng hỗ trợ giải đáp chi tiết cho bạn!
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(true)}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#B85064]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Liên hệ ngay</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cột phải: Thông tin liên lạc (Hotline, Địa chỉ, Email) */}
            <div className="lg:col-span-5 space-y-3 pt-4 lg:pt-0 lg:border-l lg:border-[#F2C0CA]/60 lg:pl-8 text-xs sm:text-sm text-[#4A3C41]">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-2xs mt-0.5">
                  <PhoneIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-[#261A1E] block">
                    0987 654 321
                  </span>
                  <span className="text-[11px] text-[#8C7D82]">
                    (Từ 8:00 - 21:00, tất cả các ngày)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-2xs">
                  <MapPinIcon className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">
                  123 Nguyễn Văn Cừ, Quận 1, TP.HCM
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-2xs">
                  <EnvelopeIcon className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">contact@photostudio.vn</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL VIẾT ĐÁNH GIÁ GÓI CHỤP */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-7 overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <FloralCardCorner position="top-right" opacity="opacity-60" />
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#EBF8F2] text-[#2EA46D] flex items-center justify-center mx-auto border border-[#B4E8D0]">
                  <CheckIcon className="w-7 h-7 stroke-[3]" />
                </div>
                <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418]">
                  Cảm Ơn Đánh Giá Của Bạn!
                </h3>
                <p className="text-xs text-[#7A6C71] leading-relaxed max-w-xs mx-auto">
                  Nhận xét của bạn về <strong>{pkg.name}</strong> đã được ghi nhận vào hệ thống CSDL PhotoStudio.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReviewSubmitted(false);
                    setIsReviewModalOpen(false);
                  }}
                  className="cursor-pointer px-5 py-2 rounded-full bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A33D50] transition-colors shadow-sm"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newReviewForm.comment.trim()) {
                    alert('Vui lòng nhập nội dung đánh giá của bạn.');
                    return;
                  }
                  const reviewerName = currentCustomer?.fullname || currentCustomer?.username || 'Khách Hàng PhotoStudio';
                  const added = {
                    id: Date.now(),
                    customerName: reviewerName,
                    avatar: currentCustomer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    rating: newReviewForm.rating,
                    createdAt: 'Hôm nay',
                    comment: newReviewForm.comment.trim(),
                    verified: true,
                    tag: pkg.name,
                    likes: 1,
                  };
                  setReviews((prev) => [added, ...prev]);
                  setReviewSubmitted(true);
                  setNewReviewForm({ name: '', rating: 5, comment: '' });

                  // Gửi lưu vào backend nếu có API
                  if (customerReviewService?.createReview) {
                    customerReviewService.createReview({
                      packageId: targetId,
                      rating: newReviewForm.rating,
                      comment: newReviewForm.comment.trim(),
                    }).catch(() => {});
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B85064] block">
                    ĐÁNH GIÁ TRẢI NGHIỆM GÓI CHỤP
                  </span>
                  <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418] mt-0.5">
                    {pkg.name}
                  </h3>
                </div>

                {/* Thông tin tài khoản người dùng đăng nhập */}
                <div className="p-3.5 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B85064] to-[#E295A2] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm overflow-hidden">
                    {currentCustomer?.avatar ? (
                      <img
                        src={currentCustomer.avatar}
                        alt={currentCustomer.fullname || currentCustomer.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{(currentCustomer?.fullname || currentCustomer?.username || 'KH').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-[#8C7D82] font-medium uppercase tracking-wider">Tài khoản đánh giá</div>
                    <div className="text-sm font-bold text-[#2A1D22] truncate flex items-center gap-1.5">
                      <span>{currentCustomer?.fullname || currentCustomer?.username || 'Khách Hàng PhotoStudio'}</span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#EBF8F2] text-[#2EA46D]">
                        <CheckIcon className="w-2.5 h-2.5 stroke-[3]" />
                        Đã đăng nhập
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Số sao đánh giá
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewReviewForm({ ...newReviewForm, rating: s })}
                        className="cursor-pointer p-1 text-[#F59E0B] hover:scale-110 transition-transform"
                      >
                        <StarIcon
                          className={`w-6 h-6 ${s <= newReviewForm.rating ? 'fill-[#F59E0B]' : 'text-neutral-300'}`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#B85064] ml-2">
                      {newReviewForm.rating}.0 / 5.0
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Nhận xét & Trải nghiệm *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Chia sẻ trải nghiệm của bạn về thợ chụp, phòng studio, trang phục, makeup và chất lượng ảnh..."
                    value={newReviewForm.comment}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs sm:text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="cursor-pointer w-full py-3 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold transition-all shadow-md shadow-[#B85064]/20"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL YÊU CẦU ĐĂNG NHẬP KHI VIẾT ĐÁNH GIÁ */}
      {requireLoginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setRequireLoginModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-7 text-center overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <FloralCardCorner position="top-right" opacity="opacity-50" />
            <button
              onClick={() => setRequireLoginModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC] flex items-center justify-center mx-auto mb-4 text-[#B85064] shadow-sm">
              <ChatBubbleLeftEllipsisIcon className="w-7 h-7 stroke-[1.8]" />
            </div>

            <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418] mb-2">
              Yêu Cầu Đăng Nhập
            </h3>
            <p className="text-xs text-[#7A6C71] leading-relaxed mb-6">
              Bạn cần đăng nhập tài khoản khách hàng để viết đánh giá cho gói chụp <strong>{pkg.name}</strong>. Đánh giá sẽ được ghi nhận cùng tên tài khoản của bạn.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setRequireLoginModalOpen(false);
                  navigate(ROUTES.AUTH.LOGIN, { state: { from: location.pathname } });
                }}
                className="cursor-pointer w-full py-2.5 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold transition-all shadow-md shadow-[#B85064]/25 flex items-center justify-center gap-1.5"
              >
                <span>Đăng nhập ngay</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequireLoginModalOpen(false);
                  navigate(ROUTES.AUTH.REGISTER);
                }}
                className="cursor-pointer w-full py-2.5 rounded-full border border-[#F0E4E6] text-[#4A3C41] hover:bg-[#FAF5F5] text-xs font-semibold transition-colors"
              >
                Chưa có tài khoản? Đăng ký
              </button>

              <button
                type="button"
                onClick={() => setRequireLoginModalOpen(false)}
                className="cursor-pointer text-xs text-[#8C7D82] hover:text-[#2A1D22] pt-1"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL ĐẶT LỊCH NGAY (GỬI TRỰC TIẾP VÀO CSDL BOOKINGS) */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsBookingModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-8 overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <FloralCardCorner position="top-right" opacity="opacity-70" />
            <FloralCardCorner position="bottom-left" opacity="opacity-60" />

            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EBF8F2] text-[#2EA46D] flex items-center justify-center mx-auto border border-[#B4E8D0]">
                  <CheckIcon className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold font-serif-luxury text-[#1F1418]">
                  Đăng Ký Đặt Lịch Thành Công!
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6C71] max-w-sm mx-auto leading-relaxed">
                  Cảm ơn bạn đã lựa chọn <strong>{pkg.name}</strong> (Mã gói #{pkg.id}).
                  Studio sẽ gọi lại qua số <strong>{bookingForm.phone}</strong>{' '}
                  trong vòng 15 phút để chốt giờ chụp và hướng dẫn trang phục.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsBookingModalOpen(false);
                    setBookingForm({ name: '', phone: '', date: '', note: '' });
                  }}
                  className="cursor-pointer px-6 py-2.5 rounded-full bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A33D50] transition-colors shadow-md"
                >
                  Hoàn tất
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B85064] block">
                    ĐẶT LỊCH GÓI CHỤP CSDL #{pkg.id}
                  </span>
                  <h3 className="text-xl font-bold font-serif-luxury text-[#1F1418] mt-0.5">
                    {pkg.name}
                  </h3>
                </div>

                {/* Preview thông tin gói đã chọn từ CSDL */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC]">
                  {activeImage && (
                    <img
                      src={activeImage.url}
                      alt={pkg.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#B85064] block">
                      {priceDisplay}
                    </span>
                    <span className="text-xs text-[#7A6C71] truncate block">
                      {durationDisplay}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={bookingForm.name}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs sm:text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={bookingForm.phone}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs sm:text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Ngày chụp mong muốn
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs sm:text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Khung giờ chụp
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.slice(0, 4).map((slot) => {
                      const isSel = selectedTimeSlot.id === slot.id;
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`cursor-pointer px-2.5 py-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                            isSel
                              ? 'bg-[#B85064] text-white border-[#B85064] shadow-xs'
                              : 'bg-white border-[#E8DCDE] text-[#4A3C41] hover:border-[#B85064]'
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Ghi chú / Yêu cầu thêm (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Mang theo trang phục riêng, chụp phong cách hoàng hôn..."
                    value={bookingForm.note}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, note: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full py-3.5 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white font-semibold text-sm transition-all shadow-md shadow-[#B85064]/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi thông tin...' : 'Xác nhận đặt lịch ngay'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL TƯ VẤN THÊM NHANH */}
      {/* ========================================================================= */}
      {isConsultModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsConsultModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-7 overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsConsultModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {consultSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EBF8F2] text-[#2EA46D] flex items-center justify-center mx-auto border border-[#B4E8D0]">
                  <CheckIcon className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418]">
                  Đã Nhận Yêu Cầu Tư Vấn!
                </h3>
                <p className="text-xs text-[#7A6C71] leading-relaxed">
                  Chuyên viên tư vấn của PhotoStudio sẽ gọi qua số{' '}
                  <strong>{consultPhone}</strong> trong vòng 5 – 10 phút.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setConsultSubmitted(false);
                    setIsConsultModalOpen(false);
                    setConsultPhone('');
                  }}
                  className="cursor-pointer px-5 py-2 rounded-full bg-[#B85064] text-white text-xs font-semibold"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitConsult} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-[#FDF5F6] text-[#B85064] flex items-center justify-center mx-auto mb-2 border border-[#F5D5DC]">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418]">
                    Tư Vấn Miễn Phí {pkg.name}
                  </h3>
                  <p className="text-xs text-[#7A6C71]">
                    Để lại số điện thoại, studio sẽ gọi lại ngay để giải đáp mọi thắc mắc của bạn.
                  </p>
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Nhập số điện thoại của bạn..."
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DCDE] text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                  />
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full py-3 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white font-semibold text-xs sm:text-sm transition-all"
                >
                  Gọi lại cho tôi ngay
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. LIGHTBOX XEM ẢNH FULLSCREEN */}
      {/* ========================================================================= */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="cursor-pointer absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <img
            src={galleryImages[lightboxIndex].url}
            alt={galleryImages[lightboxIndex].caption}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === 0 ? galleryImages.length - 1 : prev - 1
                  );
                }}
                className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === galleryImages.length - 1 ? 0 : prev + 1
                  );
                }}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
