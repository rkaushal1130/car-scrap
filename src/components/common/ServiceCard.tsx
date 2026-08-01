import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight } from 'lucide-react';

export interface ServiceCardProps {
  image: string;
  icon: LucideIcon;
  title: string;
  description: string;
  onAction?: () => void;
  actionText?: string;
  delay?: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  image,
  icon: Icon,
  title,
  description,
  onAction,
  actionText = "Learn More",
  delay = 0,
}) => {
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
        {/* Card Image Container with Zoom Hover Effect */}
        <div className="h-48 overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
          
          {/* Floating Icon Container */}
          <div className="absolute bottom-3 left-4 w-10 h-10 bg-[#0D7A41] text-white rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-2 font-['Outfit'] group-hover:text-[#0D7A41] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-['Inter'] mb-4">
            {description}
          </p>
        </div>
      </div>

      {/* Learn More Button / Link */}
      <div className="px-6 pb-6 pt-0">
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0D7A41] group-hover:gap-3 transition-all cursor-pointer font-['Outfit']"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
