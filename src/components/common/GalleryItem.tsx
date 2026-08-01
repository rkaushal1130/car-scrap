import React from 'react';
import { motion } from 'framer-motion';

export interface GalleryItemProps {
  image: string;
  title: string;
  category?: string;
  delay?: number;
  className?: string;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({
  image,
  title,
  category = "RVSF Facility",
  delay = 0,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      className={`relative rounded-2xl overflow-hidden shadow-md border border-gray-200 group cursor-pointer ${className}`}
    >
      {/* Lazy Loaded Industrial Image with Hover Zoom Effect */}
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

      {/* Caption & Overlay Badge */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex flex-col justify-end transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1 font-['Outfit']">
          {category}
        </span>
        <h4 className="font-bold text-sm sm:text-base leading-snug font-['Outfit'] text-white">
          {title}
        </h4>
      </div>
    </motion.div>
  );
};
