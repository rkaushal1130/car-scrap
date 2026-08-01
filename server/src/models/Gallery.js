const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gallery item title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['scrapyard', 'dismantling', 'bales', 'containers', 'machinery', 'general'],
      default: 'general',
      index: true,
    },
    album: {
      type: String,
      trim: true,
      default: 'General',
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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
gallerySchema.index({ category: 1, album: 1, isActive: 1, displayOrder: 1 });
gallerySchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual Getter
gallerySchema.virtual('image').get(function () {
  return this.imageUrl;
});

// Hooks: Sync isActive with status
gallerySchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.isActive = this.status === 'ACTIVE';
  }
  next();
});

// Instance Methods
gallerySchema.methods.softDelete = async function (userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  if (userId) this.deletedBy = userId;
  return await this.save();
};

// Statics
gallerySchema.statics.findByAlbum = function (albumName) {
  return this.find({ album: albumName, status: 'ACTIVE', isDeleted: false })
    .populate('uploadedBy', 'fullName avatarUrl')
    .sort({ displayOrder: 1, createdAt: -1 });
};

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
