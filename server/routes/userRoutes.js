import express from 'express';
import { getUsers, getCurrentUser, getUserStats } from '../controllers/userController.js';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, getUsers);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/me/stats', authMiddleware, getUserStats);

export default router;
