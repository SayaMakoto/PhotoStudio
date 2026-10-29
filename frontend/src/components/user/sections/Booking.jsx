import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ArrowRightIcon,
  TicketIcon,
  ShieldCheckIcon,
  CameraIcon,
  BuildingLibraryIcon,
  HeartIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';

import BlurText from '../../animations/BlurText';
import ShinyText from '../../animations/ShinyText';
import ScrollReveal from '../../animations/ScrollReveal';
import SpotlightCard from '../../cards/SpotlightCard';
import { FloralBranchCorner, FloralCardCorner } from '../../common/FloralDecorations';
import { ROUTES } from '../../../routes/web';
import { customerAuth } from '../../../lib/axiosCustomer';

export default function BookingSection() {
  const navigate = useNavigate();

  const handleGoToBooking = (extraParams = '') => {
    const targetUrl = extraParams ? `${ROUTES.USER.BOOKING}${extraParams}` : ROUTES.USER.BOOKING;
    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        state: {
          from: targetUrl,
          message: 'Vui lòng đăng nhập tài khoản để tiến hành đặt lịch chụp trực tuyến!',
        },
      });
    } else {
      navigate(targetUrl);
    }
  };

  return (
    <section id="booking" className="relative py-24 sm:py-32 bg-[#1A1215] text-white overflow-hidden">
      {/* Nền ảnh studio nghệ thuật mờ ảo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#140E10] via-[#1A1215]/95 to-[#120D0F] pointer-events-none" />

      {/* Cành hoa góc nghệ thuật */}
      <FloralBranchCorner position="top-right" opacity="opacity-35" className="top-10 z-10" />
      <FloralBranchCorner position="bottom-left" opacity="opacity-30" className="bottom-10 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B85064]/20 border border-[#B85064]/40 text-[#F3ACB8] text-xs font-bold uppercase tracking-wider mb-4 shadow-inner">
              <CalendarDaysIcon className="w-4 h-4 text-white" />
              <span>HỆ THỐNG ĐẶT LỊCH CHỤP TRỰC TUYẾN 2026</span>
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury text-white tracking-tight leading-tight">
              <BlurText text="Đăng Ký Đặt Lịch Chụp Trực Tuyến" delay={30} />
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="mt-4 text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
              Trải nghiệm quy trình đặt lịch thông minh 3 bước: Chọn không gian studio yêu thích, chọn gói chụp độc bản và nhận ngay đặc quyền ưu đãi <strong className="text-[#F3ACB8] font-semibold">giảm 20% trên giá gốc</strong>.
            </p>
          </ScrollReveal>
        </div>

        {/* 3 PREVIEW SHOWCASE CARDS (LÔI CUỐN, HÌNH ẢNH SANG TRỌNG) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1: 12 Không gian phòng chụp */}
          <ScrollReveal direction="up" delay={0.1}>
            <SpotlightCard
              spotlightColor="rgba(243, 172, 184, 0.15)"
              className="p-0 overflow-hidden rounded-3xl border border-white/10 bg-[#251A1E]/80 backdrop-blur-md shadow-2xl flex flex-col h-full group hover:border-[#B85064]/50 transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                  alt="12 Phòng Chụp Studio"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#251A1E] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
                  <BuildingLibraryIcon className="w-3.5 h-3.5 text-[#F3ACB8]" />
                  <span>12 Không Gian Studio</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-serif-luxury text-white mb-2 group-hover:text-[#F3ACB8] transition-colors">
                    Không Gian Bối Cảnh Độc Bản
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    Phòng Pastel Hàn Quốc, Cung Điện Hoàng Gia, Ban Công Hoàng Hôn, Cổ Điển Vintage lấy 100% hình ảnh thực tế từ CSDL.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoToBooking('?roomId=1')}
                  className="cursor-pointer text-xs font-bold text-[#F3ACB8] group-hover:text-white flex items-center gap-1.5 transition-colors pt-2 border-t border-white/10"
                >
                  <span>Chọn Phòng & Đặt Lịch</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </SpotlightCard>
          </ScrollReveal>

          {/* Card 2: 8 Gói chụp nghệ thuật */}
          <ScrollReveal direction="up" delay={0.2}>
            <SpotlightCard
              spotlightColor="rgba(243, 172, 184, 0.15)"
              className="p-0 overflow-hidden rounded-3xl border border-white/10 bg-[#251A1E]/80 backdrop-blur-md shadow-2xl flex flex-col h-full group hover:border-[#B85064]/50 transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                  alt="8 Gói Chụp Nghệ Thuật"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#251A1E] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
                  <CameraIcon className="w-3.5 h-3.5 text-[#F3ACB8]" />
                  <span>8 Gói Chụp Trọn Gói</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-serif-luxury text-white mb-2 group-hover:text-[#F3ACB8] transition-colors">
                    Dịch Vụ Nhiếp Ảnh Chuyên Nghiệp
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    Trọn gói makeup làm tóc cao cấp, mượn trang phục thiết kế miễn phí, bàn giao toàn bộ file gốc và ảnh chỉnh sửa 4K.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoToBooking('?packageId=1')}
                  className="cursor-pointer text-xs font-bold text-[#F3ACB8] group-hover:text-white flex items-center gap-1.5 transition-colors pt-2 border-t border-white/10"
                >
                  <span>Chọn Gói & Đặt Lịch</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </SpotlightCard>
          </ScrollReveal>

          {/* Card 3: Ưu đãi 20% & Thanh toán VNPay */}
          <ScrollReveal direction="up" delay={0.3}>
            <SpotlightCard
              spotlightColor="rgba(243, 172, 184, 0.15)"
              className="p-0 overflow-hidden rounded-3xl border border-white/10 bg-[#251A1E]/80 backdrop-blur-md shadow-2xl flex flex-col h-full group hover:border-[#B85064]/50 transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Ưu đãi 20% Trực Tuyến"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#251A1E] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-[#B85064] px-3 py-1 rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                  <TicketIcon className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Mã Giảm 20%: STUDIO2026</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-serif-luxury text-white mb-2 group-hover:text-[#F3ACB8] transition-colors">
                    Chiết Khấu Độc Quyền Trực Tuyến
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    Giảm trực tiếp 20% trên giá gốc niêm yết khi đặt lịch. Thanh toán linh hoạt đặt cọc hoặc trọn gói qua VNPay Sandbox an toàn.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoToBooking()}
                  className="cursor-pointer text-xs font-bold text-[#F3ACB8] group-hover:text-white flex items-center gap-1.5 transition-colors pt-2 border-t border-white/10"
                >
                  <span>Áp Dụng Mã & Đặt Lịch</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </SpotlightCard>
          </ScrollReveal>

        </div>

        {/* MAIN CTA LUXURY ACTION BOX */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#2C1D23] via-[#38232B] to-[#251A1E] border border-white/15 shadow-2xl text-center max-w-4xl mx-auto overflow-hidden">
            <FloralCardCorner position="top-right" />
            <FloralCardCorner position="bottom-left" />

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white">
                <HeartIcon className="w-4 h-4 text-[#F3ACB8]" />
                <span>Hơn 3,500+ khách hàng đã tin tưởng trải nghiệm dịch vụ</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-luxury text-white leading-tight">
                Sẵn Sàng Ghi Lại Những Khoảnh Khắc Đẹp Nhất?
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                Nhấn nút bên dưới để chuyển trực tiếp đến trang Đặt Lịch Chuyên Nghiệp. Bạn có thể tự do chọn phòng, chọn gói, chọn ngày giờ và tiến hành thanh toán cọc hoặc trọn gói một cách tiện lợi nhất.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleGoToBooking()}
                  className="cursor-pointer w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-sm font-bold shadow-xl shadow-[#B85064]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                  <CalendarDaysIcon className="w-5 h-5 text-white" />
                  <ShinyText text="ĐẶT LỊCH CHỤP TRỰC TUYẾN NGAY" className="font-bold tracking-wider" />
                  <ArrowRightIcon className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to={ROUTES.USER.PACKAGES}
                  className="cursor-pointer w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold transition-all flex items-center justify-center"
                >
                  <span>Xem Tất Cả Gói Chụp</span>
                </Link>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-300">
                <div className="flex items-center justify-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Xác nhận lịch hẹn tức thì</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Đổi lịch miễn phí trước 24h</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-[#F3ACB8] shrink-0" />
                  <span>Cổng VNPay Sandbox bảo mật</span>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
