// server/models/ConversationModel.js — Model: Historial del chatbot
import { db } from '../config/database.js';
import { chatConversations, chatbotSessions, chatbotFeedback } from '../db/schema.js';
import { eq, and, sql, desc, asc, count } from 'drizzle-orm';
import crypto from 'crypto';

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

export const ConversationModel = {
    async createSession(sessionId = null) {
        const sid = sessionId || generateSessionId();
        await db.insert(chatbotSessions).values({ id: sid }).onConflictDoNothing();
        await db.update(chatbotSessions).set({ lastActive: sql`datetime('now')` }).where(eq(chatbotSessions.id, sid));
        return sid;
    },

    async getOrCreateSession(sessionId) {
        if (sessionId) {
            const result = await db.select().from(chatbotSessions).where(eq(chatbotSessions.id, sessionId)).limit(1);
            if (result[0]) {
                await db.update(chatbotSessions).set({ 
                    lastActive: sql`datetime('now')`, 
                    messageCount: sql`${chatbotSessions.messageCount} + 1` 
                }).where(eq(chatbotSessions.id, sessionId));
                return sessionId;
            }
        }
        return await this.createSession();
    },

    async addMessage(sessionId, role, content) {
        await db.insert(chatConversations).values({
            sessionId,
            role,
            content
        });
        await db.update(chatbotSessions).set({ 
            messageCount: sql`${chatbotSessions.messageCount} + 1`, 
            lastActive: sql`datetime('now')` 
        }).where(eq(chatbotSessions.id, sessionId));
    },

    async getBySession(sessionId) {
        return await db.select().from(chatConversations)
            .where(eq(chatConversations.sessionId, sessionId))
            .orderBy(asc(chatConversations.timestamp));
    },

    async getRecent(limit = 50) {
        // En Drizzle, las consultas complejas con GROUP BY y subconsultas a veces son más fáciles con sql``
        return await db.all(sql`
            SELECT c.session_id as sessionId,
                   MIN(c.timestamp) as startedAt,
                   CAST(COUNT(*) AS INTEGER) as messageCount,
                   (SELECT content FROM chat_conversations
                    WHERE session_id = c.session_id AND role = 'user'
                    ORDER BY timestamp ASC LIMIT 1) as firstQuestion
            FROM chat_conversations c
            GROUP BY c.session_id
            ORDER BY startedAt DESC
            LIMIT ${limit}
        `);
    },

    async deleteSession(sessionId) {
        await db.delete(chatConversations).where(eq(chatConversations.sessionId, sessionId));
        await db.delete(chatbotSessions).where(eq(chatbotSessions.id, sessionId));
        await db.delete(chatbotFeedback).where(eq(chatbotFeedback.sessionId, sessionId));
        return true;
    },

    async totalSessions() {
        const result = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(chatbotSessions);
        return result[0]?.count || 0;
    },

    async addFeedback(sessionId, rating) {
        await db.insert(chatbotFeedback).values({
            sessionId,
            rating
        });
    },

    async getFeedbackStats() {
        return await db.select({ 
            rating: chatbotFeedback.rating, 
            count: sql`count(*)`.mapWith(Number) 
        })
        .from(chatbotFeedback)
        .groupBy(chatbotFeedback.rating);
    },

    async getSessionStats() {
        const totalResult = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(chatbotSessions);
        const totalMessagesResult = await db.select({ total: sql`SUM(${chatbotSessions.messageCount})`.mapWith(Number) }).from(chatbotSessions);
        const recentSessions = await db.select().from(chatbotSessions)
            .orderBy(desc(chatbotSessions.lastActive))
            .limit(10);
            
        return { 
            total: totalResult[0]?.count || 0, 
            totalMessages: totalMessagesResult[0]?.total || 0, 
            recentSessions 
        };
    }
};
