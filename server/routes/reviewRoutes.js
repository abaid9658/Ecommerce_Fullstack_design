import express from 'express';
import { getProductReviews, createReview, replyToReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/product/:productId')
  .get(getProductReviews);

router.route('/:id/reply')
  .put(protect, admin, replyToReview);

export default router;
