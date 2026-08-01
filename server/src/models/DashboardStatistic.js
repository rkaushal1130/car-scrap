const mongoose = require('mongoose');

const dashboardStatisticSchema = new mongoose.Schema(
  {
    totalUsers: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalServices: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalBlogs: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalGalleryImages: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTestimonials: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalInquiries: {
      type: Number,
      default: 0,
      min: 0,
    },
    todaysVisitors: {
      type: Number,
      default: 0,
      min: 0,
    },
    monthlyVisitors: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedRequests: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingRequests: {
      type: Number,
      default: 0,
      min: 0,
    },
    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isSingleton: {
      type: Boolean,
      default: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Getter Aliases
dashboardStatisticSchema.virtual('totalRevenue').get(function () {
  return this.revenue;
});

// Singleton Query Static Method
dashboardStatisticSchema.statics.getStats = async function () {
  let stats = await this.findOne({ isSingleton: true });
  if (!stats) {
    stats = await this.create({ isSingleton: true });
  }
  return stats;
};

// Real-Time Recalculation Static Method across system models
dashboardStatisticSchema.statics.recalculateStats = async function () {
  const User = mongoose.model('User');
  const Service = mongoose.model('Service');
  const Post = mongoose.model('Post');
  const Gallery = mongoose.model('Gallery');
  const Testimonial = mongoose.model('Testimonial');
  const Inquiry = mongoose.model('Inquiry');

  const [
    totalUsers,
    totalServices,
    totalBlogs,
    totalGalleryImages,
    totalTestimonials,
    totalInquiries,
    completedRequests,
    pendingRequests,
  ] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Service.countDocuments({ isDeleted: false, status: 'PUBLISHED' }),
    Post.countDocuments({ isDeleted: false, status: 'PUBLISHED' }),
    Gallery.countDocuments({ isDeleted: false }),
    Testimonial.countDocuments({ isDeleted: false, status: 'APPROVED' }),
    Inquiry.countDocuments({ isDeleted: false }),
    Inquiry.countDocuments({ isDeleted: false, status: 'COMPLETED' }),
    Inquiry.countDocuments({ isDeleted: false, status: { $in: ['NEW', 'IN_PROGRESS'] } }),
  ]);

  let stats = await this.findOne({ isSingleton: true });
  if (!stats) {
    stats = new this({ isSingleton: true });
  }

  stats.totalUsers = totalUsers;
  stats.totalServices = totalServices;
  stats.totalBlogs = totalBlogs;
  stats.totalGalleryImages = totalGalleryImages;
  stats.totalTestimonials = totalTestimonials;
  stats.totalInquiries = totalInquiries;
  stats.completedRequests = completedRequests;
  stats.pendingRequests = pendingRequests;
  stats.lastUpdated = new Date();

  return await stats.save();
};

const DashboardStatistic = mongoose.model('DashboardStatistic', dashboardStatisticSchema);
module.exports = DashboardStatistic;
