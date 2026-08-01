const mongoose = require('mongoose');

const mediaLibrarySchema = new mongoose.Schema(
  {
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: {
        values: ['IMAGE', 'VIDEO', 'PDF', 'DOCUMENT'],
        message: '{VALUE} is not a supported file type',
      },
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'File size in bytes is required'],
      max: [52428800, 'File size cannot exceed 50MB'], // 50MB max
    },
    dimensions: {
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      duration: { type: Number, default: 0 }, // Duration in seconds (Videos)
      pageCount: { type: Number, default: 0 }, // Total pages (PDFs)
    },
    altText: {
      type: String,
      trim: true,
      default: '',
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    folder: {
      type: String,
      trim: true,
      default: 'car_scrap_uploads',
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user ID is required'],
      index: true,
    },
    cloudinaryUrl: {
      type: String,
      required: [true, 'Cloudinary URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
    format: {
      type: String,
      trim: true,
      default: '',
    },

    // Admin Control & Soft Delete Fields
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
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

// Indexes for Search, Sorting & Filtering
mediaLibrarySchema.index({ fileType: 1, folder: 1, isDeleted: 1 });
mediaLibrarySchema.index({ createdAt: -1 });
mediaLibrarySchema.index({ title: 'text', originalName: 'text', altText: 'text', tags: 'text' });

// Virtuals
mediaLibrarySchema.virtual('fileSizeFormatted').get(function () {
  if (!this.fileSize) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.fileSize) / Math.log(k));
  return parseFloat((this.fileSize / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Hooks: Auto-detect fileType from mimeType & setup default thumbnail
mediaLibrarySchema.pre('validate', function (next) {
  if (this.mimeType) {
    if (this.mimeType.startsWith('image/')) {
      this.fileType = 'IMAGE';
      if (!this.thumbnailUrl && this.cloudinaryUrl) {
        this.thumbnailUrl = this.cloudinaryUrl;
      }
    } else if (this.mimeType.startsWith('video/')) {
      this.fileType = 'VIDEO';
    } else if (this.mimeType === 'application/pdf') {
      this.fileType = 'PDF';
    } else {
      this.fileType = 'DOCUMENT';
    }
  }

  if (!this.title && this.originalName) {
    this.title = this.originalName;
  }

  next();
});

// Instance Methods
mediaLibrarySchema.methods.softDelete = async function (userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  if (userId) this.deletedBy = userId;
  return await this.save();
};

mediaLibrarySchema.methods.restore = async function () {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  return await this.save();
};

// Statics
mediaLibrarySchema.statics.findByFolder = function (folderName) {
  return this.find({ folder: folderName, isDeleted: false }).sort({ createdAt: -1 });
};

mediaLibrarySchema.statics.findByType = function (type) {
  return this.find({ fileType: type, isDeleted: false }).sort({ createdAt: -1 });
};

mediaLibrarySchema.statics.getStorageSummary = function () {
  return this.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$fileType',
        totalCount: { $sum: 1 },
        totalSizeBytes: { $sum: '$fileSize' },
      },
    },
  ]);
};

const MediaLibrary = mongoose.model('MediaLibrary', mediaLibrarySchema);
module.exports = MediaLibrary;
