const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/apiError');

// Storage strategy: disk storage to temporary uploads directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter: strict format validation (jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  const extValid = allowedExtensions.includes(ext);

  if (mimeTypeValid && extValid) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Invalid file format '${ext}'. Allowed image formats are: JPG, JPEG, PNG, WEBP.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
    files: 5,
  },
});

module.exports = upload;
