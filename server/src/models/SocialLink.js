const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, 'Social platform name is required'],
      unique: true,
      enum: ['facebook', 'instagram', 'whatsapp', 'twitter', 'linkedin', 'youtube'],
      index: true,
    },
    url: {
      type: String,
      required: [true, 'Platform URL is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Icon identifier is required'],
      trim: true,
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

socialLinkSchema.index({ isActive: 1, displayOrder: 1 });

const SocialLink = mongoose.model('SocialLink', socialLinkSchema);
module.exports = SocialLink;
