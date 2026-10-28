import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, StarIcon, TrophyIcon, CameraIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import BlurText from '../../animations/BlurText';
import ShinyText from '../../animations/ShinyText';
import TiltedCard from '../../cards/TiltedCard';
import Magnet from '../../animations/Magnet';
import ScrollReveal from '../../animations/ScrollReveal';
import userBannerService from '../../../services/user/bannerService';
import customerReviewService from '../../../services/user/reviewService';
import { ROUTES } from '../../../routes/web';
import { FloralBranchCorner, FloatingPetals } from '../../common/FloralDecorations';

export default function Hero({ onOpenBooking }) {
  const [heroData, setHeroData] = useState({
    badge: 'STUDIO NHIẾP ẢNH NGHỆ THUẬT & CƯỚI CHUYÊN NGHIỆP',
    awardBadge: '🏆 Không Gian Chụp Ảnh Nghệ Thuật Độc Bản',
    headline: 'Khoảnh Khắc Cảm Xúc',
    description: 'Không gian phòng chụp chuẩn điện ảnh, máy ảnh Full-Frame sắc nét cùng đội ngũ Makeup & Stylist chuyên nghiệp. Hãy để chúng tôi kể lại câu chuyện của bạn bằng ngôn ngữ ánh sáng.',
    imageSrc: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    imageTitle: 'Khoảnh Khắc Hạnh Phúc',
    imageSubtitle: 'Trang thiết bị chuyên nghiệp & Không gian sáng tạo',
    ratingText: '5.0 / 5.0',
    totalReviewsText: 'Chất lượng hàng đầu',
  });

  useEffect(() => {
    // 1. Tải Banner nổi bật từ CSDL
    void userBannerService
      .getAllBanners()
      .then((banners) => {
        if (Array.isArray(banners) && banners.length > 0) {
          const activeBanner = banners.find((b) => b.status === 'active') || banners[0];
          setHeroData((prev) => ({
            ...prev,
            badge: activeBanner.title || prev.badge,
            imageSrc: activeBanner.imageUrl || prev.imageSrc,
            imageTitle: activeBanner.title || prev.imageTitle,
          }));
        }
      })
      .catch((err) => {
        console.warn('[Hero] Lỗi tải banners:', err.message);
      });

    // 2. Tính toán điểm rating thực tế từ CSDL Reviews
    void customerReviewService
      .getAllReviews()
      .then((reviews) => {
        if (Array.isArray(reviews) && reviews.length > 0) {
          const avg = (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1);
          setHeroData((prev) => ({
            ...prev,
            ratingText: `${avg} / 5.0`,
            totalReviewsText: `${reviews.length} Lượt đánh giá`,
          }));
        }
      })
      .catch((err) => {
        console.warn('[Hero] Lỗi tải reviews:', err);
      });
  }, []);

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-24 flex items-center justify-center overflow-hidden bg-[#141012]">
      {/* Background Image & Cinematic Studio Effects với độ sáng rõ nét cao */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-65 scale-105 pointer-events-none"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/90 via-[#141012]/60 to-[#141012]/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#141012] pointer-events-none" />
      {/* Background Studio Glow & Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Chuyển sắc mượt mà xuống nền sáng bên dưới */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#FAF5F5] via-[#141012]/60 to-transparent pointer-events-none z-10" />

      {/* Hoa lá màu nước rải ở nền Hero */}
      <FloralBranchCorner position="top-left" opacity="opacity-80" />
      <FloralBranchCorner position="top-right" opacity="opacity-75" />
      <FloatingPetals count={8} opacity="opacity-55" />

      {/* Subtle Studio grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <ScrollReveal direction="down" duration={0.6}>
              {/* Shiny Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1619] border border-rose-500/40 backdrop-blur-md mb-6 shadow-inner shadow-rose-500/10">
                <SparklesIcon className="w-4 h-4 text-[#E899A8] animate-pulse" />
                <ShinyText
                  text={heroData.badge}
                  className="text-xs font-semibold tracking-wider text-rose-200"
                />
              </div>
            </ScrollReveal>

            {/* Main Headline */}
            <ScrollReveal direction="up" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.2] mb-6 font-serif-luxury">
                Lưu Giữ Trọn Vẹn{' '}
                <span className="block mt-2 font-serif-luxury">
                  <BlurText
                    text={heroData.headline}
                    delay={120}
                    animateBy="words"
                    direction="top"
                    className="bg-gradient-to-r from-rose-200 via-[#E899A8] to-rose-100 bg-clip-text text-transparent font-serif-luxury"
                  />
                </span>
                Bằng Nghệ Thuật Ánh Sáng
              </h1>
            </ScrollReveal>

            {/* Subtitle */}
            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed mb-8">
                {heroData.description}
              </p>
            </ScrollReveal>

            {/* CTA Group */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <Magnet padding={40} magnetStrength={3}>
                  <button
                    onClick={onOpenBooking}
                    className="cursor-pointer w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white font-bold text-base shadow-xl shadow-rose-950/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <span>Đặt Lịch Tư Vấn Ngay</span>
                    <ArrowRightIcon className="w-5 h-5 text-white" />
                  </button>
                </Magnet>

                <Link
                  to={ROUTES.USER.PACKAGES}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-base font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Xem Bảng Giá & Gói Chụp</span>
                </Link>
              </div>
            </ScrollReveal>

            {/* Trust Badges */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/15 text-[#E899A8] border border-rose-500/30 shadow-md">
                    <StarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{heroData.ratingText}</h4>
                    <p className="text-xs text-neutral-400">{heroData.totalReviewsText}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/15 text-[#E899A8] border border-rose-500/30 shadow-md">
                    <CameraIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full-Frame Gear</h4>
                    <p className="text-xs text-neutral-400">Sony & Canon Cinema</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/15 text-[#E899A8] border border-rose-500/30 shadow-md">
                    <ShieldCheckIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Cam Kết Chất Lượng</h4>
                    <p className="text-xs text-neutral-400">Hỗ trợ chụp lại miễn phí</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Tilted Hero Cards */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            <ScrollReveal direction="left" duration={0.9} className="w-full flex flex-col items-center">
              
              {/* Standalone Award Badge */}
              <div className="w-full max-w-[500px] lg:max-w-[520px] mb-4">
                <div className="flex items-center justify-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl bg-[#1C1619] border-2 border-rose-500/40 shadow-xl shadow-rose-950/20 backdrop-blur-md">
                  <TrophyIcon className="w-5 h-5 text-[#E899A8] shrink-0 animate-bounce" />
                  <span className="text-rose-200 font-extrabold text-xs sm:text-sm tracking-wide text-center">
                    {heroData.awardBadge}
                  </span>
                </div>
              </div>

              {/* Interactive 3D Tilted Card */}
              <div className="relative w-full flex justify-center">
                <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 via-transparent to-purple-500/20 rounded-[40px] blur-2xl opacity-70 pointer-events-none" />

                <TiltedCard
                  imageSrc={heroData.imageSrc}
                  altText="Photo Studio Hero Showcase"
                  captionText="PHOTOSTUDIO • ÁNH SÁNG & CẢM XÚC"
                  containerHeight="520px"
                  containerWidth="100%"
                  imageHeight="520px"
                  imageWidth="100%"
                  rotateAmplitude={12}
                  scaleOnHover={1.03}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="p-6 rounded-3xl bg-[#141012]/90 backdrop-blur-xl border border-rose-500/30 shadow-2xl flex flex-col gap-2 max-w-[90%]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#E899A8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <SparklesIcon className="w-3.5 h-3.5" />
                          <span>Studio Cao Cấp</span>
                        </span>
                        <span className="text-[11px] text-white bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/40 font-bold">
                          2026
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug font-serif-luxury">
                        {heroData.imageTitle}
                      </h3>
                      <p className="text-xs text-neutral-300 font-light leading-relaxed">
                        {heroData.imageSubtitle}
                      </p>
                    </div>
                  }
                />
              </div>

            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
