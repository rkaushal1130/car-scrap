const Statistic = require('../models/Statistic');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

const DEFAULT_STATISTICS = [
  { label: 'Vehicles Scrapped', value: '50,000+', numericValue: 50000, icon: 'car', displayOrder: 1 },
  { label: 'Cash Paid Out', value: '₹25 Cr+', numericValue: 250000000, icon: 'currency', displayOrder: 2 },
  { label: 'Happy Customers', value: '48,500+', numericValue: 48500, icon: 'users', displayOrder: 3 },
  { label: 'Recycling Efficiency', value: '99.5%', numericValue: 99.5, icon: 'recycle', displayOrder: 4 },
];

const getAllStatistics = asyncHandler(async (req, res) => {
  const query = {};
  if (!req.user) query.isActive = true;

  let statistics = await Statistic.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean();

  if (statistics.length === 0) {
    await Statistic.insertMany(DEFAULT_STATISTICS);
    statistics = await Statistic.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean();
  }

  return res.status(200).json(
    new ApiResponse(200, { statistics, total: statistics.length }, 'Statistics retrieved successfully')
  );
});

const getStatisticById = asyncHandler(async (req, res) => {
  const statistic = await Statistic.findById(req.params.id);
  if (!statistic) {
    throw new ApiError(404, 'Statistic entry not found');
  }
  return res.status(200).json(new ApiResponse(200, statistic, 'Statistic details retrieved successfully'));
});

const createStatistic = asyncHandler(async (req, res) => {
  const statistic = await Statistic.create(req.body);
  return res.status(201).json(new ApiResponse(201, statistic, 'Statistic created successfully'));
});

const updateStatistic = asyncHandler(async (req, res) => {
  const statistic = await Statistic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!statistic) {
    throw new ApiError(404, 'Statistic entry not found');
  }
  return res.status(200).json(new ApiResponse(200, statistic, 'Statistic updated successfully'));
});

const deleteStatistic = asyncHandler(async (req, res) => {
  const statistic = await Statistic.findByIdAndDelete(req.params.id);
  if (!statistic) {
    throw new ApiError(404, 'Statistic entry not found');
  }
  return res.status(200).json(new ApiResponse(200, {}, 'Statistic deleted successfully'));
});

module.exports = {
  getAllStatistics,
  getStatisticById,
  createStatistic,
  updateStatistic,
  deleteStatistic,
};
