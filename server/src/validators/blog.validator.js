const { body, query } = require('express-validator');
const { stringRule, mongoIdParamRule, mongoIdBodyRule, paginationQueryRules } = require('./common.validator');

const createBlogValidator = [
  stringRule('title', { min: 3, max: 200, required: true, label: 'Title' }),
  stringRule('content', { min: 10, max: 50000, required: true, label: 'Content' }),
  mongoIdBodyRule('category', 'Category', true),
  stringRule('excerpt', { min: 0, max: 500, required: false, label: 'Excerpt' }),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
    .withMessage('Invalid post status'),
  body('isFeatured')
    .optional()
    .isBoolean(),
];

const updateBlogValidator = [
  mongoIdParamRule('id', 'Blog ID'),
  stringRule('title', { min: 3, max: 200, required: false, label: 'Title' }),
  stringRule('content', { min: 10, max: 50000, required: false, label: 'Content' }),
  mongoIdBodyRule('category', 'Category', false),
  body('tags')
    .optional()
    .isArray(),
  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
];

const blogQueryValidator = [
  ...paginationQueryRules,
  query('category').optional().isString(),
  query('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  query('isFeatured').optional().isBoolean(),
];

const blogIdOrSlugValidator = [
  mongoIdParamRule('idOrSlug', 'Blog ID or Slug'),
];

module.exports = {
  createBlogValidator,
  updateBlogValidator,
  blogQueryValidator,
  blogIdOrSlugValidator,
};
