// server/controllers/aiConfigController.js — Controller: Configuración de la IA
import { AiConfigModel } from '../models/AiConfigModel.js';
import { db } from '../config/database.js';
import { activityLog } from '../db/schema.js';
import { logActivity } from '../services/activityService.js';
import { desc, sql } from 'drizzle-orm';

const VALID_TONES = ['formal', 'amigable', 'neutral'];
const VALID_POSITIONS = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];

export const aiConfigController = {
    async getConfig(req, res) {
        const config = await AiConfigModel.getConfig();
        res.json({
            ...config,
            defaultTemplate: AiConfigModel.getDefaultPromptTemplate()
        });
    },

    async updateConfig(req, res) {
        const data = req.body;

        if (data.temperature !== undefined) {
            const temp = parseFloat(data.temperature);
            if (isNaN(temp) || temp < 0 || temp > 1) {
                return res.status(400).json({ error: 'La temperatura debe estar entre 0 y 1' });
            }
        }

        if (data.max_tokens !== undefined) {
            const tokens = parseInt(data.max_tokens);
            if (isNaN(tokens) || tokens < 100 || tokens > 2048) {
                return res.status(400).json({ error: 'max_tokens debe estar entre 100 y 2048' });
            }
        }

        if (data.tone && !VALID_TONES.includes(data.tone)) {
            return res.status(400).json({ error: `Tono inválido. Opciones: ${VALID_TONES.join(', ')}` });
        }

        if (data.widget_position && !VALID_POSITIONS.includes(data.widget_position)) {
            return res.status(400).json({ error: `Posición inválida. Opciones: ${VALID_POSITIONS.join(', ')}` });
        }

        if (data.max_messages !== undefined) {
            const msgs = parseInt(data.max_messages);
            if (isNaN(msgs) || msgs < 10 || msgs > 200) {
                return res.status(400).json({ error: 'max_messages debe estar entre 10 y 200' });
            }
        }

        if (data.suggestions) {
            try {
                // Si viene como string, verificamos JSON. Si es objeto, lo serializamos en el model.
                if (typeof data.suggestions === 'string') {
                    JSON.parse(data.suggestions);
                }
            } catch {
                return res.status(400).json({ error: 'El campo suggestions debe ser un JSON array válido' });
            }
        }

        const mappedData = {};
        for (const [key, value] of Object.entries(data)) {
            const camelKey = key.replace(/([-_][a-z])/ig, ($1) => {
                return $1.toUpperCase().replace('-', '').replace('_', '');
            });
            mappedData[camelKey] = value;
        }

        const updated = await AiConfigModel.updateConfig(mappedData);
        await logActivity('AI_CONFIG_UPDATE', 'Configuración de IA actualizada');
        res.json(updated);
    },

    async resetConfig(req, res) {
        const reset = await AiConfigModel.resetToDefaults();
        await logActivity('AI_CONFIG_RESET', 'Configuración restaurada a valores por defecto');
        res.json(reset);
    },

    // ── Respuestas personalizadas ──────────────────────────────────────────────

    async getResponses(req, res) {
        res.json(await AiConfigModel.getAllResponses());
    },

    async addResponse(req, res) {
        const { trigger, response, priority = 0 } = req.body;
        if (!trigger || !response) {
            return res.status(400).json({ error: 'Se requieren trigger y response' });
        }
        if (trigger.length < 2) {
            return res.status(400).json({ error: 'El trigger debe tener al menos 2 caracteres' });
        }

        const item = await AiConfigModel.addResponse(trigger.trim(), response.trim(), priority);
        await logActivity('AI_RESPONSE_ADD', `Respuesta personalizada agregada: "${trigger}"`);
        res.status(201).json(item);
    },

    async updateResponse(req, res) {
        const { trigger, response, enabled, priority } = req.body;
        if (!trigger || !response) {
            return res.status(400).json({ error: 'Se requieren trigger y response' });
        }

        const item = await AiConfigModel.updateResponse(req.params.id, { trigger, response, enabled, priority });
        if (!item) return res.status(404).json({ error: 'Respuesta no encontrada' });
        res.json(item);
    },

    async deleteResponse(req, res) {
        const deleted = await AiConfigModel.deleteResponse(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Respuesta no encontrada' });
        await logActivity('AI_RESPONSE_DELETE', `Respuesta personalizada eliminada: ID ${req.params.id}`);
        res.json({ message: 'Respuesta eliminada' });
    },

    async getActivityLog(req, res) {
        const limit = parseInt(req.query.limit) || 50;
        const rows = await db.select().from(activityLog).orderBy(desc(activityLog.timestamp)).limit(limit);
        res.json(rows);
    }
};
