const Category = require('../models/Category');
const Post = require('../models/Post');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const { generateUniqueSlug } = require('../helpers/helpers');

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();

  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const postCount = await Post.countDocuments({
        category: cat._id,
        status: 'PUBLISHED',
      });
      return { ...cat, postCount };
    })
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      { categories: categoriesWithCounts, total: categoriesWithCounts.length },
      'Categories fetched successfully'
    )
  );
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).lean();

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const postCount = await Post.countDocuments({
    category: category._id,
    status: 'PUBLISHED',
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { ...category, postCount }, 'Category fetched successfully')
    );
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, color, isFeatured } = req.body;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(409, 'Category with this name already exists');
  }

  const slug = await generateUniqueSlug(Category, name);

  const category = await Category.create({
    name,
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

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const { name, description, icon, color, isFeatured } = req.body;

  if (name && name !== category.name) {
    category.name = name;
    category.slug = await generateUniqueSlug(Category, name, category._id);
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

const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  const associatedPostsCount = await Post.countDocuments({ category: categoryId });
  if (associatedPostsCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete category. There are ${associatedPostsCount} blog posts linked to this category.`
    );
  }

  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Category deleted successfully'));
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
