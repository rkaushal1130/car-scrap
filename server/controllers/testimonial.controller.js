const Testimonial = require('../models/Testimonial');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create Testimonial (Admin or Client submission)
 * @route   POST /api/v1/testimonials
 * @access  Public / Private
 */
const createTestimonial = asyncHandler(async (req, res) => {
  const {
    clientName,
    designation,
    location,
    rating,
    content,
    clientAvatar,
    vehicleScrapped,
    displayOrder,
    isApproved,
    isFeatured,
  } = req.body;

  const testimonial = await Testimonial.create({
    clientName: clientName.trim(),
    designation: designation ? designation.trim() : 'Vehicle Owner',
    location: location ? location.trim() : '',
    rating: parseInt(rating, 10) || 5,
    content: content.trim(),
    clientAvatar: clientAvatar || '',
    vehicleScrapped: vehicleScrapped ? vehicleScrapped.trim() : '',
    displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
    isApproved: req.user ? (isApproved !== undefined ? Boolean(isApproved) : true) : false,
    isFeatured: req.user ? Boolean(isFeatured) : false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, testimonial, 'Testimonial created successfully'));
});

/**
 * @desc    Get All Testimonials with Search, Filtering & Pagination
 * @route   GET /api/v1/testimonials
 * @access  Public
 */
const getAllTestimonials = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const { rating, isApproved, isFeatured, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;

  const query = {};

  if (!req.user) {
    query.isApproved = true;
  } else if (isApproved !== undefined) {
    query.isApproved = isApproved === 'true' || isApproved === true;
  }

  if (rating) {
    query.rating = parseInt(rating, 10);
  }

  if (isFeatured !== undefined) {
    query.isFeatured = isFeatured === 'true' || isFeatured === true;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [testimonials, total] = await Promise.all([
    Testimonial.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    Testimonial.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        testimonials,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'Testimonials retrieved successfully'
    )
  );
});

/**
 * @desc    Get Single Testimonial by ID
 * @route   GET /api/v1/testimonials/:id
 * @access  Public
 */
const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  if (!req.user && !testimonial.isApproved) {
    throw new ApiError(404, 'Testimonial not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, testimonial, 'Testimonial details retrieved successfully'));
});

/**
 * @desc    Update Testimonial (Admin)
 * @route   PUT /api/v1/testimonials/:id
 * @access  Private/Admin
 */
const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  const {
    clientName,
    designation,
    location,
    rating,
    content,
    clientAvatar,
    vehicleScrapped,
    displayOrder,
    isApproved,
    isFeatured,
  } = req.body;

  if (clientName) testimonial.clientName = clientName.trim();
  if (designation !== undefined) testimonial.designation = designation.trim();
  if (location !== undefined) testimonial.location = location.trim();
  if (rating !== undefined) testimonial.rating = parseInt(rating, 10);
  if (content) testimonial.content = content.trim();
  if (clientAvatar !== undefined) testimonial.clientAvatar = clientAvatar;
  if (vehicleScrapped !== undefined) testimonial.vehicleScrapped = vehicleScrapped.trim();
  if (displayOrder !== undefined) testimonial.displayOrder = parseInt(displayOrder, 10);
  if (isApproved !== undefined) testimonial.isApproved = Boolean(isApproved);
  if (isFeatured !== undefined) testimonial.isFeatured = Boolean(isFeatured);

  await testimonial.save();

  return res
    .status(200)
    .json(new ApiResponse(200, testimonial, 'Testimonial updated successfully'));
});

/**
 * @desc    Delete Testimonial (Admin)
 * @route   DELETE /api/v1/testimonials/:id
 * @access  Private/Admin
 */
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Testimonial deleted successfully'));
});

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};
