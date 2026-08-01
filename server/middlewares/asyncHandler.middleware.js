/**
 * Async Handler Middleware Wrapper to catch promise rejections automatically
 * @param {Function} requestHandler - Async route handler function (req, res, next)
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
