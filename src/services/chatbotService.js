// src/services/chatbotService.js — Service: Chatbot y analíticas vía API
import { apiRequest, apiStream } from './api.js';

export const chatbotService = {
    async sendMessage(message, sessionId = null, onChunk) {
        const response = await apiStream('/chatbot/message', {
            method: 'POST',
            body: JSON.stringify({ message, sessionId }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || `Error ${response.status}`);
        }

        const reader  = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
        let buffer = '';
        let currentSessionId = sessionId;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop();

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;
                
                const parts = trimmedLine.split('data: ');
                for (const part of parts) {
                    const raw = part.trim();
                    if (!raw || raw === '[DONE]') continue;

                    try {
                        const data = JSON.parse(raw);
                        if (data.error) throw new Error(data.error);
                        if (data.sessionId && data.sessionId !== currentSessionId) {
                            currentSessionId = data.sessionId;
                            onChunk?.({ sessionId: data.sessionId });
                        }
                        if (data.text) {
                            accumulated += data.text;
                            onChunk?.(data);
                        }
                    } catch (e) {
                        // Ignorar fragmentos inválidos
                    }
                }
            }
        }

        return accumulated || 'No pude generar una respuesta.';
    },

    getChatbotConfig() {
        return apiRequest('/chatbot/config');
    },

    getHistory(sessionId) {
        return apiRequest(`/chatbot/history?sessionId=${encodeURIComponent(sessionId)}`);
    },

    submitFeedback(sessionId, rating) {
        return apiRequest('/chatbot/feedback', {
            method: 'POST',
            body: JSON.stringify({ sessionId, rating }),
        });
    },

    getFeedbackStats() {
        return apiRequest('/chatbot/feedback-stats');
    },

    getAnalytics()     { return apiRequest('/chatbot/analytics'); },
    getDailyCounts(d)  { return apiRequest(`/chatbot/analytics/daily?days=${d || 7}`); },
    getCategoryStats() { return apiRequest('/chatbot/analytics/categories'); },
    getFrequent(n)     { return apiRequest(`/chatbot/analytics/frequent?limit=${n || 10}`); },
    getSummary()       { return apiRequest('/chatbot/analytics/summary'); },
};
