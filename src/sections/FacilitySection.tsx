import React from 'react';
import { GalleryItem } from '../components/common/GalleryItem';
import { PillTag } from '../components/ui/PillTag';

export const FacilitySection: React.FC = () => {
  const galleryItems = [
    {
      id: 1,
      title: "Advanced Industrial Dismantling & Shredding",
      category: "RVSF Operations",
      image: "/images/container_main.webp",
    },
    {
      id: 2,
      title: "Fluid Extraction & Depollution Bay",
      category: "Material Depollution",
      image: "/images/car_dismantling_1.webp",
    },
    {
      id: 3,
      title: "High-Density Ferrous Metal Baling",
      category: "Metal Processing",
      image: "/images/metal_bales_1.webp",
    },
    {
      id: 4,
      title: "Automated Heavy Scrap Machinery Zone",
      category: "Heavy Scrap",
      image: "/images/scrap_2.webp",
    },
    {
      id: 5,
      title: "Eco-Friendly Scrap Logistics Yard",
      category: "Facility Storage",
      image: "/images/scrapyard_facility_1.webp",
    },
    {
      id: 6,
      title: "Precision Scrap Metal Sorting & Recovery",
      category: "Material Recovery",
      image: "/images/scrap_3.webp",
    },
  ];

  return (
    <section id="facility" className="py-16 sm:py-24 bg-[#F4F6F5]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <PillTag>VISUAL TOUR</PillTag>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 font-['Outfit']">
            Our Facility & Industrial Operations
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-['Inter'] leading-relaxed">
            Take a visual tour of our government-certified Registered Vehicle Scrapping Facility (RVSF) and advanced metal recovery infrastructure.
          </p>
        </div>

        {/* Equal Size Grid Layout: 3 Columns with Equal Photo Heights and Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <GalleryItem
              key={item.id}
              image={item.image}
              title={item.title}
              category={item.category}
              className="h-72 sm:h-80 w-full"
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
