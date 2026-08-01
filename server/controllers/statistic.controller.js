const Statistic = require('../models/Statistic');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Initial Default Platform Statistics
 */
const DEFAULT_STATISTICS = [
  { label: 'Vehicles Scrapped', value: '50,000+', numericValue: 50000, icon: 'car', displayOrder: 1 },
  { label: 'Cash Paid Out', value: '₹25 Cr+', numericValue: 250000000, icon: 'currency', displayOrder: 2 },
  { label: 'Happy Customers', value: '48,500+', numericValue: 48500, icon: 'users', displayOrder: 3 },
  { label: 'Recycling Efficiency', value: '99.5%', numericValue: 99.5, icon: 'recycle', displayOrder: 4 },
];

/**
 * @desc    Get All Statistics (Public)
 * @route   GET /api/v1/statistics
 * @access  Public
 */
const getAllStatistics = asyncHandler(async (req, res) => {
  const query = {};
  if (!req.user) {
    query.isActive = true;
  }

  let statistics = await Statistic.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean();

  // Initialize defaults if empty
  if (statistics.length === 0) {
    await Statistic.insertMany(DEFAULT_STATISTICS);
    statistics = await Statistic.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean();
  }

  return res.status(200).json(
    new ApiResponse(200, { statistics, total: statistics.length }, 'Statistics retrieved successfully')
  );
});

/**
 * @desc    Get Single Statistic by ID
 * @route   GET /api/v1/statistics/:id
 * @access  Public
 */
const getStatisticById = asyncHandler(async (req, res) => {
  const statistic = await Statistic.findById(req.params.id);

  if (!statistic) {
    throw new ApiError(404, 'Statistic entry not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, statistic, 'Statistic details retrieved successfully'));
});

/**
 * @desc    Create Statistic (Admin)
 * @route   POST /api/v1/statistics
 * @access  Private/Admin
 */
const createStatistic = asyncHandler(async (req, res) => {
  const { label, value, numericValue, icon, description, displayOrder, isActive } = req.body;

  const statistic = await Statistic.create({
    label: label.trim(),
    value: value.trim(),
    numericValue: numericValue !== undefined ? Number(numericValue) : 0,
    icon: icon || '',
    description: description || '',
    displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, statistic, 'Statistic created successfully'));
});

/**
 * @desc    Update Statistic (Admin)
 * @route   PUT /api/v1/statistics/:id
 * @access  Private/Admin
 */
const updateStatistic = asyncHandler(async (req, res) => {
  const statistic = await Statistic.findById(req.params.id);

  if (!statistic) {
    throw new ApiError(404, 'Statistic entry not found');
  }

  const { label, value, numericValue, icon, description, displayOrder, isActive } = req.body;

  if (label) statistic.label = label.trim();
  if (value) statistic.value = value.trim();
  if (numericValue !== undefined) statistic.numericValue = Number(numericValue);
  if (icon !== undefined) statistic.icon = icon;
  if (description !== undefined) statistic.description = description;
  if (displayOrder !== undefined) statistic.displayOrder = parseInt(displayOrder, 10);
  if (isActive !== undefined) statistic.isActive = Boolean(isActive);

  await statistic.save();

  return res
    .status(200)
    .json(new ApiResponse(200, statistic, 'Statistic updated successfully'));
});

/**
 * @desc    Delete Statistic (Admin)
 * @route   DELETE /api/v1/statistics/:id
 * @access  Private/Admin
 */
const deleteStatistic = asyncHandler(async (req, res) => {
  const statistic = await Statistic.findByIdAndDelete(req.params.id);

  if (!statistic) {
    throw new ApiError(404, 'Statistic entry not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Statistic deleted successfully'));
});

module.exports = {
  getAllStatistics,
  getStatisticById,
  createStatistic,
  updateStatistic,
  deleteStatistic,
};
