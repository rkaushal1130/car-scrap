const ApiError = require('../utils/apiError');

/**
 * 404 Route Not Found Middleware Handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    404,
    `Route resource '${req.originalUrl}' on method [${req.method}] was not found on this server.`
  );
  next(error);
};

module.exports = notFoundHandler;
