import { Router, Request, Response } from 'express'
import pool from '../config/db'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        const [cats]: any = await pool.query('SELECT * FROM categories ORDER BY name ASC')
        res.json(cats)
    } catch {
        res.status(500).json({ message: 'Error' })
    }
})

router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { name, slug } = req.body
        if (!name || !slug) {
            res.status(400).json({ message: 'Nombre y slug son obligatorios' })
            return
        }
        await pool.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug])
        res.status(201).json({ message: 'Categoría creada' })
    } catch {
        res.status(500).json({ message: 'Error' })
    }
})

router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
        await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id])
            res.json({ message: 'Categoría eliminada' })
    } catch {
            res.status(500).json({ message: 'Error' })
    }
})

export default router