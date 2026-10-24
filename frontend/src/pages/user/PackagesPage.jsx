import { useState, useEffect, useRef } from 'react';
import {
  SparklesIcon,
  CheckIcon,
  ClockIcon,
  PhotoIcon,
  ArrowRightIcon,
  TrophyIcon,
  ShieldCheckIcon,
  PhoneIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/react/24/solid';
import SpotlightCard from '../../components/cards/SpotlightCard';
import ScrollReveal from '../../components/animations/ScrollReveal';
import ShinyText from '../../components/animations/ShinyText';
import customerPackageService from '../../services/user/packageService';
import customerServiceService from '../../services/user/serviceService';
import customerRoomService from '../../services/user/roomService';
import customerBookingService from '../../services/user/bookingService';
import userImageService from '../../services/user/imageService';
import { customerAuth } from '../../lib/axiosCustomer';

// Danh mục ảnh mẫu chất lượng cao dự phòng (fallback) khi CSDL chưa có ảnh cho gói
const CURATED_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', // Nàng thơ
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', // Cưới studio
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85', // Gia đình
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', // Cưới luxury
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85', // Kỷ yếu
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', // Doanh nhân
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85', // Cổ trang
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', // Lookbook
];

const EQUIPMENT_LABELS = {
  camera: 'Máy ảnh Cinema Full-Frame',
  lighting: 'Dàn đèn Godox Pro Studio',
  tripod: 'Chân máy chống rung Manfrotto',
  backdrop: 'Phông nền điện tử đa sắc',
  lens: 'Ống kính chân dung GM / L-series',
  reflector: 'Tấm hắt sáng chuyên dụng',
  softbox: 'Softbox tản sáng điện ảnh',
};

const padZero = (n) => (n < 10 ? `0${n}` : `${n}`);

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bộ lọc sản phẩm
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-asc', 'price-desc', 'duration'

  // Phân trang (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal xem chi tiết sản phẩm / lookbook
  const [quickViewPkg, setQuickViewPkg] = useState(null);

  // Trạng thái form đặt lịch tích hợp
  const [selectedBookingPkg, setSelectedBookingPkg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    note: '',
  });

  const bookingSectionRef = useRef(null);
  const productsTopRef = useRef(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    void Promise.allSettled([
      customerPackageService.getAllPackages(),
      customerServiceService.getAllServices(),
      customerRoomService.getAllRooms(),
      userImageService.getAllImages(),
    ])
      .then(([packagesRes, servicesRes, roomsRes, imagesRes]) => {
        const allImages =
          imagesRes.status === 'fulfilled' && Array.isArray(imagesRes.value)
            ? imagesRes.value
            : [];

        // 1. Tải và xử lý Packages kèm hình ảnh từ CSDL / fallback
        if (packagesRes.status === 'fulfilled' && Array.isArray(packagesRes.value)) {
          const activePkgs = packagesRes.value.filter(
            (p) => !p.status || p.status === 'active'
          );

          const mapped = activePkgs.map((pkg, idx) => {
            // ĐK: Tìm ảnh từ bảng images khớp với imageable_type = 'package' và imageable_id = pkg.id
            const pkgImages = allImages.filter(
              (img) =>
                img.imageableType?.toLowerCase() === 'package' &&
                Number(img.imageableId) === Number(pkg.id)
            );

            // Ưu tiên ảnh is_primary = true hoặc ảnh đầu tiên tìm thấy trong CSDL
            const primaryImg =
              pkgImages.find((img) => img.isPrimary) || pkgImages[0];

            // Nếu CSDL có ảnh -> Lấy ảnh CSDL; Nếu CSDL chưa có ảnh -> Lấy ảnh mẫu chất lượng cao
            const displayImage =
              primaryImg?.imageUrl ||
              pkg.imageUrl ||
              CURATED_FALLBACK_IMAGES[idx % CURATED_FALLBACK_IMAGES.length];

            // Xác định category tag
            const nameLower = (pkg.name || '').toLowerCase();
            let category = 'other';
            let categoryLabel = 'Sản Phẩm Studio';
            let badgeTag = 'Hot Concept';

            if (nameLower.includes('cưới') || nameLower.includes('wedding')) {
              category = 'wedding';
              categoryLabel = 'Ảnh Cưới & Couple';
              badgeTag = idx === 1 ? 'Best Seller' : 'Luxury Wedding';
            } else if (nameLower.includes('cá nhân') || nameLower.includes('nàng thơ') || nameLower.includes('beauty')) {
              category = 'portrait';
              categoryLabel = 'Nàng Thơ & Profile';
              badgeTag = 'Xu Hướng 2026';
            } else if (nameLower.includes('gia đình') || nameLower.includes('nhóm')) {
              category = 'family';
              categoryLabel = 'Gia Đình & Nhóm';
              badgeTag = 'Ấm Cúng & Gắn Kết';
            } else if (nameLower.includes('doanh nhân') || nameLower.includes('thời trang') || nameLower.includes('lookbook')) {
              category = 'commercial';
              categoryLabel = 'Doanh Nhân & Lookbook';
              badgeTag = 'High-End Editorial';
            }

            return {
              ...pkg,
              displayImage,
              galleryImages: pkgImages.length > 0 ? pkgImages.map((i) => i.imageUrl) : [displayImage],
              hasDbImage: Boolean(primaryImg?.imageUrl || pkg.imageUrl),
              category,
              categoryLabel,
              badgeTag,
              rating: 5.0,
            };
          });

          setPackages(mapped);
          if (mapped.length > 0) {
            setSelectedBookingPkg(mapped[0]);
          }
        } else {
          setPackages([]);
        }

        // 2. Tải Dịch vụ cộng thêm
        if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value)) {
          const activeSrvs = servicesRes.value.filter(
            (s) => !s.status || s.status === 'active'
          );
          setAdditionalServices(activeSrvs);
        } else {
          setAdditionalServices([]);
        }

        // 3. Tải Phòng Studio
        if (roomsRes.status === 'fulfilled' && Array.isArray(roomsRes.value)) {
          setRooms(roomsRes.value);
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('[PackagesPage] Lỗi tải dữ liệu gói chụp:', err);
      });
  }, []);

  // Tách mô tả hoặc thiết bị thành danh sách đặc quyền thực tế
  const getPackageFeatures = (pkg) => {
    const list = [];
    if (pkg.description) {
      const parts = pkg.description
        .split(/[,;\n]/)
        .map((p) => p.trim())
        .filter(Boolean);
      list.push(...parts);
    }
    if (Array.isArray(pkg.equipments) && pkg.equipments.length > 0) {
      pkg.equipments.forEach((eq) => {
        const typeLabel = EQUIPMENT_LABELS[eq.equipmentType] || eq.equipmentType;
        list.push(`Trang bị: ${eq.quantity}x ${typeLabel}`);
      });
    }
    return list.length > 0 ? list : ['Bao gồm trọn gói dịch vụ và không gian phòng chụp'];
  };

  // Cuộn mượt đến phần đặt lịch và chọn gói
  const handleSelectAndScrollToBooking = (pkg) => {
    setSelectedBookingPkg(pkg);
    if (quickViewPkg) setQuickViewPkg(null);
    if (bookingSectionRef.current) {
      bookingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Danh mục bộ sưu tập
  const categories = [
    { id: 'all', label: 'Tất Cả Sản Phẩm' },
    { id: 'wedding', label: 'Ảnh Cưới & Couple' },
    { id: 'portrait', label: 'Nàng Thơ & Profile' },
    { id: 'family', label: 'Gia Đình & Nhóm' },
    { id: 'commercial', label: 'Doanh Nhân & Thời Trang' },
  ];

  // Tính số lượng từng danh mục
  const getCategoryCount = (catId) => {
    if (catId === 'all') return packages.length;
    return packages.filter((p) => p.category === catId).length;
  };

  // Lọc và Sắp xếp danh sách gói chụp
  const filteredAndSortedPackages = packages
    .filter((pkg) => {
      const matchesCategory =
        selectedCategory === 'all' || pkg.category === selectedCategory;
      const matchesSearch =
        !searchTerm.trim() ||
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
      return 0;
    });

  // Phân trang dữ liệu
  const totalPages = Math.ceil(filteredAndSortedPackages.length / itemsPerPage) || 1;
  const paginatedPackages = filteredAndSortedPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const bookingDateStr =
      formData.date ||
      `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;
    const roomIdToUse = rooms.length > 0 ? rooms[0].id : 1;
    const currentCustomer = customerAuth.getUser();

    const payload = {
      customerId: currentCustomer?.id || 1,
      roomId: roomIdToUse,
      bookingDate: `${bookingDateStr}T09:00:00`,
      startTime: '09:00:00',
      endTime: '11:00:00',
      status: 'pending',
      customerNote: `[Trưng bày gói] Khách: ${formData.name} - SĐT: ${formData.phone} - Gói đặt: ${selectedBookingPkg?.name || 'Tùy chọn'} (${selectedBookingPkg?.price ? Number(selectedBookingPkg.price).toLocaleString('vi-VN') + 'đ' : ''})${formData.note ? ` - Ghi chú: ${formData.note}` : ''}`,
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

  return (
    <div className="pt-28 pb-24 overflow-hidden bg-neutral-950 min-h-screen">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
              <ShinyText text="SHOWCASE BỘ SƯU TẬP & BÁO GIÁ CHÍNH HÃNG 2026" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-5 leading-tight font-sans">
              Trưng Bày Gói Chụp & Báo Giá
            </h1>

            <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed">
              Khám phá các bộ sưu tập concept độc bản của PhotoStudio. Toàn bộ thông tin báo giá, thời lượng và thiết bị được đồng bộ minh bạch từ hệ thống CSDL.
            </p>
          </div>
        </ScrollReveal>

        {/* ============================================================= */}
        {/* LAYOUT: BỘ LỌC BÊN TRÁI (3) + DANH SÁCH SẢN PHẨM BÊN PHẢI (7) - TỈ LỆ 3:7 */}
        {/* ============================================================= */}
        <div ref={productsTopRef} className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start mb-24 scroll-mt-28">
          
          {/* CỘT BÊN TRÁI: BỘ LỌC SẢN PHẨM (SIDEBAR FILTER - CHIẾM 3 PHẦN) */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
            <ScrollReveal direction="right">
              <div className="p-6 rounded-3xl bg-neutral-900/85 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
                
                {/* Header Bộ lọc */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <AdjustmentsVerticalIcon className="w-5 h-5 text-amber-400" />
                    <span>Bộ Lọc Sản Phẩm</span>
                  </div>
                  {(selectedCategory !== 'all' || searchTerm || sortBy !== 'default') && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchTerm('');
                        setSortBy('default');
                        setCurrentPage(1);
                      }}
                      className="cursor-pointer text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
                    >
                      Đặt lại
                    </button>
                  )}
                </div>

                {/* 1. Tìm kiếm theo tên */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    Tìm Kiếm Concept
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Nhập tên gói chụp..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/15 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Danh mục Bộ Sưu Tập (NẰM BÊN TRÁI) */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TagIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                      Bộ Sưu Tập
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {categories.map((cat) => {
                      const count = getCategoryCount(cat.id);
                      const isSelected = selectedCategory === cat.id;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setCurrentPage(1);
                          }}
                          className={`cursor-pointer w-full px-4 py-2.5 rounded-2xl flex items-center justify-between text-left text-xs sm:text-sm font-semibold transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-extrabold shadow-lg shadow-amber-500/25 scale-[1.02]'
                              : 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
                          }`}
                        >
                          <span className="truncate">{cat.label}</span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ml-2 ${
                              isSelected
                                ? 'bg-neutral-950/20 text-neutral-950'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Sắp xếp giá */}
                <div className="pt-4 border-t border-white/10">
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    Sắp Xếp Giá & Thời Lượng
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="default">Mặc định hệ thống</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="duration">Thời lượng chụp lâu nhất</option>
                  </select>
                </div>

                {/* Cam kết chất lượng studio */}
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-amber-500/20 text-xs text-neutral-300 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <ShieldCheckIcon className="w-4 h-4 shrink-0" />
                    <span>Cam Kết Báo Giá</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Minh bạch 100%, trọn gói không phụ thu bối cảnh & thiết bị.
                  </p>
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* CỘT BÊN PHẢI: DANH SÁCH SẢN PHẨM TRƯNG BÀY + PHÂN TRANG (CHIẾM 7 PHẦN) */}
          <div className="lg:col-span-7">
            
            {/* Top Status Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 text-xs text-neutral-400">
              <div>
                Đang hiển thị{' '}
                <strong className="text-white">
                  {filteredAndSortedPackages.length > 0
                    ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                        currentPage * itemsPerPage,
                        filteredAndSortedPackages.length
                      )}`
                    : '0'}{' '}
                </strong>
                trên tổng số <strong className="text-amber-400">{filteredAndSortedPackages.length}</strong> gói sản phẩm
              </div>

              {selectedCategory !== 'all' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <span>{categories.find((c) => c.id === selectedCategory)?.label}</span>
                </div>
              )}
            </div>

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="rounded-3xl border border-white/10 bg-neutral-900/60 p-0 overflow-hidden animate-pulse space-y-4"
                  >
                    <div className="h-64 w-full bg-white/10" />
                    <div className="p-6 space-y-4">
                      <div className="h-5 w-24 bg-white/10 rounded-full" />
                      <div className="h-7 w-3/4 bg-white/10 rounded-lg" />
                      <div className="h-4 w-full bg-white/10 rounded" />
                      <div className="h-9 w-1/2 bg-amber-500/20 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredAndSortedPackages.length === 0 && (
              <div className="text-center py-20 px-4 rounded-3xl border border-white/10 bg-neutral-900/40">
                <PhotoIcon className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy gói chụp phù hợp</h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
                  Không có sản phẩm nào khớp với tiêu chí bạn chọn. Vui lòng thử lại với từ khóa khác hoặc đặt lại bộ lọc.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setSortBy('default');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-2.5 rounded-full bg-amber-500 text-neutral-950 font-bold text-xs"
                >
                  Xem Tất Cả Sản Phẩm
                </button>
              </div>
            )}

            {/* Products Grid (Paginated: Cố định 2 sản phẩm mỗi hàng) */}
            {!isLoading && paginatedPackages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedPackages.map((pkg, idx) => {
                  const features = getPackageFeatures(pkg);
                  const formattedPrice = pkg.price
                    ? Number(pkg.price).toLocaleString('vi-VN')
                    : 'Liên hệ';
                  const isSelected = selectedBookingPkg?.id === pkg.id;

                  return (
                    <ScrollReveal
                      key={pkg.id}
                      direction="up"
                      delay={idx * 0.06}
                      duration={0.5}
                      className="flex"
                    >
                      <SpotlightCard
                        onClick={() => setQuickViewPkg(pkg)}
                        className={`group cursor-pointer flex flex-col justify-between relative overflow-hidden rounded-3xl p-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 w-full ${
                          isSelected
                            ? 'border-amber-500 bg-neutral-900/95 ring-2 ring-amber-500/50 shadow-2xl shadow-amber-500/20'
                            : 'bg-neutral-900/70 border-white/10 hover:border-amber-500/50'
                        }`}
                        spotlightColor="rgba(245, 158, 11, 0.22)"
                      >
                        <div>
                          {/* Product Showcase Image */}
                          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-950">
                            <img
                              src={pkg.displayImage}
                              alt={pkg.name}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                            {/* Top Badges: Category & Tag on Left, Rating on Right */}
                            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10 pointer-events-none">
                              <div className="flex flex-wrap items-center gap-1.5 max-w-[70%]">
                                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 shadow-lg">
                                  {pkg.badgeTag}
                                </span>
                                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-neutral-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30 shadow-md">
                                  {pkg.categoryLabel}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950/85 backdrop-blur-md border border-white/20 text-white text-xs shrink-0 shadow-md">
                                <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="font-bold">5.0</span>
                              </div>
                            </div>

                            {/* HOVER OVERLAY: Rê chuột vào hình sẽ hiện nút Xem Chi Tiết */}
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 text-xs sm:text-sm font-extrabold shadow-2xl shadow-amber-500/40 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                <ArrowsPointingOutIcon className="w-4 h-4 text-neutral-950" />
                                <span>Xem Chi Tiết</span>
                              </span>
                            </div>
                          </div>

                          {/* Product Content Body */}
                          <div className="p-6 sm:p-7 pb-8">
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-xs text-neutral-400 font-medium">Mã #{pkg.id}</span>
                              {pkg.duration && (
                                <span className="flex items-center gap-1.5 text-xs text-neutral-300 bg-neutral-800/80 px-2.5 py-0.5 rounded-lg border border-white/10">
                                  <ClockIcon className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{pkg.duration} phút</span>
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                              {pkg.name}
                            </h3>

                            <p className="text-xs sm:text-sm text-neutral-300 font-light mb-6 min-h-[40px] leading-relaxed line-clamp-2">
                              {pkg.description || 'Gói dịch vụ chụp ảnh nghệ thuật chuyên nghiệp.'}
                            </p>

                            {/* Price Tag */}
                            <div className="mb-6 pb-6 border-b border-white/10 flex items-center justify-between">
                              <div>
                                <span className="text-[11px] text-neutral-400 block mb-1">Giá trọn gói niêm yết:</span>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                                    {formattedPrice}
                                  </span>
                                  <span className="text-sm font-bold text-amber-400">VNĐ</span>
                                </div>
                              </div>

                              <div className="text-xs text-amber-400/80 flex items-center gap-1 font-semibold group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
                                <span>Xem chi tiết</span>
                                <ArrowRightIcon className="w-3.5 h-3.5" />
                              </div>
                            </div>

                            {/* Feature Checklist */}
                            <div className="space-y-2.5">
                              {features.slice(0, 3).map((feat, fIdx) => (
                                <div key={fIdx} className="flex items-start gap-2.5">
                                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckIcon className="w-3 h-3 stroke-[3]" />
                                  </div>
                                  <span className="text-xs sm:text-sm text-neutral-300 font-light leading-snug truncate">
                                    {feat}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}

            {/* ============================================================= */}
            {/* PHẦN PHÂN TRANG (PAGINATION) */}
            {/* ============================================================= */}
            {!isLoading && totalPages > 1 && (
              <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 mt-8">
                <div className="text-xs text-neutral-400">
                  Trang <strong className="text-white">{currentPage}</strong> / <strong className="text-white">{totalPages}</strong> ({filteredAndSortedPackages.length} sản phẩm)
                </div>

                <div className="flex items-center gap-2">
                  {/* Nút Trước */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold border border-white/15 bg-neutral-900 text-white hover:bg-neutral-800 hover:border-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeftIcon className="w-3.5 h-3.5" />
                    <span>Trước</span>
                  </button>

                  {/* Danh sách các số trang */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`cursor-pointer w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 shadow-lg shadow-amber-500/30 scale-105'
                          : 'border border-white/10 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-amber-400/50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Nút Sau */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold border border-white/15 bg-neutral-900 text-white hover:bg-neutral-800 hover:border-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                  >
                    <span>Sau</span>
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ============================================================= */}
        {/* INTEGRATED BOOKING SHOWCASE SECTION (LỊCH ĐẶT & TRƯNG BÀY) */}
        {/* ============================================================= */}
        <div ref={bookingSectionRef} className="pt-8 mb-24 scroll-mt-28">
          <ScrollReveal direction="up">
            <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left: Selected Package Showcase Summary */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                    <CalendarDaysIcon className="w-4 h-4 text-amber-400" />
                    <span>LỊCH HẸN & GIỮ CHỖ TRỰC TUYẾN</span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
                      Đăng Ký Trải Nghiệm Gói Chụp
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                      Lựa chọn gói chụp ưng ý và gửi thông tin. Studio sẽ liên hệ xác nhận trong vòng 15 phút.
                    </p>
                  </div>

                  {/* Selected Product Card Preview */}
                  {selectedBookingPkg ? (
                    <div className="p-5 rounded-2xl bg-neutral-950/80 border border-amber-500/40 shadow-xl space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={selectedBookingPkg.displayImage}
                          alt={selectedBookingPkg.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                            Gói đã chọn trưng bày:
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">
                            {selectedBookingPkg.name}
                          </h4>
                          <span className="text-sm font-extrabold text-amber-400">
                            {selectedBookingPkg.price ? Number(selectedBookingPkg.price).toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-neutral-300 space-y-1.5 pt-3 border-t border-white/10">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Thời lượng chụp:</span>
                          <span className="font-semibold text-white">{selectedBookingPkg.duration} phút</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Trạng thái:</span>
                          <span className="text-emerald-400 font-semibold">Khả dụng trong CSDL</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-neutral-950/50 border border-white/10 text-xs text-neutral-400">
                      Vui lòng chọn một gói chụp ở danh sách phía trên.
                    </div>
                  )}

                  {/* Studio Guarantees */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-xs text-neutral-300">
                      <ShieldCheckIcon className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>Không phát sinh chi phí bối cảnh và thiết bị</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-300">
                      <TrophyIcon className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>Cam kết chụp đến khi khách hàng hoàn toàn ưng ý</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-300">
                      <PhoneIcon className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>Hotline hỗ trợ 24/7: <strong>0901 234 567</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Booking Form */}
                <div className="lg:col-span-7">
                  <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950/90 border border-white/15 backdrop-blur-xl shadow-2xl">
                    {isSubmitted ? (
                      <div className="text-center py-10 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/20 animate-bounce">
                          <CheckCircleIcon className="w-9 h-9 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Đăng Ký Giữ Chỗ Thành Công!</h3>
                        <p className="text-neutral-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                          Cảm ơn bạn đã lựa chọn <strong>{selectedBookingPkg?.name}</strong>. Ekip PhotoStudio sẽ liên hệ qua số điện thoại <strong>{formData.phone}</strong> trong vòng 15 phút!
                        </p>
                        <button
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormData({ name: '', phone: '', date: '', note: '' });
                          }}
                          className="cursor-pointer mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                        >
                          Đặt Thêm Lịch Hẹn Khác
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { void handleSubmitBooking(e); }} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-neutral-200 mb-1.5">
                              Họ và Tên của bạn *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Nguyễn Văn A"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-neutral-200 mb-1.5">
                              Số Điện Thoại / Zalo *
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="0901 234 567"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Selected Package Selector */}
                          <div>
                            <label className="block text-xs font-bold text-neutral-200 mb-1.5">
                              Gói Chụp Được Chọn
                            </label>
                            <select
                              value={selectedBookingPkg?.id || ''}
                              onChange={(e) => {
                                const found = packages.find((p) => String(p.id) === e.target.value);
                                if (found) setSelectedBookingPkg(found);
                              }}
                              className="w-full px-3.5 py-3 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                            >
                              {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.name} — {pkg.price ? Number(pkg.price).toLocaleString('vi-VN') + 'đ' : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Date Input */}
                          <div>
                            <label className="block text-xs font-bold text-neutral-200 mb-1.5">
                              Ngày Chụp Dự Kiến
                            </label>
                            <input
                              type="date"
                              min={today.toISOString().split('T')[0]}
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-200 mb-1.5">
                            Ghi Chú Yêu Cầu Riêng (Layout makeup, trang phục...)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Ví dụ: Mình muốn chụp tone màu ấm Hàn Quốc, cần hỗ trợ thêm làm tóc..."
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="cursor-pointer w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 font-extrabold text-sm shadow-xl shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <PaperAirplaneIcon className="w-4 h-4 text-neutral-950" />
                          <span>{isSubmitting ? 'Đang gửi đăng ký...' : 'Xác Nhận Giữ Lịch & Tư Vấn Concept'}</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Additional Services Showcase */}
        {!isLoading && additionalServices.length > 0 && (
          <ScrollReveal direction="up" delay={0.2}>
            <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl mb-16">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Dịch Vụ Phụ Trợ & Tiện Ích Kèm Theo</h3>
                    <p className="text-xs text-neutral-400">Các dịch vụ mở rộng từ CSDL có thể bổ sung vào buổi chụp</p>
                  </div>
                </div>
                <span className="text-xs text-amber-400 bg-amber-500/15 px-3.5 py-1.5 rounded-full border border-amber-500/30 w-fit">
                  ✨ {additionalServices.length} Dịch vụ khả dụng
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {additionalServices.map((service) => (
                  <div
                    key={service.id}
                    className="group relative p-6 rounded-2xl bg-neutral-950/70 border border-white/10 hover:border-amber-400/60 hover:bg-neutral-900/90 hover:shadow-xl hover:shadow-amber-500/15 transition-all duration-300 hover:-translate-y-1.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md">
                      <SparklesIcon className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80 mb-1 block">
                      Loại: {service.type || 'Dịch vụ'}
                    </span>
                    <h4 className="text-sm font-bold text-neutral-200 group-hover:text-white mb-1.5 transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-xs text-neutral-400 mb-4 font-light leading-relaxed min-h-[36px]">
                      {service.description || 'Dịch vụ tiện ích studio hỗ trợ buổi chụp hoàn hảo'}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <p className="text-sm font-extrabold text-amber-400 group-hover:text-amber-300 transition-colors">
                        {service.price ? `${Number(service.price).toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                      </p>
                      {service.duration ? (
                        <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <ClockIcon className="w-3 h-3 text-amber-400" />
                          {service.duration}p
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

      </div>

      {/* QUICK VIEW / LOOKBOOK SHOWCASE MODAL */}
      {quickViewPkg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setQuickViewPkg(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-amber-500/50 shadow-2xl shadow-black p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setQuickViewPkg(null)}
              className="cursor-pointer absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Modal Image */}
              <div className="md:col-span-6 rounded-2xl overflow-hidden border border-white/10 relative">
                <img
                  src={quickViewPkg.displayImage}
                  alt={quickViewPkg.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-neutral-950 uppercase shadow-lg">
                    {quickViewPkg.badgeTag}
                  </span>
                </div>
              </div>

              {/* Modal Specs */}
              <div className="md:col-span-6 space-y-5">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {quickViewPkg.categoryLabel}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {quickViewPkg.name}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 block">Báo giá trọn gói:</span>
                    <span className="text-2xl font-extrabold text-amber-400 font-sans">
                      {quickViewPkg.price ? Number(quickViewPkg.price).toLocaleString('vi-VN') + ' VNĐ' : 'Liên hệ'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 block">Thời lượng:</span>
                    <span className="text-sm font-bold text-white">{quickViewPkg.duration} phút</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {quickViewPkg.description}
                </p>

                {/* Features List */}
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block">
                    Đặc quyền & Thiết bị bao gồm:
                  </span>
                  {getPackageFeatures(quickViewPkg).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckIcon className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-neutral-200">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex gap-3">
                  <button
                    onClick={() => handleSelectAndScrollToBooking(quickViewPkg)}
                    className="cursor-pointer flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-extrabold text-sm shadow-xl shadow-amber-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span className="whitespace-nowrap">Đặt Lịch Ngay Gói Này</span>
                    <ArrowRightIcon className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
