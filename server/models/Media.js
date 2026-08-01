const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    folder: {
      type: String,
      trim: true,
      default: 'car_scrap_uploads',
    },
    mimeType: {
      type: String,
      trim: true,
      default: 'image/jpeg',
    },
    format: {
      type: String,
      trim: true,
    },
    bytes: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    altText: {
      type: String,
      trim: true,
      default: '',
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    associatedEntity: {
      entityType: {
        type: String,
        enum: ['BLOG', 'SERVICE', 'GALLERY', 'COMPANY', 'OTHER'],
        default: 'OTHER',
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  },
  {
    timestamps: true,
  }
);

mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ originalName: 'text', altText: 'text', caption: 'text' });

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;
