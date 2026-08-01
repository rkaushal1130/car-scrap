import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface FeatureCardProps {
  numberStr?: string;
  icon: LucideIcon;
  title: string;
  badge?: string;
  description: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  numberStr,
  icon: Icon,
  title,
  badge,
  description,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -7, transition: { duration: 0.25 } }}
      className="bg-white p-7 sm:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:border-[#0D7A41] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-full"
    >
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#0D7A41]/5 rounded-full blur-2xl group-hover:bg-[#0D7A41]/15 transition-all duration-500 pointer-events-none" />

      <div>
        {/* Top Header Row: Icon + Number Step/Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-13 h-13 bg-[#e6f4ec] text-[#0D7A41] rounded-2xl flex items-center justify-center group-hover:bg-[#0D7A41] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-[#0D7A41]/30">
            <Icon className="w-6 h-6" />
          </div>

          {numberStr && (
            <span className="text-xs font-black text-gray-300 font-['Outfit'] group-hover:text-[#0D7A41]/40 transition-colors">
              {numberStr}
            </span>
          )}
          {badge && !numberStr && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-[#0D7A41] rounded-md font-['Outfit']">
              {badge}
            </span>
          )}
        </div>

        {/* Feature Title */}
        <h3 className="font-extrabold text-lg text-gray-900 mb-2.5 font-['Outfit'] group-hover:text-[#0D7A41] transition-colors leading-snug">
          {title}
        </h3>

        {/* Feature Description */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-['Inter'] mb-6">
          {description}
        </p>
      </div>

      {/* Card Footer Link Accent */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-[#0D7A41] transition-colors">
        <span className="font-['Outfit'] uppercase tracking-wider text-[10px]">Verified Scrappage</span>
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </motion.div>
  );
};
