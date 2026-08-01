import React, { useState, lazy, Suspense } from 'react';
import { TopBar } from '../components/common/TopBar';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

// Core Page Sections
import { HeroSection } from '../sections/HeroSection';
import { FeaturesSection } from '../sections/FeaturesSection';
import { ProcessSection } from '../sections/ProcessSection';
import { ComparisonSection } from '../sections/ComparisonSection';
import { ServicesSection } from '../sections/ServicesSection';
import { BenefitsSection } from '../sections/BenefitsSection';
import { FacilitySection } from '../sections/FacilitySection';
import { PresenceSection } from '../sections/PresenceSection';
import { StatsSection } from '../sections/StatsSection';
import { ArticlesSection } from '../sections/ArticlesSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { ContactSection } from '../sections/ContactSection';
import { FAQSection } from '../sections/FAQSection';
import { OfficeMapSection } from '../sections/OfficeMapSection';

// Lazy Loaded Modals for Performance Code-Splitting
const ValuationCalculatorModal = lazy(() =>
  import('../components/modals/ValuationCalculatorModal').then((mod) => ({ default: mod.ValuationCalculatorModal }))
);
const CertificateModal = lazy(() =>
  import('../components/modals/CertificateModal').then((mod) => ({ default: mod.CertificateModal }))
);

export const HomePage: React.FC = () => {
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certType, setCertType] = useState<'cod' | 'cvs' | null>(null);

  const handleOpenCertModal = (type: 'cod' | 'cvs') => {
    setCertType(type);
    setCertModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F4F6F5]">
      {/* Header Navigation Stack */}
      <TopBar />
      <Header onOpenCalculator={() => setCalcModalOpen(true)} />

      {/* Main Semantic Content */}
      <main id="main-content" className="flex-grow">
        <HeroSection onOpenCalculator={() => setCalcModalOpen(true)} />
        <FeaturesSection />
        <ProcessSection />
        <ComparisonSection onOpenCalculator={() => setCalcModalOpen(true)} />
        <ServicesSection onOpenCertModal={handleOpenCertModal} />
        <BenefitsSection onOpenCalculator={() => setCalcModalOpen(true)} />
        <FacilitySection />
        <PresenceSection />
        <StatsSection />
        <ArticlesSection />
        <TestimonialsSection />
        <ContactSection />
        <FAQSection />
        <OfficeMapSection />
      </main>

      {/* Semantic Footer */}
      <Footer />

      {/* Lazy Loaded Interactive Modals */}
      <Suspense fallback={null}>
        {calcModalOpen && (
          <ValuationCalculatorModal
            isOpen={calcModalOpen}
            onClose={() => setCalcModalOpen(false)}
          />
        )}
        {certModalOpen && (
          <CertificateModal
            isOpen={certModalOpen}
            onClose={() => setCertModalOpen(false)}
            certType={certType}
          />
        )}
      </Suspense>
    </div>
  );
};
