const ApiError = require('../utils/apiError');
const multer = require('multer');

/**
 * Centralized Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ID format: '${err.value}'`;
    error = new ApiError(404, message);
  }

  // Handle Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    const message = `Duplicate value '${value}' entered for unique field '${field}'.`;
    error = new ApiError(409, message, [{ field, message, value }]);
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message,
    }));
    const message = 'Database Validation Error';
    error = new ApiError(400, message, errors);
  }

  // Handle JWT Verification Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token. Please log in again.');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token has expired. Please refresh token.');
  }

  // Handle Multer File Upload Errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new ApiError(400, 'File size exceeds maximum allowed limit of 5MB.');
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error = new ApiError(400, `Unexpected upload field name: '${err.field}'`);
    } else {
      error = new ApiError(400, `File upload error: ${err.message}`);
    }
  }

  const response = {
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error(`💥 [ERROR ${error.statusCode}]: ${error.message}`, error);
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
