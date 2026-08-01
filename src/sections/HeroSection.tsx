import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Leaf, Truck, Building2, Cog, FileCheck, RotateCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface HeroSectionProps {
  onOpenCalculator?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCalculator }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const ribbonItems = [
    { icon: Leaf, text: 'Eco-Friendly Recycling' },
    { icon: Truck, text: 'Vehicle Scrappage Service' },
    { icon: Building2, text: 'Industrial Scrap Management' },
    { icon: Cog, text: 'Metal Recovery Solution' },
    { icon: FileCheck, text: 'Authorized & Compliant Process' },
    { icon: RotateCw, text: 'Circular Economy Approach' },
  ];

  // Tripled list to ensure infinite seamless scrolling loop
  const tickerItems = [...ribbonItems, ...ribbonItems, ...ribbonItems];

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className="relative w-full bg-cover bg-center bg-no-repeat pt-12 sm:pt-20 pb-0 overflow-hidden"
      style={{ backgroundImage: "url('/images/hero_bg.png')" }}
    >
      {/* Semi-Transparent Soft White Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 text-left flex flex-col items-start pb-16 sm:pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start w-full max-w-5xl lg:max-w-6xl"
        >
          {/* Overline Badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-block px-4 py-1.5 bg-[#e6f4ec] text-[#0D7A41] text-xs font-bold uppercase tracking-wider rounded-md mb-5 border border-[#0D7A41]/20 font-['Outfit'] shadow-xs">
              GOVERNMENT RVSF AUTHORIZED FACILITY
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.12] mb-6 font-['Outfit'] max-w-5xl"
          >
            TRANSFORMING SCRAP<br />
            <span className="text-[#0D7A41] inline-block">INTO SUSTAINABLE RESOURCES</span>
          </motion.h1>

          {/* Subheading / Lead Text */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg lg:text-xl text-gray-700 font-medium mb-9 leading-relaxed max-w-4xl font-['Inter']"
          >
            Grand Global Junkyard & Recycling LLP is committed to responsible vehicle recycling, metal recovery, industrial scrap management, and sustainable waste solutions. We help businesses and individuals convert end-of-life assets into valuable resources while protecting the environment.
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <Button
              variant="green"
              size="lg"
              onClick={onOpenCalculator}
              aria-label="Calculate instant scrap value quote"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Get Instant Quote
            </Button>
            <a href="#contact" className="w-full sm:w-auto">
              <Button
                variant="dark"
                size="lg"
                block
                aria-label="Navigate to contact form"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Contact Us
              </Button>
            </a>
          </motion.div>

        </motion.div>
      </div>

      {/* Hero Bottom Infinite Moving Marquee Ticker */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative z-10 w-full bg-[#051A10] text-white py-4 border-t-4 border-[#0D7A41] overflow-hidden select-none"
      >
        <div className="flex w-max">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 25,
              ease: 'linear',
              repeat: Infinity,
            }}
            className="flex items-center gap-10 whitespace-nowrap pr-10"
          >
            {tickerItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2.5 text-xs font-semibold text-white/90 hover:text-emerald-400 transition-colors shrink-0 font-['Inter']"
                >
                  <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item.text}</span>
                  <span className="ml-6 text-emerald-500/50">•</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
