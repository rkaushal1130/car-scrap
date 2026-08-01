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
    designation: {
      type: String,
      trim: true,
      default: 'Vehicle Owner',
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
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      trim: true,
      minlength: [5, 'Content must be at least 5 characters'],
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    clientAvatar: {
      type: String,
      trim: true,
      default: '',
    },
    vehicleScrapped: {
      type: String,
      trim: true,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: [0, 'Display order must be >= 0'],
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ isApproved: 1, isFeatured: -1, displayOrder: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
