const mongoose = require('mongoose');
const { slugify } = require('../helpers/helpers');

const navItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Navigation label is required'],
      trim: true,
      maxlength: [50, 'Label cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    url: {
      type: String,
      required: [true, 'Navigation URL is required'],
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NavItem',
      default: null,
      index: true,
    },
    isExternal: {
      type: Boolean,
      default: false,
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

navItemSchema.pre('validate', function (next) {
  if (this.label && (!this.slug || this.isModified('label'))) {
    this.slug = slugify(this.label);
  }
  next();
});

navItemSchema.index({ isActive: 1, displayOrder: 1 });

const NavItem = mongoose.model('NavItem', navItemSchema);
module.exports = NavItem;
