import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ShieldCheck, CheckCircle, Facebook, Instagram, Linkedin, MessageCircle, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B130E] text-gray-400 pt-16 border-t-4 border-[#0D7A41] overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-10 pb-14">
        
        {/* Col 1: Logo & Company Bio & Social Icons */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-white text-xl font-bold font-['Outfit']">
            <img
              src="/images/logo.png"
              alt="Grand Global Junkyard & Recycling LLP Logo"
              className="h-11 w-auto object-contain bg-white/95 p-1 rounded-lg shadow-sm"
            />
            <div>
              <span className="block text-base leading-tight">GRAND GLOBAL</span>
              <span className="block text-[10px] text-[#0D7A41] font-extrabold uppercase tracking-wider font-['Inter']">
                JUNKYARD & RECYCLING LLP
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed font-['Inter']">
            GRAND GLOBAL JUNKYARD & RECYCLING LLP is a premier government-authorized vehicle recycling facility (RVSF). We provide eco-friendly disposal for end-of-life vehicles with legal COD & CVS proof.
          </p>

          {/* Social Icons */}
          <div className="flex gap-2.5 pt-2">
            <motion.a
              whileHover={{ y: -3, backgroundColor: '#0D7A41' }}
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center text-xs transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ y: -3, backgroundColor: '#0D7A41' }}
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center text-xs transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ y: -3, backgroundColor: '#0D7A41' }}
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center text-xs transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ y: -3, backgroundColor: '#0D7A41' }}
              href="https://wa.me/917838791313"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center text-xs transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

        {/* Col 2: Services List */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-5 font-['Outfit'] border-b border-white/10 pb-2">
            Our Services
          </h4>
          <ul className="space-y-3 text-xs font-['Inter']">
            {[
              'Vehicle Scraping',
              'Metal Recovery Solution',
              'Industrial Scrap Management',
              'Certificate of Deposit (COD)',
              'Certificate of Vehicle Scrap (CVS)',
              'RC Cancellation Assistance',
            ].map((service) => (
              <li key={service}>
                <a href="#services" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#0D7A41] group-hover:translate-x-1 transition-transform" />
                  <span>{service}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact & Authorized Facility Card */}
        <div className="space-y-4">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-5 font-['Outfit'] border-b border-white/10 pb-2">
            Contact Us
          </h4>

          <ul className="space-y-3 text-xs font-['Inter'] mb-5">
            <li className="flex gap-3">
              <MapPin className="w-4 h-4 text-[#0D7A41] shrink-0 mt-0.5" />
              <span>KHASRA NO 328, Gulaothi Masuri Road, Ravali, Mussoorie Gulawathi Road Industrial Area, Hapur, UP 201015</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-4 h-4 text-[#0D7A41] shrink-0 mt-0.5" />
              <a href="tel:+917838791313" className="hover:text-white transition-colors">+91-7838791313</a>
            </li>
            <li className="flex gap-3">
              <Mail className="w-4 h-4 text-[#0D7A41] shrink-0 mt-0.5" />
              <a href="mailto:info@grandglobalrecycling.com" className="hover:text-white transition-colors">info@grandglobalrecycling.com</a>
            </li>
          </ul>

          {/* RVSF Badge Card */}
          <div className="bg-[#0D7A41]/15 border border-[#0D7A41]/30 p-4.5 rounded-xl text-white">
            <ShieldCheck className="w-7 h-7 text-emerald-400 mb-2" />
            <h5 className="font-bold text-xs font-['Outfit'] mb-1">AUTHORIZED RVSF FACILITY</h5>
            <p className="text-[11px] text-gray-300 mb-2 leading-relaxed">
              Fully licensed by government RTO authorities and CPCB for legal vehicle disposal.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> 100% LEGAL SCRAPPAGE
            </span>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 py-5 text-xs text-[#9ca3af] font-['Inter']">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 GRAND GLOBAL JUNKYARD & RECYCLING LLP. All Rights Reserved. Government Authorized RVSF Scrap Facility.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
