const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gallery item title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['scrapyard', 'dismantling', 'bales', 'containers', 'machinery', 'general'],
      default: 'general',
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ category: 1, isActive: 1, displayOrder: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
