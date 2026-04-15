// server/controllers/settingsController.js — Controller: Configuración del liceo
import { SettingsModel } from '../models/SettingsModel.js';
import { logActivity } from '../services/activityService.js';

export const settingsController = {
    // Público — datos del liceo sin API key
    async getPublic(req, res) {
        const info = await SettingsModel.getLiceoInfo();
        res.json(info);
    },

    // Admin — incluye estado de la API key (sin revelarla)
    async getAdmin(req, res) {
        const info = await SettingsModel.getLiceoInfo();
        const apiKey = await SettingsModel.getApiKey();
        res.json({
            ...info,
            hasApiKey: !!apiKey,
            apiKey: apiKey // Enviamos la key al admin para que pueda verla/editarla
        });
    },

    async updateLiceoInfo(req, res) {
        const { nombre, nombreCorto, email, telefono, direccion, mision, vision, ubicacion, contacto, horario, estadisticas, lema } = req.body;
        await SettingsModel.saveLiceoInfo({ 
            nombre, nombreCorto, email, telefono, direccion,
            mision, vision, ubicacion, contacto, horario, estadisticas, lema 
        });
        await logActivity('SETTINGS_UPDATE', 'Información del liceo actualizada');
        res.json({ message: 'Información del liceo actualizada correctamente' });
    },

    async updateApiKey(req, res) {
        const { apiKey } = req.body;
        if (apiKey === undefined) {
            return res.status(400).json({ error: 'Se requiere el campo apiKey' });
        }
        await SettingsModel.saveApiKey(apiKey.trim());
        await logActivity('API_KEY_UPDATE', 'API Key de OpenRouter actualizada');
        res.json({ message: 'API Key guardada correctamente' });
    },

    async getComunicado(req, res) {
        res.json(await SettingsModel.getComunicado());
    },

    async updateComunicado(req, res) {
        const { enabled, titulo, mensaje } = req.body;
        await SettingsModel.saveComunicado({ enabled, titulo, mensaje });
        await logActivity('COMUNICADO_UPDATE', `Comunicado urgente actualizado: ${enabled ? 'activado' : 'desactivado'}`);
        res.json({ message: 'Comunicado guardado correctamente' });
    }
};
