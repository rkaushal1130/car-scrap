const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gallery item title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Gallery category is required'],
      enum: ['FACILITY', 'SHREDDING', 'COLLECTION', 'BEFORE_AFTER', 'RTO_DOCUMENTS', 'EQUIPMENT'],
      default: 'FACILITY',
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    altText: {
      type: String,
      required: [true, 'Alt text is required for SEO and accessibility'],
      trim: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    bytes: {
      type: Number,
    },
    format: {
      type: String,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast category filtering & sorted pagination
gallerySchema.index({ isPublished: 1, category: 1, displayOrder: 1 });
gallerySchema.index({ category: 1, createdAt: -1 });

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
