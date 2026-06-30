import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, createComment } from '../controllers/blogController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, admin, createBlog);

router.route('/:id')
  .put(protect, admin, updateBlog)
  .delete(protect, admin, deleteBlog);

router.route('/slug/:slug')
  .get(getBlogBySlug);

router.route('/:id/comment')
  .post(protect, createComment);

export default router;
