import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Award, Users, Recycle, Headset, MapPin, Building, Phone, ArrowRight } from 'lucide-react';
import { PillTag } from '../components/ui/PillTag';
import { Button } from '../components/ui/Button';

export const PresenceSection: React.FC = () => {
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

  const stats = [
    {
      id: 1,
      icon: Award,
      value: "3+ Years",
      label: "Industry Experience",
      color: "text-white",
    },
    {
      id: 2,
      icon: Users,
      value: "Trusted by",
      label: "Hundreds of Happy Customers",
      color: "text-emerald-400",
    },
    {
      id: 3,
      icon: Recycle,
      value: "Eco-Friendly",
      label: "Responsible Recycling",
      color: "text-emerald-400",
    },
  ];

  return (
    <section id="presence" className="py-16 sm:py-20 bg-[#0B130E] text-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Content & Statistics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.div variants={fadeInUp}>
            <PillTag variant="dark">LIVE NETWORK</PillTag>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold text-white mb-3 font-['Outfit']">
            Our <span className="text-[#0D7A41]">Presence</span>
          </motion.h2>
          
          <motion.p variants={fadeInUp} className="text-sm text-gray-400 mb-8 font-['Inter']">
            Expanding across Central & North India with professional scrap solutions.
          </motion.p>

          {/* Statistics List */}
          <motion.div variants={fadeInUp} className="space-y-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0D7A41] transition-colors duration-300">
                    <Icon className={`w-6 h-6 ${stat.color} group-hover:text-white transition-colors`} />
                  </div>
                  <div>
                    <span className="font-extrabold text-lg text-white font-['Outfit'] mr-2">{stat.value}</span>
                    <span className="text-xs text-gray-400 font-['Inter']">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Help Box */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Headset className="w-7 h-7 text-[#0D7A41] shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white font-['Outfit']">Have Questions?</h4>
                <p className="text-xs text-gray-400 font-['Inter']">Our team is ready to assist you.</p>
              </div>
            </div>
            <a href="#contact">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Contact Us
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: Map Card & Location Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="bg-[#051A10] border border-[#0D7A41]/40 rounded-2xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden group">
            
            {/* Pulsing Pin Icon */}
            <div className="relative w-16 h-16 bg-[#0D7A41] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#0D7A41]/50 group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8 animate-bounce" />
              <span className="absolute inset-0 rounded-full bg-[#0D7A41] animate-ping opacity-30 pointer-events-none" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-['Outfit']">We Are Here</h3>
            <p className="text-xs text-gray-400 mb-8 font-['Inter']">Visit our authorized facility for professional vehicle recycling.</p>

            {/* Office Address & Phone Card */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-left space-y-4 mb-8">
              <div className="flex gap-3.5 items-start">
                <Building className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs font-bold text-white mb-1 font-['Outfit']">Our Facility Address</strong>
                  <p className="text-xs text-gray-300 leading-relaxed font-['Inter']">
                    KHASRA NO 328, Gulaothi Masuri Road, Ravali, Mussoorie Gulawathi Road Industrial Area, Hapur, Uttar Pradesh, 201015
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-center pt-3 border-t border-white/10">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-xs font-bold text-white mb-0.5 font-['Outfit']">Phone Number</strong>
                  <a href="tel:+917838791313" className="text-xs text-emerald-400 font-semibold hover:underline">
                    +91-7838791313
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a href="tel:+917838791313">
              <Button variant="orange" block size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Call Authorized Facility
              </Button>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
