const { body } = require('express-validator');
const { emailRule, stringRule } = require('./common.validator');

const loginValidator = [
  emailRule('email', 'Email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const registerValidator = [
  stringRule('fullName', { min: 2, max: 100, required: true, label: 'Full name' }),
  emailRule('email', 'Email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'])
    .withMessage('Invalid user role specified'),
];

const forgotPasswordValidator = [
  emailRule('email', 'Email address'),
];

const resetPasswordValidator = [
  body('token')
    .notEmpty()
    .withMessage('Password reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long'),
];

const refreshTokenValidator = [
  body('refreshToken')
    .optional()
    .isString()
    .withMessage('Refresh token must be a string'),
];

module.exports = {
  loginValidator,
  registerValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  refreshTokenValidator,
};
