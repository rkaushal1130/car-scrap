import React from 'react';
import { motion } from 'framer-motion';
import { StarRating } from '../ui/StarRating';

export interface TestimonialCardProps {
  name: string;
  vehicle: string;
  initials: string;
  rating?: number;
  review: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  vehicle,
  initials,
  rating = 5,
  review,
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white p-7 sm:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#0D7A41] transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        {/* 5-Star Rating */}
        <StarRating count={rating} />

        {/* Review Quote Text */}
        <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed mb-6 font-['Inter']">
          "{review}"
        </p>
      </div>

      {/* User Avatar & Details */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100">
        <div className="w-11 h-11 bg-[#e6f4ec] text-[#0D7A41] font-extrabold text-sm rounded-full flex items-center justify-center shrink-0 font-['Outfit'] shadow-xs">
          {initials}
        </div>
        <div>
          <strong className="block text-sm font-bold text-gray-900 font-['Outfit']">
            {name}
          </strong>
          <span className="inline-block text-[11px] font-medium text-gray-500 font-['Inter']">
            {vehicle}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
