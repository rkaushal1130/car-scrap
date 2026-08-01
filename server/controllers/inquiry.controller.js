const Inquiry = require('../models/Inquiry');
const { calculateScrapValue } = require('../services/valuation.service');
const {
  sendAdminInquiryNotification,
  sendCustomerValuationReceipt,
} = require('../services/email.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Helper to generate unique inquiry number
const generateInquiryNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Inquiry.countDocuments();
  const sequence = String(count + 1).padStart(5, '0');
  return `INQ-${year}-${sequence}`;
};

/**
 * @desc    Submit Public Contact & Scrap Valuation Inquiry
 * @route   POST /api/v1/contact/submit
 * @access  Public
 */
const submitInquiry = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    email,
    location,
    vehicleDetails,
    category,
    manufactureYear,
    fuelType,
    condition,
    message,
  } = req.body;

  // Calculate Valuation Range
  const valuation = calculateScrapValue({ category, condition });

  // Generate Unique Inquiry Number
  const inquiryNumber = await generateInquiryNumber();

  // Create Inquiry Record
  const inquiry = await Inquiry.create({
    inquiryNumber,
    fullName,
    phone,
    email: email || '',
    location,
    vehicleDetails,
    category,
    manufactureYear,
    fuelType,
    condition,
    estimatedValuation: valuation,
    message: message || '',
    ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
  });

  // Asynchronously Send Email Notifications
  sendAdminInquiryNotification(inquiry);
  sendCustomerValuationReceipt(inquiry);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        inquiryNumber: inquiry.inquiryNumber,
        estimatedValuation: inquiry.estimatedValuation,
        message: 'Inquiry submitted successfully. Our team will contact you shortly.',
      },
      'Inquiry submitted successfully'
    )
  );
});

/**
 * @desc    Get All Inquiries (Admin) with Pagination, Search & Filters
 * @route   GET /api/v1/inquiries
 * @access  Private/Admin
 */
const getAllInquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const {
    search,
    status,
    category,
    isRead,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { inquiryNumber: { $regex: search, $options: 'i' } },
      { fullName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { vehicleDetails: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) query.status = status;
  if (category) query.category = category;
  if (isRead !== undefined) query.isRead = isRead === 'true';

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const [inquiries, total, unreadCount] = await Promise.all([
    Inquiry.find(query)
      .populate('assignedTo', 'fullName email role')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit),
    Inquiry.countDocuments(query),
    Inquiry.countDocuments({ isRead: false }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        inquiries,
        unreadCount,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'Inquiries retrieved successfully'
    )
  );
});

/**
 * @desc    Get Single Inquiry Details
 * @route   GET /api/v1/inquiries/:id
 * @access  Private/Admin
 */
const getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id)
    .populate('assignedTo', 'fullName email role')
    .populate('internalNotes.addedBy', 'fullName email role');

  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }

  // Auto mark as read on view
  if (!inquiry.isRead) {
    inquiry.isRead = true;
    await inquiry.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, inquiry, 'Inquiry details retrieved successfully'));
});

/**
 * @desc    Mark Inquiry as Read
 * @route   PATCH /api/v1/inquiries/:id/read
 * @access  Private/Admin
 */
const markInquiryAsRead = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, inquiry, 'Inquiry marked as read'));
});

/**
 * @desc    Update Inquiry Status / Assignment
 * @route   PATCH /api/v1/inquiries/:id/status
 * @access  Private/Admin
 */
const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status, isRead, assignedTo } = req.body;

  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }

  if (status) inquiry.status = status;
  if (isRead !== undefined) inquiry.isRead = isRead;
  if (assignedTo) inquiry.assignedTo = assignedTo;

  await inquiry.save();

  const updatedInquiry = await Inquiry.findById(inquiry._id).populate(
    'assignedTo',
    'fullName email role'
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedInquiry, 'Inquiry status updated successfully'));
});

/**
 * @desc    Add Internal Note to Inquiry
 * @route   POST /api/v1/inquiries/:id/notes
 * @access  Private/Admin
 */
const addInquiryNote = asyncHandler(async (req, res) => {
  const { note } = req.body;

  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }

  inquiry.internalNotes.push({
    note,
    addedBy: req.user._id,
    addedAt: new Date(),
  });

  await inquiry.save();

  const updatedInquiry = await Inquiry.findById(inquiry._id).populate(
    'internalNotes.addedBy',
    'fullName email role'
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedInquiry, 'Internal note added successfully'));
});

/**
 * @desc    Delete Inquiry (Admin)
 * @route   DELETE /api/v1/inquiries/:id
 * @access  Private/Admin
 */
const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Inquiry deleted successfully'));
});

module.exports = {
  submitInquiry,
  getAllInquiries,
  getInquiryById,
  markInquiryAsRead,
  updateInquiryStatus,
  addInquiryNote,
  deleteInquiry,
};
