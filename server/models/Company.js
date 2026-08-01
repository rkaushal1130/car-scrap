const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      default: 'Car Scrap Enterprise',
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Eco-Friendly Car Scrapping & Fair Valuation Platform',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      street: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      postalCode: { type: String, trim: true, default: '' },
      country: { type: String, trim: true, default: 'India' },
      formattedAddress: { type: String, trim: true, default: '' },
    },
    phone: {
      primary: { type: String, trim: true, default: '' },
      secondary: { type: String, trim: true, default: '' },
      whatsapp: { type: String, trim: true, default: '' },
      tollFree: { type: String, trim: true, default: '' },
    },
    email: {
      primary: { type: String, trim: true, default: '' },
      support: { type: String, trim: true, default: '' },
      inquiry: { type: String, trim: true, default: '' },
    },
    workingHours: {
      weekdays: { type: String, trim: true, default: 'Mon - Sat: 9:00 AM - 7:00 PM' },
      weekends: { type: String, trim: true, default: 'Sunday: Closed' },
      note: { type: String, trim: true, default: '24/7 Online Scrapping Valuation Support' },
    },
    googleMapLink: {
      type: String,
      trim: true,
      default: '',
    },
    googleMapEmbedUrl: {
      type: String,
      trim: true,
      default: '',
    },
    socialLinks: {
      facebook: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    logo: {
      url: { type: String, default: '' },
      alt: { type: String, default: 'Company Logo' },
      publicId: { type: String, default: '' },
    },
    favicon: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    licenseNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    isDefault: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
