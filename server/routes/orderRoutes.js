import express from 'express';
import { getUserOrders, trackOrder, createOrder, getAllOrders, updateOrderStatus, exportReport, getMyOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserOrders)
  .post(protect, createOrder);

router.route('/my-orders')
  .get(protect, getMyOrders);

router.route('/all')
  .get(protect, admin, getAllOrders);

router.route('/report')
  .get(protect, admin, exportReport);

router.route('/track/:id')
  .get(trackOrder);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

export default router;
