const { body, param } = require('express-validator');
const { stringRule } = require('./common.validator');

const updateSeoValidator = [
  param('pageIdentifier')
    .trim()
    .notEmpty()
    .withMessage('Page identifier is required'),
  stringRule('metaTitle', { min: 2, max: 100, required: true, label: 'Meta title' }),
  stringRule('metaDescription', { min: 10, max: 300, required: true, label: 'Meta description' }),
  body('keywords').optional().isArray(),
  body('canonicalUrl').optional().isString(),
];

const pageIdentifierValidator = [
  param('pageIdentifier')
    .trim()
    .notEmpty()
    .withMessage('Page identifier is required'),
];

module.exports = {
  updateSeoValidator,
  pageIdentifierValidator,
};
