const express = require('express');
const router = express.Router();

const {
  getAllPosts,
  getPostByIdOrSlug,
  createPost,
  updatePost,
  deletePost,
  getRelatedPosts,
} = require('../controllers/blog.controller');

const {
  createBlogValidator,
  updateBlogValidator,
  blogQueryValidator,
  blogIdOrSlugValidator,
} = require('../validators/blog.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, optionalJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', optionalJWT, blogQueryValidator, validate, getAllPosts);
router.get('/:idOrSlug', optionalJWT, blogIdOrSlugValidator, validate, getPostByIdOrSlug);
router.get('/:id/related', getRelatedPosts);

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'));

router.post('/', upload.single('featuredImage'), createBlogValidator, validate, createPost);
router.put('/:id', upload.single('featuredImage'), updateBlogValidator, validate, updatePost);
router.delete('/:id', deletePost);

module.exports = router;
