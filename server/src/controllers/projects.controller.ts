import { Request, Response } from 'express';
import pool from '../config/db';

// GET todos los proyectos publicados
export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, search } = req.query;

        let query = `
        SELECT 
            p.id, p.title, p.description, p.cover_url, p.created_at, p.published_at,
            u.id as author_id, u.username, u.avatar_url,
            COUNT(DISTINCT l.user_id) as likes_count,
            COUNT(DISTINCT c.id) as comments_count
        FROM projects p
        JOIN users u ON p.author_id = u.id
        LEFT JOIN likes l ON p.id = l.project_id
        LEFT JOIN comments c ON p.id = c.project_id
        WHERE p.status = 'published'
        `;

        const params: any[] = [];

        if (search) {
        query += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
        }

        if (category) {
        query += ` AND EXISTS (
            SELECT 1 FROM project_categories pc
            JOIN categories cat ON pc.category_id = cat.id
            WHERE pc.project_id = p.id AND cat.slug = ?
        )`;
        params.push(category);
        }

        query += ` GROUP BY p.id ORDER BY p.published_at DESC`;

        const [projects]: any = await pool.query(query, params);
        res.json(projects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    // GET proyecto por ID
    export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const [projects]: any = await pool.query(`
        SELECT 
            p.*, 
            u.id as author_id, u.username, u.avatar_url, u.bio as author_bio,
            COUNT(DISTINCT l.user_id) as likes_count,
            COUNT(DISTINCT c.id) as comments_count
        FROM projects p
        JOIN users u ON p.author_id = u.id
        LEFT JOIN likes l ON p.id = l.project_id
        LEFT JOIN comments c ON p.id = c.project_id
        WHERE p.id = ? AND p.status = 'published'
        GROUP BY p.id
        `, [id]);

        if (projects.length === 0) {
        res.status(404).json({ message: 'Proyecto no encontrado' });
        return;
        }

        // Imágenes del proyecto
        const [images]: any = await pool.query(
        'SELECT * FROM project_images WHERE project_id = ? ORDER BY order_index',
        [id]
        );

        // Categorías del proyecto
        const [categories]: any = await pool.query(`
        SELECT c.id, c.name, c.slug 
        FROM categories c
        JOIN project_categories pc ON c.id = pc.category_id
        WHERE pc.project_id = ?
        `, [id]);

        // Comentarios del proyecto
        const [comments]: any = await pool.query(`
        SELECT 
            cm.id, cm.content, cm.created_at, cm.parent_id,
            u.id as author_id, u.username, u.avatar_url
        FROM comments cm
        JOIN users u ON cm.author_id = u.id
        WHERE cm.project_id = ?
        ORDER BY cm.created_at ASC
        `, [id]);

        res.json({
        ...projects[0],
        images,
        categories,
        comments
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    // POST crear proyecto
    export const createProject = async (req: Request, res: Response): Promise<void> => {
    const connection = await pool.getConnection();
    
    try {
        const userId = (req as any).user.id;
        const { title, description, cover_url, status, categories } = req.body;

        if (!title) {
        res.status(400).json({ message: 'El título es obligatorio' });
        connection.release();
        return;
        }

        await connection.beginTransaction();

        const published_at = status === 'published' ? new Date() : null;

        const [result]: any = await connection.query(
        'INSERT INTO projects (author_id, title, description, cover_url, status, published_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, title, description, cover_url, status || 'draft', published_at]
        );

        const projectId = result.insertId;

        if (categories && categories.length > 0) {
        for (const categoryId of categories) {
            await connection.query(
            'INSERT INTO project_categories (project_id, category_id) VALUES (?, ?)',
            [projectId, categoryId]
            );
        }
        }

        await connection.commit();
        connection.release();

        res.status(201).json({
        message: 'Proyecto creado correctamente',
        projectId
        });

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    // PUT editar proyecto
    export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;
        const { title, description, cover_url, status } = req.body;

        // Comprobar que el proyecto pertenece al usuario
        const [projects]: any = await pool.query(
        'SELECT * FROM projects WHERE id = ? AND author_id = ?',
        [id, userId]
        );

        if (projects.length === 0) {
        res.status(403).json({ message: 'No tienes permiso para editar este proyecto' });
        return;
        }

        const published_at = status === 'published' && projects[0].status === 'draft'
        ? new Date()
        : projects[0].published_at;

        await pool.query(
        'UPDATE projects SET title = ?, description = ?, cover_url = ?, status = ?, published_at = ? WHERE id = ?',
        [title, description, cover_url, status, published_at, id]
        );

        res.json({ message: 'Proyecto actualizado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    // DELETE eliminar proyecto
    export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        const [projects]: any = await pool.query(
        'SELECT * FROM projects WHERE id = ? AND author_id = ?',
        [id, userId]
        );

        if (projects.length === 0) {
        res.status(403).json({ message: 'No tienes permiso para eliminar este proyecto' });
        return;
        }

        await pool.query('DELETE FROM projects WHERE id = ?', [id]);
        res.json({ message: 'Proyecto eliminado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    // POST like a un proyecto
    export const likeProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        const [existing]: any = await pool.query(
        'SELECT * FROM likes WHERE user_id = ? AND project_id = ?',
        [userId, id]
        );

        if (existing.length > 0) {
        await pool.query(
            'DELETE FROM likes WHERE user_id = ? AND project_id = ?',
            [userId, id]
        );
        res.json({ message: 'Like eliminado', liked: false });
        } else {
        await pool.query(
            'INSERT INTO likes (user_id, project_id) VALUES (?, ?)',
            [userId, id]
        );
        res.json({ message: 'Like añadido', liked: true });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    export const addComment = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id
            const { id } = req.params
            const { content } = req.body

            if (!content?.trim()) {
            res.status(400).json({ message: 'El comentario no puede estar vacío' })
            return
            }

            await pool.query(
            'INSERT INTO comments (project_id, author_id, content) VALUES (?, ?, ?)',
            [id, userId, content]
            )

            res.status(201).json({ message: 'Comentario añadido' })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }