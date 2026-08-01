const { body, query } = require('express-validator');
const { stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const createTestimonialValidator = [
  stringRule('clientName', { min: 2, max: 100, required: true, label: 'Client name' }),
  stringRule('reviewText', { min: 10, max: 1000, required: true, label: 'Review text' }),
  body('rating')
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  stringRule('location', { min: 0, max: 100, required: false, label: 'Location' }),
  stringRule('vehicleScrapped', { min: 0, max: 100, required: false, label: 'Vehicle scrapped' }),
  body('isApproved')
    .optional()
    .isBoolean(),
  body('isFeatured')
    .optional()
    .isBoolean(),
];

const updateTestimonialValidator = [
  mongoIdParamRule('id', 'Testimonial ID'),
  stringRule('clientName', { min: 2, max: 100, required: false, label: 'Client name' }),
  stringRule('reviewText', { min: 10, max: 1000, required: false, label: 'Review text' }),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }),
];

const getTestimonialsQueryValidator = [
  ...paginationQueryRules,
  query('isApproved').optional().isBoolean(),
  query('isFeatured').optional().isBoolean(),
];

const testimonialIdValidator = [
  mongoIdParamRule('id', 'Testimonial ID'),
];

module.exports = {
  createTestimonialValidator,
  updateTestimonialValidator,
  getTestimonialsQueryValidator,
  testimonialIdValidator,
};
