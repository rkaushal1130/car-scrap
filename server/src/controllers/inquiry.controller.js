const Inquiry = require('../models/Inquiry');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

const createInquiry = asyncHandler(async (req, res) => {
  const { customerName, phoneNumber, email, city, vehicleMake, vehicleModel, manufacturingYear, vehicleCategory, fuelType, condition, estimatedValue, message } = req.body;

  const inquiry = await Inquiry.create({
    customerName,
    phoneNumber,
    email: email || '',
    city,
    vehicleMake,
    vehicleModel,
    manufacturingYear: parseInt(manufacturingYear, 10),
    vehicleCategory: vehicleCategory || 'sedan',
    fuelType: fuelType || 'petrol',
    condition: condition || 'complete',
    estimatedValue: estimatedValue ? parseFloat(estimatedValue) : 0,
    message: message || '',
  });

  return res.status(201).json(new ApiResponse(201, inquiry, 'Scrap valuation inquiry submitted successfully'));
});

const getAllInquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Inquiry.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { inquiries, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } }, 'Inquiries fetched successfully')
  );
});

const getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }
  return res.status(200).json(new ApiResponse(200, inquiry, 'Inquiry details fetched'));
});

const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }
  return res.status(200).json(new ApiResponse(200, inquiry, 'Inquiry status updated'));
});

const addInquiryNote = asyncHandler(async (req, res) => {
  const { note } = req.body;
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }
  inquiry.notes.push({ note, createdBy: req.user._id });
  await inquiry.save();
  return res.status(200).json(new ApiResponse(200, inquiry, 'Note added successfully'));
});

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  addInquiryNote,
};
