import { Outlet } from 'react-router-dom';
import Navbar from '../components/user/layout/Navbar';
import Footer from '../components/user/layout/Footer';
import QuickContact from '../components/user/layout/QuickContact';

export default function UserLayout() {
  const handleOpenBooking = () => {
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#booking';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141012] text-white selection:bg-[#BE4B5E] selection:text-white font-sans">
      <Navbar onOpenBooking={handleOpenBooking} />
      <main className="flex-1">
        <Outlet />
      </main>
      <QuickContact onOpenBooking={handleOpenBooking} />
      <Footer />
    </div>
  );
}
