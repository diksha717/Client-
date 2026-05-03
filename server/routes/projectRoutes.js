import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectStats,
} from '../controllers/projectController.js';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getProjects);
router.get('/:id', authMiddleware, getProjectById);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);
router.post('/:id/members', authMiddleware, addProjectMember);
router.delete('/:id/members/:memberId', authMiddleware, removeProjectMember);
router.get('/:id/stats', authMiddleware, getProjectStats);

export default router;
