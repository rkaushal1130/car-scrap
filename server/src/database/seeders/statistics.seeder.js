const Statistic = require('../../models/Statistic');
const DashboardStatistic = require('../../models/DashboardStatistic');

const SAMPLE_STATS = [
  { label: 'Vehicles Scrapped', value: '15,000+', numericValue: 15000, icon: 'Car', description: 'Cars and commercial vehicles eco-dismantled', displayOrder: 1, isActive: true },
  { label: 'Satisfied Owners', value: '14,500+', numericValue: 14500, icon: 'Smile', description: 'Happy vehicle owners with instant cash payouts', displayOrder: 2, isActive: true },
  { label: 'RTO Certificates Issued', value: '14,200+', numericValue: 14200, icon: 'FileText', description: 'Official Certificate of Deposit (COD) receipts', displayOrder: 3, isActive: true },
  { label: 'Steel Recycled (Tons)', value: '25,000+', numericValue: 25000, icon: 'Recycle', description: 'Metric tons of steel recovered for foundry reuse', displayOrder: 4, isActive: true },
];

const seedStatistics = async () => {
  try {
    console.log('🌱 Seeding Statistics...');

    for (const item of SAMPLE_STATS) {
      let doc = await Statistic.findOne({ label: item.label });
      if (!doc) {
        await Statistic.create(item);
      }
    }

    // Initialize Dashboard Statistics Singleton
    let dashboardStats = await DashboardStatistic.findOne({ isSingleton: true });
    if (!dashboardStats) {
      await DashboardStatistic.create({
        totalUsers: 12,
        totalServices: 4,
        totalBlogs: 2,
        totalGalleryImages: 4,
        totalTestimonials: 3,
        totalInquiries: 128,
        todaysVisitors: 450,
        monthlyVisitors: 12400,
        completedRequests: 115,
        pendingRequests: 13,
        revenue: 4580000,
        isSingleton: true,
      });
    }

    console.log('✅ Seeded Homepage & Dashboard Statistics.');
  } catch (error) {
    console.error('❌ Error seeding Statistics:', error);
    throw error;
  }
};

module.exports = seedStatistics;
