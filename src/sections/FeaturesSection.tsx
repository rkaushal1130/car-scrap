import React from 'react';
import { ShieldCheck, Truck, Coins, FileCheck, Sprout, Lock } from 'lucide-react';
import { FeatureCard } from '../components/common/FeatureCard';
import { PillTag } from '../components/ui/PillTag';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 1,
      numberStr: "01",
      icon: ShieldCheck,
      title: "Government Certified RVSF",
      description: "Fully licensed vehicle scrapping facility operating strictly under Ministry of Road Transport & Highways (MoRTH) and CPCB guidelines.",
    },
    {
      id: 2,
      numberStr: "02",
      icon: Truck,
      title: "Free Doorstep Pickup & Towing",
      description: "Zero-cost vehicle collection arranged from your location within hours across Gwalior and surrounding regions.",
    },
    {
      id: 3,
      numberStr: "03",
      icon: Coins,
      title: "Transparent Live Rate Valuation",
      description: "Scientifically calculated scrap payout based on live metal market rates and kerb weight with zero hidden deductions.",
    },
    {
      id: 4,
      numberStr: "04",
      icon: FileCheck,
      title: "Official RTO RC Cancellation",
      description: "Immediate issuance of Certificate of Deposit (COD) & Certificate of Vehicle Scrappage (CVS) required for RC cancellation.",
    },
    {
      id: 5,
      numberStr: "05",
      icon: Sprout,
      title: "Zero-Pollution Eco Recycling",
      description: "Strict environmental protection protocol with automated fluid extraction, battery neutralization, and 95% metal recovery.",
    },
    {
      id: 6,
      numberStr: "06",
      icon: Lock,
      title: "Instant Payout Guarantee",
      description: "Direct bank transfer or instant payout delivered immediately upon vehicle inspection before towing.",
    },
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-gradient-to-b from-[#F4F6F5] via-white to-[#F4F6F5]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <PillTag>TRUST & SECURITY</PillTag>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 font-['Outfit']">
            Why Vehicle Owners <span className="text-[#0D7A41]">Trust Us</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-['Inter'] leading-relaxed">
            Delivering seamless, transparent, and eco-friendly vehicle scrappage solutions engineered for maximum financial return, legal protection, and complete peace of mind.
          </p>
        </div>

        {/* Responsive Grid for 6 Professional Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <FeatureCard
              key={item.id}
              numberStr={item.numberStr}
              icon={item.icon}
              title={item.title}
              description={item.description}
              delay={index * 0.1}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
