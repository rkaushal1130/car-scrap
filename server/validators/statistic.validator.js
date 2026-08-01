const { body, query } = require('express-validator');
const { stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const createStatisticValidator = [
  stringRule('label', { min: 2, max: 100, required: true, label: 'Label' }),
  stringRule('value', { min: 1, max: 50, required: true, label: 'Value' }),
  body('numericValue')
    .optional()
    .isNumeric()
    .withMessage('Numeric value must be a number'),
  stringRule('icon', { min: 0, max: 100, required: false, label: 'Icon' }),
  stringRule('description', { min: 0, max: 300, required: false, label: 'Description' }),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be an integer >= 0'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean'),
];

const updateStatisticValidator = [
  mongoIdParamRule('id', 'Statistic ID'),
  stringRule('label', { min: 2, max: 100, required: false, label: 'Label' }),
  stringRule('value', { min: 1, max: 50, required: false, label: 'Value' }),
  body('numericValue')
    .optional()
    .isNumeric()
    .withMessage('Numeric value must be a number'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 }),
  body('isActive')
    .optional()
    .isBoolean(),
];

const getStatisticsQueryValidator = [
  ...paginationQueryRules,
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive filter must be boolean'),
];

const statisticIdValidator = [
  mongoIdParamRule('id', 'Statistic ID'),
];

module.exports = {
  createStatisticValidator,
  updateStatisticValidator,
  getStatisticsQueryValidator,
  statisticIdValidator,
};
