const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema(
  {
    pageIdentifier: {
      type: String,
      required: [true, 'Page identifier is required'],
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
    structuredData: {
      type: mongoose.Schema.Types.Mixed, // JSON-LD schema object
      default: null,
    },
    robots: {
      index: { type: Boolean, default: true },
      follow: { type: Boolean, default: true },
      noarchive: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

seoSchema.virtual('metaRobotsString').get(function () {
  const parts = [];
  parts.push(this.robots.index ? 'index' : 'noindex');
  parts.push(this.robots.follow ? 'follow' : 'nofollow');
  if (this.robots.noarchive) parts.push('noarchive');
  return parts.join(', ');
});

const Seo = mongoose.model('Seo', seoSchema);
module.exports = Seo;
