const { body } = require('express-validator');
const { stringRule, mongoIdParamRule, paginationQueryRules, urlRule } = require('./common.validator');

const createGalleryValidator = [
  stringRule('title', { min: 2, max: 150, required: true, label: 'Title' }),
  urlRule('imageUrl', 'Image URL', true),
  body('category')
    .optional()
    .isIn(['scrapyard', 'dismantling', 'bales', 'containers', 'machinery', 'general']),
  body('displayOrder').optional().isInt({ min: 0 }),
];

const updateGalleryValidator = [
  mongoIdParamRule('id', 'Gallery ID'),
  stringRule('title', { min: 2, max: 150, required: false, label: 'Title' }),
  urlRule('imageUrl', 'Image URL', false),
];

const galleryQueryValidator = [
  ...paginationQueryRules,
  body('category').optional().isString(),
];

const galleryIdValidator = [
  mongoIdParamRule('id', 'Gallery ID'),
];

module.exports = {
  createGalleryValidator,
  updateGalleryValidator,
  galleryQueryValidator,
  galleryIdValidator,
};
