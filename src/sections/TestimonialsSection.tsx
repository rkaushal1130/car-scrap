import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck, Coins, Clock, Sprout } from 'lucide-react';
import { TestimonialCard } from '../components/common/TestimonialCard';
import { PillTag } from '../components/ui/PillTag';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Sharma",
      vehicle: "Scrapped Maruti Swift (2008)",
      initials: "RS",
      rating: 5,
      review: "Scrapping my 16-year-old diesel car was stress-free. Grand Global Junkyard handled the doorstep towing, paid me the exact quoted amount, and provided the official Certificate of Deposit on the spot!",
    },
    {
      id: 2,
      name: "Vikram Singh",
      vehicle: "Scrapped Hyundai i20 (2009)",
      initials: "VS",
      rating: 5,
      review: "Highest scrap price in Gwalior by far! Their team came to my office, verified the RC documents, and transferred the funds instantly to my bank account before loading the vehicle.",
    },
    {
      id: 3,
      name: "Amit Patel",
      vehicle: "Scrapped Tata Ace Truck",
      initials: "AP",
      rating: 5,
      review: "Professionalism at its best. They guided me through the entire RTO RC cancellation process and gave me the official CVS proof. Highly recommended for commercial vehicle scrappage!",
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section aria-label="Customer Reviews" className="py-16 sm:py-20 bg-[#F4F6F5]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <PillTag>CLIENT TESTIMONIALS</PillTag>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 font-['Outfit']">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-600 font-['Inter']">
            Real feedback from vehicle owners who experienced our hassle-free, government-certified scrappage service.
          </p>
        </div>

        {/* Testimonial Carousel Box */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <TestimonialCard
                  name={testimonials[currentIndex].name}
                  vehicle={testimonials[currentIndex].vehicle}
                  initials={testimonials[currentIndex].initials}
                  rating={testimonials[currentIndex].rating}
                  review={testimonials[currentIndex].review}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              aria-label="Previous Testimonial"
              className="w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-[#0D7A41] hover:text-white hover:border-[#0D7A41] transition-all shadow-sm focus:outline-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-gray-500 font-['Outfit']">
              {currentIndex + 1} / {testimonials.length}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next Testimonial"
              className="w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-[#0D7A41] hover:text-white hover:border-[#0D7A41] transition-all shadow-sm focus:outline-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5-Metric Value Ribbon */}
        <div className="mt-14 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-gray-700 font-['Outfit']">
          <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="w-4 h-4 text-[#0D7A41] shrink-0" />
            <span>Official RVSF Facility</span>
          </div>
          <div className="flex items-center gap-2 justify-center border-l border-gray-100">
            <Coins className="w-4 h-4 text-[#0D7A41] shrink-0" />
            <span>Instant Digital Payout</span>
          </div>
          <div className="flex items-center gap-2 justify-center border-l border-gray-100">
            <Clock className="w-4 h-4 text-[#0D7A41] shrink-0" />
            <span>Same-Day Towing Pickup</span>
          </div>
          <div className="flex items-center gap-2 justify-center border-l border-gray-100">
            <Sprout className="w-4 h-4 text-[#0D7A41] shrink-0" />
            <span>100% Green Recycling</span>
          </div>
        </div>
      </div>
    </section>
  );
};
