// server/controllers/conversationsController.js — Controller: Historial del chatbot
import { ConversationModel } from '../models/ConversationModel.js';

export const conversationsController = {
    async getRecent(req, res) {
        const limit = parseInt(req.query.limit) || 50;
        res.json(await ConversationModel.getRecent(limit));
    },

    async getSession(req, res) {
        const messages = await ConversationModel.getBySession(req.params.sessionId);
        if (!messages.length) return res.status(404).json({ error: 'Sesión no encontrada' });
        res.json(messages);
    },

    async deleteSession(req, res) {
        const deleted = await ConversationModel.deleteSession(req.params.sessionId);
        if (!deleted) return res.status(404).json({ error: 'Sesión no encontrada' });
        res.json({ message: 'Conversación eliminada' });
    },

    async getStats(req, res) {
        res.json({ totalSessions: await ConversationModel.totalSessions() });
    }
};
