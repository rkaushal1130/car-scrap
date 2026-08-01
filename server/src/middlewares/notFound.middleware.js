const ApiError = require('../utils/apiError');

/**
 * 404 Route Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    404,
    `Route Not Found - [${req.method}] ${req.originalUrl}`
  );
  next(error);
};

module.exports = notFoundHandler;
