const express = require('express');
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
} = require('../controllers/user.controller');

const {
  createUserValidator,
  updateUserValidator,
  changePasswordValidator,
  updateProfileValidator,
  userIdParamValidator,
  getUsersQueryValidator,
} = require('../validators/user.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// All user routes require authentication
router.use(verifyJWT);

// Current User Profile & Password Change
router.patch('/profile', updateProfileValidator, validate, updateProfile);
router.post('/change-password', changePasswordValidator, validate, changePassword);

// Management Routes (SuperAdmin & OperationsManager)
router.get(
  '/',
  authorizeRoles('SUPER_ADMIN', 'OPERATIONS_MANAGER'),
  getUsersQueryValidator,
  validate,
  getAllUsers
);

router.get(
  '/:id',
  authorizeRoles('SUPER_ADMIN', 'OPERATIONS_MANAGER'),
  userIdParamValidator,
  validate,
  getUserById
);

// Admin-Only CRUD Routes (SuperAdmin)
router.post(
  '/',
  authorizeRoles('SUPER_ADMIN'),
  createUserValidator,
  validate,
  createUser
);

router.put(
  '/:id',
  authorizeRoles('SUPER_ADMIN'),
  updateUserValidator,
  validate,
  updateUser
);

router.delete(
  '/:id',
  authorizeRoles('SUPER_ADMIN'),
  userIdParamValidator,
  validate,
  deleteUser
);

module.exports = router;
