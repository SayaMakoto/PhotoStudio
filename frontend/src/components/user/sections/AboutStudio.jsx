import { useState, useEffect } from 'react';
import {
  CubeIcon,
  CheckIcon,
  CameraIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ChevronRightIcon,
  BoltIcon,
  EyeIcon
} from '@heroicons/react/24/solid';
import SpotlightCard from '../../cards/SpotlightCard';
import ScrollReveal from '../../animations/ScrollReveal';
import customerRoomService from '../../../services/user/roomService';

export default function StudioExperience() {
  const DEFAULT_ROOMS = [
    {
      id: 1,
      name: 'Phòng Studio A - Tone Pastel Hàn Quốc',
      tag: 'Beauty & Profile Nàng Thơ',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      description: 'Phòng chụp tone sáng ngập tràn cảm hứng, phông nền cuộn tự động đa sắc pastel giả lập ánh sáng ban mai nhẹ nhàng và tôn da tuyệt đối.',
      capacity: 'Sức chứa tối đa: 5 - 6 người',
      area: 'Diện tích: 45m²',
      highlights: [
        'Hệ thống phông cuộn điện tử 6 màu Pastel nhập khẩu',
        'Cửa sổ giả lập ánh sáng nắng tự nhiên Softlight 5600K',
        'Góc decor hoa tươi nghệ thuật cập nhật hàng tuần',
        'Bàn trang điểm đèn LED gương vô cực chuẩn salon',
      ],
      gear: 'Sony A7 IV + 85mm F1.4 GM',
    },
    {
      id: 2,
      name: 'Phòng Studio B - Concept Cổ Điển & Cưới',
      tag: 'Vintage & Luxury Wedding',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      description: 'Không gian trần cao 4.8m thông thoáng, góc phố cổ đèn vàng ấm, bàn ghế gỗ thủ công và bối cảnh cung điện lộng lẫy cho ảnh cưới hoàng gia.',
      capacity: 'Sức chứa tối đa: 10 - 12 người',
      area: 'Diện tích: 85m²',
      highlights: [
        'Bối cảnh rèm nhung hoàng gia & cột cổ điển Châu Âu',
        'Nội thất gỗ sồi mộc cổ điển & đèn chùm pha lê',
        'Không gian trần cao chụp toàn cảnh váy xòe công chúa',
        'Khu vực nghỉ ngơi trà hoa bánh ngọt cho cô dâu chú rể',
      ],
      gear: 'Canon EOS R5 + 24-70mm F2.8L II',
    },
    {
      id: 3,
      name: 'Phòng Studio VIP - Cinema & Đa Năng',
      tag: 'High-End Commercial & Family',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      description: 'Phòng trang bị hệ thống dàn đèn Godox AD600 Pro công suất lớn, hệ thống âm thanh vòm và màn hình live-tethering truyền ảnh trực tiếp.',
      capacity: 'Sức chứa tối đa: 15 người',
      area: 'Diện tích: 120m²',
      highlights: [
        'Dàn 5 đèn Godox AD600 Pro chuẩn đồng bộ cinema',
        'Màn hình Eizo ColorEdge 32 inch preview ảnh tức thì',
        'Phòng thay đồ và phòng makeup VIP khép kín tiện nghi',
        'Hệ thống ray trượt trần tự do bố trí mọi góc máy',
      ],
      gear: 'Sony A7 IV + 24-70mm GM II & AD600 Pro',
    },
  ];

  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  useEffect(() => {
    customerRoomService
      .getAllRooms()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((room, idx) => {
            const fallback = DEFAULT_ROOMS[idx % DEFAULT_ROOMS.length];
            return {
              id: room.id,
              name: room.name || fallback.name,
              tag: room.status === 'available' ? 'Sẵn sàng phục vụ' : (fallback.tag || 'Studio Room'),
              image: room.imageUrl || fallback.image,
              description: room.description || fallback.description,
              capacity: room.capacity ? `Sức chứa tối đa: ${room.capacity} người` : fallback.capacity,
              area: fallback.area,
              highlights: fallback.highlights,
              gear: fallback.gear,
            };
          });
          setRooms(mapped);
        }
      })
      .catch((err) => {
        console.warn('[AboutStudio] Không thể kết nối API phòng studio, hiển thị dữ liệu mẫu:', err.message);
      });
  }, []);

  const currentRoom = rooms[activeRoomIndex] || rooms[0] || DEFAULT_ROOMS[0];

  return (
    <section id="studios" className="py-24 bg-neutral-950 border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with 2-way ScrollReveal */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <CubeIcon className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Cơ Sở Vật Chất Chuẩn Quốc Tế</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Không Gian Sáng Tạo Không Giới Hạn
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed">
              Hệ thống các phòng studio chuyên biệt được thiết kế bài bản về ánh sáng, âm học và điều hòa nhiệt độ mát mẻ tối đa cho buổi chụp trọn vẹn cảm xúc.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Studio Tabs with Motion Pills */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {rooms.map((room, idx) => (
              <button
                key={room.id}
                onClick={() => setActiveRoomIndex(idx)}
                className={`cursor-pointer px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
                  activeRoomIndex === idx
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 shadow-xl shadow-amber-500/30 scale-105'
                    : 'bg-neutral-900/80 text-neutral-300 hover:text-white border border-white/10 hover:border-amber-400/40 hover:bg-neutral-900'
                }`}
              >
                <SparklesIcon className={`w-4 h-4 ${activeRoomIndex === idx ? 'text-white' : 'text-amber-400'}`} />
                <span>{room.name.split(' - ')[0]}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Featured Interactive Studio Showcase Card */}
        <ScrollReveal direction="up" delay={0.2}>
          <SpotlightCard
            className="overflow-hidden rounded-3xl border-white/15 bg-neutral-900/60 p-0 shadow-2xl mb-16 transition-all duration-500"
            spotlightColor="rgba(245, 158, 11, 0.2)"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">
              
              {/* Left: Dynamic Room Photo with zoom & interactive details */}
              <div className="lg:col-span-7 relative overflow-hidden group min-h-[350px] lg:min-h-[500px]">
                <img
                  key={currentRoom.image}
                  src={currentRoom.image}
                  alt={currentRoom.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent opacity-70" />

                {/* Floating Room Tag */}
                <div className="absolute top-5 left-5">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide shadow-xl">
                    <BoltIcon className="w-4 h-4 text-amber-400" />
                    {currentRoom.tag}
                  </span>
                </div>

                {/* Bottom Room Specs Overlay */}
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
                  <div className="flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                    <EyeIcon className="w-4 h-4 text-amber-400" />
                    <span>{currentRoom.area}</span>
                    <span className="text-neutral-500">•</span>
                    <span>{currentRoom.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                    <CameraIcon className="w-4 h-4 text-amber-400" />
                    <span>{currentRoom.gear}</span>
                  </div>
                </div>
              </div>

              {/* Right: Room Description & Checklist */}
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-neutral-900/90 border-t lg:border-t-0 lg:border-l border-white/10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                    Khám Phá Chi Tiết
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                    {currentRoom.name}
                  </h3>
                  <p className="text-sm text-neutral-300 font-light leading-relaxed mb-6">
                    {currentRoom.description}
                  </p>

                  <div className="space-y-3.5 mb-8">
                    {currentRoom.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <CheckIcon className="w-3.5 h-3.5 stroke-[3] text-amber-400" />
                        </div>
                        <span className="text-xs sm:text-sm text-neutral-200 font-light leading-snug">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking CTA for this room */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-neutral-400 block">Sẵn sàng nhận lịch</span>
                    <span className="text-sm font-bold text-amber-400">Đang hoạt động</span>
                  </div>
                  <a
                    href="#booking"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 hover:scale-105"
                  >
                    <span>Đặt Phòng Này</span>
                    <ChevronRightIcon className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>

            </div>
          </SpotlightCard>
        </ScrollReveal>

        {/* Equipment & Gear Showcase Bar with dynamic hover effects */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="rounded-3xl border border-white/10 bg-neutral-900/30 p-8 sm:p-10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Dàn Thiết Bị Đẳng Cấp Studio Trang Bị Sẵn</h4>
                <p className="text-xs text-neutral-400">Đảm bảo độ nét phân giải cao nhất và ánh sáng mượt mà nhất</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300">
                <span className="text-amber-400 text-xs font-semibold block mb-1">Máy Ảnh Full-Frame</span>
                <h5 className="text-white font-bold text-sm">Sony Alpha A7 IV</h5>
                <p className="text-[11px] text-neutral-400 mt-1">Lấy nét mắt thời gian thực</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300">
                <span className="text-amber-400 text-xs font-semibold block mb-1">Máy Ảnh Độ Phân Giải Cao</span>
                <h5 className="text-white font-bold text-sm">Canon EOS R5 45MP</h5>
                <p className="text-[11px] text-neutral-400 mt-1">Chi tiết in phóng album lớn</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300">
                <span className="text-amber-400 text-xs font-semibold block mb-1">Hệ Thống Đèn Studio</span>
                <h5 className="text-white font-bold text-sm">Godox AD600 Pro 600W</h5>
                <p className="text-[11px] text-neutral-400 mt-1">Đánh sáng cinematic cao cấp</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300">
                <span className="text-amber-400 text-xs font-semibold block mb-1">Chân Máy & Ray Trượt</span>
                <h5 className="text-white font-bold text-sm">Manfrotto Pro Italy</h5>
                <p className="text-[11px] text-neutral-400 mt-1">Độ vững chãi tuyệt đối</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
