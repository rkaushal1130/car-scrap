import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ComparisonItem {
  icon: LucideIcon;
  text: React.ReactNode;
  isPositive: boolean;
}

export interface ComparisonCardProps {
  title: string;
  badgeText: string;
  variant: 'danger' | 'success';
  items: ComparisonItem[];
  children?: React.ReactNode;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title,
  badgeText,
  variant,
  items,
  children,
}) => {
  const isSuccess = variant === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={cn(
        "bg-white rounded-2xl overflow-hidden shadow-md border transition-all duration-300 flex flex-col justify-between hover:shadow-xl",
        isSuccess ? "border-t-4 border-t-[#0D7A41] border-gray-200" : "border-t-4 border-t-red-600 border-gray-200"
      )}
    >
      <div>
        {/* Header Badge */}
        <div className={cn("p-6 text-white", isSuccess ? "bg-[#0D7A41]" : "bg-red-800")}>
          <h3 className="text-xl sm:text-2xl font-bold font-['Outfit']">{title}</h3>
          <span className="text-xs font-medium opacity-90 block mt-1">{badgeText}</span>
        </div>

        {/* Comparison Rows */}
        <ul className="p-6 space-y-4 text-xs sm:text-sm text-gray-700 font-['Inter']">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={idx} className="flex items-start gap-3 leading-snug">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 mt-0.5",
                    item.isPositive ? "text-[#0D7A41]" : "text-red-600"
                  )}
                />
                <span>{item.text}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Card Action Area */}
      {children && <div className="p-6 pt-0">{children}</div>}
    </motion.div>
  );
};
