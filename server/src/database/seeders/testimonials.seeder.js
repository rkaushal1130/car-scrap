const Testimonial = require('../../models/Testimonial');

const SAMPLE_TESTIMONIALS = [
  {
    clientName: 'Rajesh Sharma',
    companyName: 'Sharma Logistics Solutions',
    designation: 'Fleet Operations Manager',
    location: 'New Delhi',
    rating: 5,
    reviewText:
      'Scrapped my 16-year-old Honda City effortlessly. They came to my home with a flatbed tow truck, checked all papers, paid cash instantly, and handed me the RTO COD receipt within 5 days. Highly professional team!',
    vehicleScrapped: 'Honda City 2008',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    status: 'APPROVED',
    isApproved: true,
    isFeatured: true,
    displayOrder: 1,
  },
  {
    clientName: 'Priya Mukherjee',
    companyName: 'Mukherjee Tech Solutions',
    designation: 'Senior HR Director',
    location: 'Gurugram',
    rating: 5,
    reviewText:
      'Got a fantastic valuation for my accident-damaged Maruti Swift. Other dealers offered peanuts, but Car Scrap Enterprises gave me full metal weight value and cleared the RC cancellation hassle-free.',
    vehicleScrapped: 'Maruti Swift Dzire 2014',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    status: 'APPROVED',
    isApproved: true,
    isFeatured: true,
    displayOrder: 2,
  },
  {
    clientName: 'Amitabh Verma',
    companyName: 'Verma Infrastructure',
    designation: 'Managing Director',
    location: 'Noida',
    rating: 5,
    reviewText:
      'Liquidated 4 commercial delivery vans from our fleet. Excellent bulk rate, proper GST tax invoicing, and complete RTO Certificate of Deposit provided for tax rebate on our new vehicles.',
    vehicleScrapped: 'Tata Ace Fleet (4 Vans)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    status: 'APPROVED',
    isApproved: true,
    isFeatured: true,
    displayOrder: 3,
  },
];

const seedTestimonials = async () => {
  try {
    console.log('🌱 Seeding Testimonials...');

    for (const item of SAMPLE_TESTIMONIALS) {
      let doc = await Testimonial.findOne({ clientName: item.clientName });
      if (!doc) {
        await Testimonial.create(item);
      }
    }

    console.log(`✅ Seeded ${SAMPLE_TESTIMONIALS.length} Testimonials.`);
  } catch (error) {
    console.error('❌ Error seeding Testimonials:', error);
    throw error;
  }
};

module.exports = seedTestimonials;
