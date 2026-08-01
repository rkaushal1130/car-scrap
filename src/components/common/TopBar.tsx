import React from 'react';
import { MapPin, Mail, Clock, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#0B130E] text-gray-300 text-xs sm:text-sm py-2.5 border-b border-white/10 hidden md:block">
      <div className="w-full px-5 sm:px-10 lg:px-14 flex justify-between items-center">
        <div className="flex items-center gap-8 xl:gap-12">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0D7A41] shrink-0" />
            <span>KHASRA NO 328, Gulaothi Masuri Road, Ravali, Hapur, UP 201015</span>
          </span>
          <a href="mailto:info@grandglobalrecycling.com" className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail className="w-4 h-4 text-[#0D7A41] shrink-0" />
            <span>info@grandglobalrecycling.com</span>
          </a>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0D7A41] shrink-0" />
            <span>Mon-Sat 09:00 AM - 6:00 PM</span>
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-[#0D7A41] transition-colors p-1" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
          <a href="#" className="hover:text-[#0D7A41] transition-colors p-1" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
          <a href="#" className="hover:text-[#0D7A41] transition-colors p-1" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
          <a href="https://wa.me/917838791313" target="_blank" rel="noreferrer" className="hover:text-[#0D7A41] transition-colors p-1" aria-label="WhatsApp"><MessageCircle className="w-4 h-4" /></a>
        </div>
      </div>
    </div>
  );
};
