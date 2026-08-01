const Testimonial = require('../models/Testimonial');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

const getAllTestimonials = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = {};
  if (!req.user) query.isApproved = true;
  if (req.query.isApproved !== undefined) query.isApproved = req.query.isApproved === 'true';
  if (req.query.isFeatured !== undefined) query.isFeatured = req.query.isFeatured === 'true';

  const [testimonials, total] = await Promise.all([
    Testimonial.find(query).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Testimonial.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { testimonials, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } }, 'Testimonials retrieved')
  );
});

const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  return res.status(201).json(new ApiResponse(201, testimonial, 'Testimonial submitted successfully'));
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');
  return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial updated successfully'));
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');
  return res.status(200).json(new ApiResponse(200, {}, 'Testimonial deleted successfully'));
});

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
