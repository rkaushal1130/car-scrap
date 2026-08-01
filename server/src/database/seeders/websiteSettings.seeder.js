const WebsiteSetting = require('../../models/WebsiteSetting');

const seedWebsiteSettings = async () => {
  try {
    console.log('🌱 Seeding Website Settings...');

    let settings = await WebsiteSetting.findOne({ isSingleton: true });

    const settingsData = {
      websiteName: 'Car Scrap India',
      branding: {
        logoUrl: '/images/logo.png',
        darkLogoUrl: '/images/logo-dark.png',
        faviconUrl: '/favicon.svg',
      },
      contactInfo: {
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        email: 'info@carscrap.com',
        address: 'Plot 45, Industrial Scrap Zone, Okhla Phase II, New Delhi 110020',
        googleMap: 'https://maps.google.com/?q=28.5355,77.2610',
        openingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
      },
      socialLinks: {
        facebook: 'https://facebook.com/carscrapindia',
        instagram: 'https://instagram.com/carscrapindia',
        linkedin: 'https://linkedin.com/company/carscrapindia',
        twitter: 'https://twitter.com/carscrapindia',
        youtube: 'https://youtube.com/carscrapindia',
      },
      theme: {
        primaryColor: '#0D7A41',
        secondaryColor: '#15803D',
      },
      footer: {
        footerText: 'Government Authorized Vehicle Scrappage Facility. Instant Cash Payout, Doorstep Free Towing & Official RTO De-Registration Certificate.',
        copyright: '© 2026 Car Scrap Enterprises Pvt. Ltd. All rights reserved.',
      },
      system: {
        maintenanceMode: false,
        analyticsCode: 'G-XXXXXXX123',
      },
      isSingleton: true,
    };

    if (!settings) {
      settings = await WebsiteSetting.create(settingsData);
      console.log('✅ Website Settings created.');
    } else {
      Object.assign(settings, settingsData);
      await settings.save();
      console.log('✅ Website Settings updated.');
    }

    return settings;
  } catch (error) {
    console.error('❌ Error seeding Website Settings:', error);
    throw error;
  }
};

module.exports = seedWebsiteSettings;
