const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category');
const { slugify, generateUniqueSlug, calculateReadingTime } = require('../utils/helpers');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/storage.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new Blog Post (Author/Admin)
 * @route   POST /api/v1/blogs
 * @access  Private (Author/Admin/Editor)
 */
const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    excerpt,
    category,
    tags,
    status = 'DRAFT',
    featuredImage,
    coverImage,
    isFeatured = false,
    seoMeta,
  } = req.body;

  // Validate category existence
  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    throw new ApiError(404, 'Selected category does not exist');
  }

  // Generate unique slug
  const slug = await generateUniqueSlug(Post, title);

  // Parse tags if array or comma-separated string
  let parsedTags = [];
  if (Array.isArray(tags)) {
    parsedTags = tags.map((t) => t.toString().trim().toLowerCase()).filter(Boolean);
  } else if (typeof tags === 'string') {
    parsedTags = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }

  // Format featured image object
  let formattedFeaturedImage = { url: '', alt: '', caption: '', publicId: '' };
  if (typeof featuredImage === 'string') {
    formattedFeaturedImage.url = featuredImage;
  } else if (typeof featuredImage === 'object' && featuredImage !== null) {
    formattedFeaturedImage = {
      url: featuredImage.url || '',
      alt: featuredImage.alt || title,
      caption: featuredImage.caption || '',
      publicId: featuredImage.publicId || '',
    };
  } else if (coverImage) {
    formattedFeaturedImage.url = coverImage;
  }

  // Calculate reading time
  const readingTime = calculateReadingTime(content);

  // SEO Fallbacks
  const formattedSeoMeta = {
    metaTitle: seoMeta?.metaTitle || title,
    metaDescription: seoMeta?.metaDescription || excerpt || title,
    keywords: Array.isArray(seoMeta?.keywords)
      ? seoMeta.keywords
      : typeof seoMeta?.keywords === 'string'
      ? seoMeta.keywords.split(',').map((k) => k.trim())
      : parsedTags,
    canonicalUrl: seoMeta?.canonicalUrl || '',
    ogImage: seoMeta?.ogImage || formattedFeaturedImage.url,
  };

  const blog = await Post.create({
    title: title.trim(),
    slug,
    content: content.trim(),
    excerpt: excerpt ? excerpt.trim() : '',
    featuredImage: formattedFeaturedImage,
    coverImage: formattedFeaturedImage.url,
    author: req.user._id,
    category,
    tags: parsedTags,
    status,
    publishedAt: status === 'PUBLISHED' ? new Date() : null,
    readingTime,
    isFeatured: Boolean(isFeatured),
    seoMeta: formattedSeoMeta,
  });

  const populatedBlog = await Post.findById(blog._id)
    .populate('author', 'fullName email avatar role')
    .populate('category', 'name slug color icon');

  return res
    .status(201)
    .json(new ApiResponse(201, populatedBlog, 'Blog post created successfully'));
});

/**
 * @desc    Get All Blogs with Search, Category, Tag, Status, Pagination & Sorting
 * @route   GET /api/v1/blogs
 * @access  Public (Filterable by status for Admin)
 */
const getAllBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const {
    search,
    category,
    tag,
    status,
    isFeatured,
    author,
    sortBy = 'publishedAt',
    sortOrder = 'desc',
  } = req.query;

  const query = {};

  // Visibility logic: Public users only see PUBLISHED. Logged in authors/admins can specify status.
  if (!req.user) {
    query.status = 'PUBLISHED';
  } else if (status && status !== 'ALL') {
    query.status = status;
  }

  // Filter by Category (Mongo ID or Slug)
  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    } else {
      const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        query.category = null; // No match
      }
    }
  }

  // Filter by Tag
  if (tag) {
    query.tags = tag.toLowerCase().trim();
  }

  // Filter by isFeatured
  if (isFeatured !== undefined) {
    query.isFeatured = isFeatured === 'true' || isFeatured === true;
  }

  // Filter by Author ID
  if (author && mongoose.Types.ObjectId.isValid(author)) {
    query.author = author;
  }

  // Search logic (Regex match across title, content, excerpt, and tags)
  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { excerpt: searchRegex },
      { content: searchRegex },
      { tags: searchRegex },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const [blogs, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'fullName email avatar role')
      .populate('category', 'name slug color icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'Blogs retrieved successfully'
    )
  );
});

/**
 * @desc    Get Single Blog Post by Slug or Mongo ID & Increment View Count
 * @route   GET /api/v1/blogs/:identifier
 * @access  Public
 */
const getBlogBySlugOrId = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const isMongoId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isMongoId ? { _id: identifier } : { slug: identifier.toLowerCase() };

  let blog = await Post.findOne(query)
    .populate('author', 'fullName email avatar role')
    .populate('category', 'name slug color icon');

  if (!blog) {
    throw new ApiError(404, 'Blog post not found');
  }

  // If public request, check if post is published
  if (!req.user && blog.status !== 'PUBLISHED') {
    throw new ApiError(404, 'Blog post not found');
  }

  // Increment views count atomically
  blog.viewsCount += 1;
  await blog.save({ validateBeforeSave: false });

  // Fetch related blogs in same category or matching tags
  const relatedBlogs = await Post.find({
    _id: { $ne: blog._id },
    status: 'PUBLISHED',
    $or: [{ category: blog.category?._id }, { tags: { $in: blog.tags } }],
  })
    .populate('author', 'fullName email avatar')
    .populate('category', 'name slug color')
    .select('title slug excerpt featuredImage coverImage readingTime publishedAt viewsCount tags')
    .limit(4)
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        blog,
        relatedBlogs,
      },
      'Blog details retrieved successfully'
    )
  );
});

/**
 * @desc    Get Related Blogs for a given post ID or Slug
 * @route   GET /api/v1/blogs/:identifier/related
 * @access  Public
 */
const getRelatedBlogs = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const limit = parseInt(req.query.limit, 10) || 4;

  const isMongoId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isMongoId ? { _id: identifier } : { slug: identifier.toLowerCase() };

  const currentBlog = await Post.findOne(query);

  if (!currentBlog) {
    throw new ApiError(404, 'Blog post not found');
  }

  const relatedBlogs = await Post.find({
    _id: { $ne: currentBlog._id },
    status: 'PUBLISHED',
    $or: [{ category: currentBlog.category }, { tags: { $in: currentBlog.tags } }],
  })
    .populate('author', 'fullName email avatar')
    .populate('category', 'name slug color')
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      { relatedBlogs, total: relatedBlogs.length },
      'Related blogs retrieved successfully'
    )
  );
});

/**
 * @desc    Get All Draft Blogs for Logged-In User / Admin
 * @route   GET /api/v1/blogs/drafts
 * @access  Private (Author/Admin)
 */
const getDraftBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { status: 'DRAFT' };

  // Non-admin authors only see their own drafts
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    query.author = req.user._id;
  }

  const [drafts, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'fullName email avatar')
      .populate('category', 'name slug color')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        drafts,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'Draft blogs retrieved successfully'
    )
  );
});

/**
 * @desc    Edit / Update Blog Post
 * @route   PUT /api/v1/blogs/:id
 * @access  Private (Author of post or Admin)
 */
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Post.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog post not found');
  }

  // Permission Check: Only the author or an admin can edit
  const isAuthor = blog.author.toString() === req.user._id.toString();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

  if (!isAuthor && !isAdmin) {
    throw new ApiError(403, 'You do not have permission to edit this blog post');
  }

  const {
    title,
    content,
    excerpt,
    category,
    tags,
    status,
    featuredImage,
    coverImage,
    isFeatured,
    seoMeta,
  } = req.body;

  // Title & Slug Update
  if (title && title.trim() !== blog.title) {
    blog.title = title.trim();
    blog.slug = await generateUniqueSlug(Post, title.trim(), blog._id);
  }

  // Category Update
  if (category) {
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      throw new ApiError(404, 'Selected category does not exist');
    }
    blog.category = category;
  }

  // Content & Reading Time Update
  if (content) {
    blog.content = content.trim();
    blog.readingTime = calculateReadingTime(content);
  }

  if (excerpt !== undefined) blog.excerpt = excerpt.trim();

  // Tags Update
  if (tags !== undefined) {
    if (Array.isArray(tags)) {
      blog.tags = tags.map((t) => t.toString().trim().toLowerCase()).filter(Boolean);
    } else if (typeof tags === 'string') {
      blog.tags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }
  }

  // Status & Published At Update
  if (status) {
    if (status === 'PUBLISHED' && blog.status !== 'PUBLISHED' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
    blog.status = status;
  }

  if (isFeatured !== undefined) blog.isFeatured = Boolean(isFeatured);

  // Featured Image Update
  if (featuredImage !== undefined) {
    if (typeof featuredImage === 'string') {
      blog.featuredImage = { ...blog.featuredImage, url: featuredImage };
      blog.coverImage = featuredImage;
    } else if (typeof featuredImage === 'object' && featuredImage !== null) {
      blog.featuredImage = {
        url: featuredImage.url || blog.featuredImage.url,
        alt: featuredImage.alt || blog.featuredImage.alt || blog.title,
        caption: featuredImage.caption || blog.featuredImage.caption,
        publicId: featuredImage.publicId || blog.featuredImage.publicId,
      };
      blog.coverImage = blog.featuredImage.url;
    }
  } else if (coverImage) {
    blog.coverImage = coverImage;
    blog.featuredImage.url = coverImage;
  }

  // SEO Update
  if (seoMeta) {
    blog.seoMeta = {
      metaTitle: seoMeta.metaTitle || blog.seoMeta?.metaTitle || blog.title,
      metaDescription: seoMeta.metaDescription || blog.seoMeta?.metaDescription || blog.excerpt,
      keywords: Array.isArray(seoMeta.keywords)
        ? seoMeta.keywords
        : typeof seoMeta.keywords === 'string'
        ? seoMeta.keywords.split(',').map((k) => k.trim())
        : blog.seoMeta?.keywords || blog.tags,
      canonicalUrl: seoMeta.canonicalUrl || blog.seoMeta?.canonicalUrl || '',
      ogImage: seoMeta.ogImage || blog.seoMeta?.ogImage || blog.featuredImage?.url || '',
    };
  }

  await blog.save();

  const updatedBlog = await Post.findById(blog._id)
    .populate('author', 'fullName email avatar role')
    .populate('category', 'name slug color icon');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBlog, 'Blog post updated successfully'));
});

/**
 * @desc    Publish a Blog Post
 * @route   PATCH /api/v1/blogs/:id/publish
 * @access  Private (Author/Admin)
 */
const publishBlog = asyncHandler(async (req, res) => {
  const blog = await Post.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog post not found');
  }

  const isAuthor = blog.author.toString() === req.user._id.toString();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

  if (!isAuthor && !isAdmin) {
    throw new ApiError(403, 'Permission denied');
  }

  blog.status = 'PUBLISHED';
  if (!blog.publishedAt) {
    blog.publishedAt = new Date();
  }

  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, blog, 'Blog post published successfully'));
});

/**
 * @desc    Draft a Blog Post (Unpublish)
 * @route   PATCH /api/v1/blogs/:id/draft
 * @access  Private (Author/Admin)
 */
const draftBlog = asyncHandler(async (req, res) => {
  const blog = await Post.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog post not found');
  }

  const isAuthor = blog.author.toString() === req.user._id.toString();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

  if (!isAuthor && !isAdmin) {
    throw new ApiError(403, 'Permission denied');
  }

  blog.status = 'DRAFT';
  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, blog, 'Blog post set to draft successfully'));
});

/**
 * @desc    Delete a Blog Post & delete cloud assets
 * @route   DELETE /api/v1/blogs/:id
 * @access  Private (Author/Admin)
 */
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Post.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog post not found');
  }

  const isAuthor = blog.author.toString() === req.user._id.toString();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

  if (!isAuthor && !isAdmin) {
    throw new ApiError(403, 'Permission denied to delete this post');
  }

  // Delete image asset from Cloudinary if publicId exists
  if (blog.featuredImage && blog.featuredImage.publicId) {
    await deleteFromCloudinary(blog.featuredImage.publicId);
  }

  await Post.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Blog post deleted successfully'));
});

/**
 * @desc    Generate Unique Slug Preview for Admin live title input
 * @route   POST /api/v1/blogs/generate-slug
 * @access  Private (Author/Admin)
 */
const generateSlugEndpoint = asyncHandler(async (req, res) => {
  const { title, currentId } = req.body;

  if (!title) {
    throw new ApiError(400, 'Title is required');
  }

  const slug = await generateUniqueSlug(Post, title, currentId);

  return res
    .status(200)
    .json(new ApiResponse(200, { slug, originalTitle: title }, 'Slug generated successfully'));
});

/**
 * @desc    Get All Unique Tags with Post Counts
 * @route   GET /api/v1/blogs/tags
 * @access  Public
 */
const getAllTags = asyncHandler(async (req, res) => {
  const tagAggregation = await Post.aggregate([
    { $match: { status: 'PUBLISHED' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ]);

  const tags = tagAggregation.map((t) => ({
    name: t._id,
    count: t.count,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { tags, total: tags.length }, 'Tags retrieved successfully'));
});

/**
 * @desc    Upload Featured Image to Cloudinary
 * @route   POST /api/v1/blogs/upload-image
 * @access  Private (Author/Admin)
 */
const uploadBlogImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }

  const cloudinaryData = await uploadToCloudinary(req.file.path, 'car_scrap_blogs');

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: cloudinaryData.secureUrl,
        thumbnailUrl: cloudinaryData.thumbnailUrl,
        publicId: cloudinaryData.publicId,
        width: cloudinaryData.width,
        height: cloudinaryData.height,
        format: cloudinaryData.format,
      },
      'Blog image uploaded successfully'
    )
  );
});

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogBySlugOrId,
  getRelatedBlogs,
  getDraftBlogs,
  updateBlog,
  publishBlog,
  draftBlog,
  deleteBlog,
  generateSlugEndpoint,
  getAllTags,
  uploadBlogImage,
};
