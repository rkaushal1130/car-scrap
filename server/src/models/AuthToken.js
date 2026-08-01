const mongoose = require('mongoose');

const authTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    token: {
      type: String,
      required: [true, 'Token string is required'],
      unique: true,
      index: true,
    },
    deviceInfo: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
      index: { expires: 0 }, // TTL index to auto-delete expired tokens
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

authTokenSchema.index({ userId: 1, isRevoked: 1 });

const AuthToken = mongoose.model('AuthToken', authTokenSchema);
module.exports = AuthToken;
