const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      default: 'Car Scrap Enterprises Pvt. Ltd.',
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Authorized Scrap Yard & Eco-Friendly Vehicle Recycling Platform',
    },
    aboutText: {
      type: String,
      trim: true,
      default: 'India leading government-authorized vehicle dismantling facility.',
    },
    gstNumber: {
      type: String,
      trim: true,
      default: '',
    },
    rtoLicenseNumber: {
      type: String,
      trim: true,
      default: '',
    },
    emails: {
      primary: { type: String, trim: true, lowercase: true, default: 'support@carscrap.com' },
      support: { type: String, trim: true, lowercase: true, default: 'help@carscrap.com' },
      inquiries: { type: String, trim: true, lowercase: true, default: 'sales@carscrap.com' },
    },
    phones: {
      primary: { type: String, trim: true, default: '+91 98765 43210' },
      tollFree: { type: String, trim: true, default: '1800-123-4567' },
      whatsapp: { type: String, trim: true, default: '+91 98765 43210' },
    },
    address: {
      street: { type: String, trim: true, default: 'Plot 45, Industrial Scrap Zone, Phase II' },
      city: { type: String, trim: true, default: 'New Delhi' },
      state: { type: String, trim: true, default: 'Delhi NCR' },
      pincode: { type: String, trim: true, default: '110020' },
      country: { type: String, trim: true, default: 'India' },
      fullAddress: { type: String, trim: true, default: 'Plot 45, Industrial Scrap Zone, Phase II, New Delhi, Delhi NCR 110020' },
    },
    mapEmbedUrl: {
      type: String,
      trim: true,
      default: '',
    },
    workingHours: {
      weekdays: { type: String, trim: true, default: 'Mon - Sat: 9:00 AM - 7:00 PM' },
      sunday: { type: String, trim: true, default: 'Sun: Closed (Emergency Hotline Active)' },
    },
    socialLinks: {
      facebook: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    assets: {
      logoUrl: { type: String, default: '/images/logo.png' },
      faviconUrl: { type: String, default: '/favicon.svg' },
      bannerUrl: { type: String, default: '' },
    },
    isSingleton: {
      type: Boolean,
      default: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.statics.getSingletonInstance = async function () {
  let doc = await this.findOne({ isSingleton: true });
  if (!doc) {
    doc = await this.create({ isSingleton: true });
  }
  return doc;
};

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
