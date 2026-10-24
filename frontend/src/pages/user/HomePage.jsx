import { useState } from 'react';
import Hero from '../../components/user/sections/Hero';
import Stats from '../../components/user/sections/Stats';
import Pricing from '../../components/user/sections/Pricing';
import Gallery from '../../components/user/sections/Gallery';
import BeforeAfter from '../../components/user/sections/BeforeAfter';
import AboutStudio from '../../components/user/sections/AboutStudio';
import Reviews from '../../components/user/sections/Reviews';
import Booking from '../../components/user/sections/Booking';

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
    <>
      <Hero onOpenBooking={handleOpenBooking} />
      <Stats />
      <Pricing onSelectPackage={handleSelectPackage} />
      <Gallery />
      <BeforeAfter />
      <AboutStudio />
      <Reviews />
      <Booking selectedPackage={selectedPackage} />
    </>
  );
}
