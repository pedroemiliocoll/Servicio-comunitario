// server/controllers/chatbotController.js — Controller: Chatbot + analytics + history
import { AnalyticsModel } from '../models/AnalyticsModel.js';
import { ConversationModel } from '../models/ConversationModel.js';
import { AiConfigModel } from '../models/AiConfigModel.js';
import { NewsModel } from '../models/NewsModel.js';
import { ContactModel } from '../models/ContactModel.js';
import { streamChatMessage } from '../services/geminiService.js';

export const chatbotController = {
    async getChatbotConfig(req, res) {
        const config = await AiConfigModel.getChatbotConfig();
        res.json(config);
    },

    async sendMessage(req, res) {
        const { message, sessionId } = req.body;

        const sid = await ConversationModel.getOrCreateSession(sessionId);
        
        await AnalyticsModel.logQuestion(message.trim());
        await ConversationModel.addMessage(sid, 'user', message.trim());

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.write(`data: ${JSON.stringify({ sessionId: sid })}\n\n`);

        await streamChatMessage(message.trim(), res, async (fullResponse) => {
            if (fullResponse) {
                await ConversationModel.addMessage(sid, 'assistant', fullResponse);
            }
        });
    },

    async getHistory(req, res) {
        const { sessionId } = req.query;
        if (!sessionId) {
            return res.status(400).json({ error: 'sessionId es requerido' });
        }
        const messages = await ConversationModel.getBySession(sessionId);
        res.json({ sessionId, messages });
    },

    async submitFeedback(req, res) {
        const { sessionId, rating } = req.body;
        if (!sessionId || !rating) {
            return res.status(400).json({ error: 'sessionId y rating son requeridos' });
        }
        if (!['positive', 'negative', 'neutral'].includes(rating)) {
            return res.status(400).json({ error: 'Rating inválido' });
        }
        await ConversationModel.addFeedback(sessionId, rating);
        res.json({ success: true });
    },

    async getFeedbackStats(req, res) {
        const rawStats = await ConversationModel.getFeedbackStats();
        const sessionStats = await ConversationModel.getSessionStats();
        
        // Transformar array [{rating, count}] en object {positive, negative...}
        const stats = { positive: 0, negative: 0, neutral: 0 };
        rawStats.forEach(r => {
            if (stats[r.rating] !== undefined) stats[r.rating] = r.count;
        });
        
        res.json({ ...stats, sessions: sessionStats });
    },

    // ── Analytics ─────────────────────────────────────────────────────────────
    async getAnalytics(req, res) { res.json(await AnalyticsModel.getAll()); },
    async getDailyStats(req, res) { res.json(await AnalyticsModel.getDailyCounts(parseInt(req.query.days) || 7)); },
    async getCategoryStats(req, res) { res.json(await AnalyticsModel.getCategoryCounts()); },
    async getFrequentQuestions(req, res) { res.json(await AnalyticsModel.getFrequentQuestions(parseInt(req.query.limit) || 10)); },
    
    async getSummary(req, res) {
        const sessionStats = await AnalyticsModel.getSessionStats();
        const rawFeedback = await ConversationModel.getFeedbackStats();
        
        const f = { positive: 0, negative: 0 };
        rawFeedback.forEach(r => { if (f[r.rating] !== undefined) f[r.rating] = r.count; });
        const totalF = f.positive + f.negative;
        const satisfaction = totalF > 0 ? Math.round((f.positive / totalF) * 100) : 0;

        res.json({
            totalMessages: await AnalyticsModel.getTotalCount(),
            todayCount: await AnalyticsModel.getTodayCount(),
            daily: await AnalyticsModel.getDailyCounts(7),
            categories: await AnalyticsModel.getCategoryCounts(),
            uniqueUsers: sessionStats.activeLast24h,
            avgDaily: sessionStats.avgMessages,
            newsCount: await NewsModel.count(),
            unreadMessages: await ContactModel.countUnread(),
            satisfaction
        });
    },

    async getHourlyStats(req, res) {
        const hourly = await AnalyticsModel.getHourlyStats();
        const sessionStats = await AnalyticsModel.getSessionStats();
        res.json({ hourly, sessions: sessionStats });
    },

    // ── CSV Export con filtros ────────────────────────────────────────────────
    async exportCsv(req, res) {
        const { startDate, endDate, category } = req.query;
        const rows = await AnalyticsModel.getFiltered({ startDate, endDate, category });
        
        const header = 'id,pregunta,categoría,fecha\n';
        const csv = rows.reduce((acc, r) => {
            const q = `"${(r.question || '').replace(/"/g, '""')}"`;
            return acc + `${r.id},${q},${r.category},${r.timestamp}\n`;
        }, header);

        const filename = `chatbot-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send('\uFEFF' + csv);
    }
};
