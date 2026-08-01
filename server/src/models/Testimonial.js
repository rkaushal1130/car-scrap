const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters'],
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    designation: {
      type: String,
      trim: true,
      default: '',
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
    status: {
      type: String,
      enum: ['APPROVED', 'PENDING', 'REJECTED'],
      default: 'APPROVED',
      index: true,
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
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
testimonialSchema.index({ status: 1, isFeatured: 1, displayOrder: 1 });
testimonialSchema.index({ isDeleted: 1, createdAt: -1 });

// Virtual Aliases
testimonialSchema.virtual('customerName').get(function () {
  return this.clientName;
});

testimonialSchema.virtual('company').get(function () {
  return this.companyName;
});

testimonialSchema.virtual('photo').get(function () {
  return this.avatarUrl;
});

testimonialSchema.virtual('vehicle').get(function () {
  return this.vehicleScrapped;
});

testimonialSchema.virtual('review').get(function () {
  return this.reviewText;
});

// Hooks: Sync status with isApproved
testimonialSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.isApproved = this.status === 'APPROVED';
  }
  next();
});

// Instance Methods
testimonialSchema.methods.approve = async function () {
  this.status = 'APPROVED';
  this.isApproved = true;
  return await this.save();
};

testimonialSchema.methods.reject = async function () {
  this.status = 'REJECTED';
  this.isApproved = false;
  return await this.save();
};

testimonialSchema.methods.softDelete = async function (userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  if (userId) this.deletedBy = userId;
  return await this.save();
};

// Statics
testimonialSchema.statics.findApprovedFeatured = function () {
  return this.find({ status: 'APPROVED', isFeatured: true, isDeleted: false }).sort({ displayOrder: 1, createdAt: -1 });
};

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
