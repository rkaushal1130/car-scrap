const Service = require('../../models/Service');
const { slugify } = require('../../helpers/helpers');

const SAMPLE_SERVICES = [
  {
    title: 'Doorstep Car Pickup & Valuation',
    shortDescription: 'Free towing and instant on-the-spot cash payment right at your doorstep.',
    fullDescription:
      'Our team evaluates your old, accident-damaged, or end-of-life vehicle at your home. We handle free towing with hydraulic flatbed trucks and pay cash on the spot.',
    icon: 'Truck',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    bannerImageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200',
    features: ['Free Hydraulic Pickup', 'Instant Doorstep Cash', 'Zero Hidden Towing Fees', 'All Vehicle Types Accepted'],
    benefits: ['No hassle driving to scrap yard', 'Guaranteed highest market valuation', 'Safe legal paper handoff'],
    displayOrder: 1,
    status: 'PUBLISHED',
    isActive: true,
  },
  {
    title: 'RTO De-Registration & RC Cancellation',
    shortDescription: 'Complete official paperwork and RTO Certificate of Deposit (COD) issuing.',
    fullDescription:
      'We process official RC cancellation at the local RTO office, issue your Certificate of Deposit (COD), and protect you from future legal liability.',
    icon: 'FileCheck',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    bannerImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
    features: ['Government Authorized COD', 'RC Deregistered in RTO Vault', 'Chassis Number Stamping Cut Out', 'Legal Indemnity Receipt'],
    benefits: ['Full protection against vehicle misuse', 'Claim scrap discount on new car purchase', 'Complete peace of mind'],
    displayOrder: 2,
    status: 'PUBLISHED',
    isActive: true,
  },
  {
    title: 'Accident & Total Loss Scrapping',
    shortDescription: 'Maximum metal value for damaged, non-running, or insurance write-off cars.',
    fullDescription:
      'Get top scrap price for severely crashed, flooded, or non-functional vehicles. We work with insurance adjusters to issue valid destruction certificates.',
    icon: 'ShieldAlert',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
    bannerImageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',
    features: ['Instant Scrap Weight Pricing', 'Hydraulic Crane Extraction', 'Insurance Claim Assistance', 'Eco-Fluid Depollution'],
    benefits: ['Turn unsalvageable wreck into instant cash', 'Clear garage space effortlessly'],
    displayOrder: 3,
    status: 'PUBLISHED',
    isActive: true,
  },
  {
    title: 'Commercial Vehicle & Fleet Dismantling',
    shortDescription: 'Heavy-duty dismantling for buses, trucks, vans, and corporate fleets.',
    fullDescription:
      'High-capacity industrial scrapping for commercial transport fleets, corporate buses, trucks, and heavy construction equipment with bulk weight bonuses.',
    icon: 'Truck',
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
    bannerImageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200',
    features: ['Industrial Baler Dismantling', 'Bulk Fleet Pricing', 'Form 2 Scrapping Compliance', 'GST Tax Invoice Provided'],
    benefits: ['Maximizes fleet liquidation asset value', 'Complies with green fleet regulations'],
    displayOrder: 4,
    status: 'PUBLISHED',
    isActive: true,
  },
];

const seedServices = async () => {
  try {
    console.log('🌱 Seeding Services...');

    for (const serviceData of SAMPLE_SERVICES) {
      const slug = slugify(serviceData.title);
      let service = await Service.findOne({ slug });

      if (!service) {
        await Service.create({
          ...serviceData,
          slug,
          seoMeta: {
            metaTitle: `${serviceData.title} | Official Car Scrap`,
            metaDescription: serviceData.shortDescription,
            keywords: ['car scrap', 'vehicle dismantling', 'RTO COD certificate', 'towing pickup'],
          },
        });
      }
    }

    console.log(`✅ Seeded ${SAMPLE_SERVICES.length} Services.`);
  } catch (error) {
    console.error('❌ Error seeding Services:', error);
    throw error;
  }
};

module.exports = seedServices;
