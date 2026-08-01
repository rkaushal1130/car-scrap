const Gallery = require('../models/Gallery');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/storage.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Upload Image to Gallery & Cloudinary (Admin)
 * @route   POST /api/v1/gallery
 * @access  Private/Admin
 */
const uploadGalleryItem = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required for gallery upload');
  }

  const { title, description, category, altText, displayOrder, isPublished } = req.body;

  // Stream local image file to Cloudinary with compression & resize
  const cloudinaryData = await uploadToCloudinary(req.file.path, 'car_scrap_gallery');

  const galleryItem = await Gallery.create({
    title,
    description: description || '',
    category: category || 'FACILITY',
    mediaUrl: cloudinaryData.secureUrl,
    thumbnailUrl: cloudinaryData.thumbnailUrl,
    publicId: cloudinaryData.publicId,
    altText,
    width: cloudinaryData.width,
    height: cloudinaryData.height,
    bytes: cloudinaryData.bytes,
    format: cloudinaryData.format,
    displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true,
    uploadedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, galleryItem, 'Gallery image uploaded successfully'));
});

/**
 * @desc    Get All Gallery Items (Public & Admin) with Search, Categories & Pagination
 * @route   GET /api/v1/gallery
 * @access  Public
 */
const getAllGalleryItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  const { search, category, isPublished, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;

  const query = {};

  if (!req.user) {
    query.isPublished = true;
  } else if (isPublished !== undefined) {
    query.isPublished = isPublished === 'true';
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { altText: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [items, total] = await Promise.all([
    Gallery.find(query)
      .populate('uploadedBy', 'fullName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit),
    Gallery.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'Gallery items retrieved successfully'
    )
  );
});

/**
 * @desc    Get Single Gallery Item by ID
 * @route   GET /api/v1/gallery/:id
 * @access  Public
 */
const getGalleryItemById = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id).populate(
    'uploadedBy',
    'fullName email'
  );

  if (!galleryItem) {
    throw new ApiError(404, 'Gallery item not found');
  }

  if (!req.user && !galleryItem.isPublished) {
    throw new ApiError(404, 'Gallery item not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, galleryItem, 'Gallery item details retrieved successfully'));
});

/**
 * @desc    Update Gallery Item Details or Replace Image (Admin)
 * @route   PUT /api/v1/gallery/:id
 * @access  Private/Admin
 */
const updateGalleryItem = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);
  if (!galleryItem) {
    throw new ApiError(404, 'Gallery item not found');
  }

  const { title, description, category, altText, displayOrder, isPublished } = req.body;

  // If a new image file is uploaded, delete old Cloudinary image asset & upload new
  if (req.file) {
    await deleteFromCloudinary(galleryItem.publicId);

    const cloudinaryData = await uploadToCloudinary(req.file.path, 'car_scrap_gallery');
    galleryItem.mediaUrl = cloudinaryData.secureUrl;
    galleryItem.thumbnailUrl = cloudinaryData.thumbnailUrl;
    galleryItem.publicId = cloudinaryData.publicId;
    galleryItem.width = cloudinaryData.width;
    galleryItem.height = cloudinaryData.height;
    galleryItem.bytes = cloudinaryData.bytes;
    galleryItem.format = cloudinaryData.format;
  }

  if (title) galleryItem.title = title;
  if (description !== undefined) galleryItem.description = description;
  if (category) galleryItem.category = category;
  if (altText) galleryItem.altText = altText;
  if (displayOrder !== undefined) galleryItem.displayOrder = parseInt(displayOrder, 10);
  if (isPublished !== undefined)
    galleryItem.isPublished = isPublished === 'true' || isPublished === true;

  await galleryItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, galleryItem, 'Gallery item updated successfully'));
});

/**
 * @desc    Delete Gallery Item & Remove Cloudinary Asset (Admin)
 * @route   DELETE /api/v1/gallery/:id
 * @access  Private/Admin
 */
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);
  if (!galleryItem) {
    throw new ApiError(404, 'Gallery item not found');
  }

  // Delete remote cloud storage asset
  await deleteFromCloudinary(galleryItem.publicId);

  // Delete database record
  await Gallery.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Gallery item and cloud asset deleted successfully'));
});

module.exports = {
  uploadGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
};
