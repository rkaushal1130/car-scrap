const mongoose = require('mongoose');
const { slugify } = require('../helpers/helpers');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
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
      trim: true,
      default: '',
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],
    isSystemRole: {
      type: Boolean,
      default: true,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

roleSchema.pre('validate', function (next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name);
  }
  next();
});

// Instance Method: Check if role has a specific permission slug
roleSchema.methods.hasPermission = function (permissionSlug) {
  if (!this.permissions || this.permissions.length === 0) return false;
  return this.permissions.some((p) => p.slug === permissionSlug || p.name === permissionSlug);
};

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
