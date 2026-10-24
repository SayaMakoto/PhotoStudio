import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  CameraIcon,
} from '@heroicons/react/24/solid';
import ScrollReveal from '../../animations/ScrollReveal';
import userImageService from '../../../services/user/imageService';

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
          const spans = [
            'md:col-span-2 md:row-span-2',
            'md:col-span-1 md:row-span-1',
            'md:col-span-1 md:row-span-1',
            'md:col-span-1 md:row-span-2',
            'md:col-span-1 md:row-span-1',
            'md:col-span-2 md:row-span-1',
            'md:col-span-1 md:row-span-1',
          ];
          const mapped = data.map((img, idx) => ({
            id: img.id,
            category: (img.imageableType || 'portrait').toLowerCase(),
            title: img.title || `Tác Phẩm #${img.id}`,
            concept: img.description || 'Chụp ảnh nghệ thuật',
            src: img.imageUrl,
            span: spans[idx % spans.length],
          }));
          setPhotos(mapped);
        } else {
          setPhotos([]);
        }
      })
      .catch((err) => {
        console.warn('[Gallery] Lỗi tải ảnh:', err.message);
        setPhotos([]);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('[Gallery] Lỗi không xử lý:', err);
      });
  }, []);

  const filteredPhotos =
    activeFilter === 'all'
      ? photos
      : photos.filter((photo) => photo.category === activeFilter);

  const handleNext = () => {
    setSlideDirection(1);
    setSelectedIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    setSlideDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
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
    <section id="gallery" className="py-24 bg-neutral-950 border-t border-white/10 relative">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <ScrollReveal direction="down">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>KHO ẢNH TỪ HỆ THỐNG</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Bộ Sưu Tập Tác Phẩm
              </h2>
            </div>
            <p className="text-neutral-400 text-sm sm:text-base font-light max-w-md leading-relaxed">
              Các hình ảnh được lấy trực tiếp từ hệ thống quản lý ảnh của PhotoStudio.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 auto-rows-[240px]">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-3xl border border-white/10 bg-neutral-900/60 animate-pulse flex items-center justify-center"
              >
                <PhotoIcon className="w-10 h-10 text-white/10" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state when 0 images in DB */}
        {!isLoading && photos.length === 0 && (
          <ScrollReveal direction="up">
            <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-12 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                <PhotoIcon className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Kho ảnh đang được cập nhật từ hệ thống</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                Chưa có hình ảnh nào được lưu trữ trong danh mục này trên cơ sở dữ liệu. Mời bạn đặt lịch chụp để sở hữu bộ ảnh nghệ thuật đầu tiên!
              </p>
              <a
                href="#booking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-bold text-xs shadow-lg hover:scale-105 transition-all"
              >
                <span>Đặt Lịch Chụp Trực Tuyến</span>
              </a>
            </div>
          </ScrollReveal>
        )}

        {/* Filter Tabs when photos exist */}
        {!isLoading && photos.length > 0 && (
          <>
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

            {/* Dynamic Photo Grid */}
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
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                    <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-neutral-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40">
                          {photo.concept}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl group-hover:scale-110">
                          <ArrowsPointingOutIcon className="w-5 h-5 text-neutral-950" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
                        {photo.title}
                      </h3>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setSelectedIndex(null)}
          >
            <div
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedIndex(null)}
                className="cursor-pointer absolute top-4 right-4 z-50 p-2.5 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors border border-white/20"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <button
                onClick={handlePrev}
                className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors border border-white/20"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors border border-white/20"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
              />

              <div className="mt-4 text-center">
                <h4 className="text-xl font-bold text-white">{selectedPhoto.title}</h4>
                <p className="text-xs text-neutral-400 mt-1">{selectedPhoto.concept}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
