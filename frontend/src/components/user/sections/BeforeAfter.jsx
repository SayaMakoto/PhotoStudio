import { useState, useRef, useCallback, useEffect } from 'react';
import { SparklesIcon, AdjustmentsHorizontalIcon, PhotoIcon } from '@heroicons/react/24/solid';
import ScrollReveal from '../../animations/ScrollReveal';
import userImageService from '../../../services/user/imageService';

export default function BeforeAfterComparison() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const [images, setImages] = useState({
    after: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=70',
  });

  useEffect(() => {
    void userImageService
      .getAllImages()
      .then((data) => {
        if (Array.isArray(data) && data.length >= 2) {
          setImages({
            after: data[0].imageUrl,
            before: data[1].imageUrl,
          });
        }
      })
      .catch((err) => {
        console.warn('[BeforeAfter] Lỗi tải ảnh:', err);
      });
  }, []);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section className="py-24 bg-neutral-950 border-t border-white/10 relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Chất Lượng Hậu Kỳ Nghệ Thuật</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Kỹ Thuật Retouch Độc Bản
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed">
              Kéo thanh trượt để so sánh sự khác biệt giữa bức ảnh gốc sắc nét và tác phẩm sau khi được cân chỉnh màu sắc & xử lý da chuyên sâu theo chuẩn tạp chí.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Before / After Comparison Slider */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="max-w-4xl mx-auto">
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative h-[380px] sm:h-[520px] rounded-3xl overflow-hidden border border-white/20 select-none shadow-2xl shadow-amber-500/10 cursor-ew-resize bg-neutral-900"
            >
              {/* After Image */}
              <img
                src={images.after}
                alt="Retouched Masterpiece"
                className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08] saturate-[1.15]"
                draggable={false}
              />

              {/* After Label */}
              <div className="absolute top-5 right-5 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 text-neutral-950 font-extrabold text-xs tracking-wider uppercase shadow-xl">
                  <SparklesIcon className="w-3.5 h-3.5 text-white" />
                  <span>Ảnh Retouch Nghệ Thuật</span>
                </span>
              </div>

              {/* Before Image */}
              <img
                src={images.before}
                alt="Raw Camera Shot"
                className="absolute inset-0 w-full h-full object-cover filter grayscale-[25%] brightness-[0.92] contrast-[0.95]"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
                draggable={false}
              />

              {/* Before Label */}
              <div className="absolute top-5 left-5 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-950/85 backdrop-blur-md border border-white/20 text-neutral-300 font-bold text-xs tracking-wider uppercase shadow-xl">
                  <PhotoIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>File Gốc Máy Ảnh (Raw)</span>
                </span>
              </div>

              {/* The Draggable Divider Line & Handle */}
              <div
                className="absolute top-0 bottom-0 z-30 pointer-events-none flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-0.5 h-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-white shadow-2xl flex items-center justify-center transform -translate-x-1/2 pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                  <AdjustmentsHorizontalIcon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-neutral-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[11px] text-neutral-300 font-medium">
                👈 Kéo sang hai bên để so sánh chi tiết 👉
              </div>
            </div>

            {/* Feature Checklist Below Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 text-center">
                <h4 className="text-amber-400 font-bold text-sm mb-1">Giữ Vân Da Tự Nhiên</h4>
                <p className="text-xs text-neutral-400">Không bị bệt, làm mịn bằng kỹ thuật Frequency Separation cao cấp</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 text-center">
                <h4 className="text-amber-400 font-bold text-sm mb-1">Cân Chỉnh Màu Điện Ảnh</h4>
                <p className="text-xs text-neutral-400">Tone màu ấm áp, trong trẻo, sang trọng và chuẩn xu hướng</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 text-center">
                <h4 className="text-amber-400 font-bold text-sm mb-1">Tôn Dáng Tinh Tế</h4>
                <p className="text-xs text-neutral-400">Chỉnh dáng thon gọn mềm mại, giữ trọn nét riêng của từng người</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
