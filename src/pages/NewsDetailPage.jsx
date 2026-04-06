// src/pages/NewsDetailPage.jsx — Página de detalle de una noticia
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import Chatbot from '../views/chatbot/Chatbot';
import { useDocumentTitle } from '../controllers/useDocumentTitle';
import { newsService } from '../services/newsService';

const CATEGORY_LABELS = {
    academico: 'Académico', cultural: 'Cultural', deportivo: 'Deportivo',
    comunidad: 'Comunidad', general: 'General', institucional: 'Institucional',
};

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-VE', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    } catch { return dateStr; }
}

function formatContent(content) {
    if (!content) return '';
    if (content.includes('<') && content.includes('>')) {
        return content;
    }
    return content.replace(/\n/g, '<br/>');
}

export default function NewsDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    useDocumentTitle(news ? news.titulo : 'Noticia');

    useEffect(() => {
        setLoading(true);
        Promise.all([
            newsService.getById(id),
            newsService.getAll(),
        ]).then(([item, all]) => {
            setNews(item);
            setRelated(all.filter(n => n.id !== id && n.categoria === item?.categoria).slice(0, 3));
        }).catch(() => navigate('/noticias', { replace: true }))
          .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="bg-surface min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!news) return null;

    return (
        <div className="bg-surface min-h-screen">
            <Header />
            <main className="pt-32 pb-24 max-w-5xl mx-auto px-6 md:px-12">

                {/* Back link */}
                <Link to="/noticias" className="inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                    Volver a Noticias
                </Link>

                <article>
                    {/* Category + Date */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                            {CATEGORY_LABELS[news.categoria] || news.categoria}
                        </span>
                        <time className="text-on-surface-variant text-sm">{formatDate(news.fecha)}</time>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-headline font-black text-on-surface tracking-tighter leading-tight mb-6">
                        {news.titulo}
                    </h1>

                    {/* Extract */}
                    <p className="text-lg text-on-surface-variant font-medium leading-relaxed mb-8 border-l-4 border-primary pl-5">
                        {news.extracto}
                    </p>

                    {/* Hero image */}
                    {news.image_url && (
                        <img
                            src={news.image_url}
                            alt={news.titulo}
                            className="w-full max-h-[480px] object-cover rounded-3xl mb-10 shadow-lg"
                        />
                    )}

                    {/* Full content */}
                    <div
                        className="prose prose-lg max-w-none text-on-surface leading-relaxed [&>p]:mb-5 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6"
                        dangerouslySetInnerHTML={{ __html: formatContent(news.contenido) }}
                    />
                </article>

                {/* Related */}
                {related.length > 0 && (
                    <section className="mt-16 pt-12 border-t border-outline-variant">
                        <h2 className="text-2xl font-headline font-bold text-on-surface mb-8">Noticias Relacionadas</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {related.map(r => (
                                <Link key={r.id} to={`/noticias/${r.id}`}
                                    className="group rounded-2xl bg-surface-container p-4 hover:bg-surface-container-high transition-colors">
                                    {r.image_url && <img src={r.image_url} alt={r.titulo} className="w-full h-32 object-cover rounded-xl mb-3"/>}
                                    <p className="text-xs text-primary font-semibold mb-1">{formatDate(r.fecha)}</p>
                                    <h3 className="font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">{r.titulo}</h3>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
}
