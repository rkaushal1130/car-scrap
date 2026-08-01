import React from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { PillTag } from '../components/ui/PillTag';
import { Button } from '../components/ui/Button';

export const OfficeMapSection: React.FC = () => {
  const fullAddress = "KHASRA NO 328, Gulaothi Masuri Road, Ravali, Mussoorie Gulawathi Road Industrial Area, Hapur, Uttar Pradesh, 201015";
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const iframeEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="location" className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <PillTag>LOCATION & MAP</PillTag>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 font-['Outfit']">
            City Office & Facility Map
          </h2>
          <p className="text-sm text-gray-600 font-['Inter']">
            Visit our authorized vehicle recycling facility in Hapur or reach out to our team for on-site vehicle inspections and scrap collection.
          </p>
        </div>

        {/* 2-Column Split Layout: Left Info (5 cols) / Right Map Iframe (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: Office Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-[#F4F6F5] p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0D7A41] text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                  <Building className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900 font-['Outfit']">
                    Grand Global Junkyard & Recycling
                  </h3>
                  <p className="text-xs text-[#0D7A41] font-bold uppercase tracking-wider font-['Inter']">
                    Government RVSF Facility
                  </p>
                </div>
              </div>

              {/* Office Details */}
              <div className="space-y-4 mb-8 text-xs sm:text-sm text-gray-700 font-['Inter']">
                <div className="flex gap-3.5 items-start">
                  <MapPin className="w-5 h-5 text-[#0D7A41] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-xs font-bold text-gray-900 mb-0.5 font-['Outfit']">
                      Facility & Office Address
                    </strong>
                    <p className="text-gray-700 leading-relaxed font-semibold">
                      {fullAddress}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center pt-3 border-t border-gray-200">
                  <Phone className="w-5 h-5 text-[#0D7A41] shrink-0" />
                  <div>
                    <strong className="block text-xs font-bold text-gray-900 font-['Outfit']">
                      Contact Hotline
                    </strong>
                    <a href="tel:+917838791313" className="text-xs font-bold text-[#0D7A41] hover:underline">
                      +91-7838791313
                    </a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center pt-3 border-t border-gray-200">
                  <Mail className="w-5 h-5 text-[#0D7A41] shrink-0" />
                  <div>
                    <strong className="block text-xs font-bold text-gray-900 font-['Outfit']">
                      Email Inquiries
                    </strong>
                    <a href="mailto:info@grandglobalrecycling.com" className="text-xs font-bold text-[#0D7A41] hover:underline">
                      info@grandglobalrecycling.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center pt-3 border-t border-gray-200">
                  <Clock className="w-5 h-5 text-[#0D7A41] shrink-0" />
                  <div>
                    <strong className="block text-xs font-bold text-gray-900 font-['Outfit']">
                      Operating Hours
                    </strong>
                    <span className="text-xs text-gray-600">Monday - Saturday: 09:00 AM - 06:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="green" block size="lg" icon={<ExternalLink className="w-4 h-4" />}>
                Get Google Maps Directions
              </Button>
            </a>
          </motion.div>

          {/* Right Side: Interactive Map Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md min-h-[380px] sm:min-h-[440px] relative"
          >
            <iframe
              title="Grand Global Junkyard & Recycling Location Map - Hapur RVSF Facility"
              src={iframeEmbedUrl}
              className="w-full h-full min-h-[380px] sm:min-h-[440px] border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
