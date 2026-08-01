const { body, query } = require('express-validator');
const { stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const uploadGalleryItemValidator = [
  stringRule('title', { min: 2, max: 150, required: true, label: 'Gallery item title' }),
  stringRule('description', { min: 0, max: 500, required: false, label: 'Description' }),
  body('category')
    .optional()
    .isIn(['FACILITY', 'SCRAP_PROCESS', 'VEHICLES', 'EQUIPMENT', 'TEAM', 'OTHER'])
    .withMessage('Invalid gallery category'),
  stringRule('altText', { min: 2, max: 200, required: false, label: 'Alt text' }),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be an integer >= 0'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be boolean'),
];

const updateGalleryItemValidator = [
  mongoIdParamRule('id', 'Gallery ID'),
  stringRule('title', { min: 2, max: 150, required: false, label: 'Gallery item title' }),
  stringRule('description', { min: 0, max: 500, required: false, label: 'Description' }),
  body('category')
    .optional()
    .isIn(['FACILITY', 'SCRAP_PROCESS', 'VEHICLES', 'EQUIPMENT', 'TEAM', 'OTHER'])
    .withMessage('Invalid gallery category'),
  stringRule('altText', { min: 2, max: 200, required: false, label: 'Alt text' }),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be an integer >= 0'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be boolean'),
];

const getGalleryQueryValidator = [
  ...paginationQueryRules,
  query('category')
    .optional()
    .isIn(['FACILITY', 'SCRAP_PROCESS', 'VEHICLES', 'EQUIPMENT', 'TEAM', 'OTHER'])
    .withMessage('Invalid gallery category filter'),
  query('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished filter must be boolean'),
];

const galleryIdValidator = [
  mongoIdParamRule('id', 'Gallery ID'),
];

module.exports = {
  uploadGalleryItemValidator,
  updateGalleryItemValidator,
  getGalleryQueryValidator,
  galleryIdValidator,
};
