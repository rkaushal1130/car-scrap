import React from 'react';
import { X, Check, ArrowRight, ShieldCheck, Coins, Zap, Sprout } from 'lucide-react';
import { ComparisonCard, ComparisonItem } from '../components/common/ComparisonCard';
import { PillTag } from '../components/ui/PillTag';
import { Button } from '../components/ui/Button';

interface ComparisonSectionProps {
  onOpenCalculator?: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onOpenCalculator }) => {
  const traditionalItems: ComparisonItem[] = [
    { icon: X, text: "Inconsistent pricing with hidden deductions and surprise fees.", isPositive: false },
    { icon: X, text: "Lengthy paperwork delays and unverified payment transfers.", isPositive: false },
    { icon: X, text: "Unverified buyers with limited transparency on vehicle status.", isPositive: false },
    { icon: X, text: "Improper disposal methods that cause environmental contamination.", isPositive: false },
    { icon: X, text: "No dedicated customer support throughout the scrappage cycle.", isPositive: false },
    { icon: X, text: "Limited vehicle categories accepted with strict weight penalties.", isPositive: false },
  ];

  const grandGlobalItems: ComparisonItem[] = [
    { icon: Check, text: <><strong>3+ years</strong> of trusted RVSF vehicle recycling experience.</>, isPositive: true },
    { icon: Check, text: <>Fair & competitive valuation with <strong>zero hidden charges</strong>.</>, isPositive: true },
    { icon: Check, text: <><strong>Free doorstep inspection</strong> and instant hassle-free pickup.</>, isPositive: true },
    { icon: Check, text: <>Instant legal documentation and <strong>immediate payment transfer</strong>.</>, isPositive: true },
    { icon: Check, text: <><strong>100% eco-friendly dismantling</strong> following CPCB regulations.</>, isPositive: true },
    { icon: Check, text: <>Accepts <strong>Cars, Bikes, Scooters, Trucks, Buses & Heavy Scrap</strong>.</>, isPositive: true },
  ];

  return (
    <section id="why-us" className="py-16 sm:py-20 bg-[#F4F6F5]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <PillTag>THE CHOICE IS CLEAR</PillTag>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 font-['Outfit']">
            Why Choose Grand Global Junkyard?
          </h2>
          <p className="text-sm text-gray-600 font-['Inter']">
            Trusted by hundreds of vehicle owners for safe, transparent and environmentally responsible vehicle scrapping services. We make the entire process simple, fast and rewarding.
          </p>
        </div>

        {/* 2-Column Responsive Layout with Central VS Badge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative items-stretch">
          
          {/* Left Card: Traditional Scrap Dealers */}
          <ComparisonCard
            title="Traditional Scrap Dealers"
            badgeText="Not Always Reliable"
            variant="danger"
            items={traditionalItems}
          />

          {/* Center VS Badge */}
          <div className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-14 h-14 bg-[#051A10] text-white font-extrabold text-base rounded-full flex items-center justify-center border-4 border-white shadow-xl mx-auto my-[-20px] lg:my-0 z-20 font-['Outfit']">
            VS
          </div>

          {/* Right Card: Grand Global Junkyard */}
          <ComparisonCard
            title="Grand Global Junkyard"
            badgeText="✓ Trusted • Transparent • Eco-Friendly"
            variant="success"
            items={grandGlobalItems}
          >
            <Button
              variant="green"
              block
              onClick={onOpenCalculator}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              GET FREE VEHICLE VALUATION
            </Button>
          </ComparisonCard>
        </div>

        {/* Bottom Value Ribbon */}
        <div className="bg-[#07542b] text-white rounded-xl mt-12 p-5 flex flex-wrap justify-between items-center gap-4 text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Legal & Safe Process</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Best Market Value Guaranteed</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Quick Pickup & Instant Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Eco-Friendly & Sustainable</span>
          </div>
        </div>
      </div>
    </section>
  );
};
