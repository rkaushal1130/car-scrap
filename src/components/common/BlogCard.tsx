import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export interface BlogCardProps {
  image: string;
  category: string;
  categoryVariant?: 'green' | 'blue';
  title: string;
  description: string;
  href?: string;
  delay?: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  image,
  category,
  categoryVariant = 'green',
  title,
  description,
  href = '#contact',
  delay = 0,
}) => {
  const badgeColors = {
    green: 'bg-[#0D7A41] text-white',
    blue: 'bg-blue-600 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#0D7A41] transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* Card Image Header with Category Badge & Zoom Effect */}
        <div className="h-56 overflow-hidden relative">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Floating Category Badge */}
          <span
            className={`absolute top-4 left-4 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md shadow-md ${badgeColors[categoryVariant]} font-['Outfit']`}
          >
            {category}
          </span>
        </div>

        {/* Card Content Body */}
        <div className="p-7">
          <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 font-['Outfit'] group-hover:text-[#0D7A41] transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-['Inter'] mb-6">
            {description}
          </p>
        </div>
      </div>

      {/* Read More Button Area */}
      <div className="px-7 pb-7 pt-0">
        <a
          href={href}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0D7A41] group-hover:gap-3.5 transition-all font-['Outfit']"
        >
          <span>Read More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
};
