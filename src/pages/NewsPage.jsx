// NewsPage.jsx — Page: Página de noticias
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import Chatbot from '../views/chatbot/Chatbot';
import { NewsFilters, NewsGrid, NewsModal, NewsHero, NewsSidebar } from '../views/news/NewsComponents';
import { useNewsController } from '../controllers/useNewsController';
import { useDocumentTitle } from '../controllers/useDocumentTitle';
import { NewsGridSkeleton } from '../components/Skeleton';

export default function NewsPage() {
    useDocumentTitle('Noticias');
    const { 
        news, loading, 
        filter, setFilter, 
        search, setSearch, 
        selectedNews, selectNews, closeModal 
    } = useNewsController();


    return (
        <div className="bg-surface min-h-screen">
            <Header />
            
            <main id="main-content" className="pt-20 md:pt-28 pb-20 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                {/* News Hero (Feature the first news item) */}
                {!loading && news.length > 0 && <NewsHero item={news[0]} onSelect={selectNews} />}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Feed */}
                    <div className="lg:col-span-8">
                        <div className="mb-12">
                            <h2 className="text-3xl font-headline font-black text-on-surface mb-2 tracking-tighter">Explorar Noticias</h2>
                            <p className="text-on-surface-variant font-medium">Filtrar por categoría para encontrar lo que buscas.</p>
                        </div>
                        
                        <NewsFilters 
                            active={filter} 
                            onChange={setFilter} 
                            search={search}
                            onSearch={setSearch}
                        />
                        
                        {loading ? (
                            <NewsGridSkeleton count={6} />
                        ) : (
                            <NewsGrid 
                                news={news} 
                                onSelect={selectNews} 
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4">
                        <NewsSidebar search={search} onSearch={setSearch} />
                    </div>
                </div>
            </main>

            <Footer />
            <Chatbot />
            {selectedNews && <NewsModal item={selectedNews} onClose={closeModal} />}
        </div>
    );
}
