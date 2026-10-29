import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/user/layout/Navbar';
import Footer from '../components/user/layout/Footer';
import { ROUTES } from '../routes/web';
import { customerAuth } from '../lib/axiosCustomer';

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tự động cuộn lên đầu trang mỗi khi chuyển tuyến đường
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  const handleOpenBooking = () => {
    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        state: {
          from: ROUTES.USER.BOOKING,
          message: 'Vui lòng đăng nhập để tiến hành đặt lịch chụp tại PhotoStudio!',
        },
      });
    } else {
      navigate(ROUTES.USER.BOOKING);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141012] text-white selection:bg-[#BE4B5E] selection:text-white font-sans">
      <Navbar onOpenBooking={handleOpenBooking} />
      <main key={location.pathname} className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
