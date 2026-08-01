const { body } = require('express-validator');
const { stringRule, emailRule } = require('./common.validator');

const updateCompanyValidator = [
  stringRule('companyName', { min: 2, max: 150, required: false, label: 'Company name' }),
  stringRule('tagline', { min: 0, max: 300, required: false, label: 'Tagline' }),
  stringRule('description', { min: 0, max: 2000, required: false, label: 'Description' }),
  body('email')
    .optional()
    .isObject()
    .withMessage('Email field must be an object containing primary, support, inquiry'),
  emailRule('email.primary', false),
  emailRule('email.support', false),
  emailRule('email.inquiry', false),
  body('googleMapLink')
    .optional()
    .isString()
    .withMessage('Google Map link must be a string URL')
    .trim(),
  stringRule('gstNumber', { min: 0, max: 20, required: false, label: 'GST number' }),
  stringRule('licenseNumber', { min: 0, max: 50, required: false, label: 'License number' }),
];

module.exports = {
  updateCompanyValidator,
};
