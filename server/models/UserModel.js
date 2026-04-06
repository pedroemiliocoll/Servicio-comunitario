// server/models/UserModel.js — Model: Usuarios y autenticación
import { db } from '../config/database.js';
import { users } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

export const UserModel = {
    async findByUsername(username) {
        const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
        return result[0] || null;
    },

    async findByEmail(email) {
        const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return result[0] || null;
    },

    async findById(id) {
        const result = await db.select({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            lastLogin: users.lastLogin,
            failedAttempts: users.failedAttempts,
            lockedUntil: users.lockedUntil
        }).from(users).where(eq(users.id, id)).limit(1);
        return result[0] || null;
    },

    async create(username, email, plainPassword, role = 'admin') {
        const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        const result = await db.insert(users).values({
            username,
            email,
            password: hashed,
            role,
            failedAttempts: 0,
            lockedUntil: null
        }).returning({ id: users.id });
        return result[0].id;
    },

    async updateEmail(id, email) {
        await db.update(users).set({ email }).where(eq(users.id, id));
    },

    async setResetToken(email) {
        const user = await this.findByEmail(email);
        if (!user) return null;
        
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        
        await db.update(users).set({ 
            resetToken: token, 
            resetTokenExpires: expires 
        }).where(eq(users.id, user.id));
        
        return { token, user };
    },

    async getUserByResetToken(token) {
        const result = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);
        const user = result[0] || null;
        if (!user) return null;
        
        if (user.resetTokenExpires && new Date(user.resetTokenExpires) < new Date()) {
            await this.clearResetToken(user.id);
            return null;
        }
        
        return user;
    },

    async clearResetToken(id) {
        await db.update(users).set({ 
            resetToken: null, 
            resetTokenExpires: null 
        }).where(eq(users.id, id));
    },

    async updatePassword(id, newPlainPassword) {
        const hashed = await bcrypt.hash(newPlainPassword, SALT_ROUNDS);
        await db.update(users).set({ password: hashed }).where(eq(users.id, id));
    },

    async updateLastLogin(id) {
        await db.update(users).set({ 
            lastLogin: sql`datetime('now')`, 
            failedAttempts: 0, 
            lockedUntil: null 
        }).where(eq(users.id, id));
    },

    async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    },

    async incrementFailedAttempts(id) {
        await db.update(users).set({ 
            failedAttempts: sql`${users.failedAttempts} + 1` 
        }).where(eq(users.id, id));
    },

    async lockAccount(id, minutes = 30) {
        const lockedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
        await db.update(users).set({ lockedUntil }).where(eq(users.id, id));
    },

    async resetFailedAttempts(id) {
        await db.update(users).set({ 
            failedAttempts: 0, 
            lockedUntil: null 
        }).where(eq(users.id, id));
    },

    isLocked(user) {
        if (!user.lockedUntil) return false;
        const lockedDate = new Date(user.lockedUntil);
        return lockedDate > new Date();
    },

    getRemainingLockTime(user) {
        if (!user.lockedUntil) return 0;
        const lockedDate = new Date(user.lockedUntil);
        const now = new Date();
        const diff = lockedDate - now;
        return diff > 0 ? Math.ceil(diff / 60000) : 0;
    },

    async count() {
        const result = await db.select({ count: sql`count(*)` }).from(users);
        return Number(result[0]?.count ?? 0);
    }
};
