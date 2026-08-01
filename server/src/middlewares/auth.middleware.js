const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('./asyncHandler.middleware');

/**
 * Verify JWT Access Token Middleware
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request. Access token is missing.');
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_key'
    );

    const user = await User.findById(decodedToken?._id).select('-refreshToken');

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token. User does not exist.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Contact Administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid or expired access token');
  }
});

/**
 * Optional JWT Verification Middleware (for public endpoints with optional user context)
 */
const optionalJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_key'
    );
    const user = await User.findById(decodedToken?._id).select('-refreshToken');
    req.user = user && user.isActive ? user : null;
  } catch (error) {
    req.user = null;
  }
  next();
});

/**
 * Role Authorization Middleware Factory
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required before authorization check'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden. Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};

module.exports = {
  verifyJWT,
  optionalJWT,
  authorizeRoles,
};
