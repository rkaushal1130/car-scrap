import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ProcessCardProps {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({
  number,
  icon: Icon,
  title,
  description,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#0D7A41] transition-all duration-300 flex flex-col items-center text-center relative group"
    >
      {/* Step Number Badge */}
      <div className="w-12 h-12 bg-[#0D7A41] text-white rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-[#0D7A41]/30 mb-4 group-hover:scale-110 transition-transform font-['Outfit']">
        {number}
      </div>

      {/* Icon */}
      <div className="w-10 h-10 bg-[#e6f4ec] text-[#0D7A41] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0D7A41] group-hover:text-white transition-colors duration-300">
        <Icon className="w-5 h-5" />
      </div>

      {/* Title */}
      <h3 className="font-bold text-base text-gray-900 mb-2 font-['Outfit'] group-hover:text-[#0D7A41] transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-600 leading-relaxed font-['Inter']">
        {description}
      </p>
    </motion.div>
  );
};
