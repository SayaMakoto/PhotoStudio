import { useNavigate } from 'react-router-dom';
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
    </div>
  );
}
