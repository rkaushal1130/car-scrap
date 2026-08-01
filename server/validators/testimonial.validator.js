const { body, param, query } = require('express-validator');
const { stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

/**
 * Create Testimonial Validator
 */
const createTestimonialValidator = [
  stringRule('clientName', { min: 2, max: 100, required: true, label: 'Client name' }),
  stringRule('content', { min: 5, max: 1000, required: true, label: 'Testimonial content' }),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5 stars'),
  stringRule('designation', { min: 2, max: 100, required: false, label: 'Designation' }),
  stringRule('location', { min: 2, max: 100, required: false, label: 'Location' }),
  stringRule('vehicleScrapped', { min: 2, max: 150, required: false, label: 'Vehicle scrapped' }),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be an integer >= 0'),
  body('isApproved')
    .optional()
    .isBoolean()
    .withMessage('isApproved must be a boolean (true/false)'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean (true/false)'),
];

/**
 * Update Testimonial Validator
 */
const updateTestimonialValidator = [
  mongoIdParamRule('id', 'Testimonial ID'),
  stringRule('clientName', { min: 2, max: 100, required: false, label: 'Client name' }),
  stringRule('content', { min: 5, max: 1000, required: false, label: 'Testimonial content' }),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5 stars'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be an integer >= 0'),
  body('isApproved')
    .optional()
    .isBoolean()
    .withMessage('isApproved must be a boolean'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
];

/**
 * Get Testimonials Query Validator
 */
const getTestimonialsQueryValidator = [
  ...paginationQueryRules,
  query('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating filter must be an integer between 1 and 5'),
  query('isApproved')
    .optional()
    .isBoolean()
    .withMessage('isApproved filter must be boolean'),
  query('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured filter must be boolean'),
];

/**
 * Testimonial ID Validator
 */
const testimonialIdValidator = [
  mongoIdParamRule('id', 'Testimonial ID'),
];

module.exports = {
  createTestimonialValidator,
  updateTestimonialValidator,
  getTestimonialsQueryValidator,
  testimonialIdValidator,
};
