// server/controllers/contactController.js — Controller: Formulario de contacto
import { ContactModel } from '../models/ContactModel.js';
import emailService from '../services/emailService.js';

export const contactController = {
    // POST /api/contact — público
    async submit(req, res) {
        const { nombre, email, asunto, mensaje } = req.body;
        if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
            return res.status(400).json({ error: 'Nombre, email y mensaje son requeridos' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }
        if (mensaje.trim().length < 10) {
            return res.status(400).json({ error: 'El mensaje debe tener al menos 10 caracteres' });
        }
        const msg = await ContactModel.create({ nombre, email, asunto, mensaje });
        res.status(201).json({ message: 'Mensaje enviado correctamente', id: msg.id });
    },

    // GET /api/contact — admin (soporta filtros)
    async getAll(req, res) {
        const { search, status, from, to } = req.query;
        
        if (search || status || from || to) {
            const filters = { search, status, from, to };
            const messages = await ContactModel.search(filters);
            return res.json(messages);
        }
        
        res.json(await ContactModel.getAll());
    },

    async markRead(req, res) {
        await ContactModel.markRead(req.params.id);
        res.json({ message: 'Marcado como leído' });
    },

    async markAllRead(req, res) {
        await ContactModel.markAllRead();
        res.json({ message: 'Todos marcados como leídos' });
    },

    async delete(req, res) {
        const deleted = await ContactModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Mensaje no encontrado' });
        res.json({ message: 'Mensaje eliminado' });
    },

    async getSummary(req, res) {
        const [unread, total] = await Promise.all([
            ContactModel.countUnread(),
            ContactModel.countAll()
        ]);
        res.json({ unread, total });
    },

    // GET /api/contact/unread-count — lightweight polling endpoint
    async getUnreadCount(req, res) {
        const unread = await ContactModel.countUnread();
        res.json({ unread });
    },

    // GET /api/contact/:id — obtener mensaje con respuestas
    async getById(req, res) {
        const message = await ContactModel.getById(req.params.id);
        if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });
        
        const replies = await ContactModel.getReplies(req.params.id);
        res.json({ ...message, replies });
    },

    // POST /api/contact/:id/reply — guardar respuesta y enviar email
    async reply(req, res) {
        const { respuesta, sendEmail = true } = req.body;
        
        if (!respuesta?.trim()) {
            return res.status(400).json({ error: 'La respuesta no puede estar vacía' });
        }

        const msg = await ContactModel.getById(req.params.id);
        if (!msg) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        const reply = await ContactModel.addReply(req.params.id, respuesta);

        let emailResult = { sent: false, reason: 'No se solicitó envío de email' };
        
        if (sendEmail) {
            emailResult = await emailService.sendContactReply(
                msg.email,
                msg.nombre,
                msg.mensaje,
                respuesta
            );
        }

        res.json({ 
            message: 'Respuesta guardada', 
            reply,
            email: emailResult
        });
    },

    // GET /api/contact/:id/replies — obtener respuestas de un mensaje
    async getReplies(req, res) {
        const replies = await ContactModel.getReplies(req.params.id);
        res.json(replies);
    },

    // POST /api/contact/:id/reply-only — solo guardar sin enviar email
    async replyOnly(req, res) {
        const { respuesta } = req.body;
        
        if (!respuesta?.trim()) {
            return res.status(400).json({ error: 'La respuesta no puede estar vacía' });
        }

        const msg = await ContactModel.getById(req.params.id);
        if (!msg) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        const reply = await ContactModel.addReply(req.params.id, respuesta);
        res.json({ message: 'Respuesta guardada', reply });
    },

    // GET /api/contact/export/csv — exportar a CSV
    async exportCsv(req, res) {
        const messages = await ContactModel.getAllForExport();
        
        const header = 'ID,Nombre,Email,Asunto,Mensaje,Leido,Fecha,Respuestas\n';
        const csv = messages.reduce((acc, m) => {
            const row = [
                m.id,
                `"${m.nombre.replace(/"/g, '""')}"`,
                m.email,
                m.asunto,
                `"${m.mensaje.replace(/"/g, '""')}"`,
                m.leido ? 'Sí' : 'No',
                m.timestamp,
                m.reply_count
            ].join(',');
            return acc + row + '\n';
        }, header);

        const filename = `contact-messages-${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send('\uFEFF' + csv);
    },

    // GET /api/contact/email-status — verificar si email está configurado
    getEmailStatus(req, res) {
        res.json({ 
            configured: emailService.isConfigured(),
            message: emailService.isConfigured() 
                ? 'Email configurado correctamente' 
                : 'Email no configurado. Configure SMTP en variables de entorno.'
        });
    }
};

export default contactController;
