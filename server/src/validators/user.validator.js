const { body } = require('express-validator');
const { emailRule, stringRule, mongoIdParamRule, paginationQueryRules } = require('./common.validator');

const updateUserProfileValidator = [
  stringRule('fullName', { min: 2, max: 100, required: false, label: 'Full name' }),
  body('avatarUrl')
    .optional()
    .isString(),
];

const changePasswordValidator = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long'),
];

const updateUserRoleValidator = [
  mongoIdParamRule('id', 'User ID'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'])
    .withMessage('Invalid user role specified'),
];

const getUsersQueryValidator = [
  ...paginationQueryRules,
  body('role').optional().isString(),
];

const userIdValidator = [
  mongoIdParamRule('id', 'User ID'),
];

module.exports = {
  updateUserProfileValidator,
  changePasswordValidator,
  updateUserRoleValidator,
  getUsersQueryValidator,
  userIdValidator,
};
