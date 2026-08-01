const Company = require('../../models/Company');

const seedCompany = async () => {
  try {
    console.log('🌱 Seeding Company Information...');

    let company = await Company.findOne({ isSingleton: true });

    const companyData = {
      companyName: 'Car Scrap Enterprises Pvt. Ltd.',
      gstNumber: '07AAAAA0000A1Z5',
      registrationNumber: 'U50100DL2018PTC333999',
      panNumber: 'AAAAA0000A',
      licenseNumber: 'RTO/DL/SCRAP/2021/089',
      rtoLicenseNumber: 'RTO/DL/SCRAP/2021/089',
      tagline: 'Government Authorized Scrap Yard & Eco-Friendly Vehicle Recycling Platform',
      address: {
        street: 'Plot 45, Industrial Scrap Zone, Okhla Phase II',
        city: 'New Delhi',
        state: 'Delhi NCR',
        pincode: '110020',
        country: 'India',
        fullAddress: 'Plot 45, Industrial Scrap Zone, Okhla Phase II, New Delhi, Delhi NCR 110020',
      },
      email: 'info@carscrap.com',
      phone: '+91 98765 43210',
      alternatePhone: '+91 98765 43211',
      emergencyNumber: '1800-123-4567',
      websiteUrl: 'https://carscrap.com',
      googleMapsUrl: 'https://maps.google.com/?q=28.5355,77.2610',
      businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
      aboutCompany:
        'Car Scrap Enterprises Pvt. Ltd. is India’s premier government-authorized vehicle dismantling and recycling facility. We provide hassle-free car scrapping, official RTO Certificate of Deposit (COD), and instant doorstep cash payouts.',
      mission:
        'To provide 100% eco-friendly, legally compliant vehicle scrapping with maximum scrap value and hassle-free paper cancellation.',
      vision:
        'To lead India’s transition toward sustainable green auto-recycling and circular economy metal recovery.',
      socialLinks: {
        facebook: 'https://facebook.com/carscrapindia',
        instagram: 'https://instagram.com/carscrapindia',
        twitter: 'https://twitter.com/carscrapindia',
        linkedin: 'https://linkedin.com/company/carscrapindia',
        youtube: 'https://youtube.com/carscrapindia',
      },
      isSingleton: true,
    };

    if (!company) {
      company = await Company.create(companyData);
      console.log('✅ Company Information created.');
    } else {
      Object.assign(company, companyData);
      await company.save();
      console.log('✅ Company Information updated.');
    }

    return company;
  } catch (error) {
    console.error('❌ Error seeding Company Information:', error);
    throw error;
  }
};

module.exports = seedCompany;
