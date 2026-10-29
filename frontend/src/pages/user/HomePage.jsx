import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Hero from '../../components/user/sections/Hero';
import Stats from '../../components/user/sections/Stats';
import Pricing from '../../components/user/sections/Pricing';
import Gallery from '../../components/user/sections/Gallery';
import BeforeAfter from '../../components/user/sections/BeforeAfter';
import AboutStudio from '../../components/user/sections/AboutStudio';
import Reviews from '../../components/user/sections/Reviews';
import Booking from '../../components/user/sections/Booking';
import { FloralBranchCorner, ScatteredPetals } from '../../components/common/FloralDecorations';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingSuccess = location.state?.bookingSuccess;

  const dismissBookingSuccess = () => {
    navigate(location.pathname, { replace: true, state: null });
  };

  const handleSelectPackage = (pkgId) => {
    const targetUrl = `${ROUTES.USER.BOOKING}?packageId=${pkgId}`;
    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        state: {
          from: targetUrl,
          message: 'Vui lòng đăng nhập tài khoản để tiến hành đặt gói chụp này!',
        },
      });
    } else {
      navigate(targetUrl);
    }
  };

  const handleOpenBooking = () => {
    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        state: {
          from: ROUTES.USER.BOOKING,
          message: 'Vui lòng đăng nhập tài khoản để tiến hành đặt lịch chụp trực tuyến!',
        },
      });
    } else {
      navigate(ROUTES.USER.BOOKING);
    }
  };

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative overflow-hidden">
      {/* Họa tiết cành hoa nghệ thuật */}
      <FloralBranchCorner position="top-right" opacity="opacity-60" className="top-96 z-10" />
      <FloralBranchCorner position="bottom-left" opacity="opacity-55" className="bottom-[1800px] z-10" />
      <FloralBranchCorner position="bottom-right" opacity="opacity-60" className="bottom-[900px] z-10" />

      <Hero onOpenBooking={handleOpenBooking} />
      <Stats />
      <Pricing onSelectPackage={handleSelectPackage} />
      <Gallery />
      <BeforeAfter />
      <AboutStudio />
      <Reviews />
      <Booking />

      {/* Cánh hoa đào bay phất phơ trải đều khắp chiều cao Trang Chủ từ trên xuống dưới */}
      <ScatteredPetals className="z-20 pointer-events-none" />

      {bookingSuccess && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) dismissBookingSuccess();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-success-title"
            className="w-full max-w-md rounded-3xl border border-[#F2E8E9] bg-white p-7 text-center shadow-2xl"
          >
            <CheckCircleIcon className="mx-auto h-16 w-16 text-emerald-500" />
            <h2 id="booking-success-title" className="mt-4 text-2xl font-bold text-[#261A1E]">
              Đặt lịch thành công!
            </h2>
            {location.state?.bookingCode && (
              <p className="mt-2 text-sm font-semibold text-[#B85064]">
                Mã đơn: {location.state.bookingCode}
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-[#7A6C71]">
              {location.state?.message || 'Studio đã nhận được lịch đặt của bạn.'}
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate(ROUTES.USER.MY_BOOKINGS, { replace: true })}
                className="rounded-xl bg-[#B85064] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#A33D50]"
              >
                Xem lịch đã đặt
              </button>
              <button
                type="button"
                onClick={dismissBookingSuccess}
                className="rounded-xl border border-[#E8DCDE] px-4 py-3 text-sm font-semibold text-[#55464B] transition hover:bg-[#FAF5F5]"
              >
                Tiếp tục xem trang chủ
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
