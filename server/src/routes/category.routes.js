const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
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

router.get('/', getAllCategories);
router.get('/:id', categoryIdValidator, validate, getCategoryById);

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

router.post('/', createCategoryValidator, validate, createCategory);
router.put('/:id', updateCategoryValidator, validate, updateCategory);
router.delete('/:id', categoryIdValidator, validate, deleteCategory);

module.exports = router;
