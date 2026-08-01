const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * Middleware to process express-validator results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    throw new ApiError(
      400,
      'Validation Error: Please correct the highlighted fields.',
      formattedErrors
    );
  }
  next();
};

module.exports = validate;
