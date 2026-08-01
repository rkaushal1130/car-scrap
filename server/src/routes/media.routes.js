const express = require('express');
const router = express.Router();

const {
  uploadImage,
  getAllMedia,
  deleteMedia,
  replaceMedia,
} = require('../controllers/media.controller');

const { mediaQueryValidator, mediaIdValidator } = require('../validators/media.validator');
const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { uploadLimiter } = require('../middlewares/rateLimiter.middleware');

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

router.post('/upload', uploadLimiter, upload.single('image'), uploadImage);
router.get('/', mediaQueryValidator, validate, getAllMedia);
router.put('/:id', uploadLimiter, mediaIdValidator, validate, upload.single('image'), replaceMedia);
router.delete('/:id', mediaIdValidator, validate, deleteMedia);

module.exports = router;
