// server/controllers/authController.js — Controller: Autenticación y sesiones
import { UserModel } from '../models/UserModel.js';
import { generateToken } from '../middleware/auth.js';
import { logActivity } from '../services/activityService.js';
import { emailService } from '../services/emailService.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 30;

export const authController = {
    async login(req, res) {
        const { username, password } = req.body;
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        const user = await UserModel.findByUsername(username.trim().toLowerCase());
        
        // Verificar si el usuario existe primero
        if (!user) {
            // Registrar intento de usuario inexistente
            await logActivity('LOGIN_FAILED', `IP: ${clientIp} - Usuario '${username}' no existe`);
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Verificar si la cuenta está bloqueada
        if (UserModel.isLocked(user)) {
            const remainingMinutes = UserModel.getRemainingLockTime(user);
            await logActivity('LOGIN_BLOCKED', `IP: ${clientIp} - Usuario '${username}' intento acceder siendo bloqueo`);
            return res.status(423).json({ 
                error: 'Cuenta temporalmente bloqueada',
                locked: true,
                remainingMinutes
            });
        }

        const valid = await UserModel.verifyPassword(password, user.password);
        
        if (!valid) {
            // Incrementar intentos fallidos
            await UserModel.incrementFailedAttempts(user.id);
            
            // Obtener intentos actualizados (findById ya es async)
            const updatedUser = await UserModel.findById(user.id);
            const attempts = updatedUser.failedAttempts;
            
            // Registrar intento fallido
            await logActivity('LOGIN_FAILED', `IP: ${clientIp} - Usuario '${username}' - Intento ${attempts}/${MAX_FAILED_ATTEMPTS}`);

            // Si alcanza el límite, bloquear cuenta
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                await UserModel.lockAccount(user.id, LOCKOUT_MINUTES);
                await logActivity('ACCOUNT_LOCKED', `Usuario '${username}' bloqueado tras ${MAX_FAILED_ATTEMPTS} intentos fallidos`);
                return res.status(423).json({ 
                    error: 'Demasiados intentos fallidos. Cuenta bloqueada por 30 minutos.',
                    locked: true,
                    remainingMinutes: LOCKOUT_MINUTES
                });
            }

            const remainingAttempts = MAX_FAILED_ATTEMPTS - attempts;
            return res.status(401).json({ 
                error: 'Contraseña incorrecta',
                incorrectPassword: true,
                remainingAttempts
            });
        }

        // Login exitoso
        await UserModel.updateLastLogin(user.id);
        await logActivity('LOGIN', `Usuario '${username}' (IP: ${clientIp}) inició sesión`);

        const token = generateToken(user);
        res.json({
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    },

    verify(req, res) {
        // En Express v5, el middleware ya es async-friendly, pero aquí no hay DB
        res.json({ valid: true, user: req.user });
    },

    async changePassword(req, res) {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Se requieren contraseña actual y nueva' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        const user = await UserModel.findById(req.user.id);
        const fullUser = await UserModel.findByUsername(user.username);
        const valid = await UserModel.verifyPassword(currentPassword, fullUser.password);
        if (!valid) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        await UserModel.updatePassword(req.user.id, newPassword);
        await logActivity('CHANGE_PASSWORD', `Usuario '${user.username}' cambió su contraseña`);

        res.json({ message: 'Contraseña actualizada correctamente' });
    },

    async requestPasswordReset(req, res) {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'El correo electrónico es requerido' });
        }

        const result = await UserModel.setResetToken(email.toLowerCase().trim());
        
        if (!result) {
            return res.status(404).json({ error: 'No existe una cuenta con ese correo electrónico' });
        }

        const { token, user } = result;
        const baseUrl = process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes('localhost') 
            ? process.env.FRONTEND_URL 
            : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
        const resetUrl = `${baseUrl}/reset-password/${token}`;
        const emailResult = await emailService.sendPasswordResetEmail(user.email, user.username, token, resetUrl);
        
        await logActivity('PASSWORD_RESET_REQUESTED', `Usuario '${user.username}' solicitó recuperación de contraseña`);

        res.json({ 
            message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña',
            emailSent: emailResult.sent
        });
    },

    async resetPassword(req, res) {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const user = await UserModel.getUserByResetToken(token);
        
        if (!user) {
            return res.status(400).json({ error: 'El token de recuperación es inválido o ha expirado' });
        }

        await UserModel.updatePassword(user.id, newPassword);
        await UserModel.clearResetToken(user.id);
        
        await logActivity('PASSWORD_RESET_COMPLETE', `Usuario '${user.username}' restableció su contraseña`);

        res.json({ message: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.' });
    }
};
