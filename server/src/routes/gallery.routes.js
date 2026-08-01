const express = require('express');
const router = express.Router();

const {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/gallery.controller');

const {
  createGalleryValidator,
  updateGalleryValidator,
  galleryQueryValidator,
  galleryIdValidator,
} = require('../validators/gallery.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, optionalJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.get('/', optionalJWT, galleryQueryValidator, validate, getGalleryItems);

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

router.post('/', createGalleryValidator, validate, createGalleryItem);
router.put('/:id', updateGalleryValidator, validate, updateGalleryItem);
router.delete('/:id', galleryIdValidator, validate, deleteGalleryItem);

module.exports = router;
