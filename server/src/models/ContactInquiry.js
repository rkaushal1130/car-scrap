const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/, 'Please enter a valid phone number'],
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED'],
        message: '{VALUE} is not a valid inquiry status',
      },
      default: 'NEW',
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    remarks: [
      {
        remark: { type: String, required: true, trim: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    followUpDate: {
      type: Date,
      default: null,
      index: true,
    },
    source: {
      type: String,
      enum: ['WEBSITE_FORM', 'DIRECT_CALL', 'WHATSAPP', 'VALUATION_CALCULATOR', 'OTHER'],
      default: 'WEBSITE_FORM',
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

// Indexes for Searching, Sorting & Filtering
contactInquirySchema.index({ status: 1, source: 1, createdAt: -1 });
contactInquirySchema.index({ assignedTo: 1, status: 1 });
contactInquirySchema.index({ followUpDate: 1, status: 1 });
contactInquirySchema.index({
  fullName: 'text',
  phoneNumber: 'text',
  email: 'text',
  subject: 'text',
  message: 'text',
});

// Instance Methods
contactInquirySchema.methods.addRemark = async function (remarkText, userId) {
  this.remarks.push({
    remark: remarkText,
    createdBy: userId,
    createdAt: new Date(),
  });
  return await this.save();
};

contactInquirySchema.methods.scheduleFollowUp = async function (date, userId) {
  this.followUpDate = date;
  if (this.status === 'NEW') {
    this.status = 'CONTACTED';
  }
  return await this.save();
};

contactInquirySchema.methods.softDelete = async function (userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  if (userId) this.deletedBy = userId;
  return await this.save();
};

// Statics for Filtered Queries
contactInquirySchema.statics.searchAndFilter = function ({ search, status, source, assignedTo, page = 1, limit = 10, sort = '-createdAt' }) {
  const query = { isDeleted: false };

  if (status) query.status = status;
  if (source) query.source = source;
  if (assignedTo) query.assignedTo = assignedTo;

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  return Promise.all([
    this.find(query)
      .populate('assignedTo', 'fullName email avatarUrl')
      .populate('remarks.createdBy', 'fullName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query),
  ]);
};

const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);
module.exports = ContactInquiry;
