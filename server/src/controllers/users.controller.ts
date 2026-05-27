import { Request, Response } from 'express';
import pool from '../config/db';

// GET perfil público de un usuario
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username } = req.params;

        const [users]: any = await pool.query(
            'SELECT id, username, avatar_url, bio, discipline, location, birth_year, created_at FROM users WHERE username = ?',
            [username]
        )

        if (users.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        return;
        }

        const user = users[0];

        // Proyectos publicados del usuario
        const [projects]: any = await pool.query(`
        SELECT 
            p.id, p.title, p.cover_url, p.published_at,
            COUNT(DISTINCT l.user_id) as likes_count
        FROM projects p
        LEFT JOIN likes l ON p.id = l.project_id
        WHERE p.author_id = ? AND p.status = 'published'
        GROUP BY p.id
        ORDER BY p.published_at DESC
        `, [user.id]);

        // Conteo seguidores y siguiendo
        const [followers]: any = await pool.query(
            'SELECT COUNT(*) as count FROM follows WHERE following_id = ?',
            [user.id]
        );

        const [following]: any = await pool.query(
            'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?',
            [user.id]
        );

        res.json({
        ...user,
        projects,
        followers_count: followers[0].count,
        following_count: following[0].count
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const [users]: any = await pool.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
            )
            res.json(users)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    };

    // PUT actualizar perfil propio
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id
        const { bio, avatar_url, discipline, location } = req.body

        await pool.query(
        'UPDATE users SET bio = ?, avatar_url = ?, discipline = ?, location = ? WHERE id = ?',
        [bio || null, avatar_url || null, discipline || null, location || null, userId]
        )

        res.json({ message: 'Perfil actualizado correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
    };

    // POST seguir / dejar de seguir usuario
export const toggleFollow = async (req: Request, res: Response): Promise<void> => {
    try {
        const followerId = (req as any).user.id;
        const { id } = req.params;

        if (followerId === parseInt(id as string)) {
        res.status(400).json({ message: 'No puedes seguirte a ti mismo' });
        return;
        }

        const [existing]: any = await pool.query(
        'SELECT * FROM follows WHERE follower_id = ? AND following_id = ?',
        [followerId, id]
        );

        if (existing.length > 0) {
        await pool.query(
            'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
            [followerId, id]
        );
        res.json({ message: 'Has dejado de seguir a este usuario', following: false });
        } else {
        await pool.query(
            'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)',
            [followerId, id]
        );
        res.json({ message: 'Ahora sigues a este usuario', following: true });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    // GET usuarios destacados
export const getFeaturedUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const [users]: any = await pool.query(`
        SELECT 
            u.id, u.username, u.avatar_url, u.bio,
            COUNT(DISTINCT p.id) as projects_count,
            COUNT(DISTINCT f.follower_id) as followers_count
        FROM users u
        LEFT JOIN projects p ON u.id = p.author_id AND p.status = 'published'
        LEFT JOIN follows f ON u.id = f.following_id
        GROUP BY u.id
        ORDER BY followers_count DESC, projects_count DESC
        LIMIT 12
        `);

        res.json(users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    // GET proyectos guardados del usuario
export const getSavedProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;

        const [projects]: any = await pool.query(`
        SELECT 
            p.id, p.title, p.cover_url, p.published_at,
            u.username, u.avatar_url,
            COUNT(DISTINCT l.user_id) as likes_count
        FROM favorites f
        JOIN projects p ON f.project_id = p.id
        JOIN users u ON p.author_id = u.id
        LEFT JOIN likes l ON p.id = l.project_id
        WHERE f.user_id = ?
        GROUP BY p.id
        ORDER BY f.created_at DESC
        `, [userId]);

        res.json(projects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    // POST guardar / quitar proyecto de favoritos
export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        const [existing]: any = await pool.query(
        'SELECT * FROM favorites WHERE user_id = ? AND project_id = ?',
        [userId, id]
        );

        if (existing.length > 0) {
        await pool.query(
            'DELETE FROM favorites WHERE user_id = ? AND project_id = ?',
            [userId, id]
        );
        res.json({ message: 'Proyecto eliminado de favoritos', saved: false });
        } else {
        await pool.query(
            'INSERT INTO favorites (user_id, project_id) VALUES (?, ?)',
            [userId, id]
        );
        res.json({ message: 'Proyecto guardado en favoritos', saved: true });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };