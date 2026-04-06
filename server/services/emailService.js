// server/services/emailService.js — Servicio de envío de emails
import nodemailer from 'nodemailer';

const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    }
};

const fromName = process.env.SMTP_FROM_NAME || 'Liceo Pedro Emilio Coll';
const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@liceopedroemiliocoll.edu.ve';

let transporter = null;

function getTransporter() {
    if (!transporter && config.auth.user && config.auth.pass) {
        transporter = nodemailer.createTransport({
            ...config,
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    return transporter;
}

function getEmailHTML(response, originalMessage, recipientName) {
    const fecha = new Date().toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Respuesta - Liceo Pedro Emilio Coll</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #005bbf 0%, #003d80 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Liceo Nacional "Pedro Emilio Coll"</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Institución Educativa de Excelencia</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
            <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
                Estimado/a <strong>${recipientName}</strong>,
            </p>

            <p style="color: #333333; font-size: 14px; line-height: 1.6;">
                Gracias por contactarnos. Adjuntamos la respuesta a su mensaje:
            </p>

            <!-- Original Message Box -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #005bbf; padding: 15px; margin: 20px 0;">
                <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Su mensaje:</p>
                <p style="color: #333333; font-size: 14px; margin: 0; font-style: italic;">"${originalMessage}"</p>
            </div>

            <!-- Response Box -->
            <div style="background-color: #e8f4fd; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
                <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Nuestra respuesta:</p>
                <p style="color: #333333; font-size: 14px; margin: 0; line-height: 1.6;">${response.replace(/\n/g, '<br>')}</p>
            </div>

            <p style="color: #666666; font-size: 13px; margin-top: 30px; line-height: 1.6;">
                Si tiene alguna otra consulta, no dude en contactarnos nuevamente.
            </p>

            <p style="color: #666666; font-size: 13px; margin-top: 20px;">
                Atentamente,<br>
                <strong>Equipo de Administración</strong><br>
                Liceo Nacional "Pedro Emilio Coll"
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
                Este correo fue enviado el ${fecha}
            </p>
            <p style="color: #999999; font-size: 11px; margin: 10px 0 0 0;">
                Liceo Nacional "Pedro Emilio Coll" - Caracas, Venezuela
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

function getPasswordResetEmailHtml(username, resetUrl) {
    const fecha = new Date().toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña - Liceo Pedro Emilio Coll</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #005bbf 0%, #003d80 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Liceo Nacional "Pedro Emilio Coll"</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Recuperación de Contraseña</p>
        </div>

        <div style="padding: 30px;">
            <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
                Hola <strong>${username}</strong>,
            </p>

            <p style="color: #333333; font-size: 14px; line-height: 1.6;">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el panel de administración del Liceo Pedro Emilio Coll.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background-color: #005bbf; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                    Restablecer mi Contraseña
                </a>
            </div>

            <p style="color: #666666; font-size: 13px; line-height: 1.6;">
                Este enlace <strong>caduca en 1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña permanecerá sin cambios.
            </p>

            <div style="background-color: #f8f9fa; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                <p style="color: #666666; font-size: 12px; margin: 0;">
                    <strong>Nota de seguridad:</strong> Si no fuiste tú quien solicitó este cambio, te recomendamos cambiar tu contraseña inmediatamente desde el panel de administración.
                </p>
            </div>

            <p style="color: #666666; font-size: 13px; margin-top: 20px;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                <a href="${resetUrl}" style="color: #005bbf;">${resetUrl}</a>
            </p>
        </div>

        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
                Este correo fue enviado el ${fecha}
            </p>
            <p style="color: #999999; font-size: 11px; margin: 10px 0 0 0;">
                Liceo Nacional "Pedro Emilio Coll" - Caracas, Venezuela
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

export const emailService = {
    async sendContactReply(to, recipientName, originalMessage, response) {
        const transporter = getTransporter();
        
        if (!transporter) {
            console.warn('⚠️ Email no configurado. Respuesta guardada pero no enviada.');
            return { sent: false, reason: 'Email no configurado' };
        }

        try {
            const info = await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to: to,
                subject: `Re: Respuesta desde Liceo Pedro Emilio Coll`,
                html: getEmailHTML(response, originalMessage, recipientName)
            });

            console.log(`✅ Email enviado a ${to}: ${info.messageId}`);
            return { sent: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error enviando email:', error.message);
            return { sent: false, reason: error.message };
        }
    },

    async sendPasswordResetEmail(to, username, token, resetUrl) {
        const transporter = getTransporter();
        
        if (!transporter) {
            console.warn('⚠️ Email no configurado. No se puede enviar el correo de recuperación.');
            return { sent: false, reason: 'Email no configurado' };
        }

        const html = getPasswordResetEmailHtml(username, resetUrl);

        try {
            const info = await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to: to,
                subject: 'Recuperación de Contraseña - Liceo Pedro Emilio Coll',
                html
            });

            console.log(`✅ Email de recuperación enviado a ${to}: ${info.messageId}`);
            return { sent: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error enviando email de recuperación:', error.message);
            return { sent: false, reason: error.message };
        }
    },

    async testConnection() {
        const transporter = getTransporter();
        if (!transporter) {
            return { success: false, reason: 'Transporter no configurado' };
        }
        
        try {
            await transporter.verify();
            return { success: true };
        } catch (error) {
            return { success: false, reason: error.message };
        }
    },

    isConfigured() {
        return !!(config.auth.user && config.auth.pass);
    }
};

export default emailService;
