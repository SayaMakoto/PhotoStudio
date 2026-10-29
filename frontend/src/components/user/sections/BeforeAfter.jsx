import { useState, useRef, useCallback, useEffect } from 'react';
import { CalendarDaysIcon, AdjustmentsHorizontalIcon, PhotoIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import ScrollReveal from '../../animations/ScrollReveal';
import userImageService from '../../../services/user/imageService';

// Danh sách các bức ảnh so sánh Before - After chuẩn studio
const DEMO_CONCEPTS = [
  {
    id: 'portrait',
    title: 'Chân Dung Nàng Thơ',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'wedding',
    title: 'Cô Dâu Ngày Cưới',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'beauty',
    title: 'Beauty & Makeup Glow',
    src: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=85',
  },
];

export default function BeforeAfterComparison() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [conceptList, setConceptList] = useState(DEMO_CONCEPTS);
  const containerRef = useRef(null);

  // Lấy ảnh chân dung chất lượng cao từ CSDL nếu có
  useEffect(() => {
    void userImageService
      .getAllImages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Lọc ra các ảnh đại diện chất lượng cao
          const studioImages = data
            .filter((img) => img.imageUrl)
            .slice(0, 3)
            .map((img, idx) => ({
              id: `db-${img.id || idx}`,
              title: img.title || (idx === 0 ? 'Chân Dung Nàng Thơ' : idx === 1 ? 'Ảnh Cưới Studio' : 'Nghệ Thuật Ánh Sáng'),
              src: img.imageUrl,
            }));

          if (studioImages.length > 0) {
            setConceptList(studioImages);
          }
        }
      })
      .catch((err) => {
        console.warn('[BeforeAfter] Dùng ảnh so sánh chất lượng cao mặc định:', err.message);
      });
  }, []);

  const currentConcept = conceptList[activeConceptIndex] || DEMO_CONCEPTS[0];

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
    <section className="py-24 bg-[#FAF5F5] border-t border-[#F0E4E6] relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-rose-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <AdjustmentsHorizontalIcon className="w-4 h-4 text-neutral-800" />
              <span>Chất Lượng Hậu Kỳ Nghệ Thuật</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight mb-4">
              Kỹ Thuật Retouch Độc Bản
            </h2>
            <p className="text-[#7A6C71] text-base sm:text-lg font-light leading-relaxed">
              Kéo thanh trượt để so sánh sự khác biệt kỳ diệu trên cùng một bức ảnh: từ file mộc máy ảnh (RAW) đến tác phẩm sau khi được cân chỉnh màu sắc & xử lý da chuyên sâu theo chuẩn tạp chí.
            </p>

            {/* Concept Selector Pills */}
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              {conceptList.map((concept, idx) => (
                <button
                  key={concept.id}
                  onClick={() => {
                    setActiveConceptIndex(idx);
                    setSliderPosition(50);
                  }}
                  className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                    activeConceptIndex === idx
                      ? 'bg-[#B85064] text-white shadow-md shadow-[#B85064]/25 scale-105'
                      : 'bg-white text-[#7A6C71] hover:text-[#B85064] border border-[#F0E4E6] hover:border-[#B85064]/40 shadow-sm'
                  }`}
                >
                  {activeConceptIndex === idx && <CheckBadgeIcon className="w-3.5 h-3.5" />}
                  <span>{concept.title}</span>
                </button>
              ))}
            </div>
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
              className="relative h-[380px] sm:h-[520px] rounded-3xl overflow-hidden border border-[#F0E4E6] select-none shadow-2xl shadow-[#B85064]/10 cursor-ew-resize bg-white"
            >
              {/* NỬA PHẢI: ẢNH ĐÃ RETOUCH NGHỆ THUẬT (Màu sắc trong trẻo, da mịn, khối 3D rực rỡ) */}
              <img
                src={currentConcept.src}
                alt={`${currentConcept.title} - Retouched`}
                className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08] saturate-[1.12] brightness-[1.02]"
                draggable={false}
              />

              {/* Nhãn Ảnh Retouch (Bên phải) */}
              <div className="absolute top-5 right-5 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#B85064] text-white font-bold text-xs tracking-wider uppercase shadow-xl">
                  <CalendarDaysIcon className="w-3.5 h-3.5 text-white" />
                  <span>Ảnh Retouch Nghệ Thuật</span>
                </span>
              </div>

              {/* NỬA TRÁI: CÙNG BỨC ẢNH ĐÓ NHƯNG Ở TRẠNG THÁI FILE GỐC (RAW - Màu phẳng, chưa làm da, ánh sáng mộc) */}
              <img
                src={currentConcept.src}
                alt={`${currentConcept.title} - Raw`}
                className="absolute inset-0 w-full h-full object-cover filter saturate-[0.65] contrast-[0.88] brightness-[0.93] sepia-[0.05]"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
                draggable={false}
              />

              {/* Nhãn File Gốc RAW (Bên trái) */}
              <div className="absolute top-5 left-5 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#F5D5DC] text-[#2A1D22] font-bold text-xs tracking-wider uppercase shadow-xl">
                  <PhotoIcon className="w-3.5 h-3.5 text-[#B85064]" />
                  <span>File Gốc Máy Ảnh (RAW)</span>
                </span>
              </div>

              {/* Thanh trượt phân cách kéo qua kéo lại */}
              <div
                className="absolute top-0 bottom-0 z-30 pointer-events-none flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-0.5 h-full bg-[#B85064] shadow-[0_0_12px_rgba(184,80,100,0.8)]" />
                <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-[#BE4B5E] to-[#E295A2] border-2 border-white shadow-2xl flex items-center justify-center transform -translate-x-1/2 pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                  <AdjustmentsHorizontalIcon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#F5D5DC] text-[11px] text-[#2A1D22] font-semibold shadow-sm whitespace-nowrap">
                👈 Kéo thanh trượt để so sánh trước & sau 👉
              </div>
            </div>

            {/* Ba đặc điểm hậu kỳ nổi bật phía dưới */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="p-5 rounded-2xl bg-white border border-[#F0E4E6] text-center shadow-sm">
                <h4 className="text-[#B85064] font-bold text-sm mb-1">Giữ Vân Da Tự Nhiên</h4>
                <p className="text-xs text-[#7A6C71]">Không bị bệt, làm mịn bằng kỹ thuật Frequency Separation cao cấp</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#F0E4E6] text-center shadow-sm">
                <h4 className="text-[#B85064] font-bold text-sm mb-1">Cân Chỉnh Màu Điện Ảnh</h4>
                <p className="text-xs text-[#7A6C71]">Tone màu ấm áp, trong trẻo, sang trọng và chuẩn xu hướng</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#F0E4E6] text-center shadow-sm">
                <h4 className="text-[#B85064] font-bold text-sm mb-1">Tôn Dáng Tinh Tế</h4>
                <p className="text-xs text-[#7A6C71]">Chỉnh dáng thon gọn mềm mại, giữ trọn nét riêng của từng người</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
