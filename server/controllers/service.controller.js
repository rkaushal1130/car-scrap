const mongoose = require('mongoose');
const Service = require('../models/Service');
const { slugify } = require('../utils/helpers');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new Service (Admin)
 * @route   POST /api/v1/services
 * @access  Private/Admin
 */
const createService = asyncHandler(async (req, res) => {
  const {
    title,
    shortDescription,
    fullDescription,
    icon,
    image,
    features,
    status,
    displayOrder,
    seoMeta,
  } = req.body;

  const existingService = await Service.findOne({ title });
  if (existingService) {
    throw new ApiError(400, 'Service with this title already exists');
  }

  const slug = slugify(title);

  const service = await Service.create({
    title,
    slug,
    shortDescription,
    fullDescription,
    icon: icon || '',
    image: image || '',
    features: features || [],
    status: status || 'PUBLISHED',
    displayOrder: displayOrder || 0,
    seoMeta: seoMeta || {},
  });

  return res
    .status(201)
    .json(new ApiResponse(201, service, 'Service created successfully'));
});

/**
 * @desc    Get All Services (Public & Admin) with Search, Filtering & Pagination
 * @route   GET /api/v1/services
 * @access  Public
 */
const getAllServices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const { search, status, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;

  const query = {};

  // If user is not authenticated or explicitly requesting published, default to PUBLISHED
  if (!req.user) {
    query.status = 'PUBLISHED';
  } else if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { fullDescription: { $regex: search, $options: 'i' } },
      { features: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [services, total] = await Promise.all([
    Service.find(query).sort(sortOptions).skip(skip).limit(limit),
    Service.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        services,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'Services retrieved successfully'
    )
  );
});

/**
 * @desc    Get Single Service by ID or Slug
 * @route   GET /api/v1/services/:identifier
 * @access  Public
 */
const getServiceByIdOrSlug = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const isMongoId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isMongoId ? { _id: identifier } : { slug: identifier };

  const service = await Service.findOne(query);

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  // If public request, check if published
  if (!req.user && service.status !== 'PUBLISHED') {
    throw new ApiError(404, 'Service not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, service, 'Service details retrieved successfully'));
});

/**
 * @desc    Update Service (Admin)
 * @route   PUT /api/v1/services/:id
 * @access  Private/Admin
 */
const updateService = asyncHandler(async (req, res) => {
  const {
    title,
    shortDescription,
    fullDescription,
    icon,
    image,
    features,
    status,
    displayOrder,
    seoMeta,
  } = req.body;

  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  if (title && title !== service.title) {
    const existingTitle = await Service.findOne({ title });
    if (existingTitle) {
      throw new ApiError(400, 'Service with this title already exists');
    }
    service.title = title;
    service.slug = slugify(title);
  }

  if (shortDescription) service.shortDescription = shortDescription;
  if (fullDescription) service.fullDescription = fullDescription;
  if (icon !== undefined) service.icon = icon;
  if (image !== undefined) service.image = image;
  if (features) service.features = features;
  if (status) service.status = status;
  if (displayOrder !== undefined) service.displayOrder = displayOrder;
  if (seoMeta) service.seoMeta = { ...service.seoMeta, ...seoMeta };

  await service.save();

  return res
    .status(200)
    .json(new ApiResponse(200, service, 'Service updated successfully'));
});

/**
 * @desc    Delete Service (Admin)
 * @route   DELETE /api/v1/services/:id
 * @access  Private/Admin
 */
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Service deleted successfully'));
});

/**
 * @desc    Reorder Services Display Sequence (Admin)
 * @route   PATCH /api/v1/services/reorder
 * @access  Private/Admin
 */
const reorderServices = asyncHandler(async (req, res) => {
  const { items } = req.body; // Array of { id, displayOrder }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Items array is required for reordering');
  }

  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { $set: { displayOrder: item.displayOrder } },
    },
  }));

  await Service.bulkWrite(bulkOps);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Services reordered successfully'));
});

module.exports = {
  createService,
  getAllServices,
  getServiceByIdOrSlug,
  updateService,
  deleteService,
  reorderServices,
};
