const { body } = require('express-validator');
const { stringRule } = require('./common.validator');

const updateCompanyValidator = [
  stringRule('companyName', { min: 2, max: 150, required: false, label: 'Company name' }),
  stringRule('tagline', { min: 0, max: 300, required: false, label: 'Tagline' }),
  stringRule('aboutText', { min: 0, max: 2000, required: false, label: 'About text' }),
  body('emails.primary').optional().isEmail().withMessage('Invalid primary email'),
  body('emails.support').optional().isEmail().withMessage('Invalid support email'),
  body('phones.primary').optional().isString(),
];

module.exports = {
  updateCompanyValidator,
};
