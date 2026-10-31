import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowsPointingOutIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  CameraIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../animations/ScrollReveal';
import Magnet from '../../animations/Magnet';
import ShinyText from '../../animations/ShinyText';
import { ROUTES } from '../../../routes/web';
import userImageService from '../../../services/user/imageService';

// Danh sách ảnh fallback phòng trường hợp đường dẫn ảnh trong CSDL bị lỗi hoặc 404
const CURATED_GALLERY_FALLBACKS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
];

// Danh sách tác phẩm khởi tạo mặc định phong phú cho cả 3 danh mục
const INITIAL_GALLERY_PHOTOS = [
  {
    id: 1,
    category: 'portrait',
    title: 'Nàng Thơ Trong Nắng',
    concept: 'Gói Chụp Cá Nhân Nàng Thơ Pastel Hàn Quốc',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 2,
    category: 'portrait',
    title: 'Góc Cận Cảnh Nghệ Thuật',
    concept: 'Layout makeup glow & Ánh sáng Beauty tự nhiên',
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 3,
    category: 'wedding',
    title: 'Hạnh Phúc Ngọt Ngào',
    concept: 'Gói Chụp Ảnh Cưới Studio Cung Điện Hoàng Gia',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 4,
    category: 'wedding',
    title: 'Khoảnh Khắc Hoàng Gia',
    concept: 'Tuxedo & Váy cưới ren thêu tay thủ công Pháp',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 5,
    category: 'family',
    title: 'Gia Đình Đoàn Viên',
    concept: 'Bối cảnh Sofa Vintage ấm cúng & Yêu thương',
    src: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 6,
    category: 'wedding',
    title: 'Cưới Luxury Hoàng Hôn',
    concept: 'Ánh sáng tự nhiên lãng mạn & Váy cưới bồng bềnh',
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 7,
    category: 'family',
    title: 'Kỷ Yếu Tốt Nghiệp Rực Rỡ',
    concept: 'Lưu giữ thanh xuân tuổi trẻ năng động cùng bạn bè',
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 8,
    category: 'portrait',
    title: 'Doanh Nhân Đẳng Cấp',
    concept: 'Profile phong thái lãnh đạo chuẩn tạp chí Forbes',
    src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 9,
    category: 'portrait',
    title: 'Nét Đẹp Á Đông Truyền Thống',
    concept: 'Tà áo dài tơ tằm thêu tay & Bối cảnh sen hồ phố cổ',
    src: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 10,
    category: 'portrait',
    title: 'Lookbook Thời Trang High-End',
    concept: 'BST thời trang cao cấp với ánh sáng studio hiện đại',
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
  },
];

/**
 * Nhận diện danh mục chính xác từ dữ liệu CSDL (tên, mô tả, concept, entity type)
 */
function detectPhotoCategory(img, index = 0) {
  // 1. Nếu backend gửi trực tiếp category hợp lệ
  const rawCat = (img.category || '').toLowerCase();
  if (['wedding', 'portrait', 'family'].includes(rawCat)) {
    return rawCat;
  }

  // 2. Phân tích ngữ nghĩa từ khóa trong mô tả và tiêu đề
  const text = `${img.title || ''} ${img.description || ''} ${img.concept || ''}`.toLowerCase();

  // Nhóm Cưới
  if (
    text.includes('cưới') ||
    text.includes('wedding') ||
    text.includes('cô dâu') ||
    text.includes('chú rể') ||
    text.includes('couple') ||
    text.includes('hôn lễ') ||
    text.includes('tuxedo') ||
    text.includes('váy cưới')
  ) {
    return 'wedding';
  }

  // Nhóm Gia Đình & Nhóm
  if (
    text.includes('gia đình') ||
    text.includes('family') ||
    text.includes('nhóm') ||
    text.includes('kỷ yếu') ||
    text.includes('đoàn viên') ||
    text.includes('bé') ||
    text.includes('baby') ||
    text.includes('thôi nôi') ||
    text.includes('bạn bè')
  ) {
    return 'family';
  }

  // Nhóm Nàng Thơ & Beauty
  if (
    text.includes('nàng thơ') ||
    text.includes('portrait') ||
    text.includes('cá nhân') ||
    text.includes('chân dung') ||
    text.includes('beauty') ||
    text.includes('áo dài') ||
    text.includes('doanh nhân') ||
    text.includes('lookbook') ||
    text.includes('profile') ||
    text.includes('makeup')
  ) {
    return 'portrait';
  }

  // 3. Fallback phân bổ đều để mọi tab đều có ảnh
  const rotation = ['portrait', 'wedding', 'family'];
  return rotation[index % rotation.length];
}

/**
 * Thuật toán tính toán kích thước ô Bento (Col/Row Spans) thông minh:
 * - Tái hiện phong cách Bento / Collage nghệ thuật với ô to ấn tượng (Hero 2x2), ô vừa, ô dài
 * - Đảm bảo 100% các hàng đều được lấp đầy khít, KHÔNG BAO GIỜ BỊ HỞ HOẶC THỪA KHOẢNG TRỐNG
 */
function getBentoSpans(total) {
  const result = [];
  let i = 0;
  while (i < total) {
    const rem = total - i;
    if (rem === 1) {
      // 1 ảnh còn lại: trải dài toàn màn hình (4 cột desktop, 2 cột tablet)
      result.push('col-span-1 sm:col-span-2 lg:col-span-4 row-span-1 sm:row-span-1 lg:row-span-1');
      i += 1;
    } else if (rem === 2) {
      // 2 ảnh còn lại: chia đôi hàng đồng đều (mỗi ảnh 2 cột desktop, 1 cột tablet)
      result.push('col-span-1 sm:col-span-1 lg:col-span-2 row-span-1 sm:row-span-1 lg:row-span-1');
      result.push('col-span-1 sm:col-span-1 lg:col-span-2 row-span-1 sm:row-span-1 lg:row-span-1');
      i += 2;
    } else if (rem === 3) {
      // 3 ảnh: trên desktop lg là 1 - 2 - 1 (tổng 4 cột khít hàng); trên tablet sm là 1 - 1 (hàng 1) và 2 (hàng 2)
      result.push('col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 sm:row-span-1 lg:row-span-1');
      result.push('col-span-1 sm:col-span-1 lg:col-span-2 row-span-1 sm:row-span-1 lg:row-span-1');
      result.push('col-span-1 sm:col-span-2 lg:col-span-1 row-span-1 sm:row-span-1 lg:row-span-1');
      i += 3;
    } else {
      // Cụm 4 ảnh tạo thành khối Bento 2 hàng x 4 cột hoàn hảo
      const blockIndex = Math.floor(i / 4);
      if (blockIndex % 2 === 0) {
        // Cụm A: Hero 2x2 bên trái + 2 ảnh 1x1 trên phải + 1 ảnh 2x1 dưới phải
        result.push('col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 sm:row-span-2 lg:row-span-2');
        result.push('col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 sm:row-span-1 lg:row-span-1');
        result.push('col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 sm:row-span-1 lg:row-span-1');
        result.push('col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 sm:row-span-1 lg:row-span-1');
      } else {
        // Cụm B: Ảnh dài 2x1 trên trái + Hero 2x2 bên phải + 2 ảnh 1x1 dưới trái
        result.push('col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 sm:row-span-1 lg:row-span-1');
        result.push('col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 sm:row-span-2 lg:row-span-2');
        result.push('col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 sm:row-span-1 lg:row-span-1');
        result.push('col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 sm:row-span-1 lg:row-span-1');
      }
      i += 4;
    }
  }
  return result;
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'Tất Cả Tác Phẩm' },
    { id: 'wedding', label: 'Ảnh Cưới Studio' },
    { id: 'portrait', label: 'Nàng Thơ & Beauty' },
    { id: 'family', label: 'Gia Đình & Nhóm' },
  ];

  useEffect(() => {
    void userImageService
      .getAllImages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((img, idx) => ({
            id: img.id,
            category: detectPhotoCategory(img, idx),
            title: img.title || (img.description ? img.description.split('–')[0].trim() : `Tác Phẩm #${img.id}`),
            concept: img.description || 'Chụp ảnh nghệ thuật',
            src: img.imageUrl || CURATED_GALLERY_FALLBACKS[idx % CURATED_GALLERY_FALLBACKS.length],
            fallbackSrc: CURATED_GALLERY_FALLBACKS[idx % CURATED_GALLERY_FALLBACKS.length],
          }));
          setPhotos(mapped);
        } else {
          setPhotos(INITIAL_GALLERY_PHOTOS);
        }
      })
      .catch((err) => {
        console.warn('[Gallery] Dùng ảnh bộ sưu tập mẫu:', err.message);
        setPhotos(INITIAL_GALLERY_PHOTOS);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredPhotos = useMemo(() => {
    return activeFilter === 'all'
      ? photos
      : photos.filter((photo) => photo.category === activeFilter);
  }, [activeFilter, photos]);

  // Giới hạn hiển thị đúng 12 hình trên trang chủ theo yêu cầu của người dùng
  const displayedPhotos = useMemo(() => {
    return filteredPhotos.slice(0, 12);
  }, [filteredPhotos]);

  const bentoSpans = useMemo(() => {
    return getBentoSpans(displayedPhotos.length);
  }, [displayedPhotos.length]);

  const handleNext = () => {
    setSlideDirection(1);
    setSelectedIndex((prev) => (prev + 1) % displayedPhotos.length);
  };

  const handlePrev = () => {
    setSlideDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + displayedPhotos.length) % displayedPhotos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSlideDirection(1);
        setSelectedIndex((prev) => (prev + 1) % displayedPhotos.length);
      }
      if (e.key === 'ArrowLeft') {
        setSlideDirection(-1);
        setSelectedIndex((prev) => (prev - 1 + displayedPhotos.length) % displayedPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, displayedPhotos.length]);

  const selectedPhoto = selectedIndex !== null ? displayedPhotos[selectedIndex] : null;

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.25, ease: 'easeIn' },
    }),
  };

  return (
    <section id="gallery" className="py-24 bg-[#FAF5F5] border-t border-[#F0E4E6] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-rose-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <ScrollReveal direction="down">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                <PhotoIcon className="w-4 h-4 text-neutral-800" />
                <ShinyText text="KHO ẢNH TỪ HỆ THỐNG" speed={3} className="text-[#B85064]" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight">
                Bộ Sưu Tập Tác Phẩm
              </h2>
            </div>
            <p className="text-[#7A6C71] text-sm sm:text-base font-light max-w-md leading-relaxed">
              Các hình ảnh được lấy trực tiếp từ hệ thống quản lý ảnh của PhotoStudio với bối cảnh bento nghệ thuật đỉnh cao.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[280px]">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-full h-full rounded-3xl bg-white border border-[#F0E4E6] animate-pulse flex flex-col items-center justify-center gap-3"
              >
                <PhotoIcon className="w-10 h-10 text-[#BE4B5E]/30 animate-pulse" />
                <span className="text-xs text-[#7A6C71] font-medium">Đang tải tác phẩm...</span>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs when photos exist */}
        {!isLoading && photos.length > 0 && (
          <>
            <ScrollReveal direction="up" delay={0.1}>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
                {categories.map((cat) => {
                  const count =
                    cat.id === 'all'
                      ? photos.length
                      : photos.filter((p) => p.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveFilter(cat.id);
                        setSelectedIndex(null);
                      }}
                      className={`cursor-pointer whitespace-nowrap px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                        activeFilter === cat.id
                          ? 'bg-[#B85064] text-white shadow-md shadow-[#B85064]/30 scale-105'
                          : 'bg-white text-[#55464B] hover:text-[#B85064] border border-[#F0E4E6] hover:border-[#B85064]/40 shadow-sm'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          activeFilter === cat.id
                            ? 'bg-white/20 text-white'
                            : 'bg-neutral-100 text-[#7A6C71]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* BỐ CỤC BENTO NGHỆ THUẬT ĐA DẠNG KÍCH THƯỚC - KHÔNG BAO GIỜ BỊ HỞ HAY TRỐNG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[250px] sm:auto-rows-[270px] lg:auto-rows-[290px] gap-4 sm:gap-5">
              {displayedPhotos.map((photo, index) => {
                const spanClass = bentoSpans[index] || 'col-span-1 sm:col-span-1 lg:col-span-1 row-span-1';

                return (
                  <ScrollReveal
                    key={photo.id}
                    direction="up"
                    delay={index * 0.05}
                    className={`h-full w-full ${spanClass}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.015, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      onClick={() => {
                        setSlideDirection(1);
                        setSelectedIndex(index);
                      }}
                      className="group relative h-full min-h-[250px] w-full overflow-hidden rounded-3xl border border-[#F0E4E6] bg-white cursor-pointer shadow-sm hover:border-[#BE4B5E]/60 hover:shadow-2xl hover:shadow-[#BE4B5E]/15 transition-all duration-300"
                    >
                      {/* Ảnh với fallback tự động */}
                      <img
                        src={photo.src}
                        alt={photo.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = photo.fallbackSrc;
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />

                      {/* Lớp phủ Gradient điện ảnh */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-40 group-hover:opacity-65 transition-opacity duration-300" />

                      {/* Nội dung thông tin trên thẻ ảnh */}
                      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#B85064]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
                            {photo.concept}
                          </span>
                          <div className="w-10 h-10 rounded-full bg-white text-[#B85064] group-hover:bg-[#B85064] group-hover:text-white flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl group-hover:scale-110">
                            <ArrowsPointingOutIcon className="w-5 h-5" />
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 drop-shadow-md font-serif-luxury line-clamp-2">
                          {photo.title}
                        </h3>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                );
              })}
            </div>
            {/* Nút Khám Phá Trang Bộ Sưu Tập 3D Hoàn Chỉnh */}
            <div className="mt-12 text-center">
              <Magnet padding={30} magnetStrength={3}>
                <Link
                  to={ROUTES.USER.GALLERY}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/20 hover:scale-105 transition-all"
                >
                  <PhotoIcon className="w-4 h-4 text-white" />
                  <span>Xem Thêm Tác Phẩm Khác Trong Bộ Sưu Tập ({photos.length}+ Tác Phẩm)</span>
                  <ChevronRightIcon className="w-4 h-4 text-white" />
                </Link>
              </Magnet>
            </div>
          </>
        )}

      </div>

      {/* Lightbox Modal Cao Cấp với Filmstrip và Chuyển Động Trượt */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6 select-none"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Top Bar with Close Button */}
            <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-30">
              <div className="text-white/70 text-xs font-medium tracking-wider">
                {selectedIndex + 1} / {filteredPhotos.length}
              </div>
              <button
                onClick={() => setSelectedIndex(null)}
                className="cursor-pointer p-2.5 rounded-full bg-neutral-900/80 text-white hover:bg-[#B85064] transition-all border border-white/20 shadow-lg"
                title="Đóng (Esc)"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Main Stage with Navigation Arrows */}
            <div
              className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-2 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="cursor-pointer absolute left-2 sm:left-6 z-30 p-3 sm:p-3.5 rounded-full bg-neutral-900/80 hover:bg-[#B85064] text-white border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-2xl"
                title="Ảnh trước (Mũi tên trái)"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="cursor-pointer absolute right-2 sm:right-6 z-30 p-3 sm:p-3.5 rounded-full bg-neutral-900/80 hover:bg-[#B85064] text-white border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-2xl"
                title="Ảnh tiếp theo (Mũi tên phải)"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              {/* Animated Main Image */}
              <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                <motion.div
                  key={selectedPhoto.id}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex items-center justify-center w-full h-full p-2 sm:p-4"
                >
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = selectedPhoto.fallbackSrc;
                    }}
                    className="max-h-[64vh] sm:max-h-[68vh] w-auto max-w-[92vw] sm:max-w-5xl object-contain rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Section: Filmstrip Thumbnails & Concept Action Bar */}
            <div
              className="w-full max-w-4xl mx-auto space-y-3 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Filmstrip Carousel Preview */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-1 no-scrollbar">
                {filteredPhotos.map((thumb, idx) => (
                  <button
                    key={thumb.id}
                    onClick={() => {
                      setSlideDirection(idx > selectedIndex ? 1 : -1);
                      setSelectedIndex(idx);
                    }}
                    className={`cursor-pointer relative h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                      idx === selectedIndex
                        ? 'border-[#B85064] scale-110 shadow-lg shadow-[#B85064]/30'
                        : 'border-white/20 opacity-40 hover:opacity-100 hover:border-[#B85064]/60'
                    }`}
                  >
                    <img
                      src={thumb.src}
                      alt={thumb.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = thumb.fallbackSrc;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Info & Booking Bar */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1 font-serif-luxury">
                    {selectedPhoto.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300">
                    <span className="text-[#E899A8] font-semibold">{selectedPhoto.concept}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <CameraIcon className="w-3.5 h-3.5 text-[#E899A8]" />
                      Studio 4K High-End
                    </span>
                  </div>
                </div>

                <a
                  href="#booking"
                  onClick={() => setSelectedIndex(null)}
                  className="cursor-pointer shrink-0 px-6 py-2.5 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white font-bold text-xs shadow-lg shadow-[#B85064]/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  <CalendarDaysIcon className="w-4 h-4 text-white" />
                  <span>Đặt Lịch Concept Này</span>
                </a>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
