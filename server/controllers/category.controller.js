const mongoose = require('mongoose');
const Category = require('../models/Category');
const Post = require('../models/Post');
const { slugify } = require('../utils/helpers');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new Category (Admin / Editor)
 * @route   POST /api/v1/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, color, isFeatured } = req.body;

  const existingCategory = await Category.findOne({
    $or: [{ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } }],
  });

  if (existingCategory) {
    throw new ApiError(400, 'Category with this name already exists');
  }

  const slug = slugify(name);

  const category = await Category.create({
    name: name.trim(),
    slug,
    description: description || '',
    icon: icon || '',
    color: color || '#3B82F6',
    isFeatured: isFeatured !== undefined ? isFeatured : false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, 'Category created successfully'));
});

/**
 * @desc    Get All Categories (Public) with optional blog post counts
 * @route   GET /api/v1/categories
 * @access  Public
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ isFeatured: -1, name: 1 }).lean();

  // Aggregate published post counts for each category
  const postCounts = await Post.aggregate([
    { $match: { status: 'PUBLISHED' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  postCounts.forEach((item) => {
    countMap[item._id.toString()] = item.count;
  });

  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    postCount: countMap[cat._id.toString()] || 0,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      { categories: categoriesWithCounts, total: categories.length },
      'Categories retrieved successfully'
    )
  );
});

/**
 * @desc    Get Single Category by ID or Slug
 * @route   GET /api/v1/categories/:identifier
 * @access  Public
 */
const getCategoryBySlugOrId = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const isMongoId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isMongoId ? { _id: identifier } : { slug: identifier.toLowerCase() };

  const category = await Category.findOne(query).lean();

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const postCount = await Post.countDocuments({
    category: category._id,
    status: 'PUBLISHED',
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { ...category, postCount },
      'Category details retrieved successfully'
    )
  );
});

/**
 * @desc    Update Category (Admin)
 * @route   PUT /api/v1/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, color, isFeatured } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
    const existingName = await Category.findOne({
      _id: { $ne: req.params.id },
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
    if (existingName) {
      throw new ApiError(400, 'Category with this name already exists');
    }
    category.name = name.trim();
    category.slug = slugify(name);
  }

  if (description !== undefined) category.description = description;
  if (icon !== undefined) category.icon = icon;
  if (color !== undefined) category.color = color;
  if (isFeatured !== undefined) category.isFeatured = isFeatured;

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, 'Category updated successfully'));
});

/**
 * @desc    Delete Category (Admin)
 * @route   DELETE /api/v1/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if any posts are linked to this category
  const linkedPostsCount = await Post.countDocuments({ category: category._id });
  if (linkedPostsCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete category. There are ${linkedPostsCount} blog post(s) associated with it.`
    );
  }

  await Category.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Category deleted successfully'));
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryBySlugOrId,
  updateCategory,
  deleteCategory,
};
