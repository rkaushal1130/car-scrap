import React from 'react';
import { Counter } from '../components/common/Counter';

export const StatsSection: React.FC = () => {
  const stats = [
    { target: 500, suffix: "+", label: "Happy Customers" },
    { target: 1200, suffix: "+", label: "Vehicles Scrapped" },
    { target: 3, suffix: "+", label: "Years Experience" },
    { target: 100, suffix: "%", label: "Customer Satisfaction" },
  ];

  return (
    <section aria-label="Company Key Metrics" className="py-14 bg-[#051A10] border-t border-[#0D7A41]/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white font-['Outfit']">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-400 mb-1">
              <Counter target={stat.target} suffix={stat.suffix} />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-300 font-['Outfit'] uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
