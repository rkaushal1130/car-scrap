const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City/Location is required'],
      trim: true,
    },
    vehicleMake: {
      type: String,
      required: [true, 'Vehicle brand/make is required'],
      trim: true,
    },
    vehicleModel: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    manufacturingYear: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
      min: [1970, 'Manufacturing year cannot be prior to 1970'],
      max: [new Date().getFullYear(), 'Manufacturing year cannot be in the future'],
    },
    vehicleCategory: {
      type: String,
      enum: ['hatchback', 'sedan', 'suv', 'twowheeler', 'commercial'],
      default: 'sedan',
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'cng', 'electric'],
      default: 'petrol',
    },
    condition: {
      type: String,
      enum: ['complete', 'accidental', 'junk'],
      default: 'complete',
    },
    estimatedValue: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'NEW',
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: [
      {
        note: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ phoneNumber: 1 });
inquirySchema.index({ customerName: 'text', vehicleMake: 'text', vehicleModel: 'text', city: 'text' });

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
