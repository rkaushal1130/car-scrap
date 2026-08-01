const mongoose = require('mongoose');

const websiteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Setting key is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Setting value is required'],
    },
    group: {
      type: String,
      enum: ['GENERAL', 'THEME', 'ANNOUNCEMENT', 'VALUATION_RATES', 'SECURITY'],
      default: 'GENERAL',
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: false,
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

const WebsiteSetting = mongoose.model('WebsiteSetting', websiteSettingSchema);
module.exports = WebsiteSetting;
