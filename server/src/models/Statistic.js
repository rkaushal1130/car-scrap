const mongoose = require('mongoose');
const DashboardStatistic = require('./DashboardStatistic');

const statisticSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Statistic label is required'],
      trim: true,
      minlength: [2, 'Label must be at least 2 characters'],
      maxlength: [100, 'Label cannot exceed 100 characters'],
    },
    value: {
      type: String,
      required: [true, 'Statistic value is required'],
      trim: true,
    },
    numericValue: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

statisticSchema.index({ isActive: 1, displayOrder: 1 });

const Statistic = mongoose.model('Statistic', statisticSchema);
Statistic.DashboardStatistic = DashboardStatistic;

module.exports = Statistic;
