// server/controllers/usersController.js — Controller: Gestión de usuarios admin
import { UserModel } from '../models/UserModel.js';
import { db } from '../config/database.js';
import { users } from '../db/schema.js';
import { logActivity } from '../services/activityService.js';
import { eq, and, sql, asc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const usersController = {
    async getAll(req, res) {
        const result = await db.select({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            lastLogin: users.lastLogin
        }).from(users).orderBy(asc(users.createdAt));
        res.json(result);
    },

    async create(req, res) {
        const { username, email, password, role = 'admin' } = req.body;
        if (!username?.trim() || !password || !email?.trim()) {
            return res.status(400).json({ error: 'Usuario, correo y contraseña son requeridos' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }
        
        const emailLower = email.toLowerCase().trim();
        const usernameLower = username.toLowerCase().trim();
        
        const existingUser = await UserModel.findByUsername(usernameLower);
        if (existingUser) {
            return res.status(409).json({ error: 'El nombre de usuario ya existe' });
        }
        
        const existingEmail = await UserModel.findByEmail(emailLower);
        if (existingEmail) {
            return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
        }
        
        const id = await UserModel.create(usernameLower, emailLower, password, role);
        await logActivity('USER_CREATE', `Usuario creado: "${usernameLower}" con email ${emailLower}`);
        
        res.status(201).json({ id, username: usernameLower, email: emailLower, role });
    },

    async delete(req, res) {
        const id = parseInt(req.params.id);
        // No permitir borrar el propio usuario
        if (id === req.user.id) {
            return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
        }
        
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        await db.delete(users).where(eq(users.id, id));
        await logActivity('USER_DELETE', `Usuario eliminado: "${user.username}"`);
        
        res.json({ message: 'Usuario eliminado' });
    },

    async update(req, res) {
        const id = parseInt(req.params.id);
        const { username, email, password, role } = req.body;
        
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        const set = {};

        if (username && username.toLowerCase() !== user.username) {
            const usernameLower = username.toLowerCase().trim();
            const existing = await UserModel.findByUsername(usernameLower);
            if (existing && existing.id !== id) {
                return res.status(409).json({ error: 'El nombre de usuario ya existe' });
            }
            set.username = usernameLower;
        }

        if (email && email.toLowerCase().trim() !== user.email) {
            const emailLower = email.toLowerCase().trim();
            const existing = await UserModel.findByEmail(emailLower);
            if (existing && existing.id !== id) {
                return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
            }
            set.email = emailLower;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            }
            set.password = await bcrypt.hash(password, 12);
        }

        if (role && role !== user.role) {
            if (role !== 'admin' && role !== 'editor') {
                return res.status(400).json({ error: 'Rol inválido' });
            }
            set.role = role;
        }

        if (Object.keys(set).length === 0) {
            return res.status(400).json({ error: 'No hay cambios para actualizar' });
        }

        await db.update(users).set(set).where(eq(users.id, id));
        await logActivity('USER_UPDATE', `Usuario actualizado: ID ${id}`);
        
        const updatedUser = await UserModel.findById(id);
        res.json({ 
            id: updatedUser.id, 
            username: updatedUser.username, 
            email: updatedUser.email,
            role: updatedUser.role 
        });
    }
};
