const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: [true, 'Page name is required'],
      trim: true,
      index: true,
    },
    url: {
      type: String,
      required: [true, 'Page URL is required'],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    pageIdentifier: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    metaTitle: {
      type: String,
      required: [true, 'Meta title is required'],
      trim: true,
      maxlength: [100, 'Meta title cannot exceed 100 characters'],
    },
    metaDescription: {
      type: String,
      required: [true, 'Meta description is required'],
      trim: true,
      maxlength: [300, 'Meta description cannot exceed 300 characters'],
    },
    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    canonicalUrl: {
      type: String,
      trim: true,
      default: '',
    },
    robots: {
      index: { type: Boolean, default: true },
      follow: { type: Boolean, default: true },
      noarchive: { type: Boolean, default: false },
    },
    structuredData: {
      type: mongoose.Schema.Types.Mixed, // JSON-LD schema object
      default: null,
    },
    openGraph: {
      ogTitle: { type: String, trim: true, default: '' },
      ogDescription: { type: String, trim: true, default: '' },
      ogImage: { type: String, trim: true, default: '' },
      ogType: { type: String, trim: true, default: 'website' },
      ogUrl: { type: String, trim: true, default: '' },
    },
    twitterCard: {
      cardType: { type: String, trim: true, default: 'summary_large_image' },
      title: { type: String, trim: true, default: '' },
      description: { type: String, trim: true, default: '' },
      image: { type: String, trim: true, default: '' },
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DRAFT'],
      default: 'ACTIVE',
      index: true,
    },

    // Soft Delete Fields
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Getters for Flat Property Access
seoSchema.virtual('openGraphTitle').get(function () {
  return this.openGraph ? this.openGraph.ogTitle : '';
});

seoSchema.virtual('openGraphDescription').get(function () {
  return this.openGraph ? this.openGraph.ogDescription : '';
});

seoSchema.virtual('openGraphImage').get(function () {
  return this.openGraph ? this.openGraph.ogImage : '';
});

seoSchema.virtual('schemaJson').get(function () {
  return this.structuredData;
});

seoSchema.virtual('metaRobotsString').get(function () {
  if (!this.robots) return 'index, follow';
  const parts = [];
  parts.push(this.robots.index ? 'index' : 'noindex');
  parts.push(this.robots.follow ? 'follow' : 'nofollow');
  if (this.robots.noarchive) parts.push('noarchive');
  return parts.join(', ');
});

// Hooks: Auto-populate pageIdentifier, OpenGraph, and Twitter card titles/descriptions
seoSchema.pre('validate', function (next) {
  if (!this.pageIdentifier && this.url) {
    this.pageIdentifier = this.url.replace(/^\/+|\/+$/g, '').replace(/[\/\?#]/g, '_') || 'home';
  }

  if (this.metaTitle) {
    if (this.openGraph && !this.openGraph.ogTitle) this.openGraph.ogTitle = this.metaTitle;
    if (this.twitterCard && !this.twitterCard.title) this.twitterCard.title = this.metaTitle;
  }

  if (this.metaDescription) {
    if (this.openGraph && !this.openGraph.ogDescription) this.openGraph.ogDescription = this.metaDescription;
    if (this.twitterCard && !this.twitterCard.description) this.twitterCard.description = this.metaDescription;
  }

  next();
});

// Statics
seoSchema.statics.findByUrl = function (targetUrl) {
  return this.findOne({ url: targetUrl.toLowerCase(), status: 'ACTIVE', isDeleted: false });
};

const Seo = mongoose.model('Seo', seoSchema);
module.exports = Seo;
