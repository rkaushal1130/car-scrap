const express = require('express');
const router = express.Router();

const {
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
} = require('../controllers/blog.controller');

const {
  createBlogValidator,
  updateBlogValidator,
  getBlogsQueryValidator,
  generateSlugValidator,
  blogIdValidator,
} = require('../validators/blog.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, optionalJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Public Routes (Optional Auth for draft viewing privileges)
router.get('/', optionalJWT, getBlogsQueryValidator, validate, getAllBlogs);
router.get('/tags', getAllTags);
router.get('/drafts', verifyJWT, getDraftBlogs);
router.get('/:identifier', optionalJWT, getBlogBySlugOrId);
router.get('/:identifier/related', getRelatedBlogs);

// Protected Blog Routes (Authors, Editors, Admins)
router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR', 'OPERATIONS_MANAGER'));

router.post('/', createBlogValidator, validate, createBlog);
router.post('/upload-image', upload.single('image'), uploadBlogImage);
router.post('/generate-slug', generateSlugValidator, validate, generateSlugEndpoint);

router.put('/:id', updateBlogValidator, validate, updateBlog);
router.patch('/:id/publish', blogIdValidator, validate, publishBlog);
router.patch('/:id/draft', blogIdValidator, validate, draftBlog);
router.delete('/:id', blogIdValidator, validate, deleteBlog);

module.exports = router;
