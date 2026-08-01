const Seo = require('../../models/Seo');

const SAMPLE_SEO = [
  {
    pageName: 'Home Page',
    url: '/',
    pageIdentifier: 'home',
    metaTitle: 'Car Scrap India | Government Authorized Vehicle Scrappage & RTO Certificate',
    metaDescription: 'Scrap your old car for maximum instant cash. Government-authorized RVSF facility with free doorstep pickup & official RTO deregistration certificate (COD).',
    keywords: ['car scrap', 'scrap my car', 'RTO certificate of deposit', 'instant car cash', 'delhi scrap yard'],
    canonicalUrl: 'https://carscrap.com/',
    openGraph: {
      ogTitle: 'Car Scrap India | Government Authorized Vehicle Scrappage & RTO Certificate',
      ogDescription: 'Scrap your old car for maximum instant cash. Government-authorized RVSF facility with free doorstep pickup & official RTO deregistration certificate (COD).',
      ogImage: 'https://carscrap.com/images/og-home.jpg',
      ogType: 'website',
      ogUrl: 'https://carscrap.com/',
    },
    status: 'ACTIVE',
  },
  {
    pageName: 'Services Page',
    url: '/services',
    pageIdentifier: 'services',
    metaTitle: 'Vehicle Scrapping Services | Doorstep Pickup, RTO Paperwork & Valuation',
    metaDescription: 'Explore our full range of car scrapping services including doorstep hydraulic towing, instant cash valuation, RTO deregistration, and fleet dismantling.',
    keywords: ['car scrap services', 'hydraulic pickup', 'rto rc cancellation', 'accident vehicle scrap'],
    canonicalUrl: 'https://carscrap.com/services',
    status: 'ACTIVE',
  },
  {
    pageName: 'About Us',
    url: '/about',
    pageIdentifier: 'about',
    metaTitle: 'About Us | India Premier Authorized Auto Recycler',
    metaDescription: 'Learn about Car Scrap Enterprises Pvt. Ltd. - India government-authorized eco-friendly vehicle dismantling facility and recycling leaders.',
    keywords: ['about car scrap', 'rvsf facility', 'eco friendly auto recycling'],
    canonicalUrl: 'https://carscrap.com/about',
    status: 'ACTIVE',
  },
  {
    pageName: 'Contact Us',
    url: '/contact',
    pageIdentifier: 'contact',
    metaTitle: 'Contact Us | Get Free Instant Car Scrap Quote',
    metaDescription: 'Contact Car Scrap Enterprises for instant car valuation quotes, free doorstep towing pickup scheduling, or RTO deregistration guidance.',
    keywords: ['contact car scrap', 'car valuation quote', 'scrap yard phone number'],
    canonicalUrl: 'https://carscrap.com/contact',
    status: 'ACTIVE',
  },
];

const seedSeo = async () => {
  try {
    console.log('🌱 Seeding SEO Metadata...');

    for (const item of SAMPLE_SEO) {
      let doc = await Seo.findOne({ url: item.url });
      if (!doc) {
        await Seo.create(item);
      }
    }

    console.log(`✅ Seeded ${SAMPLE_SEO.length} SEO Metadata Pages.`);
  } catch (error) {
    console.error('❌ Error seeding SEO:', error);
    throw error;
  }
};

module.exports = seedSeo;
