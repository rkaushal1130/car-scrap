const { body, param, query } = require('express-validator');

const createCategoryValidator = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim(),
  body('icon')
    .optional()
    .isString()
    .withMessage('Icon must be a string')
    .trim(),
  body('color')
    .optional()
    .isString()
    .withMessage('Color must be a string')
    .trim(),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
];

const updateCategoryValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Category ID format'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim(),
  body('icon')
    .optional()
    .isString()
    .trim(),
  body('color')
    .optional()
    .isString()
    .trim(),
  body('isFeatured')
    .optional()
    .isBoolean(),
];

const categoryIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Category ID format'),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
};
