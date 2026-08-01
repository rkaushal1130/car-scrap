import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Trees, Lightbulb, RotateCcw, Sun } from 'lucide-react';
import { BlogCard } from '../components/common/BlogCard';
import { PillTag } from '../components/ui/PillTag';

export const ArticlesSection: React.FC = () => {
  const articles = [
    {
      id: 1,
      image: "/images/car_dismantling_1.webp",
      category: "Recycling",
      categoryVariant: "green" as const,
      title: "The Importance of Responsible Vehicle Recycling",
      description: "Understand how responsible vehicle recycling helps protect the environment, prevent toxic fluid contamination, and conserve precious natural metal resources.",
      href: "#contact",
    },
    {
      id: 2,
      image: "/images/metal_bales_1.webp",
      category: "Metal Recovery",
      categoryVariant: "blue" as const,
      title: "How Metal Recycling Contributes to Sustainability",
      description: "Explore the role of industrial metal recovery in reducing industrial carbon emissions, saving energy, and supporting a circular economy.",
      href: "#contact",
    },
  ];

  const ecoBenefits = [
    { icon: Globe, text: "Reduces Environment Impact" },
    { icon: Trees, text: "Conserves Natural Resources" },
    { icon: Lightbulb, text: "Save Energy & Cost" },
    { icon: RotateCcw, text: "Supports Circular Economy" },
    { icon: Sun, text: "Creates a Cleaner Tomorrow" },
  ];

  // Tripled array for infinite seamless looping
  const tickerItems = [...ecoBenefits, ...ecoBenefits, ...ecoBenefits];

  return (
    <section id="blog" className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <PillTag>INSIGHTS & NEWS</PillTag>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 font-['Outfit']">
            Latest Articles & Sustainability
          </h2>
          <p className="text-sm text-gray-600 font-['Inter']">
            Stay informed with the latest updates on vehicle recycling, metal recovery, and sustainable environmental practices.
          </p>
        </div>

        {/* 2 Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {articles.map((article, index) => (
            <BlogCard
              key={article.id}
              image={article.image}
              category={article.category}
              categoryVariant={article.categoryVariant}
              title={article.title}
              description={article.description}
              href={article.href}
              delay={index * 0.15}
            />
          ))}
        </div>

        {/* Environmental Benefits Infinite Moving Ticker */}
        <div className="bg-[#F4F6F5] border border-gray-200 rounded-2xl p-4 overflow-hidden select-none">
          <div className="flex w-max">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 25,
                ease: 'linear',
                repeat: Infinity,
              }}
              className="flex items-center gap-8 sm:gap-12 whitespace-nowrap pr-12 text-xs sm:text-sm font-semibold text-gray-800 font-['Outfit']"
            >
              {tickerItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5 hover:text-[#0D7A41] transition-colors shrink-0">
                    <Icon className="w-4 h-4 text-[#0D7A41] shrink-0" />
                    <span>{item.text}</span>
                    <span className="ml-6 text-gray-300">•</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
