const { body, query } = require('express-validator');
const { stringRule, mongoIdParamRule, mongoIdBodyRule, paginationQueryRules } = require('./common.validator');

const createBlogValidator = [
  stringRule('title', { min: 3, max: 200, required: true, label: 'Blog title' }),
  stringRule('content', { min: 10, max: 50000, required: true, label: 'Blog content' }),
  stringRule('excerpt', { min: 0, max: 500, required: false, label: 'Excerpt' }),
  mongoIdBodyRule('category', true, 'Category ID'),
  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string' || Array.isArray(value)) return true;
      throw new Error('Tags must be a string or an array of strings');
    }),
  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
    .withMessage('Status must be DRAFT, PUBLISHED, or ARCHIVED'),
  body('featuredImage')
    .optional()
    .custom((value) => {
      if (typeof value === 'string' || (typeof value === 'object' && value !== null)) {
        return true;
      }
      throw new Error('Featured Image must be a URL string or image object');
    }),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean (true/false)'),
  body('seoMeta')
    .optional()
    .isObject()
    .withMessage('seoMeta must be an object'),
];

const updateBlogValidator = [
  mongoIdParamRule('id', 'Blog post ID'),
  stringRule('title', { min: 3, max: 200, required: false, label: 'Blog title' }),
  stringRule('content', { min: 10, max: 50000, required: false, label: 'Blog content' }),
  stringRule('excerpt', { min: 0, max: 500, required: false, label: 'Excerpt' }),
  mongoIdBodyRule('category', false, 'Category ID'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
    .withMessage('Status must be DRAFT, PUBLISHED, or ARCHIVED'),
  body('isFeatured')
    .optional()
    .isBoolean(),
];

const getBlogsQueryValidator = [
  ...paginationQueryRules,
  query('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'ALL'])
    .withMessage('Invalid status filter value'),
  query('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured filter must be true or false'),
];

const generateSlugValidator = [
  stringRule('title', { min: 1, max: 200, required: true, label: 'Title' }),
];

const blogIdValidator = [
  mongoIdParamRule('id', 'Blog post ID'),
];

module.exports = {
  createBlogValidator,
  updateBlogValidator,
  getBlogsQueryValidator,
  generateSlugValidator,
  blogIdValidator,
};
