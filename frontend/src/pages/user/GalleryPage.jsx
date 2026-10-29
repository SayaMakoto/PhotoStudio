import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowsPointingOutIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  CameraIcon,
  HeartIcon,
  EyeIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ShareIcon,
  CheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';

// React Bits Animations & Cards
import BlurText from '../../components/animations/BlurText';
import ShinyText from '../../components/animations/ShinyText';
import Magnet from '../../components/animations/Magnet';
import CountUp from '../../components/animations/CountUp';
import ScrollReveal from '../../components/animations/ScrollReveal';
import SpotlightCard from '../../components/cards/SpotlightCard';
import TiltedCard from '../../components/cards/TiltedCard';

import { FloralBranchCorner, ScatteredPetals } from '../../components/common/FloralDecorations';
import { ROUTES } from '../../routes/web';
import userImageService from '../../services/user/imageService';

const ITEMS_PER_PAGE = 20;

/**
 * Tự động phân loại danh mục dựa trên mô tả và mã gói trong CSDL
 */
function detectCategoryFromText(text = '', packageId = 0) {
  const t = text.toLowerCase();
  if (t.includes('cưới') || t.includes('wedding') || t.includes('cô dâu') || t.includes('chú rể') || t.includes('tuxedo') || t.includes('váy cưới')) {
    return 'wedding';
  }
  if (t.includes('cặp đôi') || t.includes('couple') || t.includes('tình yêu') || t.includes('hẹn hò')) {
    return 'couple';
  }
  if (t.includes('gia đình') || t.includes('family') || t.includes('kỷ yếu') || t.includes('bạn bè') || t.includes('tốt nghiệp') || t.includes('bé') || t.includes('nhóm')) {
    return 'family';
  }
  if (t.includes('doanh nhân') || t.includes('profile') || t.includes('lookbook') || t.includes('thời trang') || t.includes('lãnh đạo') || t.includes('forbes')) {
    return 'profile';
  }
  if (t.includes('nàng thơ') || t.includes('portrait') || t.includes('beauty') || t.includes('áo dài') || t.includes('cổ trang') || t.includes('chân dung')) {
    return 'portrait';
  }

  // Phân theo ID gói nếu mô tả ngắn
  const pkgMap = {
    1: 'portrait',
    2: 'wedding',
    3: 'family',
    4: 'wedding',
    5: 'family',
    6: 'profile',
    7: 'portrait',
    8: 'profile',
  };
  return pkgMap[packageId] || 'portrait';
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'likes'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);
  const galleryGridRef = useRef(null);

  const categories = [
    { id: 'all', label: 'Tất Cả Tác Phẩm' },
    { id: 'wedding', label: 'Ảnh Cưới Studio' },
    { id: 'couple', label: 'Cặp Đôi & Tình Yêu' },
    { id: 'portrait', label: 'Nàng Thơ & Beauty' },
    { id: 'profile', label: 'Doanh Nhân & Lookbook' },
    { id: 'family', label: 'Gia Đình & Kỷ Yếu' },
  ];

  const mapDbImages = (data) => {
    return data.map((img, idx) => {
      const desc = img.description || '';
      const cat = detectCategoryFromText(desc, img.imageableId);
      const title = desc
        ? desc.includes('–')
          ? desc.split('–')[0].trim()
          : desc.length > 38
          ? desc.substring(0, 38).trim() + '...'
          : desc
        : `Tác Phẩm #${img.id}`;

      const photographers = ['Tuấn Trần', 'Linh Đan', 'Hoàng Nam', 'Quang Huy'];
      const gears = [
        'Nikon Z9 • 85mm f/1.2 S',
        'Sony A7R V • 50mm f/1.2 GM',
        'Canon R5 • 28-70mm f/2L',
        'Fujifilm GFX 100S • 110mm f/2',
      ];
      const tones = [
        'Tone Ánh Sáng Studio Tự Nhiên',
        'Tone Trầm Ấm Quý Tộc',
        'Tone Trong Trẻo Hàn Quốc',
        'Tone Golden Hour Hoàng Hôn',
      ];

      return {
        id: img.id,
        isPrimary: Boolean(img.isPrimary),
        category: cat,
        title: title,
        concept: desc || 'Chụp ảnh nghệ thuật độc bản',
        photographer: photographers[idx % photographers.length],
        gear: gears[idx % gears.length],
        tone: tones[idx % tones.length],
        likes: 180 + (idx * 23) % 490,
        views: `${(5 + (idx * 1.2) % 15).toFixed(1)}K`,
        src: img.imageUrl,
      };
    });
  };

  const handleRetry = () => {
    setIsLoading(true);
    setErrorMessage(null);
    userImageService
      .getAllImages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(mapDbImages(data));
        } else {
          setPhotos([]);
        }
      })
      .catch((err) => {
        console.error('[GalleryPage] Lỗi lấy dữ liệu ảnh từ CSDL:', err.message);
        setErrorMessage('Không thể kết nối với máy chủ để lấy ảnh từ CSDL. Vui lòng kiểm tra lại dịch vụ backend.');
        setPhotos([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    userImageService
      .getAllImages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(mapDbImages(data));
        } else {
          setPhotos([]);
        }
      })
      .catch((err) => {
        console.error('[GalleryPage] Lỗi lấy dữ liệu ảnh từ CSDL:', err.message);
        setErrorMessage('Không thể kết nối với máy chủ để lấy ảnh từ CSDL. Vui lòng kiểm tra lại dịch vụ backend.');
        setPhotos([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Lọc, tìm kiếm & sắp xếp trực tiếp trên dữ liệu CSDL
  const filteredPhotos = useMemo(() => {
    let list = [...photos];

    if (activeFilter !== 'all') {
      list = list.filter((p) => p.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.concept.toLowerCase().includes(q) ||
          p.photographer.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'likes') {
      list.sort((a, b) => (b.likes + (likedPhotos[b.id] ? 1 : 0)) - (a.likes + (likedPhotos[a.id] ? 1 : 0)));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => b.id - a.id);
    }
    // 'popular' keeps default database order

    return list;
  }, [photos, activeFilter, searchQuery, sortBy, likedPhotos]);

  // Phân trang: 20 hình / trang
  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const displayedPhotos = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredPhotos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPhotos, safeCurrentPage]);

  // Danh sách Tiêu Điểm 3D (Lấy trực tiếp từ 3 ảnh đại diện CSDL)
  const primaries = photos.filter((p) => p.isPrimary);
  const masterpiecePhotos = primaries.length >= 3 ? primaries.slice(0, 3) : photos.slice(0, 3);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (galleryGridRef.current) {
      galleryGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleLike = (e, photoId) => {
    e.stopPropagation();
    setLikedPhotos((prev) => ({
      ...prev,
      [photoId]: !prev[photoId],
    }));
  };

  const handleNext = () => {
    setSlideDirection(1);
    setSelectedIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    setSlideDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSlideDirection(1);
        setSelectedIndex((prev) => (prev + 1) % filteredPhotos.length);
      }
      if (e.key === 'ArrowLeft') {
        setSlideDirection(-1);
        setSelectedIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredPhotos.length]);

  const selectedPhoto = selectedIndex !== null ? filteredPhotos[selectedIndex] : null;

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative overflow-hidden">
      {/* Cành hoa đào trang trí góc */}
      <FloralBranchCorner position="top-right" opacity="opacity-75" className="top-24 z-10" />
      <FloralBranchCorner position="bottom-left" opacity="opacity-60" className="bottom-96 z-10" />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Nền điện ảnh, Ánh sáng studio, React Bits Title & Badges */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[460px] lg:min-h-[500px] bg-[#141012] overflow-hidden flex items-center pt-28 pb-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75 scale-105 pointer-events-none transition-transform duration-1000"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=85)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/92 via-[#141012]/70 to-[#141012]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#141012] pointer-events-none" />

        <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-rose-500/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 mb-6">
            <Link to={ROUTES.USER.HOME} className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <span>/</span>
            <span className="text-[#E899A8] font-semibold">Bộ Sưu Tập Tác Phẩm</span>
          </div>

          <div className="max-w-3xl">
            {/* Shimmering Badge với React Bits ShinyText */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/15 border border-rose-500/30 text-[#E899A8] text-xs font-semibold uppercase tracking-wider mb-5 shadow-lg backdrop-blur-md">
              <PhotoIcon className="w-4 h-4 text-white" />
              <ShinyText text="DỮ LIỆU TÁC PHẨM TRỰC TIẾP TỪ HỆ THỐNG" speed={3.5} className="text-white" />
            </div>

            {/* Title với React Bits BlurText */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif-luxury tracking-tight leading-tight mb-5">
              <BlurText text="Bộ Sưu Tập Tuyệt Tác Ánh Sáng" delay={100} />
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-light">
              Mỗi bức hình là một tác phẩm nghệ thuật độc bản được quản lý tập trung từ cơ sở dữ liệu hệ thống PhotoStudio,
              kết hợp nghệ thuật phối sáng điện ảnh và cảm xúc thăng hoa của chính bạn.
            </p>

            {/* Quick Stats với React Bits CountUp */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury flex items-center">
                  <CountUp to={photos.length > 0 ? photos.length : 64} duration={2.0} />
                  <span className="text-[#E899A8]">+</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">Bức ảnh trong CSDL</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury flex items-center">
                  <CountUp to={8} duration={1.5} />
                  <span className="text-[#E899A8]">+</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">Gói chụp độc quyền</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury flex items-center">
                  <CountUp to={99} duration={1.8} />
                  <span className="text-[#E899A8]">.8%</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">Khách hàng hài lòng</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury flex items-center">
                  <CountUp to={12} duration={1.6} />
                  <span className="text-[#E899A8]">+</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MASTERPIECE SPOTLIGHT: 3D Perspective Tilt Cards (100% CSDL) */}
      {/* ========================================================================= */}
      {masterpiecePhotos.length > 0 && (
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#141012] via-[#1a1417] to-[#FAF5F5] relative text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal direction="down">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[#E899A8] text-xs font-semibold uppercase tracking-wider mb-3">
                    <CameraIcon className="w-3.5 h-3.5 text-white" />
                    <span>TIÊU ĐIỂM NGHỆ THUẬT 3D TỪ CSDL</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-luxury tracking-tight text-white">
                    Tuyển Tập Kiệt Tác 3D Tương Tác
                  </h2>
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm font-light max-w-md">
                  Rê chuột lên các bức ảnh để trải nghiệm hiệu ứng thị giác 3D với góc nghiêng đa chiều sống động.
                </p>
              </div>
            </ScrollReveal>

            {/* 3D Tilted Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {masterpiecePhotos.map((item, idx) => (
                <ScrollReveal key={item.id} direction="up" delay={idx * 0.1}>
                  <TiltedCard
                    imageSrc={item.src}
                    altText={item.title}
                    containerHeight="440px"
                    scaleOnHover={1.04}
                    rotateAmplitude={14}
                    captionText={`Tác phẩm tiêu biểu • ${item.photographer}`}
                    onClick={() => {
                      const foundIndex = filteredPhotos.findIndex((p) => p.id === item.id);
                      setSelectedIndex(foundIndex !== -1 ? foundIndex : idx);
                    }}
                    overlayContent={
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#B85064]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full">
                            <HeartIcon className="w-3.5 h-3.5 text-rose-400" />
                            <span>{item.likes}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white font-serif-luxury drop-shadow-md line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="text-xs text-neutral-300 flex items-center gap-2">
                          <CameraIcon className="w-3.5 h-3.5 text-[#E899A8]" />
                          <span>{item.gear}</span>
                        </p>
                      </div>
                    }
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN GALLERY: GRID ĐỒNG ĐỀU (KHÔNG HỞ ĐÁY, HÀNG TRÊN LẤP ĐẦY KHI LỌC) */}
      {/* ========================================================================= */}
      <section ref={galleryGridRef} className="py-20 bg-[#FAF5F5] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <ScrollReveal direction="down">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
                <PhotoIcon className="w-4 h-4 text-[#B85064]" />
                <span>KHO ẢNH TRỰC TUYẾN</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight mb-3">
                Khám Phá Theo Chủ Đề Yêu Thích
              </h2>
              <p className="text-[#7A6C71] text-sm">
                Toàn bộ hình ảnh được đồng bộ từ cơ sở dữ liệu hệ thống, sắp xếp theo hàng chuẩn đẹp không để lại khoảng trống.
              </p>
            </div>
          </ScrollReveal>

          {/* Filter Bar: Nút di chuyển độc lập, không dính chùm */}
          <div className="mb-10 space-y-5">
            {/* Category Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3">
              {categories.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? photos.length
                    : photos.filter((p) => p.category === cat.id).length;
                const isActive = activeFilter === cat.id;

                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => {
                      setActiveFilter(cat.id);
                      setCurrentPage(1);
                      setSelectedIndex(null);
                    }}
                    className={`cursor-pointer whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2 shadow-sm ${
                      isActive
                        ? 'bg-[#B85064] text-white shadow-md shadow-[#B85064]/30 ring-2 ring-[#B85064]/30'
                        : 'bg-white text-[#55464B] hover:text-[#B85064] border border-[#F0E4E6] hover:border-[#B85064]/50 hover:bg-[#FFF9FA]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-neutral-100 text-[#7A6C71]'
                      }`}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Search Input & Sort Options Bar - KÉO DÀI LIỀN MẠCH, KHÔNG BỊ TRỐNG KHOẢNG GIỮA */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#F0E4E6] shadow-sm max-w-5xl mx-auto">
              {/* Search input: flex-1 để lấp đầy toàn bộ khoảng trống một cách cân đối */}
              <div className="relative flex-1 w-full">
                <MagnifyingGlassIcon className="w-4 h-4 text-[#9E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tác phẩm, concept, nhiếp ảnh gia..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl border border-[#F0E4E6] focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]/60 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sắp xếp: Nằm liền kề cạnh thanh tìm kiếm gọn gàng */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0 w-full sm:w-auto justify-end">
                <span className="text-[#9E8E93] flex items-center gap-1 font-medium hidden md:flex">
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                  Sắp xếp:
                </span>
                <button
                  onClick={() => {
                    setSortBy('popular');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    sortBy === 'popular'
                      ? 'bg-[#B85064] text-white shadow-sm'
                      : 'bg-[#FAF5F5] text-[#55464B] hover:text-[#B85064]'
                  }`}
                >
                  Nổi bật
                </button>
                <button
                  onClick={() => {
                    setSortBy('likes');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    sortBy === 'likes'
                      ? 'bg-[#B85064] text-white shadow-sm'
                      : 'bg-[#FAF5F5] text-[#55464B] hover:text-[#B85064]'
                  }`}
                >
                  Yêu thích nhất
                </button>
                <button
                  onClick={() => {
                    setSortBy('newest');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    sortBy === 'newest'
                      ? 'bg-[#B85064] text-white shadow-sm'
                      : 'bg-[#FAF5F5] text-[#55464B] hover:text-[#B85064]'
                  }`}
                >
                  Mới nhất
                </button>
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-3xl bg-white border border-[#F0E4E6] animate-pulse flex flex-col items-center justify-center gap-3"
                >
                  <PhotoIcon className="w-10 h-10 text-[#BE4B5E]/30 animate-pulse" />
                  <span className="text-xs text-[#7A6C71] font-medium">Đang tải ảnh từ CSDL...</span>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && errorMessage && (
            <div className="text-center py-16 bg-white rounded-3xl border border-red-200 p-8 max-w-lg mx-auto shadow-sm">
              <XMarkIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#2A1D22] mb-2">Chưa thể tải dữ liệu ảnh</h3>
              <p className="text-xs text-[#7A6C71] mb-5 leading-relaxed">{errorMessage}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 rounded-full bg-[#B85064] text-white text-xs font-bold hover:bg-[#A8394C] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span>Thử tải lại</span>
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !errorMessage && filteredPhotos.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#F0E4E6] p-8 max-w-md mx-auto shadow-sm">
              <PhotoIcon className="w-12 h-12 text-[#B85064]/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#2A1D22] mb-1">Không tìm thấy tác phẩm phù hợp</h3>
              <p className="text-xs text-[#7A6C71] mb-4">Hãy thử tìm với từ khóa khác hoặc chọn xem tất cả tác phẩm.</p>
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="px-5 py-2 rounded-full bg-[#B85064] text-white text-xs font-bold hover:bg-[#A8394C] transition-colors cursor-pointer"
              >
                Xem tất cả tác phẩm
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LƯỚI ẢNH ĐỒNG ĐỀU (GRID): HÀNG TRÊN LẤP ĐẦY, ĐÁY KHỚP 100% VỚI PHÂN TRANG */}
          {/* ========================================================================= */}
          {!isLoading && !errorMessage && displayedPhotos.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedPhotos.map((photo, index) => {
                  const isLiked = likedPhotos[photo.id];
                  const totalLikes = photo.likes + (isLiked ? 1 : 0);
                  const globalIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE + index;

                  return (
                    <SpotlightCard
                      key={photo.id}
                      spotlightColor="rgba(184, 80, 100, 0.22)"
                      className="group p-0 overflow-hidden rounded-3xl border border-[#F0E4E6] bg-white hover:border-[#BE4B5E]/60 shadow-sm hover:shadow-2xl hover:shadow-[#BE4B5E]/20 transition-all duration-300 flex flex-col cursor-pointer"
                      onClick={() => {
                        setSlideDirection(1);
                        setSelectedIndex(globalIndex);
                      }}
                    >
                      {/* Image container: Chiều cao đồng đều chuẩn portrait 3:4 */}
                      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-neutral-900">
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                          loading="lazy"
                        />

                        {/* Top floating actions */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-auto">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                            {photo.category}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => toggleLike(e, photo.id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-md cursor-pointer ${
                                isLiked
                                  ? 'bg-rose-500 text-white scale-110'
                                  : 'bg-black/50 text-white hover:bg-white hover:text-rose-500'
                              }`}
                              title={isLiked ? 'Đã yêu thích' : 'Yêu thích tác phẩm'}
                            >
                              {isLiked ? (
                                <HeartIcon className="w-3.5 h-3.5" />
                              ) : (
                                <HeartOutlineIcon className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <div className="w-8 h-8 rounded-full bg-black/50 text-white group-hover:bg-[#B85064] flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-md">
                              <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Bottom Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                        {/* Concept & Title on Image */}
                        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 pointer-events-none">
                          <p className="text-[11px] font-medium text-[#E899A8] line-clamp-1 mb-0.5 drop-shadow-sm">
                            {photo.concept}
                          </p>
                          <h3 className="text-base font-bold text-white font-serif-luxury line-clamp-1 drop-shadow-md">
                            {photo.title}
                          </h3>
                        </div>
                      </div>

                      {/* Card meta footer */}
                      <div className="p-3.5 bg-white flex items-center justify-between text-xs text-[#7A6C71] border-t border-[#F0E4E6] mt-auto">
                        <div className="flex items-center gap-1.5 font-medium">
                          <CameraIcon className="w-3.5 h-3.5 text-[#B85064]" />
                          <span className="truncate max-w-[110px]">{photo.photographer}</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center gap-1">
                            <HeartIcon className="w-3 h-3 text-rose-500" />
                            {totalLikes}
                          </span>
                          <span className="flex items-center gap-1">
                            <EyeIcon className="w-3 h-3 text-neutral-400" />
                            {photo.views}
                          </span>
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>

              {/* ========================================================================= */}
              {/* PHÂN TRANG (PAGINATION): 20 hình/trang, đáy phẳng khít không hở khoảng trống */}
              {/* ========================================================================= */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#F0E4E6] shadow-sm">
                  {/* Status indicator */}
                  <div className="text-xs text-[#7A6C71] text-center sm:text-left">
                    Đang hiển thị{' '}
                    <span className="font-bold text-[#2A1D22]">
                      {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                      {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredPhotos.length)}
                    </span>{' '}
                    trên tổng số <span className="font-bold text-[#B85064]">{filteredPhotos.length}</span> tác phẩm CSDL
                    (Trang {safeCurrentPage} / {totalPages})
                  </div>

                  {/* Page selector buttons */}
                  <div className="flex items-center gap-2">
                    {/* Previous page */}
                    <button
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                      disabled={safeCurrentPage === 1}
                      className="w-10 h-10 rounded-xl border border-[#F0E4E6] bg-white flex items-center justify-center text-[#55464B] hover:text-[#B85064] hover:border-[#B85064] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer"
                      aria-label="Trang trước"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>

                    {/* Numeric page pills */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                          safeCurrentPage === pageNum
                            ? 'bg-[#B85064] text-white shadow-md shadow-[#B85064]/30 scale-105'
                            : 'bg-white border border-[#F0E4E6] text-[#55464B] hover:text-[#B85064] hover:border-[#B85064] hover:bg-[#FFF9FA]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next page */}
                    <button
                      onClick={() => handlePageChange(safeCurrentPage + 1)}
                      disabled={safeCurrentPage === totalPages}
                      className="w-10 h-10 rounded-xl border border-[#F0E4E6] bg-white flex items-center justify-center text-[#55464B] hover:text-[#B85064] hover:border-[#B85064] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer"
                      aria-label="Trang kế tiếp"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* CTA Banner at bottom - Nút độc lập không dính chùm */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1C1619] via-[#2A1D22] to-[#141012] text-white border border-rose-500/25 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-[#E899A8] text-xs font-semibold uppercase">
                  <CameraIcon className="w-3.5 h-3.5 text-white" />
                  <span>SẴN SÀNG LƯU GIỮ THANH XUÂN?</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury leading-tight">
                  Bạn Muốn Sở Hữu Bộ Ảnh Mang Đậm Cá Tính Riêng?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  Đội ngũ nhiếp ảnh gia và stylist chuyên nghiệp của PhotoStudio sẽ đồng hành cùng bạn từ khâu lên ý tưởng
                  concept, trang phục đến hoàn thiện album nghệ thuật.
                </p>
              </div>

              {/* Action Buttons độc lập */}
              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Link
                    to={ROUTES.USER.PACKAGES}
                    className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-rose-950/50 block text-center transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>Đặt Lịch Chụp Ngay</span>
                    </span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Link
                    to={ROUTES.USER.PACKAGES}
                    className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 block text-center transition-all"
                  >
                    <span>Xem Bảng Giá Gói Chụp</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FULLSCREEN CINEMATIC LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl p-3 sm:p-6 select-none"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Top Bar with Controls */}
            <div
              className="w-full max-w-7xl mx-auto flex items-center justify-between z-30 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-white/80 text-xs font-semibold tracking-wider bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                  {selectedIndex + 1} / {filteredPhotos.length}
                </span>
                <span className="text-[#E899A8] text-xs font-bold uppercase tracking-wider hidden sm:inline">
                  {selectedPhoto.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <ShareIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Chia sẻ</span>
                    </>
                  )}
                </button>

                {/* Close Button with Magnet */}
                <Magnet padding={15} magnetStrength={3}>
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-rose-500 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg"
                    aria-label="Đóng"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </Magnet>
              </div>
            </div>

            {/* Main Stage: Photo & Side Info */}
            <div
              className="relative flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 max-w-7xl mx-auto w-full my-auto overflow-hidden py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button with Magnet */}
              <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30">
                <Magnet padding={20} magnetStrength={2.5}>
                  <button
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-full bg-black/60 hover:bg-[#B85064] text-white border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md hover:scale-110"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                </Magnet>
              </div>

              {/* Main Photo with Slide Animation */}
              <div className="relative flex-1 h-[55vh] sm:h-[65vh] lg:h-[72vh] w-full flex items-center justify-center overflow-hidden">
                <AnimatePresence custom={slideDirection} mode="wait">
                  <motion.div
                    key={selectedPhoto.id}
                    custom={slideDirection}
                    initial={{
                      x: slideDirection > 0 ? 60 : -60,
                      opacity: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.3, ease: 'easeOut' },
                    }}
                    exit={{
                      x: slideDirection > 0 ? -60 : 60,
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.25, ease: 'easeIn' },
                    }}
                    className="relative max-h-full max-w-full flex items-center justify-center"
                  >
                    <img
                      src={selectedPhoto.src}
                      alt={selectedPhoto.title}
                      className="max-h-[55vh] sm:max-h-[65vh] lg:max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button with Magnet */}
              <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30">
                <Magnet padding={20} magnetStrength={2.5}>
                  <button
                    onClick={handleNext}
                    className="w-12 h-12 rounded-full bg-black/60 hover:bg-[#B85064] text-white border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md hover:scale-110"
                    aria-label="Ảnh kế tiếp"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </Magnet>
              </div>

              {/* Sidebar Info Panel */}
              <div className="w-full lg:w-80 p-5 rounded-2xl bg-neutral-900/90 border border-white/10 backdrop-blur-xl text-white space-y-4 shrink-0 shadow-2xl">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E899A8] bg-rose-500/20 px-2.5 py-1 rounded-full border border-rose-500/30">
                    {selectedPhoto.category}
                  </span>
                  <h3 className="text-lg font-bold font-serif-luxury text-white pt-2">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    {selectedPhoto.concept}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-neutral-300">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Nhiếp ảnh:</span>
                    <span className="font-semibold text-white">{selectedPhoto.photographer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Thiết bị:</span>
                    <span className="font-medium text-neutral-200">{selectedPhoto.gear}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Layout ánh sáng:</span>
                    <span className="font-medium text-neutral-200">{selectedPhoto.tone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Lượt yêu thích:</span>
                    <span className="font-semibold text-rose-400 flex items-center gap-1">
                      <HeartIcon className="w-3.5 h-3.5" />
                      {selectedPhoto.likes + (likedPhotos[selectedPhoto.id] ? 1 : 0)}
                    </span>
                  </div>
                </div>

                {/* Direct CTA */}
                <div className="pt-2">
                  <Link
                    to={ROUTES.USER.PACKAGES}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold text-center block shadow-lg hover:brightness-110 transition-all"
                  >
                    Đặt Lịch Chụp Concept Này
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Filmstrip Carousel */}
            <div
              className="w-full max-w-4xl mx-auto flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar z-30"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredPhotos.slice(0, 30).map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => {
                    setSlideDirection(idx > selectedIndex ? 1 : -1);
                    setSelectedIndex(idx);
                  }}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedIndex === idx
                      ? 'border-[#B85064] scale-110 shadow-lg shadow-rose-500/40 ring-2 ring-white/50'
                      : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/50'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cánh hoa đào bay phất phơ */}
      <ScatteredPetals className="z-10 pointer-events-none" />
    </div>
  );
}
