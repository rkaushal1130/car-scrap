const { body, param, query } = require('express-validator');
const { emailRule, phoneRule, stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

/**
 * Contact Form & Inquiry Submission Validator
 */
const submitInquiryValidator = [
  stringRule('fullName', { min: 2, max: 100, required: true, label: 'Full name' }),
  phoneRule('phone', true),
  emailRule('email', false),
  stringRule('location', { min: 2, max: 150, required: true, label: 'Location/City' }),
  stringRule('vehicleDetails', { min: 2, max: 200, required: true, label: 'Vehicle details (Make, Model, Year)' }),
  body('category')
    .notEmpty()
    .withMessage('Vehicle category is required')
    .isIn(['hatchback', 'sedan', 'suv', 'twowheeler', 'commercial'])
    .withMessage('Invalid vehicle category. Allowed: hatchback, sedan, suv, twowheeler, commercial'),
  body('manufactureYear')
    .optional()
    .isInt({ min: 1970, max: new Date().getFullYear() })
    .withMessage(`Manufacture year must be between 1970 and ${new Date().getFullYear()}`),
  body('fuelType')
    .notEmpty()
    .withMessage('Fuel type is required')
    .isIn(['petrol', 'diesel', 'cng', 'electric'])
    .withMessage('Invalid fuel type. Allowed: petrol, diesel, cng, electric'),
  body('condition')
    .notEmpty()
    .withMessage('Vehicle condition is required')
    .isIn(['complete', 'accidental', 'junk'])
    .withMessage('Invalid vehicle condition. Allowed: complete, accidental, junk'),
  body('message')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters')
    .trim(),
];

/**
 * Inquiry List Query Filters Validator
 */
const getInquiriesQueryValidator = [
  ...paginationQueryRules,
  query('status')
    .optional()
    .isIn(['NEW', 'CONTACTED', 'QUOTE_OFFERED', 'PICKUP_SCHEDULED', 'COMPLETED', 'REJECTED'])
    .withMessage('Invalid status filter value'),
  query('category')
    .optional()
    .isIn(['hatchback', 'sedan', 'suv', 'twowheeler', 'commercial'])
    .withMessage('Invalid category filter value'),
  query('isRead')
    .optional()
    .isBoolean()
    .withMessage('isRead filter must be boolean (true/false)'),
];

/**
 * Update Inquiry Status Validator
 */
const updateInquiryStatusValidator = [
  mongoIdParamRule('id', 'Inquiry ID'),
  body('status')
    .optional()
    .isIn(['NEW', 'CONTACTED', 'QUOTE_OFFERED', 'PICKUP_SCHEDULED', 'COMPLETED', 'REJECTED'])
    .withMessage('Invalid status value'),
  body('isRead')
    .optional()
    .isBoolean()
    .withMessage('isRead must be boolean'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid assignedTo user ID format'),
];

/**
 * Inquiry ID Parameter Validator
 */
const inquiryIdValidator = [
  mongoIdParamRule('id', 'Inquiry ID'),
];

/**
 * Add Admin Note Validator
 */
const addNoteValidator = [
  mongoIdParamRule('id', 'Inquiry ID'),
  stringRule('note', { min: 1, max: 1000, required: true, label: 'Note content' }),
];

module.exports = {
  submitInquiryValidator,
  getInquiriesQueryValidator,
  updateInquiryStatusValidator,
  inquiryIdValidator,
  addNoteValidator,
};
