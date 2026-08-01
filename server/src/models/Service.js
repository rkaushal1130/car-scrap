const mongoose = require('mongoose');
const { slugify } = require('../helpers/helpers');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
      default: 'car',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    bannerImageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    features: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    seoMeta: {
      metaTitle: { type: String, trim: true, default: '' },
      metaDescription: { type: String, trim: true, default: '' },
      keywords: [{ type: String, trim: true }],
      canonicalUrl: { type: String, trim: true, default: '' },
      ogImage: { type: String, trim: true, default: '' },
    },

    // Admin Dashboard Control Fields
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    unpublishedAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },

    // Audit & Soft Delete
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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

// Compound & Text Search Indexes
serviceSchema.index({ status: 1, displayOrder: 1 });
serviceSchema.index({ isDeleted: 1, createdAt: -1 });
serviceSchema.index({ title: 'text', shortDescription: 'text', fullDescription: 'text' });

// Virtuals
serviceSchema.virtual('description').get(function () {
  return this.fullDescription;
});

// Lifecycle Hooks
serviceSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title);
  }

  if (this.seoMeta) {
    if (!this.seoMeta.metaTitle && this.title) {
      this.seoMeta.metaTitle = this.title;
    }
    if (!this.seoMeta.metaDescription && this.shortDescription) {
      this.seoMeta.metaDescription = this.shortDescription;
    }
  }

  next();
});

serviceSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'PUBLISHED' && !this.publishedAt) {
      this.publishedAt = new Date();
    } else if (this.status === 'UNPUBLISHED') {
      this.unpublishedAt = new Date();
    } else if (this.status === 'ARCHIVED') {
      this.archivedAt = new Date();
    }
  }
  next();
});

// Admin Control Methods
serviceSchema.methods.publish = async function (userId) {
  this.status = 'PUBLISHED';
  this.publishedAt = new Date();
  this.isActive = true;
  if (userId) this.updatedBy = userId;
  return await this.save();
};

serviceSchema.methods.unpublish = async function (userId) {
  this.status = 'UNPUBLISHED';
  this.unpublishedAt = new Date();
  this.isActive = false;
  if (userId) this.updatedBy = userId;
  return await this.save();
};

serviceSchema.methods.archive = async function (userId) {
  this.status = 'ARCHIVED';
  this.archivedAt = new Date();
  this.isActive = false;
  if (userId) this.updatedBy = userId;
  return await this.save();
};

serviceSchema.methods.softDelete = async function (userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  if (userId) this.deletedBy = userId;
  return await this.save();
};

serviceSchema.methods.restore = async function (userId) {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  if (userId) this.updatedBy = userId;
  return await this.save();
};

serviceSchema.methods.toggleStatus = async function (userId) {
  this.isActive = !this.isActive;
  if (userId) this.updatedBy = userId;
  return await this.save();
};

// Admin Query Statics
serviceSchema.statics.findAdminManaged = function ({ search, status, isDeleted = false, page = 1, limit = 10, sort = '-createdAt' }) {
  const query = { isDeleted };

  if (status) query.status = status;
  if (search) query.$text = { $search: search };

  const skip = (page - 1) * limit;

  return Promise.all([
    this.find(query).sort(sort).skip(skip).limit(limit).lean(),
    this.countDocuments(query),
  ]);
};

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
