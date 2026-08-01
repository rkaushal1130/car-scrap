const { body } = require('express-validator');
const { stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const createServiceValidator = [
  stringRule('title', { min: 3, max: 150, required: true, label: 'Title' }),
  stringRule('shortDescription', { min: 10, max: 300, required: true, label: 'Short description' }),
  stringRule('fullDescription', { min: 20, max: 10000, required: true, label: 'Full description' }),
  body('features').optional().isArray(),
  body('benefits').optional().isArray(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
];

const updateServiceValidator = [
  mongoIdParamRule('id', 'Service ID'),
  stringRule('title', { min: 3, max: 150, required: false, label: 'Title' }),
  stringRule('shortDescription', { min: 10, max: 300, required: false, label: 'Short description' }),
  stringRule('fullDescription', { min: 20, max: 10000, required: false, label: 'Full description' }),
];

const serviceQueryValidator = [
  ...paginationQueryRules,
];

const serviceIdOrSlugValidator = [
  mongoIdParamRule('idOrSlug', 'Service ID or Slug'),
];

module.exports = {
  createServiceValidator,
  updateServiceValidator,
  serviceQueryValidator,
  serviceIdOrSlugValidator,
};
