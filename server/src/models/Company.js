const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      default: 'Car Scrap Enterprises Pvt. Ltd.',
    },
    gstNumber: {
      type: String,
      trim: true,
      default: '',
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    panNumber: {
      type: String,
      trim: true,
      default: '',
    },
    licenseNumber: {
      type: String,
      trim: true,
      default: '',
    },
    rtoLicenseNumber: {
      type: String,
      trim: true,
      default: '',
    },

    // Location & Postal Details
    address: {
      street: { type: String, trim: true, default: 'Plot 45, Industrial Scrap Zone, Phase II' },
      city: { type: String, trim: true, default: 'New Delhi' },
      state: { type: String, trim: true, default: 'Delhi NCR' },
      pincode: { type: String, trim: true, default: '110020' },
      country: { type: String, trim: true, default: 'India' },
      fullAddress: { type: String, trim: true, default: 'Plot 45, Industrial Scrap Zone, Phase II, New Delhi, Delhi NCR 110020' },
    },

    // Contact Information
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'support@carscrap.com',
    },
    phone: {
      type: String,
      trim: true,
      default: '+91 98765 43210',
    },
    alternatePhone: {
      type: String,
      trim: true,
      default: '+91 98765 43211',
    },
    emergencyNumber: {
      type: String,
      trim: true,
      default: '1800-123-4567',
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: 'https://carscrap.com',
    },
    googleMapsUrl: {
      type: String,
      trim: true,
      default: '',
    },
    businessHours: {
      type: String,
      trim: true,
      default: 'Mon - Sat: 9:00 AM - 7:00 PM',
    },

    // Company Background & Statements
    aboutCompany: {
      type: String,
      trim: true,
      default: 'India leading government-authorized vehicle dismantling facility.',
    },
    mission: {
      type: String,
      trim: true,
      default: 'To provide 100% eco-friendly, hassle-free vehicle scrapping with maximum cash value.',
    },
    vision: {
      type: String,
      trim: true,
      default: 'To build India most trusted national network for auto recycling and RTO scrapping certification.',
    },

    // Additional Support Fields
    tagline: {
      type: String,
      trim: true,
      default: 'Authorized Scrap Yard & Eco-Friendly Vehicle Recycling Platform',
    },
    socialLinks: {
      facebook: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    isSingleton: {
      type: Boolean,
      default: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Aliases
companySchema.virtual('city').get(function () {
  return this.address ? this.address.city : '';
});

companySchema.virtual('state').get(function () {
  return this.address ? this.address.state : '';
});

companySchema.virtual('country').get(function () {
  return this.address ? this.address.country : '';
});

companySchema.virtual('pincode').get(function () {
  return this.address ? this.address.pincode : '';
});

companySchema.virtual('website').get(function () {
  return this.websiteUrl;
});

companySchema.virtual('googleMaps').get(function () {
  return this.googleMapsUrl;
});

companySchema.virtual('pan').get(function () {
  return this.panNumber;
});

// Singleton Pattern Static Method
companySchema.statics.getSingletonInstance = async function () {
  let doc = await this.findOne({ isSingleton: true });
  if (!doc) {
    doc = await this.create({ isSingleton: true });
  }
  return doc;
};

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
