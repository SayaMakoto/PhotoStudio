import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import BeforeAfterComparison from '../components/BeforeAfterComparison';
import StudioExperience from '../components/StudioExperience';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';

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
