const express = require('express');
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  getCategoryBySlugOrId,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} = require('../validators/category.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// Public Routes
router.get('/', getAllCategories);
router.get('/:identifier', getCategoryBySlugOrId);

// Protected Admin / Editor Routes
router.post(
  '/',
  verifyJWT,
  authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'OPERATIONS_MANAGER'),
  createCategoryValidator,
  validate,
  createCategory
);

router.put(
  '/:id',
  verifyJWT,
  authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'OPERATIONS_MANAGER'),
  updateCategoryValidator,
  validate,
  updateCategory
);

router.delete(
  '/:id',
  verifyJWT,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  categoryIdValidator,
  validate,
  deleteCategory
);

module.exports = router;
