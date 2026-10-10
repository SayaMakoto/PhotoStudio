import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import QuickContact from '../components/layout/QuickContact';

import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import Pricing from '../components/sections/Pricing';
import Gallery from '../components/sections/Gallery';
import BeforeAfter from '../components/sections/BeforeAfter';
import AboutStudio from '../components/sections/AboutStudio';
import Reviews from '../components/sections/Reviews';
import Booking from '../components/sections/Booking';

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
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-400 selection:text-neutral-950 font-sans">
      {/* Navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Content */}
      <main>
        <Hero onOpenBooking={handleOpenBooking} />
        <Stats />
        <Pricing onSelectPackage={handleSelectPackage} />
        <Gallery />
        <BeforeAfter />
        <AboutStudio />
        <Reviews />
        <Booking selectedPackage={selectedPackage} />
      </main>

      {/* Quick floating contact buttons */}
      <QuickContact onOpenBooking={handleOpenBooking} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
