import React, { useState } from 'react';
import { AccordionItem } from '../components/common/AccordionItem';
import { PillTag } from '../components/ui/PillTag';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const faqs = [
    {
      id: 1,
      question: "What documents are required to scrap my vehicle?",
      answer: "You will need the original Registration Certificate (RC), a copy of the owner's Aadhaar card/PAN card, a cancelled cheque or bank passbook copy for payment, and a signed chassis imprint.",
    },
    {
      id: 2,
      question: "What is a Certificate of Deposit (COD) and why is it important?",
      answer: "A Certificate of Deposit (COD) is an official government-recognized document issued by an authorized RVSF upon vehicle handover. It legally proves you no longer possess the vehicle and unlocks up to 5% rebates & road tax concessions when purchasing a new vehicle.",
    },
    {
      id: 3,
      question: "How is my scrap vehicle valuation calculated?",
      answer: "Valuation is scientifically determined based on your vehicle's kerb weight, metal recovery yield, working reusable components, and live ferrous/non-ferrous market scrap rates with zero hidden deductions.",
    },
    {
      id: 4,
      question: "Do you offer free doorstep pickup and towing?",
      answer: "Yes! We provide 100% free doorstep inspection, vehicle evaluation, and towing pickup service across Gwalior, Hapur, and surrounding regions.",
    },
    {
      id: 5,
      question: "How does RC Cancellation work with RTO authorities?",
      answer: "Once your vehicle is scrapped at our RVSF, we issue the final Certificate of Vehicle Scrappage (CVS) and submit digital proof to the VAHAN database for official RTO RC cancellation.",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 bg-[#F4F6F5]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <PillTag>QUESTIONS & ANSWERS</PillTag>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 font-['Outfit']">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600 font-['Inter']">
            Clear answers to common questions about vehicle scrappage, legal RTO formalities, valuation, and doorstep pickup.
          </p>
        </div>

        {/* Collapsible Accordion Stack */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
