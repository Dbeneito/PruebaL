import { Router } from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    likeProject,
    addComment
} from '../controllers/projects.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);
router.post('/:id/like', authMiddleware, likeProject);
router.post('/:id/comments', authMiddleware, addComment);

export default router;