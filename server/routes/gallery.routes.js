const express = require('express');
const router = express.Router();

const {
  uploadGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/gallery.controller');

const {
  uploadGalleryValidator,
  updateGalleryValidator,
  getGalleryQueryValidator,
  galleryIdValidator,
} = require('../validators/gallery.validator');

const uploadImage = require('../config/multer.config');
const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// Public Gallery Routes
router.get('/', getGalleryQueryValidator, validate, getAllGalleryItems);
router.get('/:id', galleryIdValidator, validate, getGalleryItemById);

// Protected Admin Gallery Routes
router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'OPERATIONS_MANAGER'));

router.post(
  '/',
  uploadImage.single('image'),
  uploadGalleryValidator,
  validate,
  uploadGalleryItem
);

router.put(
  '/:id',
  uploadImage.single('image'),
  updateGalleryValidator,
  validate,
  updateGalleryItem
);

// Delete restricted to Super Admin
router.delete('/:id', authorizeRoles('SUPER_ADMIN'), galleryIdValidator, validate, deleteGalleryItem);

module.exports = router;
