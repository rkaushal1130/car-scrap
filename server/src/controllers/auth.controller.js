const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const { getCookieOptions, jwtConfig } = require('../config/security.config');

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Failed to generate authentication tokens');
  }
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password credentials');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated. Contact Administrator.');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select('-refreshToken');

  const refreshTokenCookieOptions = getCookieOptions(7 * 24 * 60 * 60 * 1000);
  const accessTokenCookieOptions = getCookieOptions(15 * 60 * 1000);

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessTokenCookieOptions)
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'Admin logged in successfully'
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, jwtConfig.refreshSecret);

    const user = await User.findById(decoded?._id).select('+refreshToken');
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token. User no longer exists.');
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, 'Refresh token is invalid or has been revoked');
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    const refreshTokenCookieOptions = getCookieOptions(7 * 24 * 60 * 60 * 1000);
    const accessTokenCookieOptions = getCookieOptions(15 * 60 * 1000);

    return res
      .status(200)
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'Access token refreshed successfully'
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  const cookieOptions = getCookieOptions();

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'Admin logged out successfully'));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          'If an account with that email exists, a password reset token has been generated.'
        )
      );
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  return res.status(200).json(
    new ApiResponse(
      200,
      { resetToken, resetUrl },
      'Password reset token generated successfully'
    )
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password reset successfully. You can now log in.'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user profile fetched successfully'));
});

module.exports = {
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
