// server/models/AiConfigModel.js — Model: Configuración del comportamiento de la IA
import { db } from '../config/database.js';
import { aiConfig, aiCustomResponses } from '../db/schema.js';
import { eq, sql, desc, asc } from 'drizzle-orm';

const DEFAULT_SYSTEM_PROMPT = `Eres el asistente virtual del {nombre}. Responde SOLO sobre temas relacionados con este liceo. 
Sé amable, conciso y responde siempre en español.
Cuida mucho la ortografía y la gramática (acentos, puntuación, etc.).

Información del liceo:
- Misión: {mision}
- Visión: {vision}
- Dirección: {direccion}
- Teléfono: {telefono}
- Email: {email}
- Horario: {horario_entrada} a {horario_salida}
- Niveles educativos: {niveles}

{custom_instructions}`;

const DEFAULT_CONFIG = {
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    tone: 'amigable',
    temperature: 0.7,
    maxTokens: 600,
    onlySchool: 1,
    welcomeMessage: '👋 ¡Hola! Soy el asistente virtual del **Liceo Pedro Emilio Coll**. ¿En qué puedo ayudarte hoy?',
    errorMessage: '❌ Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentar de nuevo?',
    placeholder: 'Escribe tu pregunta...',
    suggestions: '["📋 Inscripciones","📚 Horarios","📞 Contacto","🏫 Sobre el Liceo"]',
    feedbackEnabled: 1,
    historyEnabled: 1,
    maxMessages: 50,
    typingIndicator: 1,
    widgetColor: '#0b92d5',
    widgetPosition: 'bottom-right',
    autoOpen: 0,
};

export const AiConfigModel = {
    async getConfig() {
        const result = await db.select().from(aiConfig).where(eq(aiConfig.id, 1)).limit(1);
        let row = result[0];
        
        if (!row) {
            await db.insert(aiConfig).values({
                id: 1,
                ...DEFAULT_CONFIG
            }).onConflictDoNothing();
            
            const fresh = await db.select().from(aiConfig).where(eq(aiConfig.id, 1)).limit(1);
            return fresh[0];
        }
        return row;
    },

    async updateConfig(data) {
        const updates = {};
        
        const camelToSnake = {
            'systemPrompt': 'system_prompt',
            'welcomeMessage': 'welcome_message',
            'errorMessage': 'error_message',
            'onlySchool': 'only_school',
            'historyEnabled': 'history_enabled',
            'feedbackEnabled': 'feedback_enabled',
            'typingIndicator': 'typing_indicator',
            'widgetColor': 'widget_color',
            'widgetPosition': 'widget_position',
            'maxTokens': 'max_tokens',
            'autoOpen': 'auto_open',
            'maxMessages': 'max_messages'
        };

        for (const [key, defaultVal] of Object.entries(DEFAULT_CONFIG)) {
            // Check both camelCase and snake_case versions of the key
            const snakeKey = camelToSnake[key];
            const val = data[key] !== undefined ? data[key] : (snakeKey ? data[snakeKey] : undefined);
            
            if (val !== undefined) {
                if (typeof defaultVal === 'number' && typeof val !== 'number') {
                    updates[key] = val ? 1 : 0;
                } else {
                    updates[key] = val;
                }
            }
        }
        
        if (Object.keys(updates).length > 0) {
            updates.updatedAt = sql`datetime('now')`;
            await db.update(aiConfig).set(updates).where(eq(aiConfig.id, 1));
        }
        
        return await this.getConfig();
    },

    async getChatbotConfig() {
        const config = await this.getConfig();
        return {
            welcomeMessage: config.welcomeMessage,
            errorMessage: config.errorMessage,
            placeholder: config.placeholder,
            suggestions: JSON.parse(config.suggestions || '[]'),
            feedbackEnabled: Boolean(config.feedbackEnabled),
            historyEnabled: Boolean(config.historyEnabled),
            maxMessages: config.maxMessages,
            typingIndicator: Boolean(config.typingIndicator),
            widgetColor: config.widgetColor,
            widgetPosition: config.widgetPosition,
            autoOpen: Boolean(config.autoOpen),
        };
    },

    async getAllResponses() {
        return await db.select().from(aiCustomResponses).orderBy(desc(aiCustomResponses.priority), asc(aiCustomResponses.id));
    },

    async getEnabledResponses() {
        return await db.select().from(aiCustomResponses)
            .where(eq(aiCustomResponses.enabled, 1))
            .orderBy(desc(aiCustomResponses.priority), asc(aiCustomResponses.id));
    },

    async addResponse(trigger, response, priority = 0) {
        const result = await db.insert(aiCustomResponses).values({
            trigger,
            response,
            priority
        }).returning();
        return result[0];
    },

    async updateResponse(id, data) {
        await db.update(aiCustomResponses).set({
            trigger: data.trigger,
            response: data.response,
            enabled: data.enabled ? 1 : 0,
            priority: data.priority ?? 0
        }).where(eq(aiCustomResponses.id, id));
        
        const result = await db.select().from(aiCustomResponses).where(eq(aiCustomResponses.id, id)).limit(1);
        return result[0];
    },

    async deleteResponse(id) {
        const result = await db.delete(aiCustomResponses).where(eq(aiCustomResponses.id, id));
        return result.rowsAffected > 0;
    },

    getDefaultPromptTemplate() {
        return DEFAULT_SYSTEM_PROMPT;
    },

    async resetToDefaults() {
        await db.update(aiConfig).set({
            ...DEFAULT_CONFIG,
            updatedAt: sql`datetime('now')`
        }).where(eq(aiConfig.id, 1));
        return await this.getConfig();
    }
};
