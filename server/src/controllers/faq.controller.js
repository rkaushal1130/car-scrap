const FAQ = require('../models/FAQ');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

const DEFAULT_FAQS = [
  { question: 'What documents are required to scrap my car legally in India?', answer: 'You need the Original RC (Registration Certificate), Copy of Aadhaar Card/PAN Card, Bank account details for payment transfer, and a signed cancellation declaration.', category: 'Documents & Legal', displayOrder: 1 },
  { question: 'How is the scrap value of my vehicle calculated?', answer: 'The valuation depends on vehicle weight, motor condition, scrap metal market rates, reusable spare parts, and fuel type.', category: 'Pricing & Cash', displayOrder: 2 },
  { question: 'Do you provide free doorstep pickup?', answer: 'Yes! We provide 100% free towing and vehicle pickup across all major cities.', category: 'Pickup & Transport', displayOrder: 3 },
];

const getAllFaqs = asyncHandler(async (req, res) => {
  const query = {};
  if (!req.user) query.status = 'PUBLISHED';
  if (req.query.category) query.category = req.query.category;

  let faqs = await FAQ.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean();

  if (faqs.length === 0 && !req.query.category) {
    await FAQ.insertMany(DEFAULT_FAQS);
    faqs = await FAQ.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean();
  }

  return res.status(200).json(new ApiResponse(200, { faqs, total: faqs.length }, 'FAQs retrieved successfully'));
});

const getFaqsGroupedByCategory = asyncHandler(async (req, res) => {
  const query = req.user ? {} : { status: 'PUBLISHED' };
  const faqs = await FAQ.find(query).sort({ category: 1, displayOrder: 1 }).lean();

  const grouped = faqs.reduce((acc, faq) => {
    const cat = faq.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  return res.status(200).json(new ApiResponse(200, grouped, 'FAQs grouped by category retrieved'));
});

const createFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.create(req.body);
  return res.status(201).json(new ApiResponse(201, faq, 'FAQ created successfully'));
});

const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!faq) throw new ApiError(404, 'FAQ entry not found');
  return res.status(200).json(new ApiResponse(200, faq, 'FAQ updated successfully'));
});

const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) throw new ApiError(404, 'FAQ entry not found');
  return res.status(200).json(new ApiResponse(200, {}, 'FAQ deleted successfully'));
});

module.exports = {
  getAllFaqs,
  getFaqsGroupedByCategory,
  createFaq,
  updateFaq,
  deleteFaq,
};
