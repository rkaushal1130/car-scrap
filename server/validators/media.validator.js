const { body, param, query } = require('express-validator');

const updateMediaMetadataValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Media ID format'),
  body('altText')
    .optional()
    .isLength({ max: 250 })
    .withMessage('Alt text cannot exceed 250 characters')
    .trim(),
  body('caption')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Caption cannot exceed 500 characters')
    .trim(),
];

const getMediaListQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be an integer >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('folder')
    .optional()
    .isString()
    .trim(),
  query('search')
    .optional()
    .isString()
    .trim(),
];

const mediaIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Media ID format'),
];

module.exports = {
  updateMediaMetadataValidator,
  getMediaListQueryValidator,
  mediaIdValidator,
};
