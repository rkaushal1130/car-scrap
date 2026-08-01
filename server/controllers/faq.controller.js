const FAQ = require('../models/FAQ');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new FAQ entry (Admin)
 * @route   POST /api/v1/faqs
 * @access  Private/Admin
 */
const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, category, order, status } = req.body;

  // Determine order if not provided (default to highest order + 1)
  let faqOrder = order;
  if (faqOrder === undefined || faqOrder === null) {
    const lastFaq = await FAQ.findOne().sort({ order: -1 }).select('order');
    faqOrder = lastFaq ? lastFaq.order + 1 : 0;
  }

  const faq = await FAQ.create({
    question: question.trim(),
    answer: answer.trim(),
    category: category ? category.trim().toUpperCase() : 'GENERAL',
    order: faqOrder,
    status: status || 'ACTIVE',
  });

  return res
    .status(201)
    .json(new ApiResponse(201, faq, 'FAQ created successfully'));
});

/**
 * @desc    Get All FAQs with Pagination, Search, Filtering & Sorting
 * @route   GET /api/v1/faqs
 * @access  Public
 */
const getAllFaqs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const {
    search,
    category,
    status,
    sortBy = 'order',
    sortOrder = 'asc',
  } = req.query;

  const query = {};

  // Unauthenticated requests default to ACTIVE / PUBLISHED status
  if (!req.user) {
    query.status = { $in: ['ACTIVE', 'PUBLISHED'] };
  } else if (status && status !== 'ALL') {
    query.status = status;
  }

  if (category) {
    query.category = category.trim().toUpperCase();
  }

  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { question: searchRegex },
      { answer: searchRegex },
      { category: searchRegex },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [faqs, total] = await Promise.all([
    FAQ.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    FAQ.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        faqs,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'FAQs retrieved successfully'
    )
  );
});

/**
 * @desc    Get Single FAQ by ID
 * @route   GET /api/v1/faqs/:id
 * @access  Public
 */
const getFaqById = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    throw new ApiError(404, 'FAQ not found');
  }

  if (!req.user && !['ACTIVE', 'PUBLISHED'].includes(faq.status)) {
    throw new ApiError(404, 'FAQ not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, faq, 'FAQ details retrieved successfully'));
});

/**
 * @desc    Get FAQs Grouped by Category (For frontend accordions)
 * @route   GET /api/v1/faqs/grouped
 * @access  Public
 */
const getFaqsGroupedByCategory = asyncHandler(async (req, res) => {
  const query = {};
  if (!req.user) {
    query.status = { $in: ['ACTIVE', 'PUBLISHED'] };
  }

  const faqs = await FAQ.find(query).sort({ category: 1, order: 1 }).lean();

  const grouped = {};
  faqs.forEach((faq) => {
    const cat = faq.category || 'GENERAL';
    if (!grouped[cat]) {
      grouped[cat] = [];
    }
    grouped[cat].push(faq);
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { groupedFaqs: grouped, categories: Object.keys(grouped) },
      'Grouped FAQs retrieved successfully'
    )
  );
});

/**
 * @desc    Update FAQ Entry (Admin)
 * @route   PUT /api/v1/faqs/:id
 * @access  Private/Admin
 */
const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    throw new ApiError(404, 'FAQ not found');
  }

  const { question, answer, category, order, status } = req.body;

  if (question) faq.question = question.trim();
  if (answer) faq.answer = answer.trim();
  if (category) faq.category = category.trim().toUpperCase();
  if (order !== undefined) faq.order = parseInt(order, 10);
  if (status) faq.status = status;

  await faq.save();

  return res
    .status(200)
    .json(new ApiResponse(200, faq, 'FAQ updated successfully'));
});

/**
 * @desc    Reorder FAQs Display Sequence (Admin)
 * @route   PATCH /api/v1/faqs/reorder
 * @access  Private/Admin
 */
const reorderFaqs = asyncHandler(async (req, res) => {
  const { items } = req.body; // Array of { id, order }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Items array is required for reordering FAQs');
  }

  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { $set: { order: item.order } },
    },
  }));

  await FAQ.bulkWrite(bulkOps);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'FAQs reordered successfully'));
});

/**
 * @desc    Delete FAQ Entry (Admin)
 * @route   DELETE /api/v1/faqs/:id
 * @access  Private/Admin
 */
const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);

  if (!faq) {
    throw new ApiError(404, 'FAQ not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'FAQ deleted successfully'));
});

module.exports = {
  createFaq,
  getAllFaqs,
  getFaqById,
  getFaqsGroupedByCategory,
  updateFaq,
  reorderFaqs,
  deleteFaq,
};
