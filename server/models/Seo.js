const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema(
  {
    pageIdentifier: {
      type: String,
      required: [true, 'Page identifier is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    pageName: {
      type: String,
      required: [true, 'Page name is required'],
      trim: true,
    },
    metaTitle: {
      type: String,
      required: [true, 'Meta title is required'],
      trim: true,
      maxlength: [150, 'Meta title cannot exceed 150 characters'],
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
    openGraph: {
      ogTitle: { type: String, trim: true, default: '' },
      ogDescription: { type: String, trim: true, default: '' },
      ogImage: { type: String, trim: true, default: '' },
      ogType: { type: String, trim: true, default: 'website' },
      ogUrl: { type: String, trim: true, default: '' },
      ogSiteName: { type: String, trim: true, default: 'Car Scrap Enterprise' },
    },
    twitterCard: {
      cardType: {
        type: String,
        enum: ['summary', 'summary_large_image', 'app', 'player'],
        default: 'summary_large_image',
      },
      twitterSite: { type: String, trim: true, default: '' },
      twitterCreator: { type: String, trim: true, default: '' },
      twitterTitle: { type: String, trim: true, default: '' },
      twitterDescription: { type: String, trim: true, default: '' },
      twitterImage: { type: String, trim: true, default: '' },
    },
    canonicalUrl: {
      type: String,
      trim: true,
      default: '',
    },
    schema: {
      schemaType: {
        type: String,
        trim: true,
        default: 'Organization',
      },
      schemaJson: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    robots: {
      index: { type: Boolean, default: true },
      follow: { type: Boolean, default: true },
      noarchive: { type: Boolean, default: false },
      nosnippet: { type: Boolean, default: false },
      maxSnippet: { type: Number, default: -1 },
      maxImagePreview: {
        type: String,
        enum: ['none', 'standard', 'large'],
        default: 'large',
      },
      customRobotsTxt: { type: String, default: '' },
    },
    sitemapSettings: {
      includeInSitemap: { type: Boolean, default: true },
      priority: {
        type: Number,
        default: 0.8,
        min: 0.0,
        max: 1.0,
      },
      changefreq: {
        type: String,
        enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
        default: 'weekly',
      },
      lastMod: { type: Date, default: Date.now },
    },
    isGlobalDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to generate meta robots tag string
seoSchema.virtual('metaRobotsString').get(function () {
  if (!this.robots) return 'index, follow, max-image-preview:large';
  const parts = [];
  parts.push(this.robots.index ? 'index' : 'noindex');
  parts.push(this.robots.follow ? 'follow' : 'nofollow');
  if (this.robots.noarchive) parts.push('noarchive');
  if (this.robots.nosnippet) parts.push('nosnippet');
  if (this.robots.maxImagePreview) parts.push(`max-image-preview:${this.robots.maxImagePreview}`);
  return parts.join(', ');
});

// Pre-validate hook for openGraph and twitterCard fallbacks
seoSchema.pre('validate', function (next) {
  if (this.openGraph) {
    if (!this.openGraph.ogTitle && this.metaTitle) {
      this.openGraph.ogTitle = this.metaTitle;
    }
    if (!this.openGraph.ogDescription && this.metaDescription) {
      this.openGraph.ogDescription = this.metaDescription;
    }
  }

  if (this.twitterCard) {
    if (!this.twitterCard.twitterTitle && this.metaTitle) {
      this.twitterCard.twitterTitle = this.metaTitle;
    }
    if (!this.twitterCard.twitterDescription && this.metaDescription) {
      this.twitterCard.twitterDescription = this.metaDescription;
    }
    if (!this.twitterCard.twitterImage && this.openGraph?.ogImage) {
      this.twitterCard.twitterImage = this.openGraph.ogImage;
    }
  }

  next();
});

const Seo = mongoose.model('Seo', seoSchema);
module.exports = Seo;
