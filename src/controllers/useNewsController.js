// useNewsController.js — Controller: Lógica de noticias para Views
import { useState, useEffect, useMemo } from 'react';
import { newsService } from '../services/newsService.js';

// Constantes de presentación (sin datos, siguen aquí)
export const NEWS_CATEGORIES = [
    { id: 'todos', label: 'Todos', emoji: '📰' },
    { id: 'inscripciones', label: 'Inscripciones', emoji: '📋' },
    { id: 'eventos', label: 'Eventos', emoji: '🎉' },
    { id: 'academico', label: 'Académico', emoji: '📚' },
    { id: 'general', label: 'General', emoji: '📢' }
];

const CATEGORY_GRADIENTS = {
    inscripciones: 'linear-gradient(135deg, #0b92d5 0%, #09689b 100%)',
    eventos: 'linear-gradient(135deg, #D4A843 0%, #B08A2E 100%)',
    academico: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    general: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
};

export const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });
};
export const getCategoryLabel = (cat) =>
    ({ inscripciones: 'Inscripciones', eventos: 'Eventos', academico: 'Académico', general: 'General' }[cat] || cat);
export const getCategoryEmoji = (cat) =>
    ({ inscripciones: '📋', eventos: '🎉', academico: '📚', general: '📢' }[cat] || '📰');
export const getCategoryGradient = (cat) => CATEGORY_GRADIENTS[cat] || CATEGORY_GRADIENTS.general;

// Controller para la vista pública de noticias
export function useNewsController() {
    const [allNews, setAllNews] = useState([]);
    const [filter, setFilter] = useState('todos');
    const [search, setSearch] = useState('');
    const [selectedNews, setSelectedNews] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchNews = () => {
        setLoading(true);
        newsService.getAll()
            .then(setAllNews)
            .catch(err => console.error('Error cargando noticias:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const news = useMemo(() => {
        let filtered = allNews;
        if (filter !== 'todos') {
            filtered = filtered.filter(n => n.categoria === filter);
        }
        if (search.trim()) {
            const s = search.toLowerCase();
            filtered = filtered.filter(n => 
                n.titulo.toLowerCase().includes(s) || 
                n.extracto.toLowerCase().includes(s)
            );
        }
        return filtered;
    }, [allNews, filter, search]);

    return {
        news, loading, refresh: fetchNews,
        filter, setFilter,
        search, setSearch,
        selectedNews,
        selectNews: setSelectedNews,
        closeModal: () => setSelectedNews(null),
        categories: NEWS_CATEGORIES,
        formatDate, getCategoryLabel, getCategoryEmoji, getCategoryGradient,
    };
}

// Controller para el CRUD de noticias en admin
export function useNewsAdmin(showToast) {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        titulo: '', fecha: new Date().toISOString().split('T')[0],
        categoria: 'general', extracto: '', contenido: '', image_url: '',
        status: 'published', scheduled_at: ''
    });

    useEffect(() => { refresh(); }, []);

    const refresh = () => {
        newsService.getAll(null, true).then(setItems).catch(err => console.error(err));
    };

    const save = async () => {
        if (!form.titulo || !form.extracto || !form.contenido) {
            showToast('Completa todos los campos requeridos', 'error');
            return;
        }
        setSaving(true);
        try {
            if (editing) {
                await newsService.update(editing, form);
                showToast('Anuncio actualizado');
            } else {
                await newsService.create(form);
                showToast('Anuncio publicado');
            }
            refresh();
            reset();
        } catch (err) {
            showToast(err.message || 'Error al guardar', 'error');
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id) => {
        try {
            await newsService.remove(id);
            refresh();
            showToast('Anuncio eliminado');
        } catch (err) {
            showToast(err.message || 'Error al eliminar', 'error');
        }
    };

    const edit = (item) => {
        setForm({
            ...item
        });
        setEditing(item.id);
        setShowForm(true);
    };

    const reset = () => {
        setForm({ titulo: '', fecha: new Date().toISOString().split('T')[0], categoria: 'general', extracto: '', contenido: '', image_url: '', status: 'published', scheduled_at: '' });
        setEditing(null);
        setShowForm(false);
    };

    const moveUp = (id) => {
        const index = items.findIndex(i => i.id === id);
        if (index > 0) {
            const newItems = [...items];
            [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
            setItems(newItems);
            newsService.reorder(newItems.map((item, i) => ({ id: item.id, orden: i + 1 })))
                .catch(err => console.error(err));
        }
    };

    const moveDown = (id) => {
        const index = items.findIndex(i => i.id === id);
        if (index < items.length - 1) {
            const newItems = [...items];
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
            setItems(newItems);
            newsService.reorder(newItems.map((item, i) => ({ id: item.id, orden: i + 1 })))
                .catch(err => console.error(err));
        }
    };

    return {
        items, showForm, setShowForm, editing, form, setForm,
        save, remove, edit, reset, saving, moveUp, moveDown,
        categories: NEWS_CATEGORIES, formatDate,
    };
}
