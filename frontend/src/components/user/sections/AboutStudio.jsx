import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckIcon,
  CubeIcon,
  ChevronRightIcon,
  EyeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';
import ScrollReveal from '../../animations/ScrollReveal';
import { ROUTES } from '../../../routes/web';
import { customerAuth } from '../../../lib/axiosCustomer';
import customerRoomService from '../../../services/user/roomService';
import userImageService from '../../../services/user/imageService';

// Fallback ảnh không gian phòng chụp nếu backend đang kết nối
const ROOM_FALLBACK_IMAGES = {
  1: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
  2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  3: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85',
  4: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
  5: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
  6: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
};

export default function StudioExperience() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleBookThisRoom = (roomId) => {
    const rId = roomId || (rooms[activeRoomIndex]?.id) || 1;
    const targetUrl = `${ROUTES.USER.BOOKING}?roomId=${rId}`;
    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        state: {
          from: targetUrl,
          message: 'Vui lòng đăng nhập tài khoản để tiến hành đặt lịch với phòng này!',
        },
      });
    } else {
      navigate(targetUrl);
    }
  };

  useEffect(() => {
    // Tải đồng thời danh sách phòng và kho ảnh từ CSDL
    Promise.allSettled([
      customerRoomService.getAllRooms(),
      userImageService.getAllImages(),
    ])
      .then(([roomsRes, imagesRes]) => {
        const rawRooms =
          roomsRes.status === 'fulfilled' && Array.isArray(roomsRes.value?.data || roomsRes.value)
            ? roomsRes.value?.data || roomsRes.value
            : [];

        const rawImages =
          imagesRes.status === 'fulfilled' && Array.isArray(imagesRes.value?.data || imagesRes.value)
            ? imagesRes.value?.data || imagesRes.value
            : [];

        if (rawRooms.length > 0) {
          const activeRooms = rawRooms.filter((r) => !r.status || r.status === 'active' || r.status === 'available');
          const finalRooms = activeRooms.length > 0 ? activeRooms : rawRooms;

          const mapped = finalRooms.map((room) => {
            const matchingImg =
              rawImages.find(
                (img) =>
                  (img.imageableType === 'room' || img.imageableType === 'ROOM') &&
                  Number(img.imageableId) === Number(room.id) &&
                  img.isPrimary
              ) ||
              rawImages.find(
                (img) =>
                  (img.imageableType === 'room' || img.imageableType === 'ROOM') &&
                  Number(img.imageableId) === Number(room.id)
              );

            const fallbackImg = ROOM_FALLBACK_IMAGES[room.id] || ROOM_FALLBACK_IMAGES[1];

            return {
              ...room,
              image: matchingImg?.imageUrl || fallbackImg,
              area: room.description?.match(/(\d+\s*m2)/i)?.[1] || '60m²',
              ceiling: '4.0m',
            };
          });

          setRooms(mapped);
        } else {
          setRooms([]);
        }
      })
      .catch((err) => {
        console.warn('[AboutStudio] Lỗi tải phòng:', err.message);
        setRooms([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const currentRoom = rooms[activeRoomIndex] || rooms[0] || null;

  const getRoomHighlights = (room) => {
    if (!room) return [];
    const list = [];
    if (room.description) {
      const parts = room.description
        .split(/[,;\n]/)
        .map((p) => p.trim())
        .filter(Boolean);
      list.push(...parts);
    }
    if (room.capacity) {
      list.push(`Không gian phục vụ tối đa ${room.capacity} người cùng lúc`);
    }
    list.push(`Trạng thái: ${room.status === 'active' || room.status === 'available' ? 'Đang hoạt động tốt' : room.status}`);
    return list;
  };

  return (
    <section id="studios" className="py-24 bg-[#FAF5F5] border-t border-[#F0E4E6] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <CubeIcon className="w-4 h-4 text-[#B85064]" />
              <span>HỆ THỐNG PHÒNG CHỤP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight mb-4">
              Không Gian Studio & Phòng Chụp
            </h2>
            <p className="text-[#7A6C71] text-base sm:text-lg font-light leading-relaxed">
              Khám phá thực tế các phòng studio nghệ thuật được đồng bộ trực tiếp từ cơ sở dữ liệu hệ thống, đáp ứng trọn vẹn mọi phong cách nhiếp ảnh.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading state */}
        {isLoading && (
          <div className="rounded-3xl border border-[#F0E4E6] bg-white p-12 text-center animate-pulse mb-16 shadow-sm">
            <div className="h-6 w-48 bg-neutral-200 rounded-full mx-auto mb-4" />
            <div className="h-4 w-64 bg-neutral-100 rounded mx-auto" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && rooms.length === 0 && (
          <div className="rounded-3xl border border-[#F0E4E6] bg-white p-12 text-center mb-16 shadow-sm">
            <CubeIcon className="w-12 h-12 text-[#CBB9BD] mx-auto mb-3" />
            <h4 className="text-[#2A1D22] font-bold text-lg mb-1 font-serif-luxury">Chưa có thông tin phòng chụp</h4>
            <p className="text-xs text-[#7A6C71]">Dữ liệu phòng chụp đang được cập nhật trong cơ sở dữ liệu.</p>
          </div>
        )}

        {/* Interactive Studio Tabs from Database */}
        {!isLoading && rooms.length > 0 && (
          <>
            <ScrollReveal direction="up" delay={0.1}>
              <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-10">
                {rooms.map((room, idx) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoomIndex(idx)}
                    className={`cursor-pointer px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                      activeRoomIndex === idx
                        ? 'bg-[#B85064] text-white shadow-xl shadow-[#B85064]/25 scale-105'
                        : 'bg-white text-[#55464B] hover:text-[#B85064] border border-[#F0E4E6] hover:border-[#B85064]/40 shadow-sm'
                    }`}
                  >
                    <PhotoIcon className={`w-3.5 h-3.5 ${activeRoomIndex === idx ? 'text-white' : 'text-neutral-700'}`} />
                    <span>{room.name.split(' - ')[0]}</span>
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Featured Studio Showcase Card có HÌNH ẢNH THỰC TẾ CỦA PHÒNG */}
            {currentRoom && (
              <ScrollReveal direction="up" delay={0.2}>
                <div className="overflow-hidden rounded-3xl border border-[#F0E4E6] bg-white shadow-xl mb-12 transition-all duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
                    
                    {/* LEFT COLUMN: ẢNH KHÔNG GIAN PHÒNG CHỤP THỰC TẾ */}
                    <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-full overflow-hidden bg-neutral-900 group">
                      <img
                        src={currentRoom.image || ROOM_FALLBACK_IMAGES[currentRoom.id] || ROOM_FALLBACK_IMAGES[1]}
                        alt={currentRoom.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Floating Badges trên ảnh */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                        <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                          {currentRoom.area || '60m²'} • Trần 4.0m
                        </span>

                        <span className="text-xs font-semibold text-white bg-[#B85064]/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                          <UserGroupIcon className="w-3.5 h-3.5" />
                          <span>Tối đa {currentRoom.capacity || 8} người</span>
                        </span>
                      </div>

                      {/* Tiêu đề phòng ghim góc dưới ảnh */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#E899A8] block mb-1">
                          ẢNH CHỤP KHÔNG GIAN THỰC TẾ
                        </span>
                        <h4 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury drop-shadow-md">
                          {currentRoom.name}
                        </h4>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: CHI TIẾT THÔNG SỐ & ĐẶC ĐIỂM NỔI BẬT */}
                    <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-white relative">
                      <div className="space-y-6">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-bold mb-3">
                            <EyeIcon className="w-3.5 h-3.5" />
                            <span>Phòng Studio ID #{currentRoom.id} • Đạt Chuẩn Điện Ảnh</span>
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-bold text-[#2A1D22] font-serif-luxury mb-3">
                            {currentRoom.name}
                          </h3>

                          <p className="text-sm text-[#7A6C71] font-light leading-relaxed">
                            {currentRoom.description || 'Không gian studio được thiết kế chuyên dụng cho nhiếp ảnh nghệ thuật.'}
                          </p>
                        </div>

                        {/* Điểm nổi bật của phòng */}
                        <div className="space-y-3 pt-2">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-[#2A1D22]">
                            Đặc Điểm & Bối Cảnh Nổi Bật:
                          </h5>
                          <div className="space-y-2">
                            {getRoomHighlights(currentRoom).map((highlight, hIdx) => (
                              <div key={hIdx} className="flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0 mt-0.5">
                                  <CheckIcon className="w-3 h-3 stroke-[3]" />
                                </div>
                                <span className="text-xs sm:text-sm text-[#55464B] font-light leading-snug">
                                  {highlight}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action */}
                      <div className="pt-6 mt-6 border-t border-[#F0E4E6] flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="text-xs text-[#7A6C71] block">Trạng thái phòng</span>
                          <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Sẵn sàng hoạt động</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            to={ROUTES.USER.STUDIOS}
                            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF5F5] text-[#B85064] border border-[#F0E4E6] hover:border-[#B85064]/50 font-bold text-xs transition-all flex items-center gap-1.5"
                          >
                            <span>Xem 12 Phòng Chụp</span>
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleBookThisRoom(currentRoom?.id)}
                            className="cursor-pointer px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white font-bold text-xs shadow-md shadow-[#B85064]/25 transition-all flex items-center gap-2 hover:scale-105"
                          >
                            <CalendarDaysIcon className="w-4 h-4 text-white" />
                            <span>Đặt Lịch Với Phòng Này</span>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* CTA Button dẫn tới trang đầy đủ 12 phòng studio */}
            <div className="text-center mt-6">
              <Link
                to={ROUTES.USER.STUDIOS}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/20 hover:scale-105 transition-all"
              >
                <CalendarDaysIcon className="w-4 h-4 text-white" />
                <span>Khám Phá Toàn Diện 12 Phòng Chụp & Bối Cảnh Studio</span>
                <ChevronRightIcon className="w-4 h-4 text-white" />
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
