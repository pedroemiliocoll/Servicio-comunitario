// server/models/AnalyticsModel.js — Model: Analíticas del chatbot
import { db } from '../config/database.js';
import { chatbotAnalytics, chatbotSessions } from '../db/schema.js';
import { eq, and, gte, lte, sql, desc, count } from 'drizzle-orm';

const CATEGORIES = {
    inscri: 'Inscripciones',
    inscripcion: 'Inscripciones',
    matricular: 'Inscripciones',
    matricularse: 'Inscripciones',
    requisitos: 'Inscripciones',
    documentacion: 'Inscripciones',
    registro: 'Inscripciones',
    
    horario: 'Horarios',
    hora: 'Horarios',
    entrada: 'Horarios',
    salida: 'Horarios',
    clases: 'Horarios',
    turno: 'Horarios',
    
    contact: 'Contacto',
    telefono: 'Contacto',
    llamada: 'Contacto',
    email: 'Contacto',
    correo: 'Contacto',
    whatsapp: 'Contacto',
    
    docente: 'Docentes',
    profesor: 'Docentes',
    maestros: 'Docentes',
    maestro: 'Docentes',
    teachers: 'Docentes',
    
    uniform: 'Uniforme',
    uniforme: 'Uniforme',
    ropa: 'Uniforme',
    zapato: 'Uniforme',
    
    examen: 'Evaluación',
    prueba: 'Evaluación',
    nota: 'Evaluación',
    calificaciones: 'Evaluación',
    notas: 'Evaluación',
    evaluacion: 'Evaluación',
    
    beca: 'Becas',
    ayuda: 'Becas',
    socioecon: 'Becas',
    
    instalaciones: 'Instalaciones',
    salon: 'Instalaciones',
    sala: 'Instalaciones',
    laboratorio: 'Instalaciones',
    biblioteca: 'Instalaciones',
    cancha: 'Instalaciones',
    
    evento: 'Eventos',
    actividad: 'Eventos',
    fiesta: 'Eventos',
    acto: 'Eventos',
    graduacion: 'Eventos',
};

function categorize(question) {
    const q = question.toLowerCase();
    let bestMatch = 'General';
    let longestMatch = 0;
    
    for (const [key, cat] of Object.entries(CATEGORIES)) {
        if (q.includes(key) && key.length > longestMatch) {
            bestMatch = cat;
            longestMatch = key.length;
        }
    }
    return bestMatch;
}

export const AnalyticsModel = {
    async logQuestion(question) {
        const category = categorize(question);
        await db.insert(chatbotAnalytics).values({
            question,
            category
        });
    },

    async getAll() {
        return await db.select().from(chatbotAnalytics).orderBy(desc(chatbotAnalytics.timestamp));
    },

    async getFiltered({ startDate, endDate, category } = {}) {
        let conditions = [];
        
        if (startDate) {
            conditions.push(gte(sql`date(${chatbotAnalytics.timestamp})`, sql`date(${startDate})`));
        }
        if (endDate) {
            conditions.push(lte(sql`date(${chatbotAnalytics.timestamp})`, sql`date(${endDate})`));
        }
        if (category && category !== 'all') {
            conditions.push(eq(chatbotAnalytics.category, category));
        }
        
        const query = db.select().from(chatbotAnalytics);
        if (conditions.length > 0) {
            query.where(and(...conditions));
        }
        return await query.orderBy(desc(chatbotAnalytics.timestamp));
    },

    async getTodayCount() {
        const result = await db.select({ count: sql`count(*)`.mapWith(Number) })
            .from(chatbotAnalytics)
            .where(sql`date(${chatbotAnalytics.timestamp}) = date('now')`);
        return result[0]?.count || 0;
    },

    async getDailyCounts(days = 7) {
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const day = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric' });
            
            const row = await db.select({ count: sql`count(*)`.mapWith(Number) })
                .from(chatbotAnalytics)
                .where(sql`date(${chatbotAnalytics.timestamp}) = ${day}`);
            
            result.push({ day, label, count: row[0]?.count || 0 });
        }
        return result;
    },

    async getCategoryCounts() {
        const rows = await db.select({ 
            category: chatbotAnalytics.category, 
            count: sql`count(*)`.mapWith(Number) 
        })
        .from(chatbotAnalytics)
        .groupBy(chatbotAnalytics.category)
        .orderBy(desc(sql`count(*)`));
        
        const result = {};
        rows.forEach(r => { result[r.category] = r.count; });
        return result;
    },

    async getFrequentQuestions(limit = 10) {
        return await db.select({ 
            question: sql`LOWER(TRIM(${chatbotAnalytics.question}))`, 
            count: sql`count(*)`.mapWith(Number) 
        })
        .from(chatbotAnalytics)
        .groupBy(sql`LOWER(TRIM(${chatbotAnalytics.question}))`)
        .orderBy(desc(sql`count(*)`))
        .limit(limit);
    },

    async getTotalCount() {
        const result = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(chatbotAnalytics);
        return result[0]?.count || 0;
    },

    async getHourlyStats() {
        const rows = await db.select({ 
            day_of_week: sql`strftime('%w', ${chatbotAnalytics.timestamp})`,
            hour: sql`CAST(strftime('%H', ${chatbotAnalytics.timestamp}) as INTEGER)`,
            count: sql`count(*)`.mapWith(Number)
        })
        .from(chatbotAnalytics)
        .where(gte(chatbotAnalytics.timestamp, sql`date('now', '-30 days')`))
        .groupBy(sql`strftime('%w', ${chatbotAnalytics.timestamp})`, sql`CAST(strftime('%H', ${chatbotAnalytics.timestamp}) as INTEGER)`);
        
        const result = {};
        rows.forEach(r => {
            const key = `${r.day_of_week}-${r.hour}`;
            result[key] = r.count;
        });
        return result;
    },

    async getSessionStats() {
        const total = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(chatbotSessions);
        const active24h = await db.select({ count: sql`count(*)`.mapWith(Number) })
            .from(chatbotSessions)
            .where(gte(chatbotSessions.lastActive, sql`datetime('now', '-24 hours')`));
        const avg = await db.select({ avg: sql`AVG(${chatbotSessions.messageCount})`.mapWith(Number) }).from(chatbotSessions);
        
        return {
            total: total[0]?.count || 0,
            activeLast24h: active24h[0]?.count || 0,
            avgMessages: Math.round((avg[0]?.avg || 0) * 10) / 10
        };
    }
};
