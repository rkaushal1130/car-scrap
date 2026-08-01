const ApiError = require('../utils/apiError');

/**
 * Global Production Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Mongoose Invalid ObjectId Format (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid format for field '${err.path}': '${err.value}'`;
    error = new ApiError(404, message);
  }

  // 2. Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const keyPattern = err.keyPattern || err.keyValue || {};
    const field = Object.keys(keyPattern)[0] || 'Field';
    const rawValue = err.keyValue ? err.keyValue[field] : '';
    const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
    const message = `${formattedField} '${rawValue}' already exists. Please enter a unique ${field}.`;

    const errors = [{ field, message: `${formattedField} already exists` }];
    error = new ApiError(400, message, errors);
  }

  // 3. Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    const extractedErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));
    error = new ApiError(400, 'Database Validation Error', extractedErrors);
  }

  // 4. Mongo Network & Server Connection Errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
    error = new ApiError(503, 'Database connection failed. Please check network or try again later.');
  }

  // 5. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token. Access denied.');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token has expired. Please log in again.');
  }
  if (err.name === 'NotBeforeError') {
    error = new ApiError(401, 'Authentication token is not active yet.');
  }

  // 6. Cloudinary API & Asset Errors
  if (err.http_code || (err.message && err.message.toLowerCase().includes('cloudinary'))) {
    const statusCode = err.http_code || 502;
    const message = `Cloud Storage Service Error: ${err.message || 'Image upload/deletion failed'}`;
    error = new ApiError(statusCode, message);
  }

  // 7. Multer File Upload Errors
  if (err.name === 'MulterError') {
    let message = `File upload error: ${err.message}`;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds maximum allowed limit of 5MB';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'File count exceeds maximum allowed limit';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected file field '${err.field}' in upload request`;
    }
    error = new ApiError(400, message);
  }

  // 8. Express JSON Syntax Error (Malformed Request Body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new ApiError(400, 'Malformed JSON payload in request body');
  }

  // 9. Fallback for generic 500 Unhandled Internal Server Errors
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : error.message || 'Internal Server Error';

    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Standardized Consistent JSON Error Response Format
  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    path: req.originalUrl || req.url,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  // Log failure details in development / staging
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ [${response.timestamp}] ${req.method} ${response.path} -> ${error.statusCode} ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  }

  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
