import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CakeIcon,
  CubeIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  TvIcon,
  ArrowRightIcon,
  PhoneIcon,
  XMarkIcon,
  EyeIcon,
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOffice2Icon,
  CameraIcon,
} from "@heroicons/react/24/solid";

// React Bits Components
import BlurText from "../../components/animations/BlurText";
import ShinyText from "../../components/animations/ShinyText";
import CountUp from "../../components/animations/CountUp";
import ScrollReveal from "../../components/animations/ScrollReveal";
import SpotlightCard from "../../components/cards/SpotlightCard";
import TiltedCard from "../../components/cards/TiltedCard";

import {
  FloralBranchCorner,
  ScatteredPetals,
} from "../../components/common/FloralDecorations";
import { ROUTES } from "../../routes/web";
import { customerAuth } from "../../lib/axiosCustomer";
import customerRoomService from "../../services/user/roomService";
import customerBackgroundService from "../../services/user/backgroundService";
import userImageService from "../../services/user/imageService";

// =========================================================================
// DỮ LIỆU DỰ PHÒNG CHUẨN ĐỒNG BỘ 100% VỚI SEED DATA TRONG CSDL (DOCS/PHOTO_STUDIO.SQL)
// Toàn bộ hình ảnh là ảnh chụp không gian kiến trúc nội thất studio thực tế (KHÔNG dùng ảnh chụp người)
// =========================================================================

const ROOMS_PER_PAGE = 6;

export default function StudiosPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedRoomFilter] = useState("all");
  const [activeSpaceModal, setActiveSpaceModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleBookRoom = (roomId) => {
    const targetUrl = `${ROUTES.USER.BOOKING}?roomId=${roomId || 1}`;
    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        state: {
          from: targetUrl,
          message:
            "Vui lòng đăng nhập tài khoản để tiến hành đặt lịch với phòng này!",
        },
      });
    } else {
      navigate(targetUrl);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Tải phòng chụp, bối cảnh và bộ sưu tập ảnh 100% từ CSDL
    Promise.allSettled([
      customerRoomService.getAllRooms(),
      customerBackgroundService.getAllBackgrounds(),
      userImageService.getAllImages(),
    ])
      .then(([roomsRes, bgRes, imagesRes]) => {
        const rawImages =
          imagesRes.status === "fulfilled" &&
          Array.isArray(imagesRes.value?.data || imagesRes.value)
            ? imagesRes.value?.data || imagesRes.value
            : [];

        // 1. Đồng bộ BỐI CẢNH CHỤP từ CSDL
        const rawBgs =
          bgRes.status === "fulfilled" &&
          Array.isArray(bgRes.value?.data || bgRes.value)
            ? bgRes.value?.data || bgRes.value
            : [];

        if (rawBgs.length > 0) {
          const mappedBgs = rawBgs.map((b) => {
            const matchingImages = rawImages.filter(
              (img) =>
                (img.imageableType === "background" ||
                  img.imageableType === "BACKGROUND") &&
                Number(img.imageableId) === Number(b.id),
            );
            const primary =
              matchingImages.find((img) => img.isPrimary)?.imageUrl ||
              matchingImages[0]?.imageUrl ||
              b.imageUrl ||
              "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85";
            const gallery =
              matchingImages.length > 0
                ? matchingImages.map((m) => m.imageUrl)
                : [primary];

            return {
              id: b.id,
              name: b.name || `Bối cảnh #${b.id}`,
              description:
                b.description || "Bối cảnh chụp ảnh nghệ thuật tại studio",
              tag: b.tag || b.backgroundType || "Bối Cảnh Nghệ Thuật",
              primaryImage: primary,
              gallery: gallery,
              highlights: b.highlights || [
                "Không gian ánh sáng tối ưu",
                "Đạo cụ decor tương thích",
              ],
            };
          });
          setBackgrounds(mappedBgs);
        } else {
          setBackgrounds([]);
        }

        // 2. Đồng bộ danh sách PHÒNG CHỤP từ CSDL
        const rawRooms =
          roomsRes.status === "fulfilled" &&
          Array.isArray(roomsRes.value?.data || roomsRes.value)
            ? roomsRes.value?.data || roomsRes.value
            : [];

        if (rawRooms.length > 0) {
          const mappedRooms = rawRooms.map((r) => {
            const matchingImages = rawImages.filter(
              (img) =>
                (img.imageableType === "room" ||
                  img.imageableType === "ROOM") &&
                Number(img.imageableId) === Number(r.id),
            );
            const primary =
              matchingImages.find((img) => img.isPrimary)?.imageUrl ||
              matchingImages[0]?.imageUrl ||
              r.imageUrl ||
              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85";
            const gallery =
              matchingImages.length > 0
                ? matchingImages.map((m) => m.imageUrl)
                : [primary];

            return {
              id: r.id,
              name: r.name || `Phòng Studio #${r.id}`,
              description:
                r.description || "Không gian studio ánh sáng tự nhiên cao cấp",
              capacity: r.capacity || 4,
              status: r.status || "active",
              primaryImage: primary,
              gallery: gallery,
              area: r.area || "60m²",
              ceiling: r.ceiling || "4.0m",
              features: r.features || [
                "Hệ thống ánh sáng studio chuyên nghiệp",
                "Phù hợp nhiều concept",
              ],
            };
          });
          setRooms(mappedRooms);
        } else {
          setRooms([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredRooms = useMemo(() => {
    if (selectedRoomFilter === "all") return rooms;
    return rooms.filter((r) => r.id === Number(selectedRoomFilter));
  }, [rooms, selectedRoomFilter]);

  // Phân trang 6 phòng mỗi trang
  const totalPages = Math.ceil(filteredRooms.length / ROOMS_PER_PAGE) || 1;

  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * ROOMS_PER_PAGE;
    return filteredRooms.slice(start, start + ROOMS_PER_PAGE);
  }, [filteredRooms, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const el = document.getElementById("rooms-showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative overflow-hidden">
      {/* Họa tiết cành hoa trang trí góc */}
      <FloralBranchCorner
        position="top-right"
        opacity="opacity-75"
        className="top-24 z-10"
      />
      <FloralBranchCorner
        position="bottom-left"
        opacity="opacity-60"
        className="bottom-96 z-10"
      />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Không gian điện ảnh, React Bits Title & Badges */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[480px] lg:min-h-[520px] bg-[#141012] overflow-hidden flex items-center pt-28 pb-16">
        {/* Nền ảnh không gian kiến trúc studio rộng lớn */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 pointer-events-none transition-transform duration-1000"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/95 via-[#141012]/75 to-[#141012]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#141012] pointer-events-none" />

        {/* Ambient Glow */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-rose-500/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 mb-6">
            <Link
              to={ROUTES.USER.HOME}
              className="hover:text-white transition-colors"
            >
              Trang Chủ
            </Link>
            <span>/</span>
            <span className="text-[#E899A8] font-semibold">
              Không Gian Studio
            </span>
          </div>

          <div className="max-w-3xl">
            {/* Shimmering Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/15 border border-rose-500/30 text-[#E899A8] text-xs font-semibold uppercase tracking-wider mb-5 shadow-lg backdrop-blur-md">
              <BuildingOffice2Icon className="w-4 h-4 text-white" />
              <ShinyText
                text="HỆ THỐNG 12 PHÒNG CHỤP & BỐI CẢNH 500M²"
                speed={3.5}
                className="text-white"
              />
            </div>

            {/* Title với React Bits BlurText */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif-luxury tracking-tight leading-tight mb-5">
              <BlurText
                text="Không Gian Nghệ Thuật & Bối Cảnh Studio Độc Bản"
                delay={100}
              />
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-light">
              Tọa lạc tại trung tâm với diện tích sàn hơn 500m², PhotoStudio sở
              hữu hệ thống 12 phòng chụp đại cảnh độc lập và 6 bối cảnh phối
              cảnh 3D độc quyền mang đến chiều sâu kiến trúc, ánh sáng tự nhiên
              và trải nghiệm hoàn hảo cho mọi ý tưởng sáng tạo.
            </p>

            {/* Quick Stats với React Bits CountUp */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury flex items-center">
                  <CountUp to={12} duration={1.5} />
                  <span className="text-[#E899A8]">+</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Phòng chụp đại cảnh
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury flex items-center">
                  <CountUp to={6} duration={1.5} />
                  <span className="text-[#E899A8]">+</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Bối cảnh độc quyền
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury flex items-center">
                  <CountUp to={500} duration={1.8} />
                  <span className="text-[#E899A8]">m²</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Diện tích sàn sáng tạo
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury flex items-center">
                  <CountUp to={100} duration={1.6} />
                  <span className="text-[#E899A8]">%</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Không gian thoải mái
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 6 BỐI CẢNH STUDIO ĐỘC BẢN (3D TiltedCards - ẢNH KHÔNG GIAN KIẾN TRÚC) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-[#141012] via-[#1a1417] to-[#FAF5F5] relative text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="down">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[#E899A8] text-xs font-semibold uppercase tracking-wider mb-3">
                  <CameraIcon className="w-3.5 h-3.5 text-white" />
                  <span>SET DESIGN NGHỆ THUẬT 3D</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-luxury tracking-tight text-white">
                  6 Bối Cảnh Studio Độc Bản
                </h2>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm font-light max-w-md leading-relaxed">
                Các set background được dàn dựng tỉ mỉ về kiến trúc, decor nội
                thất và bố cục ánh sáng. Nhấn vào từng bối cảnh để xem chi tiết
                góc nhìn không gian.
              </p>
            </div>
          </ScrollReveal>

          {/* 3D Tilted Cards Grid: 100% Ảnh không gian kiến trúc nội thất thực tế */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {backgrounds.slice(0, 6).map((item, idx) => (
              <ScrollReveal key={item.id} direction="up" delay={idx * 0.08}>
                <div
                  onClick={() =>
                    setActiveSpaceModal({ type: "background", data: item })
                  }
                  className="cursor-pointer group"
                >
                  <TiltedCard
                    imageSrc={item.primaryImage}
                    altText={item.name}
                    containerHeight="410px"
                    scaleOnHover={1.04}
                    rotateAmplitude={12}
                    captionText={`Không gian độc quyền • PhotoStudio Design`}
                    overlayContent={
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#B85064]/95 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            {item.tag}
                          </span>
                          <span className="text-white/80 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <EyeIcon className="w-3.5 h-3.5" />
                            <span>Xem góc nhìn</span>
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white font-serif-luxury drop-shadow-md">
                          {item.name}
                        </h3>

                        <p className="text-xs text-neutral-200 line-clamp-2 font-light">
                          {item.description}
                        </p>
                      </div>
                    }
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CHI TIẾT HỆ THỐNG 12 PHÒNG CHỤP ĐẠI CẢNH TỪ CSDL (CÓ PHÂN TRANG 6 PHÒNG/TRANG) */}
      {/* ========================================================================= */}
      <section id="rooms-showcase" className="py-20 bg-[#FAF5F5] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="down">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
                <CubeIcon className="w-4 h-4 text-[#B85064]" />
                <span>HỆ THỐNG {rooms.length} PHÒNG CHỤP</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight mb-3">
                Khám Phá Chi Tiết {rooms.length} Phòng Chụp
              </h2>
              <p className="text-[#7A6C71] text-sm leading-relaxed">
                Hệ thống {rooms.length} phòng chụp chuyên biệt khép kín, phân
                trang 6 phòng mỗi trang với đầy đủ thông số diện tích, sức chứa
                và hình ảnh thực tế giúp bạn dễ dàng chọn không gian lý tưởng
                nhất.
              </p>
            </div>
          </ScrollReveal>

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-3xl bg-white border border-[#F0E4E6] animate-pulse p-8"
                />
              ))}
            </div>
          )}

          {/* Rooms Grid with SpotlightCard (Hiển thị 6 phòng trên mỗi trang) */}
          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {paginatedRooms.map((room) => (
                <SpotlightCard
                  key={room.id}
                  spotlightColor="rgba(184, 80, 100, 0.18)"
                  className="p-0 overflow-hidden rounded-3xl border border-[#F0E4E6] bg-white hover:border-[#BE4B5E]/60 shadow-sm hover:shadow-2xl hover:shadow-[#BE4B5E]/15 transition-all duration-300 flex flex-col"
                >
                  {/* Room Cover Photo: Ảnh không gian phòng chụp thực tế */}
                  <div
                    onClick={() =>
                      setActiveSpaceModal({ type: "room", data: room })
                    }
                    className="relative h-72 sm:h-80 w-full overflow-hidden bg-neutral-900 cursor-pointer group"
                  >
                    <img
                      src={room.primaryImage}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Top Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                      <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        {room.area || "60m²"} • Trần {room.ceiling || "4.0m"}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white bg-[#B85064]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                          <UserGroupIcon className="w-3.5 h-3.5" />
                          <span>Tối đa {room.capacity} người</span>
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Room Name pinned at bottom */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex items-end justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#E899A8]">
                          Phòng Chụp Chuyên Nghiệp #{room.id}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury drop-shadow-md">
                          {room.name}
                        </h3>
                      </div>

                      <span className="text-white/80 text-xs flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                        <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
                        <span>Xem đại cảnh</span>
                      </span>
                    </div>
                  </div>

                  {/* Room Details Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <p className="text-sm text-[#7A6C71] leading-relaxed font-light">
                        {room.description}
                      </p>

                      {/* Key features checklist */}
                      <div className="space-y-2.5 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A1D22] flex items-center gap-1.5">
                          <CheckBadgeIcon className="w-4 h-4 text-[#B85064]" />
                          <span>Kiến Trúc & Tiện Ích Phòng Nổi Bật:</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#55464B]">
                          {(
                            room.features || [
                              "Hệ thống điều hòa trung tâm 2 chiều",
                              "Gương makeup đèn LED chuẩn màu",
                              "Hệ thống cách âm tiêu chuẩn",
                              "Khu vực thay đồ riêng tư khép kín",
                            ]
                          ).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B85064] shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-4 border-t border-[#F0E4E6] flex items-center justify-between gap-4">
                      <button
                        onClick={() =>
                          setActiveSpaceModal({ type: "room", data: room })
                        }
                        className="cursor-pointer text-xs font-semibold text-[#B85064] hover:text-[#A8394C] flex items-center gap-1.5 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span>Xem Các Góc Không Gian</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBookRoom(room.id)}
                        className="cursor-pointer px-5 py-2.5 rounded-full bg-[#B85064] hover:bg-[#A8394C] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105"
                      >
                        <span>Đặt Lịch Với Phòng Này</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}

          {/* PHÂN TRANG: 6 phòng trên mỗi trang */}
          {!isLoading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-[#F0E4E6]">
              <div className="text-xs sm:text-sm text-[#7A6C71]">
                Hiển thị{" "}
                <span className="font-bold text-[#2A1D22]">
                  {(currentPage - 1) * ROOMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ROOMS_PER_PAGE, filteredRooms.length)}
                </span>{" "}
                trên tổng số{" "}
                <span className="font-bold text-[#B85064]">
                  {filteredRooms.length}
                </span>{" "}
                phòng studio
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`cursor-pointer px-4 py-2 rounded-full border border-[#F0E4E6] text-xs font-bold flex items-center gap-1 transition-all ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed bg-neutral-100 text-neutral-400"
                      : "bg-white text-[#2A1D22] hover:bg-[#B85064] hover:text-white hover:border-[#B85064]"
                  }`}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span>Trang Trước</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pg) => (
                    <button
                      key={pg}
                      onClick={() => handlePageChange(pg)}
                      className={`cursor-pointer w-10 h-10 rounded-full text-xs font-bold transition-all ${
                        currentPage === pg
                          ? "bg-[#B85064] text-white shadow-md shadow-[#B85064]/30 scale-105"
                          : "bg-white text-[#55464B] hover:text-[#B85064] border border-[#F0E4E6] hover:border-[#B85064]/50"
                      }`}
                    >
                      {pg}
                    </button>
                  ),
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`cursor-pointer px-4 py-2 rounded-full border border-[#F0E4E6] text-xs font-bold flex items-center gap-1 transition-all ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed bg-neutral-100 text-neutral-400"
                      : "bg-white text-[#2A1D22] hover:bg-[#B85064] hover:text-white hover:border-[#B85064]"
                  }`}
                >
                  <span>Trang Sau</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TIỆN ÍCH VIP DÀNH CHO KHÁCH HÀNG (AMENITIES) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-t border-[#F0E4E6] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="down">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
                <ShieldCheckIcon className="w-4 h-4 text-[#B85064]" />
                <span>TIỆN ÍCH KHÔNG GIAN 5 SAO</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight mb-3">
                Trải Nghiệm Tiện Nghi & Chu Đáo Tối Đa
              </h2>
              <p className="text-[#7A6C71] text-sm leading-relaxed">
                Mỗi buổi chụp không chỉ là tạo ra những bức ảnh đẹp, mà còn là
                khoảng thời gian thư thái và thoải mái tuyệt đối cho bạn cùng
                người thân.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: UserGroupIcon,
                title: "Phòng Thử Đồ & Makeup VIP",
                desc: "Phòng makeup riêng tư với gương đèn LED CRI 98+ chuẩn màu và bàn trang điểm chuyên nghiệp cho từng khách hàng.",
              },
              {
                icon: TvIcon,
                title: "Màn Hình 4K Preview Trực Tiếp",
                desc: "Kết nối Tethering trực tiếp từ máy ảnh lên màn hình lớn giúp bạn và stylist kiểm tra ảnh ngay trong buổi chụp.",
              },
              {
                icon: CakeIcon,
                title: "Trà Hoa & Quầy Coffee Bar",
                desc: "Thưởng thức trà thảo mộc thơm mát, cà phê và bánh ngọt miễn phí trong suốt thời gian trang điểm và nghỉ ngơi.",
              },
              {
                icon: ShieldCheckIcon,
                title: "Phòng Thay Đồ Trang Phục Riêng",
                desc: "Không gian khép kín kín đáo, trang bị tủ cất đồ cá nhân có khóa an toàn và bàn là hơi nước chăm sóc trang phục.",
              },
            ].map((amenity, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
                <div className="p-6 rounded-3xl bg-[#FAF5F5]/60 border border-[#F0E4E6] shadow-sm hover:border-[#BE4B5E]/50 hover:bg-white hover:shadow-xl transition-all duration-300 space-y-4 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                    <amenity.icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-[#2A1D22] font-serif-luxury">
                      {amenity.title}
                    </h4>
                    <p className="text-xs text-[#7A6C71] leading-relaxed font-light">
                      {amenity.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA Banner: Nút độc lập, không dính chùm */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1C1619] via-[#2A1D22] to-[#141012] text-white border border-rose-500/25 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-[#E899A8] text-xs font-semibold uppercase">
                  <CalendarDaysIcon className="w-3.5 h-3.5 text-white" />
                  <span>TRẢI NGHIỆM KHÔNG GIAN THỰC TẾ</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury leading-tight">
                  Bạn Muốn Trực Tiếp Khám Phá Studio Của Chúng Tôi?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  Hãy ghé thăm studio để được tham quan các phòng chụp thực tế,
                  thử trang phục và nhận tư vấn concept hoàn toàn miễn phí từ
                  stylist.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <button
                    type="button"
                    onClick={() => handleBookRoom(1)}
                    className="cursor-pointer px-7 py-3.5 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-rose-950/50 block text-center transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>Đặt Lịch Chụp Ngay</span>
                    </span>
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <a
                    href="tel:0901234567"
                    className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 block text-center transition-all flex items-center justify-center gap-2"
                  >
                    <PhoneIcon className="w-4 h-4 text-[#E899A8]" />
                    <span>Gọi 0901 234 567</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MODAL CHI TIẾT GÓC NHÌN KHÔNG GIAN (LIGHTBOX WOW EFFECT) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeSpaceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header Modal */}
              <div className="px-6 py-4 border-b border-[#F0E4E6] flex items-center justify-between bg-[#FAF5F5]">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-[#B85064] text-white text-[11px] font-bold uppercase tracking-wider">
                    {activeSpaceModal.type === "background"
                      ? "Bối Cảnh Nghệ Thuật"
                      : "Phòng Chụp Đại Cảnh"}
                  </span>
                  <h3 className="text-lg font-bold text-[#2A1D22] font-serif-luxury truncate max-w-md">
                    {activeSpaceModal.data.name}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveSpaceModal(null)}
                  className="cursor-pointer p-2 rounded-full hover:bg-neutral-200 text-[#55464B] transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body Modal with Gallery */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Large Panoramic Photo */}
                <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-inner">
                  <img
                    src={activeSpaceModal.data.primaryImage}
                    alt={activeSpaceModal.data.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-light">
                    Ảnh chụp không gian kiến trúc thực tế tại PhotoStudio
                  </div>
                </div>

                {/* Multi-angle gallery preview */}
                {activeSpaceModal.data.gallery &&
                  activeSpaceModal.data.gallery.length > 1 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6C71]">
                        Các Góc Phối Cảnh Chi Tiết:
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {activeSpaceModal.data.gallery.map((imgUrl, gIdx) => (
                          <div
                            key={gIdx}
                            className="h-28 rounded-xl overflow-hidden border border-[#F0E4E6] shadow-sm"
                          >
                            <img
                              src={imgUrl}
                              alt={`Góc phối cảnh ${gIdx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Description & Features */}
                <div className="p-5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#B85064]">
                    Mô Tả & Bố Cục Ánh Sáng Không Gian
                  </h4>
                  <p className="text-sm text-[#55464B] leading-relaxed">
                    {activeSpaceModal.data.description}
                  </p>

                  {/* Highlights checklist */}
                  {(activeSpaceModal.data.highlights ||
                    activeSpaceModal.data.features) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-[#2A1D22] font-medium">
                      {(
                        activeSpaceModal.data.highlights ||
                        activeSpaceModal.data.features
                      ).map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2">
                          <CheckBadgeIcon className="w-4 h-4 text-[#B85064] shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Modal CTA */}
              <div className="px-6 py-4 border-t border-[#F0E4E6] bg-[#FAF5F5] flex items-center justify-between">
                <span className="text-xs text-[#7A6C71]">
                  Sẵn sàng đón tiếp khách hàng tham quan trực tiếp
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const rId =
                      activeSpaceModal?.type === "room"
                        ? activeSpaceModal.data.id
                        : 1;
                    setActiveSpaceModal(null);
                    handleBookRoom(rId);
                  }}
                  className="cursor-pointer px-6 py-2.5 rounded-full bg-gradient-to-r from-[#BE4B5E] to-[#B85064] text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>Chọn Gói & Đặt Không Gian Này</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cánh hoa đào bay phất phơ */}
      <ScatteredPetals className="z-10 pointer-events-none" />
    </div>
  );
}
