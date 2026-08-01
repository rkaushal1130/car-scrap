const express = require('express');
const router = express.Router();

const {
  uploadSingleImage,
  uploadMultipleImages,
  replaceImage,
  deleteImage,
  getAllMedia,
  getMediaById,
  updateMediaMetadata,
} = require('../controllers/media.controller');

const {
  updateMediaMetadataValidator,
  getMediaListQueryValidator,
  mediaIdValidator,
} = require('../validators/media.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { handleUpload } = require('../middlewares/upload.middleware');

// Public Media Routes
router.get('/', getMediaListQueryValidator, validate, getAllMedia);
router.get('/:id', mediaIdValidator, validate, getMediaById);

// Protected Upload & Media Routes
router.use(verifyJWT);

router.post('/upload', handleUpload(upload.single('image')), uploadSingleImage);
router.post('/upload-multiple', handleUpload(upload.array('images', 10)), uploadMultipleImages);
router.put('/:id/replace', mediaIdValidator, validate, handleUpload(upload.single('image')), replaceImage);
router.patch('/:id', updateMediaMetadataValidator, validate, updateMediaMetadata);
router.delete('/:id', mediaIdValidator, validate, deleteImage);

module.exports = router;
