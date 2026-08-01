const { body } = require('express-validator');
const { stringRule, phoneRule, emailRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const createInquiryValidator = [
  stringRule('customerName', { min: 2, max: 100, required: true, label: 'Customer name' }),
  phoneRule('phoneNumber', 'Phone number'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  stringRule('city', { min: 2, max: 100, required: true, label: 'City' }),
  stringRule('vehicleMake', { min: 2, max: 100, required: true, label: 'Vehicle brand/make' }),
  stringRule('vehicleModel', { min: 1, max: 100, required: true, label: 'Vehicle model' }),
  body('manufacturingYear')
    .notEmpty()
    .isInt({ min: 1970, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1970 and ${new Date().getFullYear()}`),
  body('vehicleCategory')
    .optional()
    .isIn(['hatchback', 'sedan', 'suv', 'twowheeler', 'commercial']),
  body('fuelType')
    .optional()
    .isIn(['petrol', 'diesel', 'cng', 'electric']),
  body('condition')
    .optional()
    .isIn(['complete', 'accidental', 'junk']),
];

const updateInquiryStatusValidator = [
  mongoIdParamRule('id', 'Inquiry ID'),
  body('status')
    .notEmpty()
    .isIn(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid inquiry status'),
];

const addInquiryNoteValidator = [
  mongoIdParamRule('id', 'Inquiry ID'),
  stringRule('note', { min: 2, max: 1000, required: true, label: 'Note content' }),
];

const inquiryQueryValidator = [
  ...paginationQueryRules,
  body('status').optional().isString(),
];

const inquiryIdValidator = [
  mongoIdParamRule('id', 'Inquiry ID'),
];

module.exports = {
  createInquiryValidator,
  updateInquiryStatusValidator,
  addInquiryNoteValidator,
  inquiryQueryValidator,
  inquiryIdValidator,
};
