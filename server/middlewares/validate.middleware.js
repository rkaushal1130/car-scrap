const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * Validation Middleware Wrapper for express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return next(new ApiError(400, 'Validation Error', extractedErrors));
  }

  next();
};

module.exports = validate;
