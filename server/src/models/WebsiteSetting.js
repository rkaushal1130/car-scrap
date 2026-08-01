const mongoose = require('mongoose');

const websiteSettingSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      required: [true, 'Website name is required'],
      trim: true,
      default: 'Car Scrap India',
    },
    // Branding & Media
    branding: {
      logoUrl: { type: String, trim: true, default: '' },
      darkLogoUrl: { type: String, trim: true, default: '' },
      faviconUrl: { type: String, trim: true, default: '' },
    },
    // Contact Information
    contactInfo: {
      phone: { type: String, trim: true, default: '' },
      whatsapp: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, lowercase: true, default: '' },
      address: { type: String, trim: true, default: '' },
      googleMap: { type: String, trim: true, default: '' },
      openingHours: { type: String, trim: true, default: 'Mon - Sat: 9:00 AM - 8:00 PM' },
    },
    // Social Media Profiles
    socialLinks: {
      facebook: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    // Theme Colors
    theme: {
      primaryColor: { type: String, trim: true, default: '#0D7A41' },
      secondaryColor: { type: String, trim: true, default: '#15803D' },
    },
    // Footer & Copyright
    footer: {
      footerText: { type: String, trim: true, default: '' },
      copyright: { type: String, trim: true, default: '© 2026 Car Scrap Enterprises. All rights reserved.' },
    },
    // System & Maintenance Controls
    system: {
      maintenanceMode: { type: Boolean, default: false, index: true },
      analyticsCode: { type: String, trim: true, default: '' },
    },
    isSingleton: {
      type: Boolean,
      default: true,
      unique: true,
    },

    // Audit Fields
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Property Aliases
websiteSettingSchema.virtual('logo').get(function () {
  return this.branding ? this.branding.logoUrl : '';
});

websiteSettingSchema.virtual('darkLogo').get(function () {
  return this.branding ? this.branding.darkLogoUrl : '';
});

websiteSettingSchema.virtual('favicon').get(function () {
  return this.branding ? this.branding.faviconUrl : '';
});

websiteSettingSchema.virtual('phone').get(function () {
  return this.contactInfo ? this.contactInfo.phone : '';
});

websiteSettingSchema.virtual('whatsapp').get(function () {
  return this.contactInfo ? this.contactInfo.whatsapp : '';
});

websiteSettingSchema.virtual('email').get(function () {
  return this.contactInfo ? this.contactInfo.email : '';
});

websiteSettingSchema.virtual('address').get(function () {
  return this.contactInfo ? this.contactInfo.address : '';
});

websiteSettingSchema.virtual('googleMap').get(function () {
  return this.contactInfo ? this.contactInfo.googleMap : '';
});

websiteSettingSchema.virtual('openingHours').get(function () {
  return this.contactInfo ? this.contactInfo.openingHours : '';
});

websiteSettingSchema.virtual('facebook').get(function () {
  return this.socialLinks ? this.socialLinks.facebook : '';
});

websiteSettingSchema.virtual('instagram').get(function () {
  return this.socialLinks ? this.socialLinks.instagram : '';
});

websiteSettingSchema.virtual('linkedin').get(function () {
  return this.socialLinks ? this.socialLinks.linkedin : '';
});

websiteSettingSchema.virtual('twitter').get(function () {
  return this.socialLinks ? this.socialLinks.twitter : '';
});

websiteSettingSchema.virtual('youtube').get(function () {
  return this.socialLinks ? this.socialLinks.youtube : '';
});

websiteSettingSchema.virtual('primaryColor').get(function () {
  return this.theme ? this.theme.primaryColor : '#0D7A41';
});

websiteSettingSchema.virtual('secondaryColor').get(function () {
  return this.theme ? this.theme.secondaryColor : '#15803D';
});

websiteSettingSchema.virtual('footerText').get(function () {
  return this.footer ? this.footer.footerText : '';
});

websiteSettingSchema.virtual('copyright').get(function () {
  return this.footer ? this.footer.copyright : '';
});

websiteSettingSchema.virtual('maintenanceMode').get(function () {
  return this.system ? this.system.maintenanceMode : false;
});

websiteSettingSchema.virtual('analyticsCode').get(function () {
  return this.system ? this.system.analyticsCode : '';
});

// Singleton Pattern Static Method
websiteSettingSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ isSingleton: true });
  if (!settings) {
    settings = await this.create({ isSingleton: true });
  }
  return settings;
};

const WebsiteSetting = mongoose.model('WebsiteSetting', websiteSettingSchema);
module.exports = WebsiteSetting;
