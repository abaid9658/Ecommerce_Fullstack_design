import express from 'express';
import { getUserNotifications, markNotificationRead, createNotification } from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserNotifications)
  .post(protect, admin, createNotification);

router.route('/:id/read')
  .put(protect, markNotificationRead);

export default router;
