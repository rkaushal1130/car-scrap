import React from 'react';
import { FileCheck, ClipboardCheck, Ban, Truck, Globe, Building2 } from 'lucide-react';
import { ServiceCard } from '../components/common/ServiceCard';
import { PillTag } from '../components/ui/PillTag';

interface ServicesSectionProps {
  onOpenCertModal?: (type: 'cod' | 'cvs') => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenCertModal }) => {
  const services = [
    {
      id: "cod",
      title: "Certificate of Deposit (COD)",
      description: "Instant digital and physical proof of vehicle handover for full legal security and peace of mind.",
      image: "/images/scrap_6.webp",
      icon: FileCheck,
      actionText: "View Sample Certificate",
      onAction: () => onOpenCertModal?.('cod'),
    },
    {
      id: "cvs",
      title: "Certificate of Vehicle Scrap (CVS)",
      description: "The final official government document proving your vehicle has been scrapped following all environmental laws.",
      image: "/images/container_1.webp",
      icon: ClipboardCheck,
      actionText: "View Sample Certificate",
      onAction: () => onOpenCertModal?.('cvs'),
    },
    {
      id: "rc",
      title: "RC Cancellation Assistance",
      description: "Complete filing assistance for deregistration and official RC cancellation with relevant RTO authorities.",
      image: "/images/car_dismantling_1.webp",
      icon: Ban,
      actionText: "Learn More",
    },
    {
      id: "pickup",
      title: "Free Home Doorstep Pickups",
      description: "Zero-cost doorstep collection service across Gwalior and surrounding regions with instant payment.",
      image: "/images/scrap_4.webp",
      icon: Truck,
      actionText: "Schedule Pickup",
    },
    {
      id: "pan-india",
      title: "Pan India Scrappage Network",
      description: "Extending our professional scrappage network to facilitate long-distance logistics and cross-state paperwork.",
      image: "/images/scrapyard_facility_1.webp",
      icon: Globe,
      actionText: "Explore Coverage",
    },
    {
      id: "industrial",
      title: "Industrial Scrap Management",
      description: "Efficient collection, sorting, and recycling of heavy industrial scrap and machinery for sustainable solutions.",
      image: "/images/metal_bales_1.webp",
      icon: Building2,
      actionText: "Inquire Solutions",
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div>
            <PillTag>AUTHORIZED SERVICES</PillTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-['Outfit']">
              Our Services
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md md:text-right font-['Inter']">
            Fully authorized governmental procedures ensuring complete legal safety, transparent valuation, and zero-headache disposal for your assets.
          </p>
        </div>

        {/* Responsive Grid Layout for Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              image={service.image}
              icon={service.icon}
              title={service.title}
              description={service.description}
              actionText={service.actionText}
              onAction={service.onAction}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
