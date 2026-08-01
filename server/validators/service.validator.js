const { body, query } = require('express-validator');
const { stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const createServiceValidator = [
  stringRule('title', { min: 3, max: 100, required: true, label: 'Service title' }),
  stringRule('shortDescription', { min: 5, max: 300, required: true, label: 'Short description' }),
  stringRule('fullDescription', { min: 10, max: 5000, required: true, label: 'Full description' }),
  body('icon')
    .optional()
    .isString()
    .withMessage('Icon must be a string')
    .trim(),
  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a string URL')
    .trim(),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array of strings'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED'])
    .withMessage('Status must be either DRAFT or PUBLISHED'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be an integer greater than or equal to 0'),
  body('seoMeta')
    .optional()
    .isObject()
    .withMessage('SEO Meta must be an object'),
  body('seoMeta.metaTitle')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Meta title cannot exceed 100 characters'),
  body('seoMeta.metaDescription')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Meta description cannot exceed 200 characters'),
];

const updateServiceValidator = [
  mongoIdParamRule('id', 'Service ID'),
  stringRule('title', { min: 3, max: 100, required: false, label: 'Service title' }),
  stringRule('shortDescription', { min: 5, max: 300, required: false, label: 'Short description' }),
  stringRule('fullDescription', { min: 10, max: 5000, required: false, label: 'Full description' }),
  body('icon')
    .optional()
    .isString()
    .trim(),
  body('image')
    .optional()
    .isString()
    .trim(),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array of strings'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED'])
    .withMessage('Status must be DRAFT or PUBLISHED'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 }),
];

const getServicesQueryValidator = [
  ...paginationQueryRules,
  query('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED'])
    .withMessage('Status filter must be DRAFT or PUBLISHED'),
];

const serviceIdValidator = [
  mongoIdParamRule('id', 'Service ID'),
];

module.exports = {
  createServiceValidator,
  updateServiceValidator,
  getServicesQueryValidator,
  serviceIdValidator,
};
