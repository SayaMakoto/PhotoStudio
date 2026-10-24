import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import QuickContact from './QuickContact';

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
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white selection:bg-amber-400 selection:text-neutral-950 font-sans">
      <Navbar onOpenBooking={handleOpenBooking} />
      <main className="flex-1">
        <Outlet />
      </main>
      <QuickContact onOpenBooking={handleOpenBooking} />
      <Footer />
    </div>
  );
}
