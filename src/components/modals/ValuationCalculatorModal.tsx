import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Info, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface ValuationCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ValuationCalculatorModal: React.FC<ValuationCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    regNumber: '',
    make: '',
    category: '',
    model: '',
    weightKg: '',
    pricingOption: 'standard',
  });

  const [result, setResult] = useState<{ min: number; max: number; co2Saved: string } | null>(null);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const weight = parseFloat(form.weightKg) || 1200;
    let baseRatePerKg = 24; // Rs per kg

    if (form.pricingOption === 'premium') baseRatePerKg = 28;
    if (form.pricingOption === 'certificate') baseRatePerKg = 22;

    const baseValue = weight * baseRatePerKg;
    const minVal = Math.round(baseValue * 0.95);
    const maxVal = Math.round(baseValue * 1.15);
    const co2 = (weight * 1.65).toFixed(0);

    setResult({
      min: minVal,
      max: maxVal,
      co2Saved: `${co2} kg CO2`,
    });
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white w-full max-w-4xl rounded-2xl p-6 sm:p-8 relative shadow-2xl my-8 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Close valuation calculator"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pr-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-['Outfit']">
                Check Your Vehicle Price
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-['Inter'] mt-1">
                Get an instant estimate of your vehicle's recycling value in just a few clicks.
              </p>
            </div>

            {/* System Ready Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-bold font-['Outfit']">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>SYSTEM READY</span>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs mb-6">
            {/* Card Header Title */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-base text-gray-900 font-['Outfit']">
                Vehicle Information
              </h3>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleCalculate} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Vehicle Registration Number */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-['Outfit']">
                    VEHICLE REGISTRATION NUMBER
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABC-1234-XY"
                    value={form.regNumber}
                    onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-['Inter'] focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block font-['Inter']">
                    Must match the legal registration plate exactly.
                  </span>
                </div>

                {/* 2. Vehicle Make */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-['Outfit']">
                    VEHICLE MAKE
                  </label>
                  <input
                    type="text"
                    placeholder="Manufacturer name (e.g. Maruti Suzuki, Hyundai)"
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-['Inter'] focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>

                {/* 3. Vehicle Category */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-['Outfit']">
                    VEHICLE CATEGORY
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-['Inter'] focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  >
                    <option value="">Select category...</option>
                    <option value="hatchback">Hatchback Car (Swift, i10, Alto)</option>
                    <option value="sedan">Sedan Car (City, Verna, Dzire)</option>
                    <option value="suv">SUV / MUV (Creta, Scorpio, Innova)</option>
                    <option value="twowheeler">Two Wheeler (Bike / Scooter)</option>
                    <option value="commercial">Commercial Truck / Bus</option>
                  </select>
                </div>

                {/* 4. Vehicle Model */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-['Outfit']">
                    VEHICLE MODEL
                  </label>
                  <input
                    type="text"
                    placeholder="Model or series variant (e.g. Swift VDi)"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-['Inter'] focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>

                {/* 5. RC Weight (KG) */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-['Outfit']">
                    RC WEIGHT
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 focus-within:border-blue-600">
                    <input
                      type="number"
                      placeholder="Gross weight"
                      value={form.weightKg}
                      onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 text-xs sm:text-sm font-['Inter'] focus:outline-none focus:bg-white transition-colors"
                    />
                    <div className="bg-gray-100 px-4 py-3 border-l border-gray-200 text-xs font-extrabold text-gray-600 flex items-center font-['Outfit']">
                      KG
                    </div>
                  </div>
                </div>

                {/* 6. Pricing Option */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-['Outfit']">
                    PRICING OPTION
                  </label>
                  <select
                    value={form.pricingOption}
                    onChange={(e) => setForm({ ...form, pricingOption: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-['Inter'] focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  >
                    <option value="standard">Standard Scrappage Valuation</option>
                    <option value="premium">Premium Metal Weight Rate</option>
                    <option value="certificate">RVSF Deposit Certificate Valuation</option>
                  </select>
                </div>

              </div>

              {/* Form Action Buttons */}
              <div className="pt-6 border-t border-gray-100 flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-bold hover:bg-gray-50 transition-colors font-['Outfit'] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md transition-colors font-['Outfit'] cursor-pointer"
                >
                  Check Price
                </button>
              </div>
            </form>
          </div>

          {/* Result Banner Payout Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#e6f4ec] border border-[#0D7A41] rounded-xl p-6 text-center mb-6 shadow-sm"
            >
              <span className="text-xs font-bold text-[#07542b] uppercase tracking-wider font-['Outfit']">
                ESTIMATED SCRAP PAYOUT
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0D7A41] my-2 font-['Outfit']">
                ₹{result.min.toLocaleString('en-IN')} - ₹{result.max.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs font-semibold text-[#07542b] font-['Inter']">
                Saves approx. {result.co2Saved} & includes free doorstep pickup with official RVSF Certificate of Deposit.
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <a href="#contact" onClick={onClose}>
                  <Button variant="orange" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                    BOOK FREE DOORSTEP PICKUP
                  </Button>
                </a>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-50 font-['Outfit']"
                >
                  Recalculate
                </button>
              </div>
            </motion.div>
          )}

          {/* 3 Bottom Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-['Inter']">
            
            {/* Card 1: Registration Tip */}
            <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1 font-['Outfit']">
                  REGISTRATION TIP
                </strong>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  Ensure the registration matches the format on the RC document for automatic toll sync.
                </p>
              </div>
            </div>

            {/* Card 2: Data Integrity */}
            <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl flex gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1 font-['Outfit']">
                  DATA INTEGRITY
                </strong>
                <p className="text-blue-800 text-[11px] leading-relaxed font-medium">
                  Entering precise weight ensures accurate fuel consumption projections.
                </p>
              </div>
            </div>

            {/* Card 3: Recent Adds */}
            <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl flex gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1 font-['Outfit']">
                  RECENT ADDS
                </strong>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  3 vehicles were successfully registered in the last 24 hours.
                </p>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
