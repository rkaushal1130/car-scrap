const asyncHandler = require('../middlewares/asyncHandler.middleware');
const ApiResponse = require('../utils/ApiResponse.util');
const DashboardStatistic = require('../models/DashboardStatistic');

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await DashboardStatistic.recalculateStats();
  return res.status(200).json(new ApiResponse(200, stats, 'Dashboard statistics retrieved successfully'));
});

module.exports = {
  getDashboardStats,
};
