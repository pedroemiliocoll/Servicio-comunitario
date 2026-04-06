// server/models/SettingsModel.js — Model: Configuración del sistema (key-value store)
import { db } from '../config/database.js';
import { settings } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export const SettingsModel = {
    async get(key) {
        const result = await db.select({ value: settings.value }).from(settings).where(eq(settings.key, key)).limit(1);
        const row = result[0];
        if (!row) return null;
        try { return JSON.parse(row.value); } catch { return row.value; }
    },

    async set(key, value) {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        await db.insert(settings)
            .values({ key, value: serialized, updatedAt: sql`datetime('now')` })
            .onConflictDoUpdate({
                target: settings.key,
                set: { value: serialized, updatedAt: sql`datetime('now')` }
            });
    },

    async getAll() {
        const rows = await db.select({ key: settings.key, value: settings.value }).from(settings);
        const result = {};
        rows.forEach(r => {
            try { result[r.key] = JSON.parse(r.value); } catch { result[r.key] = r.value; }
        });
        return result;
    },

    async getLiceoInfo() {
        const all = await this.getAll();
        return {
            nombre:       all.nombre             || 'U.E.N. Pedro Emilio Coll',
            nombreCorto:  all.nombreCorto        || 'Liceo Pedro Emilio Coll',
            tipo:         all.tipo                || 'Unidad Educativa Nacional',
            lema:         all.lema                || 'Formando ciudadanos con excelencia y valores',
            mision:       all.mision              || '',
            vision:       all.vision              || '',
            ubicacion:    all.ubicacion           || { estado: '', municipio: '', direccion: '' },
            contacto:     all.contacto            || { telefono: '', email: '', redes_sociales: {} },
            horario:      all.horario             || { entrada: '7:00 AM', salida: '1:00 PM' },
            niveles_educativos: all.niveles_educativos || ['1er Año','2do Año','3er Año','4to Año','5to Año'],
            estadisticas: all.estadisticas        || { anios: 25, estudiantes: 500, docentes: 40, egresados: 5000 },
        };
    },

    async saveLiceoInfo(data) {
        const fields = ['mision', 'vision', 'ubicacion', 'contacto', 'horario', 'estadisticas', 'lema'];
        for (const f of fields) {
            if (data[f] !== undefined) {
                await this.set(f, data[f]);
            }
        }
    },

    async getApiKey()    { return (await this.get('gemini_api_key')) || ''; },
    async saveApiKey(k)  { await this.set('gemini_api_key', k); },

    async getComunicado() { 
        const data = (await this.get('comunicado_urgente')) || {};
        return {
            enabled: data.enabled || false,
            titulo: data.titulo || 'Comunicado Urgente',
            mensaje: data.mensaje || ''
        };
    },
    async saveComunicado(data) {
        await this.set('comunicado_urgente', {
            enabled: data.enabled || false,
            titulo: data.titulo || 'Comunicado Urgente',
            mensaje: data.mensaje || ''
        });
    },
};
