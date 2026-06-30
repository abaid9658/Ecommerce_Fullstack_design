import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  refreshAccessToken,
  logoutUser,
  updateUserProfile,
  socialLoginUser,
  addUserAddress,
  deleteUserAddress,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, authUser);
router.post('/social-login', authLimiter, socialLoginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/update-profile', protect, updateUserProfile);
router.post('/address', protect, addUserAddress);
router.delete('/address/:id', protect, deleteUserAddress);
router.get('/users', protect, async (req, res) => {
  // Admin only — list all users
  try {
    const User = (await import('../models/User.js')).default;
    const users = await User.find({}).select('-password -refreshToken');
    res.json({ users });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
