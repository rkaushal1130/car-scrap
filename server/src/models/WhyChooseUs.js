const mongoose = require('mongoose');
const { slugify } = require('../helpers/helpers');

const whyChooseUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Feature title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
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
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [400, 'Description cannot exceed 400 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['LEGAL', 'PAYMENT', 'SPEED', 'ENVIRONMENTAL'],
      default: 'LEGAL',
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
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

whyChooseUsSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title);
  }
  next();
});

whyChooseUsSchema.index({ isActive: 1, displayOrder: 1 });

const WhyChooseUs = mongoose.model('WhyChooseUs', whyChooseUsSchema);
module.exports = WhyChooseUs;
