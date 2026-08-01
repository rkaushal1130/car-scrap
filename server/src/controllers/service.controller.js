const Service = require('../models/Service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const { generateUniqueSlug } = require('../helpers/helpers');

const getAllServices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = {};
  if (!req.user) {
    query.isActive = true;
  }

  const [services, total] = await Promise.all([
    Service.find(query).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Service.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { services, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } },
      'Services retrieved successfully'
    )
  );
});

const getServiceByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isMongoId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

  const query = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug };
  const service = await Service.findOne(query);

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  return res.status(200).json(new ApiResponse(200, service, 'Service details retrieved'));
});

const createService = asyncHandler(async (req, res) => {
  const { title, shortDescription, fullDescription, icon, imageUrl, features, benefits, displayOrder } = req.body;

  const slug = await generateUniqueSlug(Service, title);

  const service = await Service.create({
    title,
    slug,
    shortDescription,
    fullDescription,
    icon: icon || 'car',
    imageUrl: imageUrl || '',
    features: Array.isArray(features) ? features : [],
    benefits: Array.isArray(benefits) ? benefits : [],
    displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
  });

  return res.status(201).json(new ApiResponse(201, service, 'Service created successfully'));
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  const { title, shortDescription, fullDescription, icon, imageUrl, features, benefits, displayOrder, isActive } = req.body;

  if (title && title !== service.title) {
    service.title = title;
    service.slug = await generateUniqueSlug(Service, title, service._id);
  }

  if (shortDescription) service.shortDescription = shortDescription;
  if (fullDescription) service.fullDescription = fullDescription;
  if (icon) service.icon = icon;
  if (imageUrl !== undefined) service.imageUrl = imageUrl;
  if (features) service.features = Array.isArray(features) ? features : [];
  if (benefits) service.benefits = Array.isArray(benefits) ? benefits : [];
  if (displayOrder !== undefined) service.displayOrder = parseInt(displayOrder, 10);
  if (isActive !== undefined) service.isActive = Boolean(isActive);

  await service.save();

  return res.status(200).json(new ApiResponse(200, service, 'Service updated successfully'));
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }
  return res.status(200).json(new ApiResponse(200, {}, 'Service deleted successfully'));
});

module.exports = {
  getAllServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService,
};
