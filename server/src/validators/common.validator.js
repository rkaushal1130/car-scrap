const { body, param, query } = require('express-validator');

const emailRule = (fieldName = 'email', label = 'Email address') =>
  body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`${label} is required`)
    .isEmail()
    .withMessage(`Please enter a valid ${label.toLowerCase()}`)
    .normalizeEmail();

const phoneRule = (fieldName = 'phoneNumber', label = 'Phone number') =>
  body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`${label} is required`)
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/)
    .withMessage(`Please enter a valid ${label.toLowerCase()}`);

const stringRule = (fieldName, { min = 1, max = 255, required = true, label = fieldName } = {}) => {
  let rule = body(fieldName).trim();
  if (required) {
    rule = rule.notEmpty().withMessage(`${label} is required`);
  } else {
    rule = rule.optional();
  }
  return rule
    .isLength({ min, max })
    .withMessage(`${label} must be between ${min} and ${max} characters`);
};

const mongoIdParamRule = (paramName = 'id', label = 'Resource ID') =>
  param(paramName)
    .trim()
    .notEmpty()
    .withMessage(`${label} is required`)
    .isMongoId()
    .withMessage(`Invalid ${label.toLowerCase()} format`);

const mongoIdBodyRule = (fieldName = 'id', label = 'Resource ID', required = true) => {
  let rule = body(fieldName).trim();
  if (required) {
    rule = rule.notEmpty().withMessage(`${label} is required`);
  } else {
    rule = rule.optional();
  }
  return rule.isMongoId().withMessage(`Invalid ${label.toLowerCase()} format`);
};

const paginationQueryRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page number must be an integer >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Page limit must be an integer between 1 and 100'),
  query('sort')
    .optional()
    .isString()
    .trim(),
  query('search')
    .optional()
    .isString()
    .trim(),
];

const urlRule = (fieldName, label = fieldName, required = false) => {
  let rule = body(fieldName).trim();
  if (required) {
    rule = rule.notEmpty().withMessage(`${label} is required`);
  } else {
    rule = rule.optional();
  }
  return rule.isURL().withMessage(`${label} must be a valid URL`);
};

module.exports = {
  emailRule,
  phoneRule,
  stringRule,
  mongoIdParamRule,
  mongoIdBodyRule,
  paginationQueryRules,
  urlRule,
};
