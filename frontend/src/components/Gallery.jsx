import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SparklesIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  CameraIcon,
  PaintBrushIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  FilmIcon
} from '@heroicons/react/24/solid';
import ScrollReveal from './reactbits/ScrollReveal';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = next, -1 = prev

  const categories = [
    { id: 'all', label: 'Tất Cả Tác Phẩm' },
    { id: 'wedding', label: 'Ảnh Cưới Studio' },
    { id: 'portrait', label: 'Nàng Thơ & Beauty' },
    { id: 'vintage', label: 'Cổ Điển & Hoàng Gia' },
    { id: 'family', label: 'Gia Đình & Nhóm' },
  ];

  const photos = [
    {
      id: 1,
      category: 'wedding',
      title: 'Hạnh Phúc Ngọt Ngào',
      concept: 'Concept Studio B - Phong cách Hàn Quốc',
      gear: 'Sony A7 IV + FE 50mm F1.2 GM',
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
      span: 'md:col-span-2 md:row-span-2',
    },
    {
      id: 2,
      category: 'portrait',
      title: 'Nàng Thơ Trong Nắng',
      concept: 'Tone Pastel & Ánh sáng tự nhiên',
      gear: 'Canon EOS R5 + 85mm F1.4',
      src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 3,
      category: 'vintage',
      title: 'Dấu Ấn Hoàng Gia',
      concept: 'Cung điện & Váy ren thêu tay thủ công',
      gear: 'Sony A7 IV + 24-70mm GM II',
      src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 4,
      category: 'wedding',
      title: 'Tuxedo & Áo Cưới Ren Pháp',
      concept: 'Phòng Studio VIP Cinema',
      gear: 'Canon EOS R5 + 70-200mm F2.8',
      src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
      span: 'md:col-span-1 md:row-span-2',
    },
    {
      id: 5,
      category: 'portrait',
      title: 'Beauty & Makeup Glow',
      concept: 'Trang điểm layout tone cam đào',
      gear: 'Sony A7 IV + Macro 90mm GM',
      src: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=85',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 6,
      category: 'family',
      title: 'Gia Đình Ấm Áp',
      concept: 'Bối cảnh Sofa Vintage cổ điển',
      gear: 'Sony A7 IV + FE 35mm F1.4',
      src: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1600&q=85',
      span: 'md:col-span-2 md:row-span-1',
    },
    {
      id: 7,
      category: 'vintage',
      title: 'Phố Cổ Hoài Niệm',
      concept: 'Ánh sáng vàng ấm & Phụ kiện Beret',
      gear: 'Sony A7 IV + 50mm GM',
      src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=85',
      span: 'md:col-span-1 md:row-span-1',
    },
  ];

  const filteredPhotos =
    activeFilter === 'all'
      ? photos
      : photos.filter((photo) => photo.category === activeFilter);

  // Next / Prev actions with direction tracking for carousel motion
  const handleNext = () => {
    setSlideDirection(1);
    setSelectedIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    setSlideDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  // Keyboard navigation for Lightbox
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

  // 3D Rotational & Slide Variants for cinematic image transitions
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 320 : -320,
      opacity: 0,
      scale: 0.85,
      rotateY: direction > 0 ? 20 : -20,
      filter: 'blur(8px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 28 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.4 },
        rotateY: { duration: 0.4 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -320 : 320,
      opacity: 0,
      scale: 0.85,
      rotateY: direction > 0 ? -20 : 20,
      filter: 'blur(8px)',
      transition: {
        duration: 0.35,
      },
    }),
  };

  return (
    <section id="gallery" className="py-24 bg-neutral-950 border-t border-white/10 relative">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with ScrollReveal */}
        <ScrollReveal direction="down">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Bộ Sưu Tập Nghệ Thuật</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Những Khung Hình Truyền Cảm Hứng
              </h2>
            </div>
            <p className="text-neutral-400 text-sm sm:text-base font-light max-w-md leading-relaxed">
              Mỗi tác phẩm là sự kết hợp tinh tế giữa cảm xúc chân thực của khách hàng và kỹ thuật ánh sáng độc bản từ PhotoStudio.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFilter(cat.id);
                  setSelectedIndex(null);
                }}
                className={`cursor-pointer whitespace-nowrap px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  activeFilter === cat.id
                    ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/30 scale-105'
                    : 'bg-neutral-900/80 text-neutral-300 hover:text-white border border-white/10 hover:border-amber-400/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Dynamic Photo Grid with Interactive Click & Hover Dynamics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 auto-rows-[280px]">
          {filteredPhotos.map((photo, index) => (
            <ScrollReveal
              key={photo.id}
              direction="up"
              delay={index * 0.08}
              className={`h-full ${photo.span}`}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() => {
                  setSlideDirection(1);
                  setSelectedIndex(index);
                }}
                className="group relative h-full w-full overflow-hidden rounded-3xl border border-white/15 bg-neutral-900 cursor-pointer shadow-xl hover:border-amber-400/70 hover:shadow-2xl hover:shadow-amber-500/20"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-105"
                  loading="lazy"
                />

                {/* Subtle sheen highlight on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-white/0 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Gradient Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Hover Details */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-neutral-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40">
                      {photo.concept}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl group-hover:scale-110">
                      <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
                    {photo.title}
                  </h3>
                  
                  <p className="text-xs text-neutral-300 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    <CameraIcon className="w-4 h-4 text-amber-400" />
                    <span>{photo.gear}</span>
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

      </div>

      {/* FULL-SCREEN IMMERSIVE LIGHTBOX WITH 3D FILM SLIDE TRANSITIONS & FILMSTRIP */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col justify-between p-4 sm:p-6 select-none"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Top Bar with distinct, non-overlapping Close Button */}
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-30 pb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                  <FilmIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tác phẩm {selectedIndex + 1} / {filteredPhotos.length}</span>
                </span>
                <span className="text-sm font-semibold text-neutral-300 hidden sm:inline">
                  {selectedPhoto.title}
                </span>
              </div>

              {/* SEPARATE CLOSE BUTTON - NEVER OVERLAYS ANY TEXT */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(null);
                }}
                className="cursor-pointer w-12 h-12 rounded-full bg-neutral-900 border border-white/20 text-white hover:bg-amber-500 hover:text-white transition-all duration-200 flex items-center justify-center shadow-2xl hover:scale-110"
                title="Đóng (Esc)"
                aria-label="Đóng xem chi tiết"
              >
                <XMarkIcon className="w-7 h-7 text-white" />
              </button>
            </div>

            {/* Central Stage: Animated 3D Perspective Film Slide */}
            <div
              className="relative flex-1 flex items-center justify-center overflow-hidden my-auto w-full max-w-7xl mx-auto [perspective:1200px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Photo Arrow */}
              <button
                onClick={handlePrev}
                className="cursor-pointer absolute left-2 sm:left-6 z-30 w-13 h-13 rounded-full bg-neutral-900/90 hover:bg-amber-500 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-2xl"
                title="Ảnh trước (Mũi tên trái)"
              >
                <ChevronLeftIcon className="w-7 h-7 text-amber-300 hover:text-white" />
              </button>

              {/* Next Photo Arrow */}
              <button
                onClick={handleNext}
                className="cursor-pointer absolute right-2 sm:right-6 z-30 w-13 h-13 rounded-full bg-neutral-900/90 hover:bg-amber-500 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-2xl"
                title="Ảnh tiếp theo (Mũi tên phải)"
              >
                <ChevronRightIcon className="w-7 h-7 text-amber-300 hover:text-white" />
              </button>

              {/* Main Image with 3D Carousel Swapping Motion */}
              <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                <motion.div
                  key={selectedPhoto.id}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex items-center justify-center w-full h-full p-2 sm:p-6"
                >
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    className="max-h-[68vh] sm:max-h-[74vh] w-auto max-w-[90vw] sm:max-w-5xl object-contain rounded-3xl shadow-2xl border border-white/15 drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] select-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Section: Filmstrip Carousel Preview (Shows Previous & Next Thumbnails) */}
            <div
              className="w-full max-w-4xl mx-auto space-y-3 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Filmstrip Thumbnails Row */}
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
                        ? 'border-amber-400 scale-110 shadow-lg shadow-amber-400/30'
                        : 'border-white/15 opacity-40 hover:opacity-100 hover:border-amber-400/50'
                    }`}
                  >
                    <img src={thumb.src} alt={thumb.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Info Glass Bar */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {selectedPhoto.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300">
                    <span className="text-amber-400 font-semibold">{selectedPhoto.concept}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="flex items-center gap-1.5">
                      <CameraIcon className="w-4 h-4 text-amber-400" />
                      {selectedPhoto.gear}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="flex items-center gap-1.5">
                      <PaintBrushIcon className="w-4 h-4 text-amber-400" />
                      Màu phim nghệ thuật
                    </span>
                  </div>
                </div>

                <a
                  href="#booking"
                  onClick={() => setSelectedIndex(null)}
                  className="cursor-pointer shrink-0 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
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
