const FAQ = require('../../models/FAQ');

const SAMPLE_FAQS = [
  {
    question: 'How is my car scrap value calculated?',
    answer:
      'Valuation depends on kerb weight (kg of steel/iron), engine size, battery condition, catalytic converter presence, and usable spare parts. We use transparent daily scrap metal market rates.',
    category: 'Pricing & Cash',
    displayOrder: 1,
    status: 'PUBLISHED',
    isFeatured: true,
  },
  {
    question: 'What documents are required to scrap a car in India?',
    answer:
      'You need the original Registration Certificate (RC), Owner Identity Proof (Aadhaar / PAN), Address Proof, Bank Details for cash transfer, and a signed Form 22 / Form 24 de-registration application.',
    category: 'Documents & Legal',
    displayOrder: 2,
    status: 'PUBLISHED',
    isFeatured: true,
  },
  {
    question: 'What is a Certificate of Deposit (COD)?',
    answer:
      'A Certificate of Deposit (COD) is an official government RTO document issued by a Registered Vehicle Scrapping Facility (RVSF). It proves your car was scrapped legally and unlocks up to 25% road tax discount on your next new vehicle purchase.',
    category: 'Documents & Legal',
    displayOrder: 3,
    status: 'PUBLISHED',
    isFeatured: true,
  },
  {
    question: 'Do you provide free towing pickup?',
    answer:
      'Yes! We offer 100% free doorstep pickup across Delhi NCR and major cities using hydraulic flatbed trucks. Zero hidden towing charges.',
    category: 'Pickup & Transport',
    displayOrder: 4,
    status: 'PUBLISHED',
    isFeatured: true,
  },
];

const seedFaqs = async () => {
  try {
    console.log('🌱 Seeding FAQs...');

    for (const item of SAMPLE_FAQS) {
      let doc = await FAQ.findOne({ question: item.question });
      if (!doc) {
        await FAQ.create(item);
      }
    }

    console.log(`✅ Seeded ${SAMPLE_FAQS.length} FAQs.`);
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
    throw error;
  }
};

module.exports = seedFaqs;
