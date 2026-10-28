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
              <span>HỆ THỐNG PHÒNG TỪ CSDL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight mb-4">
              Không Gian Studio & Phòng Chụp
            </h2>
            <p className="text-[#7A6C71] text-base sm:text-lg font-light leading-relaxed">
              Danh sách phòng studio được đồng bộ trực tiếp từ cơ sở dữ liệu hệ thống, đáp ứng đa dạng phong cách chụp ảnh.
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
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {rooms.map((room, idx) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoomIndex(idx)}
                    className={`cursor-pointer px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
                      activeRoomIndex === idx
                        ? 'bg-[#B85064] text-white shadow-xl shadow-[#B85064]/25 scale-105'
                        : 'bg-white text-[#55464B] hover:text-[#B85064] border border-[#F0E4E6] hover:border-[#B85064]/40 shadow-sm'
                    }`}
                  >
                    <SparklesIcon className={`w-4 h-4 ${activeRoomIndex === idx ? 'text-white' : 'text-[#B85064]'}`} />
                    <span>{room.name}</span>
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Featured Studio Showcase Card */}
            {currentRoom && (
              <ScrollReveal direction="up" delay={0.2}>
                <div className="overflow-hidden rounded-3xl border border-[#F0E4E6] bg-white p-0 shadow-xl mb-16 transition-all duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[450px]">
                    
                    {/* Left: Room Badge & Specs Info */}
                    <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-white relative">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-bold mb-4">
                          <EyeIcon className="w-3.5 h-3.5" />
                          <span>Phòng Studio ID: #{currentRoom.id}</span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-bold text-[#2A1D22] font-serif-luxury mb-4">
                          {currentRoom.name}
                        </h3>

                        <p className="text-sm text-[#7A6C71] font-light leading-relaxed mb-6">
                          {currentRoom.description || 'Không gian studio được thiết kế chuyên dụng cho nhiếp ảnh nghệ thuật.'}
                        </p>

                        <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] mb-6 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0 border border-[#F5D5DC]">
                            <UserGroupIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-xs text-[#7A6C71] block">Sức chứa phục vụ</span>
                            <span className="text-base font-bold text-[#2A1D22]">
                              {currentRoom.capacity ? `Tối đa ${currentRoom.capacity} người` : 'Tiêu chuẩn'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          {getRoomHighlights(currentRoom).map((highlight, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0 mt-0.5">
                                <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                              <span className="text-xs sm:text-sm text-[#55464B] font-light leading-snug">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Action */}
                      <div className="pt-6 border-t border-[#F0E4E6] flex items-center justify-between gap-4">
                        <div>
                          <span className="text-xs text-[#7A6C71] block">Trạng thái</span>
                          <span className="text-sm font-bold text-[#B85064]">
                            {currentRoom.status === 'active' || currentRoom.status === 'available'
                              ? 'Đang hoạt động'
                              : currentRoom.status}
                          </span>
                        </div>
                        <a
                          href="#booking"
                          className="px-6 py-3 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white font-bold text-xs shadow-md shadow-[#B85064]/25 transition-all flex items-center gap-2 hover:scale-105"
                        >
                          <span>Đặt Lịch Studio</span>
                          <ChevronRightIcon className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    </div>

                    {/* Right: Studio Room Feature Cards */}
                    <div className="lg:col-span-6 p-8 sm:p-10 bg-[#FCF8F9] border-t lg:border-t-0 lg:border-l border-[#F0E4E6] flex flex-col justify-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#B85064] mb-6">
                        Tiêu Chuẩn Kỹ Thuật Studio
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-white border border-[#F0E4E6] shadow-sm">
                          <span className="text-[#B85064] text-xs font-semibold block mb-1">Ánh Sáng</span>
                          <h5 className="text-[#2A1D22] font-bold text-sm">Godox Pro Studio</h5>
                          <p className="text-[11px] text-[#7A6C71] mt-1">Đồng bộ ánh sáng tiêu chuẩn điện ảnh</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-[#F0E4E6] shadow-sm">
                          <span className="text-[#B85064] text-xs font-semibold block mb-1">Điều Hòa & Nhiệt Độ</span>
                          <h5 className="text-[#2A1D22] font-bold text-sm">22°C - 24°C Liên Tục</h5>
                          <p className="text-[11px] text-[#7A6C71] mt-1">Bảo vệ lớp trang điểm luôn hoàn hảo</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-[#F0E4E6] shadow-sm">
                          <span className="text-[#B85064] text-xs font-semibold block mb-1">Không Gian Riêng</span>
                          <h5 className="text-[#2A1D22] font-bold text-sm">Phòng Thay Đồ Khép Kín</h5>
                          <p className="text-[11px] text-[#7A6C71] mt-1">Riêng tư tuyệt đối cho khách hàng</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-[#F0E4E6] shadow-sm">
                          <span className="text-[#B85064] text-xs font-semibold block mb-1">Kiểm Tra Ảnh</span>
                          <h5 className="text-[#2A1D22] font-bold text-sm">Tethering Màn Hình</h5>
                          <p className="text-[11px] text-[#7A6C71] mt-1">Xem ảnh ngay sau mỗi lần bấm máy</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            )}
          </>
        )}

        {/* Equipment & Gear Showcase Bar */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="rounded-3xl border border-[#F0E4E6] bg-white p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-[#FDF0F3] text-[#B85064] border border-[#F5D5DC]">
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#2A1D22] font-serif-luxury">Dàn Thiết Bị Đẳng Cấp Studio Trang Bị Sẵn</h4>
                <p className="text-xs text-[#7A6C71]">Đảm bảo độ nét phân giải cao nhất và ánh sáng mượt mà nhất</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]">
                <span className="text-[#B85064] text-xs font-semibold block mb-1">Máy Ảnh Full-Frame</span>
                <h5 className="text-[#2A1D22] font-bold text-sm">Sony & Canon Cinema</h5>
                <p className="text-[11px] text-[#7A6C71] mt-1">Lấy nét mắt thời gian thực</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]">
                <span className="text-[#B85064] text-xs font-semibold block mb-1">Hệ Thống Đèn</span>
                <h5 className="text-[#2A1D22] font-bold text-sm">Godox AD600 Pro</h5>
                <p className="text-[11px] text-[#7A6C71] mt-1">Công suất flash 600W điện ảnh</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]">
                <span className="text-[#B85064] text-xs font-semibold block mb-1">Ống Kính Cao Cấp</span>
                <h5 className="text-[#2A1D22] font-bold text-sm">Dòng GM & L-Series</h5>
                <p className="text-[11px] text-[#7A6C71] mt-1">Bokeh mượt mà, độ nét xuất sắc</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]">
                <span className="text-[#B85064] text-xs font-semibold block mb-1">Màn Hình Màu Chuẩn</span>
                <h5 className="text-[#2A1D22] font-bold text-sm">ColorEdge 4K</h5>
                <p className="text-[11px] text-[#7A6C71] mt-1">Chuẩn màu 99% Adobe RGB</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
