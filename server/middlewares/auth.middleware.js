const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Verify JWT Access Token (Strict Authentication)
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request. Access token missing.');
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_key'
    );

    const user = await User.findById(decodedToken._id).select('-refreshToken -password');

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token. User no longer exists.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account has been deactivated. Contact Super Admin.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token has expired. Please refresh token.');
    }
    throw new ApiError(401, error?.message || 'Invalid Access Token');
  }
});

/**
 * Optional JWT Verification (Soft Authentication for public routes)
 */
const optionalJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_key'
    );

    const user = await User.findById(decodedToken._id).select('-refreshToken -password');
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Ignore error for optional auth
  }
  next();
});

/**
 * Role-based Authorization Middleware
 * @param  {...string} allowedRoles - List of permitted roles (e.g. 'ADMIN', 'SUPER_ADMIN')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required to access this resource');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role (${req.user.role || 'Guest'}) is not authorized to access this resource`
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
