const { body, param, query } = require('express-validator');

/**
 * Reusable Email Validator Rule
 */
const emailRule = (fieldName = 'email', required = true) => {
  let rule = body(fieldName).trim();
  if (required) {
    rule = rule.notEmpty().withMessage(`${fieldName} is required`);
  } else {
    rule = rule.optional({ checkFalsy: true });
  }
  return rule
    .isEmail()
    .withMessage(`Please enter a valid ${fieldName} address (e.g. user@example.com)`)
    .normalizeEmail();
};

/**
 * Reusable Phone Number Validator Rule (Indian 10-digit or international format)
 */
const phoneRule = (fieldName = 'phone', required = true) => {
  let rule = body(fieldName).trim();
  if (required) {
    rule = rule.notEmpty().withMessage(`${fieldName} number is required`);
  } else {
    rule = rule.optional({ checkFalsy: true });
  }
  return rule
    .matches(/^(\+?\d{1,4}[\s-])?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$|^[6-9]\d{9}$/)
    .withMessage(`Please enter a valid phone number (e.g., 9876543210 or +91 98765 43210)`);
};

/**
 * Reusable String Length Validator Rule
 */
const stringRule = (fieldName, { min = 1, max = 255, required = true, label } = {}) => {
  const displayLabel = label || fieldName;
  let rule = body(fieldName).trim();
  if (required) {
    rule = rule.notEmpty().withMessage(`${displayLabel} is required`);
  } else {
    rule = rule.optional();
  }
  return rule
    .isLength({ min, max })
    .withMessage(`${displayLabel} must be between ${min} and ${max} characters`);
};

/**
 * Reusable Mongo ObjectId Parameter Validator Rule
 */
const mongoIdParamRule = (paramName = 'id', label = 'ID') => {
  return param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${label} format. Must be a valid 24-character hexadecimal MongoDB ObjectId`);
};

/**
 * Reusable Mongo ObjectId Body Field Validator Rule
 */
const mongoIdBodyRule = (fieldName, required = true, label) => {
  const displayLabel = label || fieldName;
  let rule = body(fieldName);
  if (required) {
    rule = rule.notEmpty().withMessage(`${displayLabel} is required`);
  } else {
    rule = rule.optional();
  }
  return rule
    .isMongoId()
    .withMessage(`Invalid ${displayLabel} format. Must be a valid MongoDB ObjectId`);
};

/**
 * Reusable Pagination Query Validator Rules
 */
const paginationQueryRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page parameter must be an integer greater than or equal to 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit parameter must be an integer between 1 and 100'),
  query('sortBy')
    .optional()
    .isString()
    .withMessage('sortBy must be a valid string field name')
    .trim(),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be either "asc" or "desc"'),
];

/**
 * Reusable URL Validator Rule
 */
const urlRule = (fieldName, required = false, label) => {
  const displayLabel = label || fieldName;
  let rule = body(fieldName).trim();
  if (required) {
    rule = rule.notEmpty().withMessage(`${displayLabel} is required`);
  } else {
    rule = rule.optional({ checkFalsy: true });
  }
  return rule.isURL().withMessage(`${displayLabel} must be a valid URL string (e.g. https://example.com)`);
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
