import { Request, Response } from 'express'
import pool from '../config/db'

export const getReferents = async (req: Request, res: Response): Promise<void> => {
    try {
        const [referents]: any = await pool.query(
        'SELECT * FROM referents ORDER BY name ASC'
        )
        res.json(referents)
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

export const getReferentBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params
        const [referents]: any = await pool.query(
        'SELECT * FROM referents WHERE slug = ?', [slug]
        )
        if (referents.length === 0) {
        res.status(404).json({ message: 'Referente no encontrado' })
        return
        }
        res.json(referents[0])
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

export const createReferent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, slug, discipline, origin_country, birth_year, death_year, bio, cover_url, quote } = req.body
        if (!name || !slug) {
        res.status(400).json({ message: 'Nombre y slug son obligatorios' })
        return
        }
        await pool.query(
        'INSERT INTO referents (name, slug, discipline, origin_country, birth_year, death_year, bio, cover_url, quote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, slug, discipline, origin_country, birth_year, death_year, bio, cover_url, quote]
        )
        res.status(201).json({ message: 'Referente creado correctamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

export const updateReferent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const { name, slug, discipline, origin_country, birth_year, death_year, bio, cover_url, quote } = req.body
        await pool.query(
        'UPDATE referents SET name=?, slug=?, discipline=?, origin_country=?, birth_year=?, death_year=?, bio=?, cover_url=?, quote=? WHERE id=?',
        [name, slug, discipline, origin_country, birth_year, death_year, bio, cover_url, quote, id]
        )
        res.json({ message: 'Referente actualizado' })
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

export const deleteReferent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM referents WHERE id = ?', [id])
        res.json({ message: 'Referente eliminado' })
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}