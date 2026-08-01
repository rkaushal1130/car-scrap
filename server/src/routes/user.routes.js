const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  changePassword,
  updateUserRole,
} = require('../controllers/user.controller');

const {
  updateUserProfileValidator,
  changePasswordValidator,
  updateUserRoleValidator,
  getUsersQueryValidator,
  userIdValidator,
} = require('../validators/user.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(verifyJWT);

router.put('/profile', updateUserProfileValidator, validate, updateUserProfile);
router.post('/change-password', changePasswordValidator, validate, changePassword);

router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN'));
router.get('/', getUsersQueryValidator, validate, getAllUsers);
router.get('/:id', userIdValidator, validate, getUserById);
router.patch('/:id/role', updateUserRoleValidator, validate, updateUserRole);

module.exports = router;
