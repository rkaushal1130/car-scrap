const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'FAQ question is required'],
      trim: true,
      minlength: [5, 'Question must be at least 5 characters'],
      maxlength: [300, 'Question cannot exceed 300 characters'],
    },
    answer: {
      type: String,
      required: [true, 'FAQ answer is required'],
      trim: true,
      minlength: [5, 'Answer must be at least 5 characters'],
    },
    category: {
      type: String,
      enum: ['Process', 'Pricing & Cash', 'Documents & Legal', 'Pickup & Transport', 'General'],
      default: 'General',
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED'],
      default: 'PUBLISHED',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

faqSchema.index({ category: 1, status: 1, displayOrder: 1 });
faqSchema.index({ question: 'text', answer: 'text' });

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = FAQ;
