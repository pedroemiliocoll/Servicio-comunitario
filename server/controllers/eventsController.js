// server/controllers/eventsController.js — Controller: Eventos del calendario
import { EventModel } from '../models/EventModel.js';
import { logActivity } from '../services/activityService.js';

export const eventsController = {
    async getPublic(req, res) {
        const { search } = req.query;
        let eventList = await EventModel.getUpcoming(50);
        
        if (search && search.trim()) {
            const term = search.trim().toLowerCase();
            eventList = eventList.filter(e => 
                (e.titulo || '').toLowerCase().includes(term) ||
                (e.descripcion || '').toLowerCase().includes(term)
            );
        }
        
        res.json(eventList);
    },

    async getAll(req, res) {
        res.json(await EventModel.getAll(false));
    },

    async create(req, res) {
        const { titulo, descripcion, fecha, hora, tipo, lugar } = req.body;
        if (!titulo?.trim() || !fecha?.trim()) {
            return res.status(400).json({ error: 'Título y fecha son requeridos' });
        }
        const item = await EventModel.create({ titulo, descripcion, fecha, hora, tipo, lugar });
        await logActivity('EVENT_CREATE', `Evento creado: "${titulo}" (${fecha})`);
        res.status(201).json(item);
    },

    async update(req, res) {
        const existing = await EventModel.getById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Evento no encontrado' });
        const item = await EventModel.update(req.params.id, req.body);
        res.json(item);
    },

    async delete(req, res) {
        const deleted = await EventModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Evento no encontrado' });
        await logActivity('EVENT_DELETE', `Evento eliminado ID: ${req.params.id}`);
        res.json({ message: 'Evento eliminado' });
    }
};

export default eventsController;
