const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    },
    fileSize: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
      trim: true,
      default: 'webp',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

mediaSchema.index({ createdAt: -1 });

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;
