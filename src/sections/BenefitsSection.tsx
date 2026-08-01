import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Banknote, CheckCircle, ArrowRight } from 'lucide-react';
import { PillTag } from '../components/ui/PillTag';
import { Button } from '../components/ui/Button';

interface BenefitsSectionProps {
  onOpenCalculator?: () => void;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ onOpenCalculator }) => {
  return (
    <section id="benefits" className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        
        {/* Top Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <PillTag>THE BENEFITS</PillTag>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 font-['Outfit']">
              The Benefits of <span className="text-[#0D7A41]">Responsible Scrapping</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed font-['Inter']">
              Experience industrial-scale efficiency and environmental stewardship. Grand Global Junkyard turns your end-of-life vehicle into a sustainable asset for the planet and a financial gain for you.
            </p>

            <Button
              variant="green"
              size="lg"
              onClick={onOpenCalculator}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Get Your Rebate Certificate Now
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 group"
          >
            <img
              src="/images/container_main.webp"
              alt="Industrial Scrap Facility Scrapping Operations"
              width="700"
              height="450"
              loading="lazy"
              decoding="async"
              className="w-full h-[300px] sm:h-[380px] lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-white/40 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 font-['Outfit']">GRAND GLOBAL RVSF FACILITY</span>
              <span className="text-[11px] font-extrabold text-[#0D7A41] uppercase tracking-wider">Certified Recycling</span>
            </div>
          </motion.div>
        </div>

        {/* Section Divider & Subheading */}
        <div className="text-center max-w-2xl mx-auto mb-12 pt-6 border-t border-gray-100">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 font-['Outfit']">
            Impact That Matters
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 font-['Inter']">
            We bridge the gap between environmental responsibility and individual financial growth.
          </p>
        </div>

        {/* 2 Benefit Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Environmental Stewardship */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-[#F4F6F5] p-7 sm:p-9 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#0D7A41] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white text-[#0D7A41] rounded-xl flex items-center justify-center mb-5 shadow-xs border border-gray-100">
                <Leaf className="w-6 h-6" />
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-['Outfit']">
                Environmental Stewardship
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-['Inter'] mb-6">
                Our processes are engineered for the planet, ensuring zero hazardous waste reaches our ecosystems.
              </p>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm font-semibold text-gray-800 font-['Inter']">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#0D7A41] shrink-0 mt-0.5" />
                  <span>95% Recycling Yield diverting tons of metal from landfills</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#0D7A41] shrink-0 mt-0.5" />
                  <span>Scientific Disposal of fluids and hazardous components</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#0D7A41] shrink-0 mt-0.5" />
                  <span>Reduced Carbon Footprint via localized logistics</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl overflow-hidden h-48 border border-gray-200">
              <img
                src="/images/metal_bales_1.webp"
                alt="Environmental Scrap Metal Recycling"
                width="600"
                height="300"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

          {/* Card 2: Financial Rewards */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-[#F4F6F5] p-7 sm:p-9 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#0D7A41] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white text-[#0D7A41] rounded-xl flex items-center justify-center mb-5 shadow-xs border border-gray-100">
                <Banknote className="w-6 h-6" />
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-['Outfit']">
                Financial Rewards
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-['Inter'] mb-6">
                Maximize the liquid value of your scrap and unlock significant tax and purchase benefits.
              </p>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm font-semibold text-gray-800 font-['Inter']">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#0D7A41] shrink-0 mt-0.5" />
                  <span>New Car Rebate on production of RVSF certificate</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#0D7A41] shrink-0 mt-0.5" />
                  <span>Best Scrap Value based on live market metal rates</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#0D7A41] shrink-0 mt-0.5" />
                  <span>Tax Exemptions available on new vehicle registrations</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl overflow-hidden h-48 border border-gray-200">
              <img
                src="/images/scrap_4.webp"
                alt="Financial Rewards RVSF Certificate"
                width="600"
                height="300"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
