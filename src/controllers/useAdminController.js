// src/controllers/useAdminController.js — Full controller with all sections
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';
import { settingsService } from '../services/settingsService.js';
import { chatbotService } from '../services/chatbotService.js';
import { aiConfigService } from '../services/aiConfigService.js';
import { newsService } from '../services/newsService.js';
import { contactService } from '../services/contactService.js';
import { galleryService } from '../services/galleryService.js';
import { usersService } from '../services/usersService.js';
import { conversationsService } from '../services/conversationsService.js';
import { formatDate } from './useNewsController.js';

// ── Main admin controller ────────────────────────────────────────────────────
export function useAdmin() {
    const [section, setSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [toast, setToast] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    // Verify auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = authService.isAuthenticated();
            if (isAuth) {
                // Verify token is still valid
                const valid = await authService.verify();
                setIsLoggedIn(valid);
            }
            setAuthChecked(true);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const handler = () => { setIsLoggedIn(false); showToast('Sesión expirada', 'error'); };
        window.addEventListener('auth:expired', handler);
        return () => window.removeEventListener('auth:expired', handler);
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const login = async (e) => {
        e.preventDefault();
        if (!loginUsername || !loginPass) { showToast('Ingresa usuario y contraseña', 'error'); return; }
        setLoginLoading(true);
        setLoginError('');
        try {
            const result = await authService.login(loginUsername, loginPass);
            console.log('Login result:', result);
            console.log('Token stored:', localStorage.getItem('liceo_admin_token'));
            setIsLoggedIn(true); 
            setLoginPass('');
        } catch (err) {
            console.error('Login error:', err);
            const errorMsg = err.message || 'Error de conexión';
            setLoginError(errorMsg);
            showToast(errorMsg, 'error');
        } finally { setLoginLoading(false); }
    };

    const logout = () => { authService.logout(); setIsLoggedIn(false); setSection('dashboard'); };

    return {
        section, setSection, sidebarOpen, setSidebarOpen, isLoggedIn, authChecked,
        loginUsername, setLoginUsername, loginPass, setLoginPass, loginLoading, loginError,
        login, logout, toast, showToast,
        currentUser: authService.getCurrentUser(),
    };
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export function useDashboard() {
    const [data, setData] = useState({ newsCount: 0, totalQuestions: 0, todayCount: 0, hasApiKey: false, recentNews: [], recentQuestions: [], unreadMessages: 0, galleryCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            chatbotService.getSummary().catch(() => ({})),
            settingsService.getAdmin().catch(() => ({})),
            contactService.getSummary().catch(() => ({ unread: 0 })),
            galleryService.getAll().catch(() => []),
        ]).then(([summary, settings, contact, gallery]) => {
            // recent_news comes from the centralized summary (middleware converts recentNews → recent_news)
            const recentNews = summary.recent_news || [];
            setData({
                // Prefer centralized newsCount from summary, fallback to 0
                newsCount: summary.news_count ?? summary.newsCount ?? 0, 
                totalQuestions: summary.total_messages || summary.totalMessages || 0, 
                todayCount: summary.today_count || summary.todayCount || 0,
                hasApiKey: settings.has_api_key || settings.hasApiKey || false, 
                recentNews,
                recentQuestions: summary.daily || [], 
                unreadMessages: summary.unread_messages ?? summary.unreadMessages ?? contact.unread ?? contact.unread_count ?? 0,
                galleryCount: Array.isArray(gallery) ? gallery.length : 0,
            });
        }).catch(err => {
            console.error('Dashboard Load Error:', err);
        }).finally(() => setLoading(false));
    }, []);

    return { ...data, loading, formatDate };
}

// ── Analytics ────────────────────────────────────────────────────────────────
export function useAnalytics(refreshKey = 0, filters = {}) {
    const [data, setData] = useState({ analytics: [], daily: [], categories: {}, frequent: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            chatbotService.getAnalytics(),
            chatbotService.getDailyCounts(7),
            chatbotService.getCategoryStats(),
            chatbotService.getFrequent(10),
        ]).then(([analytics, daily, categories, frequent]) => setData({ analytics, daily, categories, frequent }))
            .catch(console.error).finally(() => setLoading(false));
    }, [refreshKey]);

    const barData = {
        labels: data.daily.map(d => d.label),
        datasets: [{ label: 'Preguntas', data: data.daily.map(d => d.count), backgroundColor: 'rgba(11,146,213,0.6)', borderColor: 'var(--blue-600)', borderWidth: 2, borderRadius: 6 }]
    };
    const doughnutData = {
        labels: Object.keys(data.categories),
        datasets: [{ data: Object.values(data.categories), backgroundColor: ['#0b92d5', '#D4A843', '#10B981', '#8B5CF6'] }]
    };

    const exportCsv = (queryParams = '') => { 
        window.open(`/api/chatbot/analytics/export-csv${queryParams}`, '_blank'); 
    };

    return { ...data, loading, barData, doughnutData, frequentQuestions: data.frequent, exportCsv };
}

// ── Settings ─────────────────────────────────────────────────────────────────
export function useSettings(showToast) {
    const [apiKey, setApiKey] = useState('');
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        settingsService.getAdmin().then(d => { 
            setInfo(d); 
            setApiKey(d.api_key || d.apiKey || ''); 
        })
            .catch(console.error).finally(() => setLoading(false));
    }, []);

    const saveApiKey = async () => {
        try { await settingsService.updateApiKey(apiKey); showToast('API Key guardada'); }
        catch (err) { showToast(err.message || 'Error', 'error'); }
    };
    const saveInfo = async () => {
        try { await settingsService.updateInfo(info); showToast('Información actualizada'); }
        catch (err) { showToast(err.message || 'Error', 'error'); }
    };

    return { apiKey, setApiKey, saveApiKey, info, setInfo, saveInfo, loading };
}

// ── Change Password ───────────────────────────────────────────────────────────
export function useChangePassword(showToast) {
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);

    const save = async () => {
        if (!currentPass || !newPass || !confirmPass) { showToast('Completa todos los campos', 'error'); return; }
        if (newPass !== confirmPass) { showToast('Las contraseñas no coinciden', 'error'); return; }
        if (newPass.length < 6) { showToast('Mínimo 6 caracteres', 'error'); return; }
        setLoading(true);
        try { await authService.changePassword(currentPass, newPass); showToast('Contraseña actualizada'); setCurrentPass(''); setNewPass(''); setConfirmPass(''); }
        catch (err) { showToast(err.message || 'Error', 'error'); }
        finally { setLoading(false); }
    };

    return { currentPass, setCurrentPass, newPass, setNewPass, confirmPass, setConfirmPass, save, loading };
}

// ── AI Config ─────────────────────────────────────────────────────────────────
export function useAiConfig(showToast) {
    const [config, setConfig] = useState(null);
    const [responses, setResponses] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTrigger, setNewTrigger] = useState('');
    const [newResponse, setNewResponse] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [cfg, resp, log] = await Promise.all([aiConfigService.getConfig(), aiConfigService.getResponses(), aiConfigService.getActivityLog(20)]);
            setConfig(cfg); setResponses(resp); setActivityLog(log);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const saveConfig = async () => {
        try { const u = await aiConfigService.updateConfig(config); setConfig(u); showToast('Configuración de IA guardada'); }
        catch (err) { showToast(err.message || 'Error', 'error'); }
    };
    
    const resetAll = async () => {
        try { 
            const u = await aiConfigService.resetConfig(); 
            setConfig(u); 
            showToast('Configuración restaurada'); 
        }
        catch (err) { showToast(err.message || 'Error', 'error'); }
    };
    
    const addResponse = async () => {
        if (!newTrigger.trim() || !newResponse.trim()) { showToast('Completa trigger y respuesta', 'error'); return; }
        try { await aiConfigService.addResponse(newTrigger.trim(), newResponse.trim()); setNewTrigger(''); setNewResponse(''); await load(); showToast('Respuesta agregada'); }
        catch (err) { showToast(err.message || 'Error', 'error'); }
    };
    const deleteResponse = async (id) => {
        try { await aiConfigService.deleteResponse(id); await load(); showToast('Eliminada'); }
        catch (err) { showToast(err.message || 'Error', 'error'); }
    };
    const toggleResponse = async (item) => {
        try { await aiConfigService.updateResponse(item.id, { ...item, enabled: !item.enabled }); await load(); }
        catch (err) { showToast(err.message || 'Error', 'error'); }
    };
    const resetPrompt = () => { if (config?.defaultTemplate) setConfig(c => ({ ...c, system_prompt: c.defaultTemplate })); };

    return { config, setConfig, loading, responses, activityLog, saveConfig, resetAll, addResponse, deleteResponse, toggleResponse, resetPrompt, newTrigger, setNewTrigger, newResponse, setNewResponse };
}

// ── Contact messages ──────────────────────────────────────────────────────────
export function useContactMessages(showToast) {
    const [messages, setMessages] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ status: '', from: '', to: '' });

    const load = useCallback(() => {
        setLoading(true);
        const params = { ...filters };
        if (search) params.search = search;
        contactService.getAll(params)
            .then(res => {
                const msgList = Array.isArray(res) ? res : (res?.data || []);
                setMessages(msgList);
            })
            .catch(err => {
                console.error('Contact Messages Load Error:', err);
                setMessages([]);
            })
            .finally(() => setLoading(false));
    }, [search, filters]);

    useEffect(() => { load(); }, [load]);

    const markRead = async (id) => {
        try { await contactService.markRead(id); await load(); }
        catch (e) { console.error(e); }
    };
    const markAllRead = async () => {
        try { await contactService.markAllRead(); await load(); showToast('Todos marcados como leídos'); }
        catch (e) { showToast('Error', 'error'); }
    };
    const remove = async (id) => {
        try { await contactService.delete(id); if (selected?.id === id) setSelected(null); await load(); showToast('Mensaje eliminado'); }
        catch (e) { showToast(e.message || 'Error', 'error'); }
    };

    return { messages, selected, setSelected, loading, markRead, markAllRead, remove, search, setSearch, filters, setFilters, refresh: load };
}

// ── Gallery ──────────────────────────────────────────────────────────────────
export function useGalleryAdmin(showToast) {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ titulo: '', descripcion: '', image_url: '', categoria: 'general', orden: 0, featured: false });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = useCallback(() => {
        setLoading(true);
        galleryService.getAll().then(setItems).catch(console.error).finally(() => setLoading(false));
    }, []);
    useEffect(() => { load(); }, [load]);

    const save = async () => {
        if (!form.titulo.trim() || !form.image_url.trim()) { showToast('Título e imagen URL son requeridos', 'error'); return; }
        setSaving(true);
        try {
            if (editing) { await galleryService.update(editing, form); showToast('Imagen actualizada'); }
            else { await galleryService.create(form); showToast('Imagen agregada'); }
            reset(); load();
        } catch (err) { showToast(err.message || 'Error', 'error'); } finally { setSaving(false); }
    };
    const remove = async (id) => {
        try { await galleryService.delete(id); load(); showToast('Eliminada'); }
        catch (err) { showToast(err.message || 'Error', 'error'); }
    };
    const edit = (item) => { setForm({ ...item, featured: !!item.featured }); setEditing(item.id); setShowForm(true); };
    const reset = () => { setForm({ titulo: '', descripcion: '', image_url: '', categoria: 'general', orden: 0, featured: false }); setEditing(null); setShowForm(false); };
    const toggle = async (item) => {
        try { await galleryService.update(item.id, { ...item, enabled: !item.enabled }); load(); }
        catch (e) { showToast(e.message || 'Error', 'error'); }
    };
    const toggleFeatured = async (id) => {
        try { await galleryService.toggleFeatured(id); load(); showToast('Imagen destacada actualizada'); }
        catch (e) { showToast(e.message || 'Error', 'error'); }
    };

    return { items, showForm, setShowForm, editing, form, setForm, save, remove, edit, reset, saving, loading, toggle, toggleFeatured };
}

// ── Users management ──────────────────────────────────────────────────────────
export function useUsersAdmin(showToast) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'admin' });
    const [creating, setCreating] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [updating, setUpdating] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        usersService.getAll().then(setUsers).catch(console.error).finally(() => setLoading(false));
    }, []);
    useEffect(() => { load(); }, [load]);

    const create = async () => {
        if (!newUser.username || !newUser.email || !newUser.password) { showToast('Completa usuario, email y contraseña', 'error'); return; }
        setCreating(true);
        try {
            await usersService.create(newUser.username, newUser.email, newUser.password, newUser.role);
            setNewUser({ username: '', email: '', password: '', role: 'admin' }); load(); showToast('Usuario creado');
        } catch (err) { showToast(err.message || 'Error', 'error'); } finally { setCreating(false); }
    };
    const remove = async (id) => {
        try { await usersService.delete(id); load(); showToast('Usuario eliminado'); }
        catch (err) { showToast(err.message || 'Error', 'error'); }
    };

    const update = async (id, data) => {
        setUpdating(true);
        try {
            await usersService.update(id, data);
            setEditingUser(null);
            load();
            showToast('Usuario actualizado');
        } catch (err) { showToast(err.message || 'Error', 'error'); } finally { setUpdating(false); }
    };

    return { users, loading, newUser, setNewUser, create, remove, update, editingUser, setEditingUser, updating };
}

// ── Conversation history ──────────────────────────────────────────────────────
export function useConversations() {
    const [sessions, setSessions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedMsgs, setSelectedMsgs] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(() => {
        setLoading(true);
        conversationsService.getRecent(30).then(setSessions).catch(console.error).finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const viewSession = async (sessionId) => {
        try {
            const msgs = await conversationsService.getSession(sessionId);
            setSelected(sessionId); setSelectedMsgs(msgs);
        } catch (e) { console.error(e); }
    };

    const deleteSession = async (sessionId) => {
        try {
            await conversationsService.deleteSession(sessionId);
            if (selected === sessionId) { setSelected(null); setSelectedMsgs([]); }
            load();
        } catch (e) { console.error(e); }
    };

    const clearSelection = () => { setSelected(null); setSelectedMsgs([]); };

    return { sessions, selected, selectedMsgs, loading, viewSession, clearSelection, deleteSession };
}
