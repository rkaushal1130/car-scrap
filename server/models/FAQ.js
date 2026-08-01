const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'FAQ question is required'],
      trim: true,
      minlength: [5, 'Question must be at least 5 characters'],
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    answer: {
      type: String,
      required: [true, 'FAQ answer is required'],
      trim: true,
      minlength: [5, 'Answer must be at least 5 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'GENERAL',
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      min: [0, 'Order must be a positive number'],
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for sorting & category queries
faqSchema.index({ category: 1, status: 1, order: 1 });
faqSchema.index({ question: 'text', answer: 'text', category: 'text' });

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = FAQ;
