const Media = require('../models/Media');
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  replaceCloudinaryImage,
} = require('../services/storage.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Upload Single Image (Compresses & Uploads to Cloudinary)
 * @route   POST /api/v1/media/upload
 * @access  Private (Auth Users / Admin)
 */
const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required for upload');
  }

  const { altText, caption, folder = 'car_scrap_uploads', entityType, entityId } = req.body;

  // Stream local file to Cloudinary with compression & optimization
  const cloudData = await uploadToCloudinary(req.file.path, { folder });

  const mediaItem = await Media.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mediaUrl: cloudData.secureUrl,
    thumbnailUrl: cloudData.thumbnailUrl,
    publicId: cloudData.publicId,
    folder,
    mimeType: req.file.mimetype,
    format: cloudData.format,
    bytes: cloudData.bytes,
    width: cloudData.width,
    height: cloudData.height,
    altText: altText || req.file.originalname,
    caption: caption || '',
    uploadedBy: req.user ? req.user._id : null,
    associatedEntity: {
      entityType: entityType || 'OTHER',
      entityId: entityId || null,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, mediaItem, 'Image uploaded and compressed successfully'));
});

/**
 * @desc    Upload Multiple Images (Batch upload up to 10 files)
 * @route   POST /api/v1/media/upload-multiple
 * @access  Private (Auth Users / Admin)
 */
const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'At least one image file is required');
  }

  const { folder = 'car_scrap_uploads' } = req.body;

  const uploadPromises = req.files.map(async (file) => {
    const cloudData = await uploadToCloudinary(file.path, { folder });
    return Media.create({
      filename: file.filename,
      originalName: file.originalname,
      mediaUrl: cloudData.secureUrl,
      thumbnailUrl: cloudData.thumbnailUrl,
      publicId: cloudData.publicId,
      folder,
      mimeType: file.mimetype,
      format: cloudData.format,
      bytes: cloudData.bytes,
      width: cloudData.width,
      height: cloudData.height,
      altText: file.originalname,
      uploadedBy: req.user ? req.user._id : null,
    });
  });

  const mediaItems = await Promise.all(uploadPromises);

  return res
    .status(201)
    .json(new ApiResponse(201, { count: mediaItems.length, items: mediaItems }, 'Multiple images uploaded successfully'));
});

/**
 * @desc    Replace Image (Deletes Old Cloudinary Image & Uploads New)
 * @route   PUT /api/v1/media/:id/replace
 * @access  Private (Auth Users / Admin)
 */
const replaceImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'New image file is required for replacement');
  }

  const mediaItem = await Media.findById(req.params.id);
  if (!mediaItem) {
    throw new ApiError(404, 'Media asset record not found');
  }

  const { altText, caption } = req.body;

  // Replace Cloudinary image (deletes old publicId & uploads new file)
  const cloudData = await replaceCloudinaryImage(mediaItem.publicId, req.file.path, mediaItem.folder);

  mediaItem.filename = req.file.filename;
  mediaItem.originalName = req.file.originalname;
  mediaItem.mediaUrl = cloudData.secureUrl;
  mediaItem.thumbnailUrl = cloudData.thumbnailUrl;
  mediaItem.publicId = cloudData.publicId;
  mediaItem.mimeType = req.file.mimetype;
  mediaItem.format = cloudData.format;
  mediaItem.bytes = cloudData.bytes;
  mediaItem.width = cloudData.width;
  mediaItem.height = cloudData.height;
  if (altText !== undefined) mediaItem.altText = altText;
  if (caption !== undefined) mediaItem.caption = caption;

  await mediaItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, mediaItem, 'Image replaced successfully'));
});

/**
 * @desc    Delete Image (Removes from Cloudinary & Database)
 * @route   DELETE /api/v1/media/:id
 * @access  Private (Auth Users / Admin)
 */
const deleteImage = asyncHandler(async (req, res) => {
  const mediaItem = await Media.findById(req.params.id);

  if (!mediaItem) {
    throw new ApiError(404, 'Media asset record not found');
  }

  // Delete image asset from Cloudinary
  if (mediaItem.publicId) {
    await deleteFromCloudinary(mediaItem.publicId);
  }

  // Delete database record
  await Media.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Image deleted successfully from Cloudinary and database'));
});

/**
 * @desc    Get All Media Assets (Paginated & Searchable Library for Admin)
 * @route   GET /api/v1/media
 * @access  Public / Admin
 */
const getAllMedia = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const { search, folder } = req.query;

  const query = {};

  if (folder) {
    query.folder = folder;
  }

  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { originalName: searchRegex },
      { altText: searchRegex },
      { caption: searchRegex },
    ];
  }

  const [mediaItems, total] = await Promise.all([
    Media.find(query)
      .populate('uploadedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Media.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        mediaItems,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'Media assets retrieved successfully'
    )
  );
});

/**
 * @desc    Get Single Media Asset by ID
 * @route   GET /api/v1/media/:id
 * @access  Public
 */
const getMediaById = asyncHandler(async (req, res) => {
  const mediaItem = await Media.findById(req.params.id).populate('uploadedBy', 'fullName email');

  if (!mediaItem) {
    throw new ApiError(404, 'Media asset not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, mediaItem, 'Media asset details retrieved successfully'));
});

/**
 * @desc    Update Media Metadata (Alt Text & Caption)
 * @route   PATCH /api/v1/media/:id
 * @access  Private (Auth / Admin)
 */
const updateMediaMetadata = asyncHandler(async (req, res) => {
  const mediaItem = await Media.findById(req.params.id);

  if (!mediaItem) {
    throw new ApiError(404, 'Media asset not found');
  }

  const { altText, caption } = req.body;

  if (altText !== undefined) mediaItem.altText = altText.trim();
  if (caption !== undefined) mediaItem.caption = caption.trim();

  await mediaItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, mediaItem, 'Media metadata updated successfully'));
});

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  replaceImage,
  deleteImage,
  getAllMedia,
  getMediaById,
  updateMediaMetadata,
};
