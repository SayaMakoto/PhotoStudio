import { useState } from 'react';
import Hero from '../../components/user/sections/Hero';
import Stats from '../../components/user/sections/Stats';
import Pricing from '../../components/user/sections/Pricing';
import Gallery from '../../components/user/sections/Gallery';
import BeforeAfter from '../../components/user/sections/BeforeAfter';
import AboutStudio from '../../components/user/sections/AboutStudio';
import Reviews from '../../components/user/sections/Reviews';
import Booking from '../../components/user/sections/Booking';
import { FloralBranchCorner, ScatteredPetals } from '../../components/common/FloralDecorations';

export default function HomePage() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = () => {
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
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
      <Booking selectedPackage={selectedPackage} />

      {/* Cánh hoa đào bay phất phơ trải đều khắp chiều cao Trang Chủ từ trên xuống dưới */}
      <ScatteredPetals className="z-20 pointer-events-none" />
    </div>
  );
}
