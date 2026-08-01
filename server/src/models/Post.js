const mongoose = require('mongoose');
const { slugify, calculateReadingTime } = require('../helpers/helpers');

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
      default: 1,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
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

// Indexes
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

// Virtuals
postSchema.virtual('readingTimeFormatted').get(function () {
  return `${this.readingTime || 1} min read`;
});

// Hooks: Pre-validate slug & reading time calculation
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

  if (this.featuredImage && this.featuredImage.url && !this.coverImage) {
    this.coverImage = this.featuredImage.url;
  }

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

// Hooks: Pre-save publishedAt timestamp assignment
postSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'PUBLISHED' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Instance Methods
postSchema.methods.incrementViews = async function () {
  this.viewsCount += 1;
  return await this.save({ validateBeforeSave: false });
};

postSchema.methods.like = async function () {
  this.likesCount += 1;
  return await this.save({ validateBeforeSave: false });
};

postSchema.methods.incrementComments = async function () {
  this.commentsCount += 1;
  return await this.save({ validateBeforeSave: false });
};

postSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.status = 'ARCHIVED';
  return await this.save();
};

// Statics
postSchema.statics.findPublished = function (filter = {}) {
  return this.find({ ...filter, status: 'PUBLISHED', isDeleted: false })
    .populate('author', 'fullName email avatarUrl')
    .populate('category', 'name slug color')
    .sort({ publishedAt: -1 });
};

postSchema.statics.findFeatured = function () {
  return this.find({ status: 'PUBLISHED', isFeatured: true, isDeleted: false })
    .populate('author', 'fullName avatarUrl')
    .populate('category', 'name slug color')
    .sort({ publishedAt: -1 });
};

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
