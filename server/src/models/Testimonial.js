const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      minlength: [2, 'Client name must be at least 2 characters'],
      maxlength: [100, 'Client name cannot exceed 100 characters'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
      default: 5,
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    vehicleScrapped: {
      type: String,
      trim: true,
      default: '', // e.g. "Maruti Swift 2012"
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ isApproved: 1, isFeatured: 1, displayOrder: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
