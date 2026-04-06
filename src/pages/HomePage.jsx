import { useState, useEffect } from 'react';
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import Chatbot from '../views/chatbot/Chatbot';
import Hero from '../views/home/Hero';
import { NewsSector, BiographySector, AssistanceSector, MissionVisionSector, MapSector, ContactSector } from '../views/home/Sections';
import { NewsModal } from '../views/news/NewsComponents';
import ScrollToTopButton from '../views/ui/ScrollToTop';
import { useScrollAnimation } from '../controllers/useAnimations';
import { newsService } from '../services/newsService';
import { useDocumentTitle } from '../controllers/useDocumentTitle';

export default function HomePage() {
    useDocumentTitle(''); // → "U.E.N. Pedro Emilio Coll"

    const [selectedNews, setSelectedNews] = useState(null);
    const [previewNews, setPreviewNews] = useState([]);
    const ref = useScrollAnimation();

    useEffect(() => {
        // Fix #17: console.error wrapped in dev-only check
        newsService.getAll()
            .then(data => setPreviewNews(data.slice(0, 3)))
            .catch(err => { if (import.meta.env.DEV) console.error('[HomePage] newsService:', err); });
    }, []);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) { setTimeout(() => { document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }); }, 100); }
    }, []);

    return (
        <div className="bg-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
            <Header transparent />
            <main id="main-content" className="pt-16">
                <Hero />
                <NewsSector previewNews={previewNews} />
                <AssistanceSector />
                <BiographySector />
                <MissionVisionSector />
                <MapSector />
                <ContactSector />
            </main>
            <Footer />

            <Chatbot />
            <ScrollToTopButton />
            {selectedNews && <NewsModal item={selectedNews} onClose={() => setSelectedNews(null)} />}
        </div>
    );
}
