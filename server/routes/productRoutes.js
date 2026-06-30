import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getDealProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  sendProductInquiry
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/deals', getDealProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.get('/:id/related', getRelatedProducts);
router.post('/:id/inquiry', sendProductInquiry);

export default router;
