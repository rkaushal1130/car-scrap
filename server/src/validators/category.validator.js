const { body } = require('express-validator');
const { stringRule, mongoIdParamRule } = require('./common.validator');

const createCategoryValidator = [
  stringRule('name', { min: 2, max: 100, required: true, label: 'Category name' }),
  stringRule('description', { min: 0, max: 500, required: false, label: 'Description' }),
  stringRule('color', { min: 3, max: 20, required: false, label: 'Color' }),
  body('isFeatured').optional().isBoolean(),
];

const updateCategoryValidator = [
  mongoIdParamRule('id', 'Category ID'),
  stringRule('name', { min: 2, max: 100, required: false, label: 'Category name' }),
  stringRule('description', { min: 0, max: 500, required: false, label: 'Description' }),
  body('isFeatured').optional().isBoolean(),
];

const categoryIdValidator = [
  mongoIdParamRule('id', 'Category ID'),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
};
