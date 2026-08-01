import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PillTag } from '../components/ui/PillTag';
import { Button } from '../components/ui/Button';

interface ContactFormData {
  fullName: string;
  phone: string;
  vehicleDetails: string;
  location: string;
  message?: string;
}

export const ContactSection: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    console.log("Form Submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <PillTag>GET IN TOUCH</PillTag>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 font-['Outfit']">
            Contact & Scrap Valuation Request
          </h2>
          <p className="text-sm text-gray-600 font-['Inter']">
            Fill out the form below or call our support line for instant vehicle valuation, legal RTO advice, and doorstep pickup scheduling.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-[#051A10] text-white p-8 sm:p-10 rounded-2xl border border-[#0D7A41]/40 shadow-xl space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-['Outfit']">
                DIRECT HOTLINE
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1 mb-4 font-['Outfit']">
                Scrap Assistance Desk
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-['Inter']">
                Speak directly with our certified scrappage evaluators for instant rate quotes and doorstep towing logistics.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 text-xs sm:text-sm font-['Inter']">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-['Outfit'] mb-0.5">Authorized RVSF Yard</strong>
                  <span className="text-gray-300">KHASRA NO 328, Gulaothi Masuri Road, Ravali, Mussoorie Gulawathi Road Industrial Area, Hapur, UP 201015</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-2">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white font-['Outfit']">Instant Call Hotline</strong>
                  <a href="tel:+917838791313" className="text-emerald-400 font-bold hover:underline">
                    +91-7838791313
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-2">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white font-['Outfit']">Official Email</strong>
                  <a href="mailto:info@grandglobalrecycling.com" className="text-emerald-400 font-bold hover:underline">
                    info@grandglobalrecycling.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-2">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white font-['Outfit']">Working Hours</strong>
                  <span className="text-gray-300">Monday - Saturday: 09:00 AM - 06:00 PM</span>
                </div>
              </div>
            </div>

            {/* Compliance Badge Box */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3 mt-6">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-white font-['Outfit']">CPCB & MoRTH Compliant</h4>
                <p className="text-[11px] text-gray-400">Guaranteed COD & CVS certificate issuance.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-[#F4F6F5] p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm"
          >
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-[#e6f4ec] text-[#0D7A41] rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-['Outfit']">Valuation Request Received!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto font-['Inter']">
                  Thank you for submitting your vehicle details. Our RVSF team will contact you shortly with an official scrap payout estimate and pickup schedule.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-['Outfit']">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      {...register('fullName', { required: 'Full name is required' })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#0D7A41] focus:ring-1 focus:ring-[#0D7A41] transition-all font-['Inter']"
                    />
                    {errors.fullName && (
                      <span className="text-xs text-red-500 mt-1 block font-['Inter']">{errors.fullName.message}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-['Outfit']">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9+\s-]{10,15}$/,
                          message: 'Please enter a valid phone number',
                        },
                      })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#0D7A41] focus:ring-1 focus:ring-[#0D7A41] transition-all font-['Inter']"
                    />
                    {errors.phone && (
                      <span className="text-xs text-red-500 mt-1 block font-['Inter']">{errors.phone.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Vehicle Details */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-['Outfit']">
                      Vehicle Make & Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maruti Swift (2009)"
                      {...register('vehicleDetails', { required: 'Vehicle details are required' })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#0D7A41] focus:ring-1 focus:ring-[#0D7A41] transition-all font-['Inter']"
                    />
                    {errors.vehicleDetails && (
                      <span className="text-xs text-red-500 mt-1 block font-['Inter']">{errors.vehicleDetails.message}</span>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-['Outfit']">
                      Pickup Location / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gwalior / Hapur"
                      {...register('location', { required: 'Pickup location is required' })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#0D7A41] focus:ring-1 focus:ring-[#0D7A41] transition-all font-['Inter']"
                    />
                    {errors.location && (
                      <span className="text-xs text-red-500 mt-1 block font-['Inter']">{errors.location.message}</span>
                    )}
                  </div>
                </div>

                {/* Message / Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-['Outfit']">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention any specific vehicle condition or questions..."
                    {...register('message')}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#0D7A41] focus:ring-1 focus:ring-[#0D7A41] transition-all font-['Inter']"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="green"
                  size="lg"
                  block
                  icon={<Send className="w-4 h-4" />}
                >
                  Submit Valuation Request
                </Button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
