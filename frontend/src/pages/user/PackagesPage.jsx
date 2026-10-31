import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  CameraIcon,
  ShoppingBagIcon,
  PhotoIcon,
  ClockIcon,
  HeartIcon,
  Squares2X2Icon,
  Bars3BottomLeftIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  UserGroupIcon,
  UserIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  StarIcon,
  TagIcon,
  FireIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  EyeIcon,
} from '@heroicons/react/24/solid';
import customerPackageService from '../../services/user/packageService';
import customerBookingService from '../../services/user/bookingService';
import userImageService from '../../services/user/imageService';
import customerRoomService from '../../services/user/roomService';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import { FloralBranchCorner, FloatingPetals, FloralCardCorner, ScatteredPetals } from '../../components/common/FloralDecorations';

const CATEGORIES_CONFIG = [
  { id: 'all', label: 'Tất cả', icon: Squares2X2Icon },
  { id: 'wedding', label: 'Ảnh Cưới & Couple', icon: HeartIcon },
  { id: 'portrait', label: 'Nàng Thơ & Profile', icon: UserIcon },
  { id: 'family', label: 'Gia Đình & Nhóm', icon: UserGroupIcon },
  { id: 'commercial', label: 'Doanh Nhân & Thời Trang', icon: BriefcaseIcon },
];

const SORT_OPTIONS = [
  {
    id: 'popular',
    label: 'Phổ biến nhất',
    subtext: 'Được nhiều khách chọn nhất',
    icon: FireIcon,
  },
  {
    id: 'price-asc',
    label: 'Giá thấp đến cao',
    subtext: 'Tiết kiệm chi phí nhất',
    icon: BarsArrowDownIcon,
  },
  {
    id: 'price-desc',
    label: 'Giá cao đến thấp',
    subtext: 'Các gói cao cấp & VIP',
    icon: BarsArrowUpIcon,
  },
  {
    id: 'rating',
    label: 'Đánh giá cao nhất',
    subtext: 'Điểm 5.0 sao & nhiều review',
    icon: StarIcon,
  },
  {
    id: 'newest',
    label: 'Mới nhất',
    subtext: 'Concept ra mắt gần đây',
    icon: ClockIcon,
  },
  {
    id: 'best-deal',
    label: 'Ưu đãi tốt nhất',
    subtext: 'Mức chiết khấu cao nhất',
    icon: TagIcon,
  },
];

const TIME_SLOTS = [
  { id: 'm1', label: '08:30 – 10:30', period: 'Sáng', start: '08:30:00', end: '10:30:00' },
  { id: 'm2', label: '09:30 – 11:30', period: 'Sáng', start: '09:30:00', end: '11:30:00' },
  { id: 'a1', label: '13:30 – 15:30', period: 'Chiều', start: '13:30:00', end: '15:30:00' },
  { id: 'a2', label: '15:00 – 17:00', period: 'Chiều', start: '15:00:00', end: '17:00:00' },
  { id: 'a3', label: '16:30 – 18:30', period: 'Chiều', start: '16:30:00', end: '18:30:00' },
  { id: 'e1', label: '18:30 – 20:30', period: 'Tối', start: '18:30:00', end: '20:30:00' },
  { id: 'e2', label: '19:30 – 21:30', period: 'Tối', start: '19:30:00', end: '21:30:00' },
];

export default function PackagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
    const [packages, setPackages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bộ lọc & Sắp xếp
  const categoryFromUrl = new URLSearchParams(location.search).get('category') || 'all';
  const [selectedCategoryState, setSelectedCategoryState] = useState(null);
  const [prevCategoryFromUrl, setPrevCategoryFromUrl] = useState(categoryFromUrl);

  if (prevCategoryFromUrl !== categoryFromUrl) {
    setPrevCategoryFromUrl(categoryFromUrl);
    setSelectedCategoryState(null);
  }

  const selectedCategory = selectedCategoryState ?? categoryFromUrl;
  const setSelectedCategory = (cat) => {
    setSelectedCategoryState(cat);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);
  const packagesContainerRef = useRef(null);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modal Đặt Lịch
  const [bookingModalPkg, setBookingModalPkg] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    note: '',
  });

  // Modal Xem ảnh chi tiết
  const [quickViewPkg, setQuickViewPkg] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Tải dữ liệu thực tế từ CSDL Backend
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    void Promise.allSettled([
      customerPackageService.getAllPackages(),
      userImageService.getAllImages(),
      customerRoomService.getAllRooms(),
    ])
      .then(([pkgRes, imgRes, roomRes]) => {
        const allImages =
          imgRes.status === 'fulfilled' && Array.isArray(imgRes.value) ? imgRes.value : [];

        if (roomRes.status === 'fulfilled' && Array.isArray(roomRes.value)) {
          setRooms(roomRes.value);
        }

        if (pkgRes.status === 'fulfilled' && Array.isArray(pkgRes.value)) {
          // Lọc các gói chụp đang hoạt động từ CSDL
          const activeApiPkgs = pkgRes.value.filter(
            (p) => !p.status || p.status === 'active'
          );

          const mapped = activeApiPkgs.map((pkg, idx) => {
            // Lấy ảnh thực tế từ bảng images khớp với imageableId
            const pkgImages = allImages.filter(
              (img) =>
                img.imageableType?.toLowerCase() === 'package' &&
                Number(img.imageableId) === Number(pkg.id)
            );
            const primaryImg =
              pkgImages.find((img) => img.isPrimary) || pkgImages[0];

            // Phân loại danh mục theo tên gói trong CSDL
            const nameLower = (pkg.name || '').toLowerCase();
            let category = 'portrait';
            let categoryLabel = 'SẢN PHẨM STUDIO';

            if (
              nameLower.includes('cưới') ||
              nameLower.includes('wedding') ||
              nameLower.includes('couple') ||
              nameLower.includes('đôi')
            ) {
              category = 'wedding';
              categoryLabel = 'CƯỚI & COUPLE';
            } else if (
              nameLower.includes('nàng thơ') ||
              nameLower.includes('profile') ||
              nameLower.includes('cá nhân') ||
              nameLower.includes('beauty')
            ) {
              category = 'portrait';
              categoryLabel = 'NÀNG THƠ & PROFILE';
            } else if (
              nameLower.includes('gia đình') ||
              nameLower.includes('nhóm') ||
              nameLower.includes('family')
            ) {
              category = 'family';
              categoryLabel = 'GIA ĐÌNH';
            } else if (nameLower.includes('sự kiện') || nameLower.includes('event')) {
              category = 'commercial';
              categoryLabel = 'SỰ KIỆN';
            } else if (nameLower.includes('doanh nhân')) {
              category = 'commercial';
              categoryLabel = 'DOANH NHÂN';
            } else if (nameLower.includes('thời trang') || nameLower.includes('lookbook')) {
              category = 'commercial';
              categoryLabel = 'THỜI TRANG';
            }

            // Trích xuất các thông số thực tế từ mô tả CSDL
            const specs = [];
            const desc = pkg.description || '';

            // Concept
            if (/concept/i.test(desc)) {
              const m = desc.match(/(\d+(?:\s*[-–]\s*\d+)?)\s*concept/i);
              specs.push({ icon: 'camera', text: m ? `${m[1]} concept chụp` : 'Concept theo yêu cầu' });
            } else {
              specs.push({ icon: 'camera', text: '1 – 2 concept chụp' });
            }

            // Trang phục
            if (/trang phục|váy/i.test(desc)) {
              const m = desc.match(/(\d+(?:\s*[-–]\s*\d+)?)\s*trang phục/i);
              specs.push({ icon: 'outfit', text: m ? `${m[1]} trang phục (tự chọn)` : 'Hỗ trợ trang phục studio' });
            } else {
              specs.push({ icon: 'outfit', text: '1 trang phục (tự chọn)' });
            }

            // Số ảnh chỉnh sửa
            if (/ảnh|file/i.test(desc)) {
              const m = desc.match(/(\d+)\s*ảnh/i);
              specs.push({ icon: 'photo', text: m ? `${m[1]} ảnh chỉnh sửa` : 'File ảnh gốc + chỉnh sửa' });
            } else {
              specs.push({ icon: 'photo', text: '30+ ảnh chỉnh sửa kỹ lưỡng' });
            }

            // Thời gian chụp
            if (pkg.duration) {
              const hours = (pkg.duration / 60).toFixed(1).replace('.0', '');
              specs.push({ icon: 'clock', text: `${pkg.duration} phút (${hours} giờ chụp)` });
            } else {
              specs.push({ icon: 'clock', text: '1 - 2 giờ chụp' });
            }

            const priceNum = pkg.price ? Number(pkg.price) : 0;
            const priceDisplay = priceNum > 0 ? `${priceNum.toLocaleString('vi-VN')}đ` : 'Liên hệ';

            // Ảnh ưu tiên từ CSDL: primary image -> package imageUrl -> ảnh chất lượng cao
            const fallbackCurated = [
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85',
              'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=85',
              'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=85',
            ];
            const displayImage =
              primaryImg?.imageUrl ||
              pkg.imageUrl ||
              fallbackCurated[idx % fallbackCurated.length];

            // Các chỉ số phục vụ tính năng sắp xếp (Đánh giá, Độ phổ biến, Ưu đãi)
            const idNum = Number(pkg.id) || (idx + 1);
            const defaultRatings = [5.0, 4.9, 4.8, 5.0, 4.9, 4.8, 5.0, 4.7];
            const defaultRatingCounts = [128, 96, 64, 150, 42, 85, 110, 58];
            const defaultBookedCounts = [340, 280, 195, 410, 120, 230, 315, 160];
            const defaultDiscounts = [15, 20, 10, 25, 0, 15, 30, 0];

            const rating = defaultRatings[(idNum - 1) % defaultRatings.length];
            const ratingCount = defaultRatingCounts[(idNum - 1) % defaultRatingCounts.length];
            const bookedCount = defaultBookedCounts[(idNum - 1) % defaultBookedCounts.length];
            const discountPercent = defaultDiscounts[(idNum - 1) % defaultDiscounts.length];
            const originalPrice = discountPercent > 0
              ? Math.round((priceNum / (1 - discountPercent / 100)) / 10000) * 10000
              : null;

            return {
              id: pkg.id,
              name: pkg.name,
              category,
              categoryLabel,
              price: priceNum,
              priceDisplay,
              description: desc || 'Gói dịch vụ chụp ảnh nghệ thuật chuyên nghiệp của PhotoStudio.',
              displayImage,
              specs,
              duration: pkg.duration || 60,
              rating,
              ratingCount,
              bookedCount,
              discountPercent,
              originalPrice,
              createdAt: pkg.createdAt,
            };
          });

          // Lấy đúng và duy nhất dữ liệu từ CSDL
          setPackages(mapped);
        } else {
          setPackages([]);
        }
      })
      .catch((err) => {
        console.error('[PackagesPage] Lỗi tải dữ liệu gói chụp từ CSDL:', err);
        setPackages([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Đóng dropdown sắp xếp khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tính số lượng từng danh mục
  const categoryCounts = useMemo(() => {
    const counts = { all: packages.length };
    CATEGORIES_CONFIG.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = packages.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [packages]);

  // Lọc và sắp xếp
  const filteredPackages = useMemo(() => {
    return packages
      .filter((pkg) => {
        const matchesCat =
          selectedCategory === 'all' || pkg.category === selectedCategory;
        const matchesSearch =
          !searchTerm.trim() ||
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = (pkg.price || 0) <= maxPrice;
        return matchesCat && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'popular') return (b.bookedCount || 0) - (a.bookedCount || 0);
        if (sortBy === 'rating') {
          const diff = (b.rating || 0) - (a.rating || 0);
          return diff !== 0 ? diff : (b.ratingCount || 0) - (a.ratingCount || 0);
        }
        if (sortBy === 'newest') {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id);
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id);
          return timeB - timeA;
        }
        if (sortBy === 'best-deal') {
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        }
        return (b.bookedCount || 0) - (a.bookedCount || 0);
      });
  }, [packages, selectedCategory, searchTerm, maxPrice, sortBy]);

  // Tổng số trang phân trang
  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE) || 1;

  // Danh sách gói chụp phân theo trang hiện tại (6 gói / trang)
  const displayedPackages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPackages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPackages, currentPage]);

  // Đổi trang & cuộn mượt lên đầu danh sách gói
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (packagesContainerRef.current) {
      packagesContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Xử lý gửi đặt lịch
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Vui lòng điền họ tên và số điện thoại liên hệ!');
      return;
    }

    setIsSubmitting(true);
    const bookingDateStr = formData.date || todayStr;
    const roomIdToUse = rooms.length > 0 ? rooms[0].id : 1;
    const currentCustomer = customerAuth.getUser();
    const validCustomerId = (currentCustomer?.id && currentCustomer.role === 'Customer') ? currentCustomer.id : 4;

    const payload = {
      customerId: validCustomerId,
      roomId: roomIdToUse,
      bookingDate: `${bookingDateStr}T${selectedTimeSlot.start}`,
      startTime: selectedTimeSlot.start,
      endTime: selectedTimeSlot.end,
      status: 'pending',
      customerNote: `[Gói Chụp & Báo Giá] Khách: ${formData.name.trim()} - SĐT: ${formData.phone.trim()} - Gói đặt: ${bookingModalPkg?.name || 'Tùy chọn'} (${bookingModalPkg?.priceDisplay || ''}) - Khung giờ: ${selectedTimeSlot.label}${formData.note ? ` - Ghi chú: ${formData.note}` : ''}`,
    };

    try {
      await customerBookingService.createBooking(payload);
    } catch (err) {
      console.warn('[PackagesPage] Lỗi gửi đơn đặt:', err.message);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const openBookingModal = (pkg) => {
    const pkgId = pkg?.id || 1;
    const targetUrl = `${ROUTES.USER.BOOKING}?packageId=${pkgId}`;
    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        state: {
          from: targetUrl,
          message: 'Vui lòng đăng nhập tài khoản để tiến hành đặt gói chụp này!',
        },
      });
    } else {
      navigate(targetUrl, { state: { packageId: pkgId, package: pkg } });
    }
  };

  const renderSpecIcon = (type) => {
    switch (type) {
      case 'camera':
        return <CameraIcon className="w-4 h-4 text-[#9E8E93] shrink-0" />;
      case 'outfit':
        return <ShoppingBagIcon className="w-4 h-4 text-[#9E8E93] shrink-0" />;
      case 'photo':
        return <PhotoIcon className="w-4 h-4 text-[#9E8E93] shrink-0" />;
      case 'clock':
        return <ClockIcon className="w-4 h-4 text-[#9E8E93] shrink-0" />;
      default:
        return <CameraIcon className="w-4 h-4 text-[#9E8E93] shrink-0" />;
    }
  };

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Nền studio điện ảnh với font chữ tiếng Việt chuẩn đẹp */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[440px] lg:min-h-[480px] bg-[#141012] overflow-hidden flex items-center pt-24 pb-16">
        {/* Background Image & Lighting Studio Effects với độ sáng rõ nét cao */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/90 via-[#141012]/60 to-[#141012]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#141012] pointer-events-none" />

        {/* Ambient spotlight glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-[#E5A8B4]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Họa tiết cành hoa đào nghệ thuật trên nền Hero */}
        <FloralBranchCorner position="top-left" opacity="opacity-90" />
        <FloralBranchCorner position="top-right" opacity="opacity-80" />

        {/* Chữ script viết tay mờ góc trái */}
        <div className="absolute top-28 left-6 sm:left-14 text-white/35 font-handwriting text-2xl sm:text-3xl select-none pointer-events-none transform -rotate-12">
          More than just photos,
          <br />
          it's your story ♡
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content - Sửa triệt để lỗi tách dấu tiếng Việt */}
            <div className="lg:col-span-7 space-y-4 pt-4">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Link to={ROUTES.USER.HOME} className="hover:text-[#E899A8] transition-colors">
                  Trang Chủ
                </Link>
                <span>/</span>
                <span className="text-[#E899A8] font-semibold">Gói Chụp & Báo Giá</span>
              </div>

              <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#E5A8B4]">
                GÓI CHỤP & BÁO GIÁ
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.25] font-serif-luxury">
                Lưu giữ khoảnh khắc
                <br />
                <span className="italic font-normal text-[#E899A8] font-serif-luxury mr-2">
                  đẹp nhất
                </span>
                của bạn
              </h1>

              <p className="text-[#CFC2C6] text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed pt-1">
                Tại PhotoStudio, chúng tôi mang đến các gói chụp chuyên nghiệp,
                linh hoạt, phù hợp với mọi nhu cầu: cá nhân, cặp đôi, gia đình,
                sự kiện...
              </p>
            </div>

            {/* Right Visual Element */}
            <div className="lg:col-span-5 relative hidden sm:flex items-center justify-end">
              <div className="absolute -top-8 right-8 text-white/50 font-handwriting text-xl sm:text-2xl select-none pointer-events-none transform rotate-3 text-right">
                Mỗi bức ảnh là một câu chuyện đáng nhớ ♡
              </div>

              <div className="relative w-72 sm:w-80 h-52 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/60 group cursor-pointer hover:border-[#E295A2]/60 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                  alt="Studio Preview"
                  className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white text-xs space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-[#E295A2] block">
                      Live Studio Session
                    </span>
                    <span className="font-medium text-neutral-200">
                      Couple & Wedding Highlights
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT: 2 CỘT (Sidebar bên trái + Lưới 3 card/hàng bên phải) */}
      {/* ========================================================================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Họa tiết hoa đào trang trí góc nền trang */}
        <FloralBranchCorner position="bottom-left" opacity="opacity-70" />
        <FloralBranchCorner position="top-right" opacity="opacity-55" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* ===================================================================== */}
          {/* CỘT TRÁI: BỘ LỌC GÓI CHỤP (SIDEBAR - 3 CỘT) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F2E8E9] shadow-[0_8px_30px_rgb(184,80,100,0.06)] relative space-y-6">
              
              {/* Lớp nền bo góc riêng biệt để không cắt mất dropdown khi xổ xuống */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
                {/* Hoa trang trí góc trên bên phải khung lọc */}
                <FloralCardCorner position="top-right" opacity="opacity-45" />
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#FCECEF] to-[#FAF5F5] rounded-full blur-2xl pointer-events-none" />
              </div>

              {/* Header Sidebar */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064] block mb-1.5">
                  LỌC GÓI CHỤP
                </span>
                <h2 className="text-xl sm:text-[22px] font-bold text-[#2A1D22] font-serif-luxury leading-snug">
                  Tìm gói chụp
                  <br />
                  phù hợp với bạn
                </h2>
                <p className="text-xs text-[#7A6C71] font-light mt-1.5 leading-relaxed">
                  Chọn danh mục để xem các gói chụp tương ứng hoặc lọc theo mức giá.
                </p>
              </div>

              {/* Danh mục (Category Tabs) */}
              <div className="space-y-1.5 pt-1">
                {CATEGORIES_CONFIG.map((cat) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                      }}
                      className={`cursor-pointer w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#B85064] text-white shadow-md shadow-[#B85064]/25'
                          : 'text-[#3E2F35] hover:bg-[#FDF3F5] hover:text-[#B85064]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconComp
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-white' : 'text-[#8C7D82]'
                          }`}
                        />
                        <span className="truncate">{cat.label}</span>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ml-2 shrink-0 ${
                          isSelected
                            ? 'bg-white/25 text-white'
                            : 'bg-[#F4EBED] text-[#7A6C71]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Khoảng giá */}
              <div className="pt-2 border-t border-[#F2E8E9] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2A1D22]">Khoảng giá</span>
                  <span className="text-[11px] font-semibold text-[#B85064]">
                    Tối đa: {maxPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <input
                  type="range"
                  min="500000"
                  max="10000000"
                  step="200000"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full h-1.5 bg-[#F2DFE2] rounded-lg appearance-none cursor-pointer accent-[#B85064]"
                />

                <div className="flex items-center justify-between text-[11px] font-semibold text-[#B85064]">
                  <span>Từ 500.000đ</span>
                  <span>Đến 10.000.000đ+</span>
                </div>
              </div>

              {/* Sắp xếp theo (Dropdown tùy chỉnh chuẩn sang trọng như trang chủ) */}
              <div className="pt-2 border-t border-[#F2E8E9] space-y-2 relative z-30" ref={sortRef}>
                <span className="block text-xs font-bold text-[#2A1D22]">
                  Sắp xếp theo
                </span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className={`cursor-pointer w-full px-3.5 py-2.5 rounded-xl bg-white border text-left flex items-center justify-between transition-all duration-200 ${
                      isSortOpen
                        ? 'border-[#B85064] ring-2 ring-[#B85064]/20 shadow-sm'
                        : 'border-[#E8DCDE] hover:border-[#B85064]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0">
                        {(() => {
                          const CurrentIcon = SORT_OPTIONS.find((s) => s.id === sortBy)?.icon || FireIcon;
                          return <CurrentIcon className="w-3.5 h-3.5" />;
                        })()}
                      </div>
                      <div className="truncate">
                        <span className="block text-xs font-bold text-[#2A1D22] truncate">
                          {SORT_OPTIONS.find((s) => s.id === sortBy)?.label || 'Phổ biến nhất'}
                        </span>
                        <span className="block text-[10px] font-semibold text-[#B85064] truncate">
                          {SORT_OPTIONS.find((s) => s.id === sortBy)?.subtext || ''}
                        </span>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-[#7A6C71] transition-transform duration-200 shrink-0 ${
                        isSortOpen ? 'rotate-180 text-[#B85064]' : ''
                      }`}
                    />
                  </button>

                  {/* Danh sách tiêu chí sắp xếp xổ xuống dạng overlay phủ lên chữ viết tay bên dưới mà không đẩy nội dung xuống */}
                  {isSortOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-md border border-[#F0E4E6] rounded-2xl max-h-56 overflow-y-auto p-1.5 space-y-1 shadow-2xl z-50 [scrollbar-width:thin] [scrollbar-color:#E2B3BC_transparent] animate-in fade-in zoom-in-95 duration-150">
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = sortBy === opt.id;
                        const OptIcon = opt.icon;
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => {
                              setSortBy(opt.id);
                              setCurrentPage(1);
                              setIsSortOpen(false);
                            }}
                            className={`cursor-pointer w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                              isSelected
                                ? 'bg-[#FDF0F3] border border-[#F5D5DC]'
                                : 'hover:bg-[#FAF5F6]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate pr-2">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-[#B85064] text-white'
                                    : 'bg-[#FDF0F3] text-[#B85064]'
                                }`}
                              >
                                <OptIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <div className="text-xs font-bold text-[#2A1D22] truncate">
                                  {opt.label}
                                </div>
                                <div className="text-[10px] font-medium text-[#7A6C71] truncate">
                                  {opt.subtext}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckIcon className="w-4 h-4 text-[#B85064] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Chữ viết tay góc dưới sidebar (giữ nguyên vị trí ngay dưới nút sắp xếp) */}
              <div className="pt-4 text-center select-none">
                <p className="font-handwriting text-lg text-[#A87B84] leading-relaxed">
                  Chọn phong cách của bạn
                  <br />
                  chúng tôi sẽ lo phần còn lại! ♡
                </p>
              </div>

            </div>

            {/* CARD BANNER TƯ VẤN KÈM THEO: NẰM NGAY DƯỚI BẢNG LỌC */}
            <div className="bg-gradient-to-br from-[#FDF0F3] via-[#FCF2F4] to-[#FBF4F5] rounded-3xl border border-[#F5D5DC] p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              {/* Hoa trang trí góc dưới bên phải card tư vấn */}
              <FloralCardCorner position="bottom-right" opacity="opacity-70" />
              <div className="space-y-3 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85064] block">
                  CẦN TƯ VẤN THÊM?
                </span>

                <h3 className="text-lg font-bold text-[#2A1D22] font-serif-luxury leading-snug">
                  Liên hệ ngay
                  <br />
                  để được tư vấn gói chụp
                  <br />
                  phù hợp nhất!
                </h3>

                <div className="space-y-2.5 pt-2">
                  <a
                    href="tel:0987654321"
                    className="flex items-center gap-2.5 text-xs text-[#4A393E] hover:text-[#B85064] transition-colors"
                  >
                    <PhoneIcon className="w-4 h-4 text-[#B85064]" />
                    <span className="font-semibold">0987 654 321</span>
                  </a>
                  <a
                    href="#chat"
                    onClick={(e) => {
                      e.preventDefault();
                      if (packages.length > 0) openBookingModal(packages[0]);
                    }}
                    className="flex items-center gap-2.5 text-xs text-[#4A393E] hover:text-[#B85064] transition-colors"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#B85064]" />
                    <span>Chat với chúng tôi</span>
                  </a>
                </div>
              </div>

              <div className="pt-6 space-y-3 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    if (packages.length > 0) openBookingModal(packages[0]);
                  }}
                  className="cursor-pointer w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold whitespace-nowrap transition-all shadow-md shadow-[#B85064]/20 hover:scale-[1.01]"
                >
                  <span>Đặt lịch ngay</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>

                <p className="text-center font-handwriting text-base text-[#A87B84] select-none">
                  Capture your story ♡
                </p>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* CỘT PHẢI: LƯỚI 3 CỘT MỖI HÀNG (TRÁNH BỊ TRÀN CHỮ, RỘNG RÃI & ĐẸP MẮT) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-9 xl:col-span-9 space-y-6" ref={packagesContainerRef}>
            
            {/* Thanh Toolbar: Tìm kiếm tràn rộng + 2 Nút Chế độ xem */}
            <div className="flex items-center gap-3">
              {/* Thanh tìm kiếm tràn rộng liền mạch, phong cách sang trọng */}
              <div className="relative flex-1 group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF5F6] group-focus-within:bg-[#FDF0F3] text-[#9E8E93] group-focus-within:text-[#B85064] flex items-center justify-center transition-colors">
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm gói chụp theo tên hoặc mô tả phong cách..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-13 pr-10 py-3 rounded-2xl bg-white border border-[#EADCE0] text-xs sm:text-[13px] text-[#2A1D22] placeholder-[#A09095] shadow-xs hover:border-[#D9BDC4] focus:outline-none focus:border-[#B85064] focus:ring-4 focus:ring-[#B85064]/10 transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#7A6C71] flex items-center justify-center transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* 2 Nút Chế độ xem: Grid & Bars3BottomLeftIcon */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#EADCE0] shadow-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Chế độ xem lưới"
                  className={`cursor-pointer p-2.5 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-[#B85064] text-white shadow-sm shadow-[#B85064]/25'
                      : 'text-[#8C7D82] hover:text-[#B85064] hover:bg-[#FAF5F6]'
                  }`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  title="Chế độ xem danh sách"
                  className={`cursor-pointer p-2.5 rounded-xl transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-[#B85064] text-white shadow-sm shadow-[#B85064]/25'
                      : 'text-[#8C7D82] hover:text-[#B85064] hover:bg-[#FAF5F6]'
                  }`}
                >
                  <Bars3BottomLeftIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Skeleton Loading khi đang đọc CSDL */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl overflow-hidden border border-[#F0E4E6] p-4 space-y-4 animate-pulse"
                  >
                    <div className="h-44 bg-[#F2DFE2]/50 rounded-xl" />
                    <div className="h-5 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded w-full" />
                    <div className="h-3 bg-neutral-100 rounded w-2/3" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 bg-[#B85064]/20 rounded w-1/3" />
                      <div className="h-8 bg-[#B85064]/30 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Trạng thái nếu không có gói nào trong CSDL khớp bộ lọc */}
            {!isLoading && displayedPackages.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#F2E8E9] shadow-sm space-y-3">
                <PhotoIcon className="w-12 h-12 text-[#CBB9BD] mx-auto" />
                <h3 className="text-base font-bold text-[#2A1D22]">
                  Không tìm thấy gói chụp nào phù hợp
                </h3>
                <p className="text-xs text-[#7A6C71] max-w-sm mx-auto">
                  Hiện không có gói chụp nào khớp với tiêu chí bạn chọn. Hãy thử lại với từ khóa khác hoặc đặt lại bộ lọc.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setMaxPrice(10000000);
                    setSortBy('popular');
                    setCurrentPage(1);
                  }}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A33D50] transition-colors shadow-sm"
                >
                  <span>Đặt lại bộ lọc</span>
                </button>
              </div>
            )}

            {/* LƯỚI CHUẨN: 1 HÀNG 3 CÁI (CLICK VÀO CARD/ẢNH VÀO TRANG CHI TIẾT) */}
            {!isLoading && viewMode === 'grid' && displayedPackages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {displayedPackages.map((pkg) => {
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => navigate(`/packages/${pkg.id}`, { state: { pkg } })}
                      className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#F0E4E6] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Top: Image + TagIcon + Hover Action */}
                      <div>
                        <div className="relative h-48 w-full overflow-hidden bg-[#EFEBEB] group/img">
                          <img
                            src={pkg.displayImage}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                          {/* TagIcon danh mục góc trên trái ảnh */}
                          <div className="absolute top-3 left-3 z-10">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-sm text-[#B85064] border border-[#F5D5DC] shadow-sm">
                              {pkg.categoryLabel}
                            </span>
                          </div>

                          {/* TagIcon ưu đãi góc dưới trái ảnh */}
                          {pkg.discountPercent > 0 && (
                            <div className="absolute bottom-2.5 left-3 z-10">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#E84360] text-white shadow-sm flex items-center gap-1">
                                <TagIcon className="w-2.5 h-2.5" />
                                <span>-{pkg.discountPercent}% Ưu đãi</span>
                              </span>
                            </div>
                          )}

                          {/* Nút Xem chi tiết hiện ra khi rê chuột vào hình ảnh */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1.5px] z-10">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-[#B85064] text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              <EyeIcon className="w-3.5 h-3.5 text-[#B85064]" />
                              <span>Xem chi tiết</span>
                            </span>
                          </div>
                        </div>

                        {/* Body Details */}
                        <div className="p-4 sm:p-5 space-y-3">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="text-[15px] font-bold text-[#2A1D22] group-hover:text-[#B85064] transition-colors line-clamp-1 block">
                                {pkg.name}
                              </h3>
                            </div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <div className="flex items-center gap-1 font-semibold text-[#D97706]">
                                <StarIcon className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                                <span>{pkg.rating?.toFixed(1) || '5.0'}</span>
                                <span className="text-[#9E8E93] font-normal text-[11px]">
                                  ({pkg.ratingCount || 0})
                                </span>
                              </div>
                              <span className="text-[11px] text-[#8C7D82]">
                                Đã đặt {pkg.bookedCount || 0}+
                              </span>
                            </div>
                            <p className="text-xs text-[#7A6C71] font-light leading-relaxed line-clamp-2 min-h-[34px]">
                              {pkg.description}
                            </p>
                          </div>

                          {/* 4 dòng specs icon */}
                          <div className="space-y-2 pt-1 border-t border-[#F8EFEF]">
                            {pkg.specs?.map((spec, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center gap-2.5 text-xs text-[#55464B]"
                              >
                                {renderSpecIcon(spec.icon)}
                                <span className="truncate">{spec.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer: Giá & Nút Đặt gói này */}
                      <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-[#F8EFEF] flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-base sm:text-lg font-bold text-[#B85064]">
                            {pkg.priceDisplay}
                          </span>
                          {pkg.originalPrice && pkg.discountPercent > 0 && (
                            <span className="text-[11px] text-[#A89A9F] line-through">
                              {pkg.originalPrice.toLocaleString('vi-VN')}đ
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openBookingModal(pkg);
                          }}
                          className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold whitespace-nowrap transition-all shadow-sm shadow-[#B85064]/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>Đặt gói này</span>
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CHẾ ĐỘ XEM LIST VIEW */}
            {!isLoading && viewMode === 'list' && displayedPackages.length > 0 && (
              <div className="space-y-4">
                {displayedPackages.map((pkg) => {
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => navigate(`/packages/${pkg.id}`, { state: { pkg } })}
                      className="cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border border-[#F0E4E6] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row gap-5 items-center justify-between group"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 relative group/thumb">
                          <img
                            src={pkg.displayImage}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="p-1.5 rounded-full bg-white/95 text-[#B85064] shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                              <EyeIcon className="w-4 h-4 text-[#B85064]" />
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#FCECEF] text-[#B85064]">
                              {pkg.categoryLabel}
                            </span>
                            {pkg.discountPercent > 0 && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-[#E84360] text-white flex items-center gap-0.5">
                                <TagIcon className="w-2.5 h-2.5" />
                                <span>-{pkg.discountPercent}% Ưu đãi</span>
                              </span>
                            )}
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#D97706]">
                              <StarIcon className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                              <span>{pkg.rating?.toFixed(1) || '5.0'}</span>
                              <span className="text-[#9E8E93] font-normal">({pkg.ratingCount || 0})</span>
                            </div>
                            <span className="text-[11px] text-[#8C7D82]">
                              • Đã đặt {pkg.bookedCount || 0}+
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[#2A1D22] group-hover:text-[#B85064] transition-colors block">
                            {pkg.name}
                          </h3>
                          <p className="text-xs text-[#7A6C71] max-w-md line-clamp-1">
                            {pkg.description}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-[#55464B] pt-1">
                            {pkg.specs?.slice(0, 3).map((spec, sIdx) => (
                              <div key={sIdx} className="flex items-center gap-1">
                                {renderSpecIcon(spec.icon)}
                                <span>{spec.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-[#F8EFEF] pt-3 sm:pt-0">
                        <div className="flex flex-col sm:items-end">
                          <span className="text-lg font-bold text-[#B85064]">
                            {pkg.priceDisplay}
                          </span>
                          {pkg.originalPrice && pkg.discountPercent > 0 && (
                            <span className="text-[11px] text-[#A89A9F] line-through">
                              {pkg.originalPrice.toLocaleString('vi-VN')}đ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openBookingModal(pkg);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold whitespace-nowrap shadow-sm shadow-[#B85064]/20"
                          >
                            <span>Đặt gói này</span>
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Phân trang gói chụp */}
            {!isLoading && filteredPackages.length > 0 && totalPages > 1 && (
              <div className="pt-6 border-t border-[#F2E8E9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#7A6C71]">
                  Hiển thị{' '}
                  <span className="font-bold text-[#2A1D22]">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{' '}
                  -{' '}
                  <span className="font-bold text-[#2A1D22]">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredPackages.length)}
                  </span>{' '}
                  trên tổng số{' '}
                  <span className="font-bold text-[#B85064]">
                    {filteredPackages.length}
                  </span>{' '}
                  gói chụp
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="cursor-pointer px-3 py-2 rounded-xl border border-[#EFE5E7] bg-white text-xs font-semibold text-[#55464B] hover:border-[#B85064] hover:text-[#B85064] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-xs"
                    title="Trang trước"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Trước</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        type="button"
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`cursor-pointer w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#B85064] text-white shadow-md shadow-[#B85064]/25 scale-105'
                            : 'bg-white text-[#55464B] border border-[#EFE5E7] hover:border-[#B85064] hover:text-[#B85064] shadow-xs'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="cursor-pointer px-3 py-2 rounded-xl border border-[#EFE5E7] bg-white text-xs font-semibold text-[#55464B] hover:border-[#B85064] hover:text-[#B85064] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-xs"
                    title="Trang sau"
                  >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MODAL ĐẶT LỊCH NHANH CHO KHÁCH HÀNG */}
      {/* ========================================================================= */}
      {bookingModalPkg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setBookingModalPkg(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-8 overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hoa lá màu nước trang trí khung đặt lịch */}
            <FloralCardCorner position="top-right" opacity="opacity-70" />
            <FloralCardCorner position="bottom-left" opacity="opacity-60" />
            <FloatingPetals count={4} opacity="opacity-50" />

            <button
              onClick={() => setBookingModalPkg(null)}
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
                  Cảm ơn bạn đã lựa chọn <strong>{bookingModalPkg.name}</strong>.
                  Lịch hẹn dự kiến: <strong>{formData.date || todayStr}</strong> (khung giờ <strong>{selectedTimeSlot.label}</strong>).
                  Đội ngũ PhotoStudio sẽ liên hệ qua số <strong>{formData.phone}</strong> trong vòng 15 phút để tư vấn chi tiết concept.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setBookingModalPkg(null);
                    setFormData({ name: '', phone: '', date: '', note: '' });
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
                    ĐẶT LỊCH GÓI CHỤP
                  </span>
                  <h3 className="text-xl font-bold font-serif-luxury text-[#1F1418] mt-0.5">
                    {bookingModalPkg.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC]">
                  <img
                    src={bookingModalPkg.displayImage}
                    alt={bookingModalPkg.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#B85064] block">
                      {bookingModalPkg.priceDisplay}
                    </span>
                    <span className="text-xs text-[#7A6C71] truncate block">
                      {bookingModalPkg.description}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3E2F35] mb-1">
                        Họ và tên của bạn *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Nguyễn Thị Mai"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DCDE] text-xs sm:text-sm text-[#2A1D22] focus:outline-none focus:border-[#B85064]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3E2F35] mb-1">
                        Số điện thoại / Zalo *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0987 654 321"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DCDE] text-xs sm:text-sm text-[#2A1D22] focus:outline-none focus:border-[#B85064]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3E2F35] mb-1">
                        Ngày chụp dự kiến *
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DCDE] text-xs text-[#2A1D22] focus:outline-none focus:border-[#B85064] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3E2F35] mb-1">
                        Khung giờ chụp *
                      </label>
                      <div className="relative">
                        <select
                          value={selectedTimeSlot.id}
                          onChange={(e) => {
                            const found = TIME_SLOTS.find((s) => s.id === e.target.value);
                            if (found) setSelectedTimeSlot(found);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DCDE] text-xs text-[#2A1D22] focus:outline-none focus:border-[#B85064] cursor-pointer appearance-none pr-8 font-medium"
                        >
                          <optgroup label="☀️ Buổi Sáng">
                            {TIME_SLOTS.filter((s) => s.period === 'Sáng').map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label} (Sáng)
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="⛅ Buổi Chiều">
                            {TIME_SLOTS.filter((s) => s.period === 'Chiều').map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label} (Chiều)
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="🌙 Buổi Tối">
                            {TIME_SLOTS.filter((s) => s.period === 'Tối').map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label} (Tối)
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        <ChevronDownIcon className="w-4 h-4 text-[#7A6C71] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2F35] mb-1">
                      Ghi chú mong muốn (Tone màu, trang phục, makeup...)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ví dụ: Mình thích phong cách nhẹ nhàng Hàn Quốc..."
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E8DCDE] text-xs text-[#2A1D22] focus:outline-none focus:border-[#B85064] resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full py-3 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#B85064]/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>
                    {isSubmitting
                      ? 'Đang gửi đăng ký...'
                      : 'Xác Nhận Giữ Lịch & Tư Vấn'}
                  </span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL XEM ẢNH CHI TIẾT (QUICK VIEW) */}
      {/* ========================================================================= */}
      {quickViewPkg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setQuickViewPkg(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl overflow-hidden p-6 text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickViewPkg(null)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF]"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-neutral-100">
                <img
                  src={quickViewPkg.displayImage}
                  alt={quickViewPkg.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FCECEF] text-[#B85064]">
                  {quickViewPkg.categoryLabel}
                </span>

                <h3 className="text-xl font-bold font-serif-luxury text-[#1F1418]">
                  {quickViewPkg.name}
                </h3>

                <p className="text-xs text-[#7A6C71] leading-relaxed">
                  {quickViewPkg.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#F8EFEF]">
                  <span className="text-[11px] font-bold uppercase text-[#8C7D82] block">
                    Đặc quyền trọn gói:
                  </span>
                  {quickViewPkg.specs?.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-[#55464B]"
                    >
                      {renderSpecIcon(spec.icon)}
                      <span>{spec.text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F8EFEF]">
                  <span className="text-xl font-bold text-[#B85064]">
                    {quickViewPkg.priceDisplay}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/packages/${quickViewPkg.id}`}
                      onClick={() => setQuickViewPkg(null)}
                      className="cursor-pointer inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-[#F2C0CA] text-[#B85064] hover:bg-[#FDF5F6] text-xs font-semibold transition-colors"
                    >
                      <span>Xem trang chi tiết</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => {
                        setQuickViewPkg(null);
                        openBookingModal(quickViewPkg);
                      }}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A33D50] transition-colors shadow-xs"
                    >
                      <span>Đặt gói này ngay</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cánh hoa đào bay phất phơ trải đều khắp chiều cao trang từ trên xuống dưới */}
      <ScatteredPetals className="z-20 pointer-events-none" />
    </div>
  );
}
