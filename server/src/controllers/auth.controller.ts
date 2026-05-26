import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// REGISTRO
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, username, password, discipline, location, birth_year } = req.body

    if (!email || !username || !password) {
    res.status(400).json({ message: 'Todos los campos son obligatorios' })
    return
    }

    try {
    const [existing]: any = await pool.query(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
    )

    if (existing.length > 0) {
        res.status(409).json({ message: 'Email o username ya en uso' })
        return
    }

    const password_hash = await bcrypt.hash(password, 10)

    const [result]: any = await pool.query(
        'INSERT INTO users (email, username, password_hash, discipline, location, birth_year) VALUES (?, ?, ?, ?, ?, ?)',
        [email, username, password_hash, discipline || null, location || null, birth_year || null]
    )

    const token = jwt.sign(
        { id: result.insertId, username, role: 'user' },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    )

    res.status(201).json({
        message: 'Usuario creado correctamente',
        token,
        user: {
        id: result.insertId,
        email,
        username,
        role: 'user'
        }
    })

    } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
    }
}

    // LOGIN
    export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        return;
    }

    try {
        // Buscar usuario
        const [users]: any = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
        );

        if (users.length === 0) {
        res.status(401).json({ message: 'Credenciales incorrectas' });
        return;
        }

        const user = users[0];

        // Comprobar contraseña
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
        res.status(401).json({ message: 'Credenciales incorrectas' });
        return;
        }

        // Generar token
        const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
        );

        res.json({
        message: 'Login correcto',
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            avatar_url: user.avatar_url,
            bio: user.bio
        }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };

    // GET PERFIL PROPIO
    export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;

        const [users]: any = await pool.query(
            'SELECT id, email, username, avatar_url, bio, role, discipline, location, birth_year, created_at FROM users WHERE id = ?',
            [userId]
        )

        if (users.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        return;
        }

        res.json(users[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    };