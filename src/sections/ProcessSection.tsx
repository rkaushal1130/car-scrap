import React from 'react';
import { PhoneCall, Truck, Cog, BadgeCheck } from 'lucide-react';
import { ProcessCard } from '../components/common/ProcessCard';
import { PillTag } from '../components/ui/PillTag';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: PhoneCall,
      title: "Request a Quote",
      description: "Call us or fill out our form with your vehicle details. As a trusted dealer, we'll provide an instant estimate based on your vehicle's condition.",
    },
    {
      number: 2,
      icon: Truck,
      title: "Free Vehicle Pickup",
      description: "We'll schedule a convenient time to collect your vehicle from your location at no extra cost. Our team handles all the logistics.",
    },
    {
      number: 3,
      icon: Cog,
      title: "Documentation & Scrapping",
      description: "We handle all paperwork and legal formalities. Your vehicle is scrapped following environmentally friendly processes at our facility.",
    },
    {
      number: 4,
      icon: BadgeCheck,
      title: "Payment & Certificates",
      description: "Receive immediate payment for your vehicle along with an official disposal proof issued by our licensed facility.",
    },
  ];

  return (
    <section id="process" className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <PillTag>SIMPLE WORKFLOW</PillTag>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 font-['Outfit']">
            Our 4 Step Process
          </h2>
          <p className="text-sm text-gray-600 font-['Inter']">
            We handle everything from pickup to paperwork. Experience the simplest 4-step vehicle scrapping journey in the country.
          </p>
        </div>

        {/* Responsive Layout: Desktop Horizontal (4 cols) / Mobile Vertical (1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <ProcessCard
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              delay={index * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
