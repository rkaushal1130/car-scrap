const { body, query } = require('express-validator');
const { stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const createFaqValidator = [
  stringRule('question', { min: 5, max: 300, required: true, label: 'Question' }),
  stringRule('answer', { min: 5, max: 5000, required: true, label: 'Answer' }),
  body('category')
    .optional()
    .isIn(['Process', 'Pricing & Cash', 'Documents & Legal', 'Pickup & Transport', 'General'])
    .withMessage('Invalid FAQ category'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be an integer >= 0'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED'])
    .withMessage('Invalid FAQ status'),
  body('isFeatured')
    .optional()
    .isBoolean(),
];

const updateFaqValidator = [
  mongoIdParamRule('id', 'FAQ ID'),
  stringRule('question', { min: 5, max: 300, required: false, label: 'Question' }),
  stringRule('answer', { min: 5, max: 5000, required: false, label: 'Answer' }),
  body('category')
    .optional()
    .isIn(['Process', 'Pricing & Cash', 'Documents & Legal', 'Pickup & Transport', 'General']),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED']),
];

const getFaqsQueryValidator = [
  ...paginationQueryRules,
  query('category').optional().isString(),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED']),
  query('isFeatured').optional().isBoolean(),
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
