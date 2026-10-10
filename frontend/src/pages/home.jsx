import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import Services from '../components/sections/Services';
import Gallery from '../components/sections/Gallery';
import BeforeAfterComparison from '../components/sections/BeforeAfterComparison';
import StudioExperience from '../components/sections/StudioExperience';
import Testimonials from '../components/sections/Testimonials';
import CTA from '../components/sections/CTA';
import Footer from '../components/layout/Footer';
import FloatingActions from '../components/layout/FloatingActions';

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
        <Services onSelectPackage={handleSelectPackage} />
        <Gallery />
        <BeforeAfterComparison />
        <StudioExperience />
        <Testimonials />
        <CTA selectedPackage={selectedPackage} />
      </main>

      {/* Floating Action Buttons */}
      <FloatingActions onOpenBooking={handleOpenBooking} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
