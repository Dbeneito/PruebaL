import { Router } from 'express'
import { getReferents, getReferentBySlug, createReferent, updateReferent, deleteReferent } from '../controllers/referents.controller'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getReferents)
router.get('/:slug', getReferentBySlug)
router.post('/', authMiddleware, adminMiddleware, createReferent)
router.put('/:id', authMiddleware, adminMiddleware, updateReferent)
router.delete('/:id', authMiddleware, adminMiddleware, deleteReferent)

export default router