import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CameraIcon, 
  SparklesIcon, 
  Bars3Icon, 
  XMarkIcon, 
  PhoneIcon, 
  CalendarDaysIcon,
  UserCircleIcon,
  // ArrowRightOnRectangleIcon
} from '@heroicons/react/24/solid';
import Magnet from '../../animations/Magnet';
import { ROUTES } from '../../../routes/web';

export default function Navbar({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang Chủ', href: '#hero' },
    { name: 'Gói Chụp & Báo Giá', href: '#services' },
    { name: 'Bộ Sưu Tập', href: '#gallery' },
    { name: 'Không Gian Studio', href: '#studios' },
    { name: 'Đánh Giá', href: '#testimonials' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/90 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl shadow-black/80'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
              <CameraIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-white font-sans flex items-center gap-1.5">
                PHOTO<span className="text-amber-400 font-extrabold">STUDIO</span>
              </span>
              <p className="text-[10px] text-amber-200/70 tracking-widest uppercase font-medium">
                Art & Cinematic Photography
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-300 hover:text-amber-400 transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">

            <Link
              to={ROUTES.AUTH.LOGIN}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-200 hover:text-white transition-all py-2 px-4 rounded-full bg-neutral-900/90 border border-white/15 hover:border-amber-400/60 hover:bg-neutral-800 shadow-sm group"
            >
              <UserCircleIcon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Đăng Nhập</span>
            </Link>

            <Magnet padding={40} magnetStrength={3}>
              <button
                onClick={onOpenBooking}
                className="cursor-pointer relative group overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <SparklesIcon className="w-4 h-4 text-white" />
                <span>Đặt Lịch Ngay</span>
              </button>
            </Magnet>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-neutral-900 border border-white/15 text-amber-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6 text-amber-400" /> : <Bars3Icon className="w-6 h-6 text-amber-400" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 bg-neutral-950/98 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-white/15">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-200 hover:text-amber-400 py-1"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={ROUTES.AUTH.LOGIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-200 py-2.5 rounded-xl bg-neutral-900 border border-white/15 hover:border-amber-400/50 transition-colors"
                >
                  <UserCircleIcon className="w-4 h-4 text-amber-400" />
                  <span>Đăng Nhập</span>
                </Link>
                <Link
                  to={ROUTES.AUTH.REGISTER}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-neutral-950 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md transition-colors"
                >
                  <span>Đăng Ký</span>
                </Link>
              </div>

              <a
                href="tel:0901234567"
                className="flex items-center justify-center gap-2 text-sm text-neutral-200 py-2.5 rounded-xl bg-neutral-900 border border-amber-500/30"
              >
                <PhoneIcon className="w-4 h-4 text-amber-400" />
                <span>Hotline: 0901 234 567</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenBooking) onOpenBooking();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
              >
                <CalendarDaysIcon className="w-4 h-4 text-white" />
                <span>Đặt Lịch Chụp Ngay</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
