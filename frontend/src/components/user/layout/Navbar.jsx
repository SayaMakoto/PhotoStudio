import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CameraIcon, 
  BellAlertIcon, 
  Bars3Icon, 
  XMarkIcon, 
  PhoneIcon, 
  CalendarDaysIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import Magnet from '../../animations/Magnet';
import { ROUTES } from '../../../routes/web';
import { customerAuth } from '../../../lib/axiosCustomer';
import customerAuthService from '../../../services/user/authService';

export default function Navbar({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [user, setUser] = useState(() => {
    return customerAuth.isAuthenticated() ? customerAuth.getUser() : null;
  });

  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('dismiss_user_info_reminder') === 'true';
  });

  // Lắng nghe sự kiện cập nhật profile để tự động cập nhật banner theo thời gian thực
  useEffect(() => {
    const handleProfileUpdated = (e) => {
      if (e.detail) {
        setUser(e.detail);
      } else {
        setUser(customerAuth.getUser());
      }
    };

    window.addEventListener('user_profile_updated', handleProfileUpdated);
    window.addEventListener('storage', handleProfileUpdated);

    return () => {
      window.removeEventListener('user_profile_updated', handleProfileUpdated);
      window.removeEventListener('storage', handleProfileUpdated);
    };
  }, []);

  const isAuth = customerAuth.isAuthenticated();
  const hasPhone = Boolean(user?.phone && user.phone.trim());
  const hasAddress = Boolean(user?.address && user.address.trim());
  const isMissingPhone = !hasPhone;
  const isMissingAddress = !hasAddress;
  const showReminder = isAuth && (isMissingPhone || isMissingAddress) && !isDismissed;

  const handleDismissReminder = () => {
    sessionStorage.setItem('dismiss_user_info_reminder', 'true');
    setIsDismissed(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    customerAuth.clearAuth();
    setUser(null);
    void customerAuthService.logout();
    window.location.href = ROUTES.USER.HOME;
  };

  const handleScrollToTop = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  };

  const navLinks = [
    { name: 'Trang Chủ', href: ROUTES.USER.HOME, isRoute: true, onClick: handleScrollToTop },
    { name: 'Gói Chụp & Báo Giá', href: ROUTES.USER.PACKAGES, isRoute: true },
    { name: 'Bộ Sưu Tập', href: ROUTES.USER.GALLERY, isRoute: true },
    { name: 'Không Gian Studio', href: ROUTES.USER.STUDIOS, isRoute: true },
    { name: 'Đánh Giá', href: ROUTES.USER.REVIEWS, isRoute: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || [ROUTES.USER.BOOKING, ROUTES.USER.PAYMENT, ROUTES.USER.MY_BOOKINGS].includes(location.pathname)
          ? 'bg-[#141012]/95 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl shadow-black/80'
          : showReminder
          ? 'bg-[#141012]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={handleScrollToTop} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#BE4B5E] to-[#E295A2] flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform duration-300">
              <CameraIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-white font-sans flex items-center gap-1.5">
                PHOTO<span className="text-[#E899A8] font-extrabold">STUDIO</span>
              </span>
              <p className="text-[10px] text-rose-200/70 tracking-widest uppercase font-medium">
                Art & Cinematic Photography
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.isRoute && location.pathname === link.href;
              const linkClasses = `text-sm font-medium transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#E899A8] after:transition-all after:duration-300 ${
                isActive
                  ? 'text-[#E899A8] font-bold after:w-full'
                  : 'text-neutral-300 hover:text-[#E899A8] after:w-0 hover:after:w-full'
              }`;

              return link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={link.onClick}
                  className={linkClasses}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className={linkClasses}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-1.5 bg-[#1E171A] p-1 pr-2 rounded-full border border-rose-500/30">
                <Link
                  to={ROUTES.USER.PROFILE}
                  className="flex items-center gap-2 text-xs font-semibold text-rose-200 hover:text-white px-2.5 py-1 rounded-full hover:bg-white/10 transition-all group"
                  title="Xem và chỉnh sửa hồ sơ cá nhân"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#BE4B5E] to-[#E295A2] flex items-center justify-center text-white text-[10px] font-bold overflow-hidden shadow-xs shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{(user.fullname || '').trim().split(/\s+/).filter(Boolean).pop()?.charAt(0).toUpperCase() || user.username?.trim().charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className="font-medium text-[13px] max-w-[120px] truncate">
                    {user.fullname || user.username || 'Khách Hàng'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer p-1.5 rounded-full text-rose-300/70 hover:text-rose-300 hover:bg-rose-500/20 transition-all"
                  title="Đăng xuất tài khoản"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="relative z-10 flex items-center gap-2 text-xs font-semibold text-neutral-200 hover:text-white transition-all py-2 px-4 rounded-full bg-[#1C1518]/90 border border-white/15 hover:border-rose-400/60 hover:bg-neutral-800 shadow-sm group"
              >
                <UserCircleIcon className="w-4 h-4 text-[#E899A8] group-hover:scale-110 transition-transform" />
                <span>Đăng Nhập</span>
              </Link>
            )}

            <Magnet padding={0} magnetStrength={2.5} maxOffset={8}>
              <button
                onClick={onOpenBooking}
                className="cursor-pointer relative group overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white font-bold text-sm shadow-lg shadow-rose-900/40 hover:shadow-rose-700/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <CalendarDaysIcon className="w-4 h-4 text-white" />
                <span>Đặt Lịch Ngay</span>
              </button>
            </Magnet>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-neutral-900 border border-white/15 text-[#E899A8] hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6 text-[#E899A8]" /> : <Bars3Icon className="w-6 h-6 text-[#E899A8]" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 bg-[#161214]/98 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-white/15">
            {navLinks.map((link) => {
              const linkClasses = "text-base font-medium text-neutral-200 hover:text-[#E899A8] py-1";
              return link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (link.onClick) link.onClick(e);
                  }}
                  className={linkClasses}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={linkClasses}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {user ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-white/10">
                  <Link
                    to={ROUTES.USER.PROFILE}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-rose-300 hover:text-white transition-colors"
                  >
                    <UserCircleIcon className="w-5 h-5 text-[#E899A8]" />
                    <span>Chào, {user.fullname || user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-rose-400 hover:underline cursor-pointer"
                  >
                    Đăng Xuất
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={ROUTES.AUTH.LOGIN}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-200 py-2.5 rounded-xl bg-neutral-900 border border-white/15 hover:border-rose-400/50 transition-colors"
                  >
                    <UserCircleIcon className="w-4 h-4 text-[#E899A8]" />
                    <span>Đăng Nhập</span>
                  </Link>
                  <Link
                    to={ROUTES.AUTH.REGISTER}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-sm font-bold text-white py-2.5 rounded-xl bg-gradient-to-r from-[#BE4B5E] to-[#A8394C] shadow-md transition-colors"
                  >
                    <span>Đăng Ký</span>
                  </Link>
                </div>
              )}

              <a
                href="tel:0901234567"
                className="flex items-center justify-center gap-2 text-sm text-neutral-200 py-2.5 rounded-xl bg-neutral-900 border border-rose-500/30"
              >
                <PhoneIcon className="w-4 h-4 text-[#E899A8]" />
                <span>Hotline: 0901 234 567</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenBooking) onOpenBooking();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50"
              >
                <CalendarDaysIcon className="w-4 h-4 text-white" />
                <span>Đặt Lịch Chụp Ngay</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* THANH THÔNG BÁO NHẮC NHỞ CẬP NHẬT SĐT & ĐỊA CHỈ DƯỚI THANH MENU */}
      {showReminder && (
        <div className="w-full mt-2.5 bg-gradient-to-r from-[#201217]/95 via-[#311622]/95 to-[#201217]/95 border-t border-[#BE4B5E]/30 border-b border-[#BE4B5E]/40 backdrop-blur-xl shadow-md transition-all animate-fade-in py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-rose-100">
            {/* Lời nhắc nhở tinh tế, không ép buộc */}
            <div className="flex items-center gap-2.5 text-left w-full sm:w-auto">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[#E899A8] border border-rose-500/30">
                <BellAlertIcon className="w-3 h-3" />
              </span>
              <p className="leading-snug text-neutral-200">
                <span className="font-semibold text-[#E899A8]">Nhắc nhở nhẹ:</span>{' '}
                {isMissingPhone && isMissingAddress ? (
                  <>
                    Tài khoản của bạn chưa có <span className="text-white font-medium underline decoration-rose-400/50">Số điện thoại</span> và{' '}
                    <span className="text-white font-medium underline decoration-rose-400/50">Địa chỉ</span>.
                  </>
                ) : isMissingPhone ? (
                  <>
                    Tài khoản của bạn chưa có <span className="text-white font-medium underline decoration-rose-400/50">Số điện thoại</span>.
                  </>
                ) : (
                  <>
                    Tài khoản của bạn chưa có <span className="text-white font-medium underline decoration-rose-400/50">Địa chỉ</span>.
                  </>
                )}{' '}
                <span className="text-neutral-400 hidden sm:inline">
                  (Nếu bạn muốn đặt hàng hoặc đặt lịch chụp, vui lòng bổ sung để studio thuận tiện liên hệ và phục vụ nhé!)
                </span>
                <span className="text-neutral-400 sm:hidden">
                  (Cần bổ sung để liên hệ khi đặt lịch/đặt hàng)
                </span>
              </p>
            </div>

            {/* Các nút thao tác: Cập nhật ngay & Đóng */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Link
                to={ROUTES.USER.PROFILE}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#BE4B5E] to-[#A8394C] hover:brightness-110 text-white font-semibold text-[11px] shadow-sm transition-all"
              >
                <span>Cập nhật ngay</span>
              </Link>
              <button
                type="button"
                onClick={handleDismissReminder}
                title="Tạm đóng nhắc nhở"
                className="cursor-pointer p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Đóng nhắc nhở"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
