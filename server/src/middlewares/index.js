const { verifyJWT, optionalJWT, authorizeRoles } = require('./auth.middleware');
const errorHandler = require('./error.middleware');
const validate = require('./validate.middleware');
const { httpLogger, requestLogger } = require('./logger.middleware');
const { apiLimiter, authLimiter, uploadLimiter } = require('./rateLimiter.middleware');
const upload = require('./upload.middleware');
const notFoundHandler = require('./notFound.middleware');
const asyncHandler = require('./asyncHandler.middleware');
const sanitizeRequest = require('./sanitizer.middleware');

module.exports = {
  verifyJWT,
  optionalJWT,
  authorizeRoles,
  errorHandler,
  validate,
  httpLogger,
  requestLogger,
  apiLimiter,
  authLimiter,
  uploadLimiter,
  upload,
  notFoundHandler,
  asyncHandler,
  sanitizeRequest,
};
