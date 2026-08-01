const mongoose = require('mongoose');

const footerSectionSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true,
      maxlength: [80, 'Section title cannot exceed 80 characters'],
    },
    columnPosition: {
      type: Number,
      required: [true, 'Column position is required'],
      min: 1,
      max: 4,
    },
    links: [
      {
        label: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
        isExternal: { type: Boolean, default: false },
      },
    ],
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

footerSectionSchema.index({ isActive: 1, displayOrder: 1 });

const FooterSection = mongoose.model('FooterSection', footerSectionSchema);
module.exports = FooterSection;
