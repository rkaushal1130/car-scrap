const { body, param, query } = require('express-validator');

const createSeoValidator = [
  body('pageIdentifier')
    .notEmpty()
    .withMessage('Page identifier is required')
    .isString()
    .trim()
    .toLowerCase(),
  body('pageName')
    .notEmpty()
    .withMessage('Page name is required')
    .isString()
    .trim(),
  body('metaTitle')
    .notEmpty()
    .withMessage('Meta title is required')
    .isLength({ max: 150 })
    .withMessage('Meta title cannot exceed 150 characters')
    .trim(),
  body('metaDescription')
    .notEmpty()
    .withMessage('Meta description is required')
    .isLength({ max: 300 })
    .withMessage('Meta description cannot exceed 300 characters')
    .trim(),
  body('keywords')
    .optional()
    .custom((value) => {
      if (typeof value === 'string' || Array.isArray(value)) return true;
      throw new Error('Keywords must be a string or array of strings');
    }),
  body('canonicalUrl')
    .optional()
    .isString()
    .trim(),
  body('sitemapSettings.priority')
    .optional()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage('Priority must be a float between 0.0 and 1.0'),
  body('sitemapSettings.changefreq')
    .optional()
    .isIn(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
    .withMessage('Invalid changefreq value'),
];

const updateSeoValidator = [
  body('metaTitle')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Meta title cannot exceed 150 characters')
    .trim(),
  body('metaDescription')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Meta description cannot exceed 300 characters')
    .trim(),
  body('keywords')
    .optional()
    .custom((value) => {
      if (typeof value === 'string' || Array.isArray(value)) return true;
      throw new Error('Keywords must be a string or array of strings');
    }),
  body('sitemapSettings.priority')
    .optional()
    .isFloat({ min: 0.0, max: 1.0 })
    .withMessage('Priority must be a float between 0.0 and 1.0'),
  body('sitemapSettings.changefreq')
    .optional()
    .isIn(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
    .withMessage('Invalid changefreq value'),
];

const getSeoQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be an integer >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('search')
    .optional()
    .isString()
    .trim(),
];

module.exports = {
  createSeoValidator,
  updateSeoValidator,
  getSeoQueryValidator,
};
