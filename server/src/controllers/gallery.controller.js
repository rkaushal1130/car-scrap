const Gallery = require('../models/Gallery');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

const getGalleryItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  const query = {};
  if (!req.user) query.isActive = true;
  if (req.query.category) query.category = req.query.category;

  const [items, total] = await Promise.all([
    Gallery.find(query).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Gallery.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } }, 'Gallery items retrieved')
  );
});

const createGalleryItem = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, publicId, category, tags, displayOrder } = req.body;

  const item = await Gallery.create({
    title,
    description: description || '',
    imageUrl,
    publicId: publicId || '',
    category: category || 'general',
    tags: Array.isArray(tags) ? tags : [],
    displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
  });

  return res.status(201).json(new ApiResponse(201, item, 'Gallery item created'));
});

const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    throw new ApiError(404, 'Gallery item not found');
  }
  return res.status(200).json(new ApiResponse(200, item, 'Gallery item updated'));
});

const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Gallery item not found');
  }
  return res.status(200).json(new ApiResponse(200, {}, 'Gallery item deleted'));
});

module.exports = {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
