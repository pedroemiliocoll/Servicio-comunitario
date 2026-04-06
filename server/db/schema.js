import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: text('role').notNull().default('admin'),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
    lastLogin: text('last_login'),
    failedAttempts: integer('failed_attempts').default(0),
    lockedUntil: text('locked_until'),
    resetToken: text('reset_token'),
    resetTokenExpires: text('reset_token_expires'),
});

export const news = sqliteTable('news', {
    id: text('id').primaryKey(),
    titulo: text('titulo').notNull(),
    fecha: text('fecha').notNull(),
    categoria: text('categoria').notNull().default('general'),
    extracto: text('extracto').notNull(),
    contenido: text('contenido').notNull(),
    status: text('status').notNull().default('published'),
    imageUrl: text('image_url'),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
    scheduledAt: text('scheduled_at'),
    orden: integer('orden').notNull().default(0),
});

export const chatbotAnalytics = sqliteTable('chatbot_analytics', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    question: text('question').notNull(),
    category: text('category').notNull().default('general'),
    timestamp: text('timestamp').notNull().default(sql`(datetime('now'))`),
});

export const settings = sqliteTable('settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const aiConfig = sqliteTable('ai_config', {
    id: integer('id').primaryKey().default(1),
    systemPrompt: text('system_prompt'),
    tone: text('tone').notNull().default('amigable'),
    temperature: real('temperature').notNull().default(0.7),
    maxTokens: integer('max_tokens').notNull().default(600),
    onlySchool: integer('only_school').notNull().default(1),
    welcomeMessage: text('welcome_message').notNull().default('👋 ¡Hola! Soy el asistente virtual del **Liceo Pedro Emilio Coll**. ¿En qué puedo ayudarte hoy?'),
    errorMessage: text('error_message').notNull().default('❌ Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentar de nuevo?'),
    placeholder: text('placeholder').notNull().default('Escribe tu pregunta...'),
    suggestions: text('suggestions').notNull().default('["📋 Inscripciones","📚 Horarios","📞 Contacto","🏫 Sobre el Liceo"]'),
    feedbackEnabled: integer('feedback_enabled').notNull().default(1),
    historyEnabled: integer('history_enabled').notNull().default(1),
    maxMessages: integer('max_messages').notNull().default(50),
    typingIndicator: integer('typing_indicator').notNull().default(1),
    widgetColor: text('widget_color').notNull().default('#0b92d5'),
    widgetPosition: text('widget_position').notNull().default('bottom-right'),
    autoOpen: integer('auto_open').notNull().default(0),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const aiCustomResponses = sqliteTable('ai_custom_responses', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    trigger: text('trigger').notNull(),
    response: text('response').notNull(),
    enabled: integer('enabled').notNull().default(1),
    priority: integer('priority').notNull().default(0),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const activityLog = sqliteTable('activity_log', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    action: text('action').notNull(),
    details: text('details'),
    timestamp: text('timestamp').notNull().default(sql`(datetime('now'))`),
});

export const contactMessages = sqliteTable('contact_messages', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    nombre: text('nombre').notNull(),
    email: text('email').notNull(),
    asunto: text('asunto').notNull().default('general'),
    mensaje: text('mensaje').notNull(),
    leido: integer('leido').notNull().default(0),
    timestamp: text('timestamp').notNull().default(sql`(datetime('now'))`),
});

export const chatConversations = sqliteTable('chat_conversations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sessionId: text('session_id').notNull(),
    role: text('role').notNull(),
    content: text('content').notNull(),
    timestamp: text('timestamp').notNull().default(sql`(datetime('now'))`),
});

export const chatbotFeedback = sqliteTable('chatbot_feedback', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sessionId: text('session_id').notNull(),
    messageId: integer('message_id'),
    rating: text('rating').notNull(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const chatbotSessions = sqliteTable('chatbot_sessions', {
    id: text('id').primaryKey(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
    lastActive: text('last_active').notNull().default(sql`(datetime('now'))`),
    messageCount: integer('message_count').notNull().default(0),
    country: text('country'),
    region: text('region'),
});

export const gallery = sqliteTable('gallery', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    titulo: text('titulo').notNull(),
    descripcion: text('descripcion'),
    imageUrl: text('image_url').notNull(),
    categoria: text('categoria').notNull().default('general'),
    enabled: integer('enabled').notNull().default(1),
    orden: integer('orden').notNull().default(0),
    featured: integer('featured').notNull().default(0),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const events = sqliteTable('events', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    titulo: text('titulo').notNull(),
    descripcion: text('descripcion'),
    fecha: text('fecha').notNull(),
    hora: text('hora'),
    tipo: text('tipo').notNull().default('general'),
    lugar: text('lugar'),
    enabled: integer('enabled').notNull().default(1),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const contactReplies = sqliteTable('contact_replies', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    messageId: integer('message_id').notNull().references(() => contactMessages.id, { onDelete: 'cascade' }),
    respuesta: text('respuesta').notNull(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const analyticsEvents = sqliteTable('analytics_events', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    eventType: text('event_type').notNull(),
    sessionId: text('session_id').notNull(),
    category: text('category'),
    action: text('action'),
    label: text('label'),
    value: integer('value'),
    url: text('url'),
    referrer: text('referrer'),
    timestamp: text('timestamp').notNull().default(sql`(datetime('now'))`),
}, (table) => {
    return {
        sessionIdx: index('idx_analytics_session').on(table.sessionId),
        timestampIdx: index('idx_analytics_timestamp').on(table.timestamp),
        typeIdx: index('idx_analytics_type').on(table.eventType),
    };
});
