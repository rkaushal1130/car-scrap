const Post = require('../models/Post');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const { generateUniqueSlug } = require('../helpers/helpers');
const { uploadToCloudinary } = require('../services/storage.service');

const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = {};

  if (!req.user || req.user.role === 'SUPPORT_AGENT') {
    query.status = 'PUBLISHED';
  } else if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.category) {
    const categoryDoc = await Category.findOne({
      $or: [{ _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null }, { slug: req.query.category }],
    });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }

  if (req.query.tag) {
    query.tags = req.query.tag.toLowerCase();
  }

  if (req.query.isFeatured !== undefined) {
    query.isFeatured = req.query.isFeatured === 'true';
  }

  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'fullName email avatarUrl')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Blog posts fetched successfully'
    )
  );
});

const getPostByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isMongoId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

  const query = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug };

  const post = await Post.findOne(query)
    .populate('author', 'fullName email avatarUrl')
    .populate('category', 'name slug color description');

  if (!post) {
    throw new ApiError(404, 'Blog post not found');
  }

  if (post.status !== 'PUBLISHED' && (!req.user || req.user.role === 'SUPPORT_AGENT')) {
    throw new ApiError(403, 'This blog post is not published yet');
  }

  post.viewsCount += 1;
  await post.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, post, 'Blog post retrieved successfully'));
});

const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, excerpt, tags, status, isFeatured, seoMeta } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(400, 'Selected category does not exist');
  }

  const slug = await generateUniqueSlug(Post, title);

  let featuredImageData = { url: '', alt: title, publicId: '' };
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.path, 'car_scrap_blogs');
    if (uploadResult) {
      featuredImageData = {
        url: uploadResult.url,
        alt: title,
        publicId: uploadResult.publicId,
      };
    }
  }

  const post = await Post.create({
    title,
    slug,
    content,
    excerpt,
    category,
    author: req.user._id,
    tags: Array.isArray(tags) ? tags : [],
    status: status || 'DRAFT',
    isFeatured: isFeatured !== undefined ? isFeatured : false,
    featuredImage: featuredImageData,
    coverImage: featuredImageData.url,
    seoMeta: seoMeta || {},
    publishedAt: status === 'PUBLISHED' ? new Date() : null,
  });

  const populatedPost = await Post.findById(post._id)
    .populate('author', 'fullName email avatarUrl')
    .populate('category', 'name slug');

  return res
    .status(201)
    .json(new ApiResponse(201, populatedPost, 'Blog post created successfully'));
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Blog post not found');
  }

  const { title, content, category, excerpt, tags, status, isFeatured, seoMeta } = req.body;

  if (title && title !== post.title) {
    post.title = title;
    post.slug = await generateUniqueSlug(Post, title, post._id);
  }

  if (content) post.content = content;
  if (excerpt !== undefined) post.excerpt = excerpt;
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(400, 'Selected category does not exist');
    }
    post.category = category;
  }
  if (tags) post.tags = Array.isArray(tags) ? tags : [];
  if (status) {
    if (status === 'PUBLISHED' && post.status !== 'PUBLISHED') {
      post.publishedAt = new Date();
    }
    post.status = status;
  }
  if (isFeatured !== undefined) post.isFeatured = isFeatured;
  if (seoMeta) post.seoMeta = { ...post.seoMeta, ...seoMeta };

  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.path, 'car_scrap_blogs');
    if (uploadResult) {
      post.featuredImage = {
        url: uploadResult.url,
        alt: post.title,
        publicId: uploadResult.publicId,
      };
      post.coverImage = uploadResult.url;
    }
  }

  await post.save();

  const updatedPost = await Post.findById(post._id)
    .populate('author', 'fullName email avatarUrl')
    .populate('category', 'name slug');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, 'Blog post updated successfully'));
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    throw new ApiError(404, 'Blog post not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Blog post deleted successfully'));
});

const getRelatedPosts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentPost = await Post.findById(id);

  if (!currentPost) {
    throw new ApiError(404, 'Blog post not found');
  }

  const relatedPosts = await Post.find({
    _id: { $ne: currentPost._id },
    status: 'PUBLISHED',
    $or: [{ category: currentPost.category }, { tags: { $in: currentPost.tags } }],
  })
    .populate('author', 'fullName avatarUrl')
    .populate('category', 'name slug color')
    .limit(3)
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, relatedPosts, 'Related blog posts fetched successfully'));
});

module.exports = {
  getAllPosts,
  getPostByIdOrSlug,
  createPost,
  updatePost,
  deletePost,
  getRelatedPosts,
};
