const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    inquiryNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    vehicleDetails: {
      type: String,
      required: [true, 'Vehicle details are required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Vehicle category is required'],
      enum: ['hatchback', 'sedan', 'suv', 'twowheeler', 'commercial'],
    },
    manufactureYear: {
      type: Number,
      min: 1970,
      max: new Date().getFullYear(),
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['petrol', 'diesel', 'cng', 'electric'],
    },
    condition: {
      type: String,
      required: [true, 'Vehicle condition is required'],
      enum: ['complete', 'accidental', 'junk'],
    },
    estimatedValuation: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      co2Saved: { type: String, required: true },
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUOTE_OFFERED', 'PICKUP_SCHEDULED', 'COMPLETED', 'REJECTED'],
      default: 'NEW',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    internalNotes: [
      {
        note: { type: String, required: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes for fast Admin searching & filtering
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ isRead: 1, createdAt: -1 });
inquirySchema.index({ category: 1 });
inquirySchema.index({ phone: 1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
