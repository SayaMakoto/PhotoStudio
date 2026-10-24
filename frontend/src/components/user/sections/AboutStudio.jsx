import { useState, useEffect } from 'react';
import {
  SparklesIcon,
  CheckIcon,
  CubeIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import SpotlightCard from '../../cards/SpotlightCard';
import ScrollReveal from '../../animations/ScrollReveal';
import customerRoomService from '../../../services/user/roomService';

export default function StudioExperience() {
  const [rooms, setRooms] = useState([]);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void customerRoomService
      .getAllRooms()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const activeRooms = data.filter((r) => !r.status || r.status === 'active' || r.status === 'available');
          setRooms(activeRooms.length > 0 ? activeRooms : data);
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
      })
      .catch((err) => {
        console.error('[AboutStudio] Lỗi không xử lý:', err);
      });
  }, []);

  const currentRoom = rooms[activeRoomIndex] || rooms[0] || null;

  // Tách mô tả thành danh sách điểm nổi bật thực tế
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
    <section id="studios" className="py-24 bg-neutral-950 border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <CubeIcon className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>HỆ THỐNG PHÒNG TỪ CSDL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Không Gian Studio & Phòng Chụp
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed">
              Danh sách phòng studio được đồng bộ trực tiếp từ cơ sở dữ liệu hệ thống, đáp ứng đa dạng phong cách chụp ảnh.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading state */}
        {isLoading && (
          <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-12 text-center animate-pulse mb-16">
            <div className="h-6 w-48 bg-white/10 rounded-full mx-auto mb-4" />
            <div className="h-4 w-64 bg-white/10 rounded mx-auto" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && rooms.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-12 text-center mb-16">
            <CubeIcon className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h4 className="text-white font-bold text-lg mb-1">Chưa có thông tin phòng chụp</h4>
            <p className="text-xs text-neutral-400">Dữ liệu phòng chụp đang được cập nhật trong cơ sở dữ liệu.</p>
          </div>
        )}

        {/* Interactive Studio Tabs from Database */}
        {!isLoading && rooms.length > 0 && (
          <>
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
                    <SparklesIcon className={`w-4 h-4 ${activeRoomIndex === idx ? 'text-neutral-950' : 'text-amber-400'}`} />
                    <span>{room.name}</span>
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Featured Studio Showcase Card */}
            {currentRoom && (
              <ScrollReveal direction="up" delay={0.2}>
                <SpotlightCard
                  className="overflow-hidden rounded-3xl border-white/15 bg-neutral-900/60 p-0 shadow-2xl mb-16 transition-all duration-500"
                  spotlightColor="rgba(245, 158, 11, 0.2)"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[450px]">
                    
                    {/* Left: Room Badge & Specs Info */}
                    <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-neutral-950/80 relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-bold mb-4">
                          <EyeIcon className="w-3.5 h-3.5" />
                          <span>Phòng Studio ID: #{currentRoom.id}</span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                          {currentRoom.name}
                        </h3>

                        <p className="text-sm text-neutral-300 font-light leading-relaxed mb-6">
                          {currentRoom.description || 'Không gian studio được thiết kế chuyên dụng cho nhiếp ảnh nghệ thuật.'}
                        </p>

                        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 mb-6 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <UserGroupIcon className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <span className="text-xs text-neutral-400 block">Sức chứa phục vụ</span>
                            <span className="text-base font-bold text-white">
                              {currentRoom.capacity ? `Tối đa ${currentRoom.capacity} người` : 'Tiêu chuẩn'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          {getRoomHighlights(currentRoom).map((highlight, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckIcon className="w-3.5 h-3.5 stroke-[3] text-amber-400" />
                              </div>
                              <span className="text-xs sm:text-sm text-neutral-200 font-light leading-snug">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Action */}
                      <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-xs text-neutral-400 block">Trạng thái</span>
                          <span className="text-sm font-bold text-amber-400">
                            {currentRoom.status === 'active' || currentRoom.status === 'available'
                              ? 'Đang hoạt động'
                              : currentRoom.status}
                          </span>
                        </div>
                        <a
                          href="#booking"
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 hover:scale-105"
                        >
                          <span>Đặt Lịch Studio</span>
                          <ChevronRightIcon className="w-4 h-4 text-neutral-950" />
                        </a>
                      </div>
                    </div>

                    {/* Right: Studio Room Feature Cards */}
                    <div className="lg:col-span-6 p-8 sm:p-10 bg-neutral-900/60 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-6">
                        Tiêu Chuẩn Kỹ Thuật Studio
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-neutral-950/60 border border-white/10">
                          <span className="text-amber-400 text-xs font-semibold block mb-1">Ánh Sáng</span>
                          <h5 className="text-white font-bold text-sm">Godox Pro Studio</h5>
                          <p className="text-[11px] text-neutral-400 mt-1">Đồng bộ ánh sáng tiêu chuẩn điện ảnh</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-neutral-950/60 border border-white/10">
                          <span className="text-amber-400 text-xs font-semibold block mb-1">Điều Hòa & Nhiệt Độ</span>
                          <h5 className="text-white font-bold text-sm">22°C - 24°C Liên Tục</h5>
                          <p className="text-[11px] text-neutral-400 mt-1">Bảo vệ lớp trang điểm luôn hoàn hảo</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-neutral-950/60 border border-white/10">
                          <span className="text-amber-400 text-xs font-semibold block mb-1">Không Gian Riêng</span>
                          <h5 className="text-white font-bold text-sm">Phòng Thay Đồ Khép Kín</h5>
                          <p className="text-[11px] text-neutral-400 mt-1">Riêng tư tuyệt đối cho khách hàng</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-neutral-950/60 border border-white/10">
                          <span className="text-amber-400 text-xs font-semibold block mb-1">Kiểm Tra Ảnh</span>
                          <h5 className="text-white font-bold text-sm">Tethering Màn Hình</h5>
                          <p className="text-[11px] text-neutral-400 mt-1">Xem ảnh ngay sau mỗi lần bấm máy</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </SpotlightCard>
              </ScrollReveal>
            )}
          </>
        )}

        {/* Equipment & Gear Showcase Bar */}
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
              <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/10">
                <span className="text-amber-400 text-xs font-semibold block mb-1">Máy Ảnh Full-Frame</span>
                <h5 className="text-white font-bold text-sm">Sony & Canon Cinema</h5>
                <p className="text-[11px] text-neutral-400 mt-1">Lấy nét mắt thời gian thực</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/10">
                <span className="text-amber-400 text-xs font-semibold block mb-1">Hệ Thống Đèn</span>
                <h5 className="text-white font-bold text-sm">Godox AD600 Pro</h5>
                <p className="text-[11px] text-neutral-400 mt-1">Công suất flash 600W điện ảnh</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/10">
                <span className="text-amber-400 text-xs font-semibold block mb-1">Ống Kính Cao Cấp</span>
                <h5 className="text-white font-bold text-sm">Dòng GM & L-Series</h5>
                <p className="text-[11px] text-neutral-400 mt-1">Bokeh mượt mà, độ nét xuất sắc</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/10">
                <span className="text-amber-400 text-xs font-semibold block mb-1">Màn Hình Màu Chuẩn</span>
                <h5 className="text-white font-bold text-sm">ColorEdge 4K</h5>
                <p className="text-[11px] text-neutral-400 mt-1">Chuẩn màu 99% Adobe RGB</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
