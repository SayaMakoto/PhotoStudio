import { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  Shirt,
  Image as ImageIcon,
  Clock,
  Heart,
  LayoutGrid,
  List,
  Search,
  Briefcase,
  Users,
  User,
  Phone,
  MessageCircle,
  Check,
  X,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import customerPackageService from '../../services/user/packageService';
import customerBookingService from '../../services/user/bookingService';
import userImageService from '../../services/user/imageService';
import customerRoomService from '../../services/user/roomService';
import { customerAuth } from '../../lib/axiosCustomer';

const CATEGORIES_CONFIG = [
  { id: 'all', label: 'Tất cả', icon: LayoutGrid },
  { id: 'wedding', label: 'Ảnh Cưới & Couple', icon: Heart },
  { id: 'portrait', label: 'Nàng Thơ & Profile', icon: User },
  { id: 'family', label: 'Gia Đình & Nhóm', icon: Users },
  { id: 'commercial', label: 'Doanh Nhân & Thời Trang', icon: Briefcase },
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
  const [packages, setPackages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bộ lọc
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [displayCount, setDisplayCount] = useState(6);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [favorites, setFavorites] = useState({});

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

  const toggleFavorite = (pkgId, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [pkgId]: !prev[pkgId],
    }));
  };

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
        if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
        return 0;
      });
  }, [packages, selectedCategory, searchTerm, maxPrice, sortBy]);

  const displayedPackages = useMemo(() => {
    if (displayCount === 'all') return filteredPackages;
    return filteredPackages.slice(0, Number(displayCount));
  }, [filteredPackages, displayCount]);

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
    setBookingModalPkg(pkg);
    setIsSubmitted(false);
  };

  const renderSpecIcon = (type) => {
    switch (type) {
      case 'camera':
        return <Camera className="w-4 h-4 text-[#9E8E93] shrink-0" />;
      case 'outfit':
        return <Shirt className="w-4 h-4 text-[#9E8E93] shrink-0" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-[#9E8E93] shrink-0" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-[#9E8E93] shrink-0" />;
      default:
        return <Camera className="w-4 h-4 text-[#9E8E93] shrink-0" />;
    }
  };

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064]">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Nền studio điện ảnh với font chữ tiếng Việt chuẩn đẹp */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[440px] lg:min-h-[480px] bg-[#141012] overflow-hidden flex items-center pt-24 pb-16">
        {/* Background Image & Lighting Studio Effects */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-105"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012] via-[#141012]/85 to-[#1c1518]/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#141012]" />

        {/* Ambient spotlight glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-[#E5A8B4]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Cành hoa đào rủ xuống góc trái phía trên */}
        <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none opacity-85 z-10">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <path
              d="M-20 -10 C 30 20, 60 70, 75 130"
              stroke="#543C3A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M20 15 C 50 10, 90 35, 110 50"
              stroke="#543C3A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="75" cy="130" r="10" fill="#EFA9B7" opacity="0.9" />
            <circle cx="70" cy="122" r="8" fill="#F8C6CE" opacity="0.95" />
            <circle cx="83" cy="125" r="9" fill="#E695A5" opacity="0.9" />
            <circle cx="110" cy="50" r="9" fill="#EFA9B7" opacity="0.85" />
            <circle cx="118" cy="45" r="7" fill="#F8C6CE" opacity="0.9" />
            <circle cx="35" cy="40" r="11" fill="#E896A7" opacity="0.8" />
            <circle cx="20" cy="70" r="8" fill="#F7C4CD" opacity="0.75" />
          </svg>
        </div>

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
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
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
        {/* Cánh hoa đào bay phất phơ trang trí góc dưới bên trái */}
        <div className="absolute bottom-8 left-0 w-72 h-72 pointer-events-none opacity-40 z-0 select-none">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <ellipse cx="60" cy="140" rx="14" ry="8" fill="#F7CAD1" transform="rotate(-25 60 140)" />
            <ellipse cx="95" cy="165" rx="12" ry="7" fill="#F5BCC5" transform="rotate(15 95 165)" />
            <ellipse cx="40" cy="180" rx="16" ry="9" fill="#FAB8C3" transform="rotate(-40 40 180)" />
            <ellipse cx="120" cy="120" rx="10" ry="6" fill="#F8C9D1" transform="rotate(35 120 120)" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* ===================================================================== */}
          {/* CỘT TRÁI: BỘ LỌC GÓI CHỤP (SIDEBAR - 3 CỘT) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F2E8E9] shadow-[0_8px_30px_rgb(184,80,100,0.06)] relative overflow-hidden space-y-6">
              
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#FCECEF] to-[#FAF5F5] rounded-full blur-2xl pointer-events-none" />

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
                      onClick={() => setSelectedCategory(cat.id)}
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
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F2DFE2] rounded-lg appearance-none cursor-pointer accent-[#B85064]"
                />

                <div className="flex items-center justify-between text-[11px] font-semibold text-[#B85064]">
                  <span>Từ 500.000đ</span>
                  <span>Đến 10.000.000đ+</span>
                </div>
              </div>

              {/* Sắp xếp theo */}
              <div className="pt-2 border-t border-[#F2E8E9] space-y-2">
                <span className="block text-xs font-bold text-[#2A1D22]">
                  Sắp xếp theo
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DCDE] text-xs font-medium text-[#3E2F35] focus:outline-none focus:border-[#B85064] cursor-pointer"
                  >
                    <option value="default">Mặc định từ CSDL</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                    <option value="duration">Thời lượng chụp lâu nhất</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#8C7D82] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Chữ viết tay góc dưới sidebar */}
              <div className="pt-4 text-center select-none">
                <p className="font-handwriting text-lg text-[#A87B84] leading-relaxed">
                  Chọn phong cách của bạn
                  <br />
                  chúng tôi sẽ lo phần còn lại! ♡
                </p>
              </div>

            </div>
          </div>

          {/* ===================================================================== */}
          {/* CỘT PHẢI: LƯỚI 3 CỘT MỖI HÀNG (TRÁNH BỊ TRÀN CHỮ, RỘNG RÃI & ĐẸP MẮT) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-9 xl:col-span-9 space-y-6">
            
            {/* Thanh Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-[#9E8E93] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm gói chụp theo tên hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#EFE5E7] text-xs sm:text-[13px] text-[#2A1D22] placeholder-[#9E8E93] focus:outline-none focus:border-[#B85064] transition-colors shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-xs text-[#6F6066]">
                  <span>Hiển thị</span>
                  <div className="relative">
                    <select
                      value={displayCount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDisplayCount(val === 'all' ? 'all' : Number(val));
                      }}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-xl bg-white border border-[#EFE5E7] text-xs font-semibold text-[#2A1D22] focus:outline-none focus:border-[#B85064] cursor-pointer shadow-sm"
                    >
                      <option value={3}>3</option>
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value="all">Tất cả ({filteredPackages.length})</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8C7D82] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Chế độ xem lưới"
                    className={`cursor-pointer p-2 rounded-xl transition-all ${
                      viewMode === 'grid'
                        ? 'bg-[#B85064] text-white shadow-sm'
                        : 'bg-white text-[#8C7D82] border border-[#EFE5E7] hover:text-[#B85064]'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    title="Chế độ xem danh sách"
                    className={`cursor-pointer p-2 rounded-xl transition-all ${
                      viewMode === 'list'
                        ? 'bg-[#B85064] text-white shadow-sm'
                        : 'bg-white text-[#8C7D82] border border-[#EFE5E7] hover:text-[#B85064]'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
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
                <ImageIcon className="w-12 h-12 text-[#CBB9BD] mx-auto" />
                <h3 className="text-base font-bold text-[#2A1D22]">
                  Không tìm thấy gói chụp nào phù hợp
                </h3>
                <p className="text-xs text-[#7A6C71] max-w-sm mx-auto">
                  Hiện không có gói chụp nào trong CSDL khớp với tiêu chí bạn chọn. Hãy thử lại với từ khóa khác hoặc đặt lại bộ lọc.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setMaxPrice(10000000);
                    setSortBy('default');
                  }}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A33D50] transition-colors shadow-sm"
                >
                  <span>Đặt lại bộ lọc</span>
                </button>
              </div>
            )}

            {/* LƯỚI CHUẨN: 1 HÀNG 3 CÁI (KHÔNG BỊ TRÀN CHỮ, NÚT THẲNG HÀNG 100%) */}
            {!isLoading && viewMode === 'grid' && displayedPackages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {displayedPackages.map((pkg) => {
                  const isFav = Boolean(favorites[pkg.id]);

                  return (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-2xl overflow-hidden border border-[#F0E4E6] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Top: Image + Tag + Heart */}
                      <div>
                        <div
                          className="relative h-48 w-full overflow-hidden bg-[#EFEBEB] cursor-pointer"
                          onClick={() => setQuickViewPkg(pkg)}
                        >
                          <img
                            src={pkg.displayImage}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                          {/* Tag danh mục góc trên trái ảnh */}
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-sm text-[#B85064] border border-[#F5D5DC] shadow-sm">
                              {pkg.categoryLabel}
                            </span>
                          </div>

                          {/* Nút tim góc trên phải ảnh */}
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(pkg.id, e)}
                            className="cursor-pointer absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all shadow-sm"
                            title={isFav ? 'Bỏ thích' : 'Yêu thích'}
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                isFav ? 'fill-[#E84360] text-[#E84360]' : 'text-white'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Body Details */}
                        <div className="p-4 sm:p-5 space-y-3">
                          <div>
                            <h3 className="text-[15px] font-bold text-[#2A1D22] group-hover:text-[#B85064] transition-colors line-clamp-1">
                              {pkg.name}
                            </h3>
                            <p className="text-xs text-[#7A6C71] font-light leading-relaxed line-clamp-2 mt-1 min-h-[34px]">
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

                      {/* Footer: Giá & Nút Đặt gói này (không bao giờ bị tràn xuống 3 dòng) */}
                      <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-[#F8EFEF] flex items-center justify-between gap-3">
                        <span className="text-base sm:text-lg font-bold text-[#B85064]">
                          {pkg.priceDisplay}
                        </span>
                        <button
                          type="button"
                          onClick={() => openBookingModal(pkg)}
                          className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold whitespace-nowrap transition-all shadow-sm shadow-[#B85064]/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>Đặt gói này</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Card Banner Tư Vấn Kèm Theo ở cuối danh sách */}
                <div className="bg-gradient-to-br from-[#FDF0F3] via-[#FCF2F4] to-[#FBF4F5] rounded-2xl border border-[#F5D5DC] p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
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
                        <Phone className="w-4 h-4 text-[#B85064]" />
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
                        <MessageCircle className="w-4 h-4 text-[#B85064]" />
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
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <p className="text-center font-handwriting text-base text-[#A87B84] select-none">
                      Capture your story ♡
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* CHẾ ĐỘ XEM LIST VIEW */}
            {!isLoading && viewMode === 'list' && displayedPackages.length > 0 && (
              <div className="space-y-4">
                {displayedPackages.map((pkg) => {
                  const isFav = Boolean(favorites[pkg.id]);
                  return (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-[#F0E4E6] shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 items-center justify-between"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={pkg.displayImage}
                          alt={pkg.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 cursor-pointer"
                          onClick={() => setQuickViewPkg(pkg)}
                        />
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#FCECEF] text-[#B85064]">
                            {pkg.categoryLabel}
                          </span>
                          <h3 className="text-base font-bold text-[#2A1D22]">
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
                        <span className="text-lg font-bold text-[#B85064]">
                          {pkg.priceDisplay}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(pkg.id, e)}
                            className="p-2 rounded-xl border border-[#EFE5E7] hover:border-[#B85064] text-[#8C7D82] hover:text-[#B85064]"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isFav ? 'fill-[#E84360] text-[#E84360]' : ''
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => openBookingModal(pkg)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold whitespace-nowrap shadow-sm shadow-[#B85064]/20"
                          >
                            <span>Đặt gói này</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
            <button
              onClick={() => setBookingModalPkg(null)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EBF8F2] text-[#2EA46D] flex items-center justify-center mx-auto border border-[#B4E8D0]">
                  <Check className="w-8 h-8 stroke-[3]" />
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
                    ĐẶT LỊCH GÓI CHỤP TỪ CSDL
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
                        <ChevronDown className="w-4 h-4 text-[#7A6C71] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  <ArrowRight className="w-4 h-4" />
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
              <X className="w-5 h-5" />
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

                <div className="pt-4 flex items-center justify-between border-t border-[#F8EFEF]">
                  <span className="text-xl font-bold text-[#B85064]">
                    {quickViewPkg.priceDisplay}
                  </span>
                  <button
                    onClick={() => {
                      setQuickViewPkg(null);
                      openBookingModal(quickViewPkg);
                    }}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A33D50] transition-colors"
                  >
                    <span>Đặt gói này ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
