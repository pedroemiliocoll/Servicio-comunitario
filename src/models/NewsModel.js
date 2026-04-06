// NewsModel.js — Model (LEGACY - solo constantes de presentación)
// El CRUD de noticias ahora está en src/services/newsService.js y en el backend.

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

const CATEGORY_PATTERNS = { inscripciones: '📋', eventos: '🎉', academico: '📚', general: '📢' };

export const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const getCategoryLabel = (cat) =>
    ({ inscripciones: 'Inscripciones', eventos: 'Eventos', academico: 'Académico', general: 'General' }[cat] || cat);
export const getCategoryEmoji  = (cat) => CATEGORY_PATTERNS[cat] || '📰';
export const getCategoryGradient = (cat) => CATEGORY_GRADIENTS[cat] || CATEGORY_GRADIENTS.general;
