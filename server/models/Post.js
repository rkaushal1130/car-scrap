const mongoose = require('mongoose');
const { slugify, calculateReadingTime } = require('../utils/helpers');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog post title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
      trim: true,
    },
    featuredImage: {
      url: { type: String, default: '' },
      alt: { type: String, default: '' },
      caption: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    readingTime: {
      type: Number,
      default: 1, // in minutes
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    seoMeta: {
      metaTitle: { type: String, trim: true, default: '' },
      metaDescription: { type: String, trim: true, default: '' },
      keywords: [{ type: String, trim: true }],
      canonicalUrl: { type: String, trim: true, default: '' },
      ogImage: { type: String, trim: true, default: '' },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate excerpt if empty and calculate reading time before validation
postSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title);
  }

  if (!this.excerpt && this.content) {
    const cleanText = this.content.replace(/<[^>]*>/g, '').trim();
    this.excerpt = cleanText.substring(0, 200) + (cleanText.length > 200 ? '...' : '');
  }

  if (this.content) {
    this.readingTime = calculateReadingTime(this.content);
  }

  // Ensure coverImage and featuredImage.url are synced
  if (this.featuredImage && this.featuredImage.url && !this.coverImage) {
    this.coverImage = this.featuredImage.url;
  } else if (this.coverImage && (!this.featuredImage || !this.featuredImage.url)) {
    this.featuredImage = { ...this.featuredImage, url: this.coverImage };
  }

  // Auto fallback for SEO fields
  if (this.seoMeta) {
    if (!this.seoMeta.metaTitle && this.title) {
      this.seoMeta.metaTitle = this.title;
    }
    if (!this.seoMeta.metaDescription && this.excerpt) {
      this.seoMeta.metaDescription = this.excerpt;
    }
  }

  next();
});

// Manage publishedAt timestamp on status change
postSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'PUBLISHED' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Indexes for fast retrieval, sorting, text search
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

