const { verifyJWT, optionalJWT, authorizeRoles } = require('./auth.middleware');
const errorHandler = require('./error.middleware');
const validate = require('./validate.middleware');
const { httpLogger, requestLogger } = require('./logger.middleware');
const { createRateLimiter, apiLimiter, authLimiter, uploadLimiter } = require('./rateLimiter.middleware');
const notFoundHandler = require('./notFound.middleware');
const asyncHandler = require('./asyncHandler.middleware');
const { sanitizeRequest, sanitizeObject, sanitizeString } = require('./sanitizer.middleware');
const upload = require('./upload.middleware');

module.exports = {
  verifyJWT,
  optionalJWT,
  authorizeRoles,
  errorHandler,
  validate,
  httpLogger,
  requestLogger,
  createRateLimiter,
  apiLimiter,
  authLimiter,
  uploadLimiter,
  notFoundHandler,
  asyncHandler,
  sanitizeRequest,
  sanitizeObject,
  sanitizeString,
  upload,
};
