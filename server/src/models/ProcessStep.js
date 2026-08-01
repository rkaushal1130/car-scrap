const mongoose = require('mongoose');
const { slugify } = require('../helpers/helpers');

const processStepSchema = new mongoose.Schema(
  {
    stepNumber: {
      type: Number,
      required: [true, 'Step number is required'],
      unique: true,
      min: 1,
    },
    title: {
      type: String,
      required: [true, 'Step title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Step description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      trim: true,
    },
    badgeText: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DRAFT'],
      default: 'ACTIVE',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
  }
);

processStepSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title);
  }
  next();
});

processStepSchema.index({ isActive: 1, stepNumber: 1 });

const ProcessStep = mongoose.model('ProcessStep', processStepSchema);
module.exports = ProcessStep;
