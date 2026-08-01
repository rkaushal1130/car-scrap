import React from 'react';
import { X, ShieldCheck, Stamp } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certType: 'cod' | 'cvs' | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, certType }) => {
  if (!isOpen) return null;

  const title = certType === 'cod' 
    ? 'Certificate of Deposit (COD)' 
    : 'Certificate of Vehicle Scrap (CVS)';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="border-4 border-double border-[#0D7A41] p-6 bg-[#fffdf9] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-30deg] font-black text-4xl text-[#0D7A41] whitespace-nowrap">
            SAMPLE RVSF OFFICIAL CERTIFICATE
          </div>

          <div className="text-center border-b-2 border-[#0D7A41] pb-4 mb-5">
            <ShieldCheck className="w-12 h-12 text-[#0D7A41] mx-auto mb-2" />
            <h2 className="text-sm font-bold text-[#07542b] uppercase tracking-wider">GOVERNMENT REGISTERED VEHICLE SCRAPPING FACILITY</h2>
            <p className="text-xs font-semibold text-gray-700 mt-1">{title}</p>
          </div>

          <div className="space-y-3 text-xs text-gray-700 mb-6">
            <p>This is to certify that the vehicle bearing details below has been received and logged for eco-friendly dismantling under Central Motor Vehicles Rules:</p>
            <div className="bg-white p-4 border border-gray-200 rounded-lg space-y-2 font-mono text-[11px]">
              <div className="flex justify-between"><span>RVSF License No:</span> <strong>RVSF/MP/GWL/2023/004</strong></div>
              <div className="flex justify-between"><span>Chassis / Engine Verified:</span> <strong>YES - MATCHED</strong></div>
              <div className="flex justify-between"><span>Owner Legal Status:</span> <strong>Verified & Cleared</strong></div>
              <div className="flex justify-between"><span>Disposal Protocol:</span> <strong>Zero Hazardous Discharge</strong></div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="border-2 border-[#0D7A41] text-[#0D7A41] px-4 py-2 rounded-md font-bold text-xs flex items-center gap-2 -rotate-3">
              <Stamp className="w-4 h-4" /> RVSF APPROVED STAMP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
