const { body, query } = require('express-validator');
const { stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const createFaqValidator = [
  stringRule('question', { min: 5, max: 500, required: true, label: 'FAQ question' }),
  stringRule('answer', { min: 5, max: 5000, required: true, label: 'FAQ answer' }),
  stringRule('category', { min: 2, max: 100, required: false, label: 'Category' }),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be an integer >= 0'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED'])
    .withMessage('Status must be ACTIVE, INACTIVE, DRAFT, or PUBLISHED'),
];

const updateFaqValidator = [
  mongoIdParamRule('id', 'FAQ ID'),
  stringRule('question', { min: 5, max: 500, required: false, label: 'FAQ question' }),
  stringRule('answer', { min: 5, max: 5000, required: false, label: 'FAQ answer' }),
  stringRule('category', { min: 2, max: 100, required: false, label: 'Category' }),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be an integer >= 0'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED'])
    .withMessage('Status must be ACTIVE, INACTIVE, DRAFT, or PUBLISHED'),
];

const getFaqsQueryValidator = [
  ...paginationQueryRules,
  query('category')
    .optional()
    .isString()
    .trim(),
  query('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED', 'ALL'])
    .withMessage('Invalid status filter value'),
];

const faqIdValidator = [
  mongoIdParamRule('id', 'FAQ ID'),
];

module.exports = {
  createFaqValidator,
  updateFaqValidator,
  getFaqsQueryValidator,
  faqIdValidator,
};
