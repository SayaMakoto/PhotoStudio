import {
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowUpIcon,
  SparklesIcon,
  HeartIcon
} from '@heroicons/react/24/solid';
import Magnet from '../animations/Magnet';
import ScrollReveal from '../animations/ScrollReveal';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-white/10 pt-20 pb-12 text-neutral-400 text-sm relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top VIP Invitation Bar with ScrollReveal */}
        <ScrollReveal direction="down">
          <div className="mb-16 p-8 rounded-3xl bg-neutral-900/70 border border-amber-500/30 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-amber-500/5">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-13 h-13 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40 shadow-md">
                <SparklesIcon className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Bạn Cần Tư Vấn Concept Độc Bản Riêng?</h4>
                <p className="text-xs text-neutral-300 mt-1">Nhiếp ảnh gia và Stylist của chúng tôi sẵn sàng lắng nghe ý tưởng của bạn.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:0901234567"
                className="px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all border border-amber-500/30 flex items-center gap-2 shadow-sm"
              >
                <PhoneIcon className="w-4 h-4 text-amber-400" />
                <span>Gọi 0901 234 567</span>
              </a>
              <a
                href="#booking"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 text-xs font-extrabold shadow-lg shadow-amber-500/30 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <SparklesIcon className="w-4 h-4 text-white" />
                <span>Giữ Lịch Trực Tuyến</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Col 1 & 2: Brand Info & Vibrant Social Icons */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#hero" className="flex items-center gap-3 group w-fit">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                <CameraIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-wider text-white font-sans">
                PHOTO<span className="text-amber-400 font-extrabold">STUDIO</span>
              </span>
            </a>

            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm font-light">
              Hệ thống phòng chụp ảnh nghệ thuật, ảnh cưới và thương mại chuyên nghiệp. Nơi lưu giữ những khoảnh khắc quý giá nhất của cuộc đời bạn bằng ánh sáng và cảm xúc.
            </p>

            {/* Vibrant, High-Contrast Social Icons (NEVER BLACK) */}
            <div className="flex items-center gap-3.5 pt-3">
              {/* Facebook */}
              <Magnet padding={30} magnetStrength={3}>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-[#1877F2]/15 border border-[#1877F2]/40 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#1877F2]/10 group cursor-pointer hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              </Magnet>

              {/* Instagram */}
              <Magnet padding={30} magnetStrength={3}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg shadow-rose-500/10 group cursor-pointer hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </Magnet>

              {/* YouTube */}
              <Magnet padding={30} magnetStrength={3}>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-red-600/15 border border-red-600/40 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg shadow-red-600/10 group cursor-pointer hover:scale-110"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </Magnet>
            </div>
          </div>

          {/* Col 3: Gói Chụp Ảnh */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Gói Chụp Ảnh
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a href="#services" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Chụp Ảnh Cưới Studio B
                </a>
              </li>
              <li>
                <a href="#services" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Concept Nàng Thơ / Cá Nhân
                </a>
              </li>
              <li>
                <a href="#services" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Chụp Ảnh Gia Đình VIP
                </a>
              </li>
              <li>
                <a href="#services" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Trang Điểm & Làm Tóc
                </a>
              </li>
              <li>
                <a href="#services" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Thuê Váy Cưới & Tuxedo
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Khám Phá Studio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Khám Phá Studio
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a href="#gallery" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Bộ Sưu Tập Nghệ Thuật
                </a>
              </li>
              <li>
                <a href="#studios" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Hệ Thống 3 Phòng Studio
                </a>
              </li>
              <li>
                <a href="#studios" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Dàn Thiết Bị Full-Frame
                </a>
              </li>
              <li>
                <a href="#booking" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Ưu Đãi Mùa Cưới 2026
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-neutral-300 hover:text-amber-400 hover:translate-x-1.5 inline-block transition-all duration-200">
                  Đánh Giá Khách Hàng (5.0★)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Liên Hệ Trực Tiếp */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Thông Tin Liên Hệ
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-neutral-200">Số 88 Phố Tràng Thi, Hoàn Kiếm, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-neutral-200">0901 234 567 / 0912 345 678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <EnvelopeIcon className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-neutral-200">contact@photostudio.com</span>
              </li>
              <li className="pt-2 text-neutral-200 text-[11px] bg-neutral-900 border border-white/10 p-3 rounded-xl shadow-inner">
                ⏰ Giờ mở cửa: <strong className="text-amber-300">08:00 - 21:00</strong> tất cả các ngày
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar with Back-to-Top Button */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p className="flex items-center gap-1.5 text-neutral-300">
            <span>© 2026 PhotoStudio. Được tạo nên với</span>
            <HeartIcon className="w-4 h-4 text-rose-500 fill-rose-500 inline-block" />
            <span>và Nghệ Thuật Ánh Sáng.</span>
          </p>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="text-neutral-300 hover:text-amber-400 transition-colors">
              Chính Sách Bảo Mật
            </a>
            <a href="#terms" className="text-neutral-300 hover:text-amber-400 transition-colors">
              Điều Khoản Dịch Vụ
            </a>
            
            {/* Smooth Back to Top Button */}
            <Magnet padding={20} magnetStrength={2}>
              <button
                onClick={scrollToTop}
                className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 border border-amber-500/40 text-amber-400 hover:text-white hover:bg-amber-500 flex items-center justify-center transition-all duration-300 shadow-lg shadow-amber-500/10 hover:scale-110"
                title="Lên đầu trang"
                aria-label="Lên đầu trang"
              >
                <ArrowUpIcon className="w-5 h-5 text-amber-400" />
              </button>
            </Magnet>
          </div>
        </div>

      </div>
    </footer>
  );
}
