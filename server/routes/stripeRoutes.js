import express from 'express';
import { createCheckoutSession, webhookHandler } from '../controllers/stripeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

export default router;
