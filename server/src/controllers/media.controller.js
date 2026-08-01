const Media = require('../models/Media');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const { uploadToCloudinary, deleteFromCloudinary, replaceCloudinaryImage } = require('../services/storage.service');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }

  const uploadResult = await uploadToCloudinary(req.file.path, 'car_scrap_gallery');

  const media = await Media.create({
    originalName: req.file.originalname,
    fileName: req.file.filename,
    mimeType: req.file.mimetype,
    fileSize: req.file.size,
    url: uploadResult.url,
    publicId: uploadResult.publicId,
    width: uploadResult.width,
    height: uploadResult.height,
    format: uploadResult.format,
    uploadedBy: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, media, 'Image uploaded successfully'));
});

const getAllMedia = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  const [media, total] = await Promise.all([
    Media.find().populate('uploadedBy', 'fullName email').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Media.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { media, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } }, 'Media items retrieved')
  );
});

const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    throw new ApiError(404, 'Media asset not found');
  }

  await deleteFromCloudinary(media.publicId);
  await Media.findByIdAndDelete(req.params.id);

  return res.status(200).json(new ApiResponse(200, {}, 'Media asset deleted successfully'));
});

const replaceMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    throw new ApiError(404, 'Media asset not found');
  }

  if (!req.file) {
    throw new ApiError(400, 'Replacement file is required');
  }

  const uploadResult = await replaceCloudinaryImage(media.publicId, req.file.path, 'car_scrap_gallery');

  media.originalName = req.file.originalname;
  media.fileName = req.file.filename;
  media.mimeType = req.file.mimetype;
  media.fileSize = req.file.size;
  media.url = uploadResult.url;
  media.publicId = uploadResult.publicId;
  media.width = uploadResult.width;
  media.height = uploadResult.height;
  media.format = uploadResult.format;

  await media.save();

  return res.status(200).json(new ApiResponse(200, media, 'Media asset replaced successfully'));
});

module.exports = {
  uploadImage,
  getAllMedia,
  deleteMedia,
  replaceMedia,
};
