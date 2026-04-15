import { useLocation, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const PageLoader = () => (
    <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-medium text-sm">Cargando...</p>
        </div>
    </div>
);

const pageComponents = {
    HomePage: lazy(() => import('../pages/HomePage')),
    NewsPage: lazy(() => import('../pages/NewsPage')),
    NewsDetailPage: lazy(() => import('../pages/NewsDetailPage')),
    AdminPage: lazy(() => import('../pages/AdminPage')),
    ContactPage: lazy(() => import('../pages/ContactPage')),
    GalleryPage: lazy(() => import('../pages/GalleryPage')),
    EventsPage: lazy(() => import('../pages/EventsPage')),
    AcademicPage: lazy(() => import('../pages/AcademicPage')),
    InstalacionesPage: lazy(() => import('../pages/InstalacionesPage')),
    EponimoPage: lazy(() => import('../pages/EponimoPage')),
    NotFoundPage: lazy(() => import('../pages/NotFoundPage')),
    PasswordRecoveryPage: lazy(() => import('../pages/PasswordRecoveryPage')),
    ResetPasswordPage: lazy(() => import('../pages/ResetPasswordPage')),
    CreditsPage: lazy(() => import('../pages/CreditsPage')),
};

function AnimatedRoute({ component: Component, animation }) {
    return (
        <div className={`page-transition ${animation}`}>
            <Component />
        </div>
    );
}

function PageTransitionRouter() {
    const location = useLocation();
    
    const routes = [
        { path: '/', component: 'HomePage', animation: 'fade-in' },
        { path: '/noticias', component: 'NewsPage', animation: 'slide-up' },
        { path: '/noticias/:id', component: 'NewsDetailPage', animation: 'slide-up' },
        { path: '/admin', component: 'AdminPage', animation: 'fade-in' },
        { path: '/contacto', component: 'ContactPage', animation: 'slide-up' },
        { path: '/galeria', component: 'GalleryPage', animation: 'slide-up' },
        { path: '/calendario', component: 'EventsPage', animation: 'slide-up' },
        { path: '/academico', component: 'AcademicPage', animation: 'slide-up' },
        { path: '/instalaciones', component: 'InstalacionesPage', animation: 'slide-up' },
        { path: '/eponimo', component: 'EponimoPage', animation: 'slide-up' },
        { path: '/recovery', component: 'PasswordRecoveryPage', animation: 'fade-in' },
        { path: '/reset-password/:token', component: 'ResetPasswordPage', animation: 'fade-in' },
        { path: '/creditos', component: 'CreditsPage', animation: 'slide-up' },
        { path: '*', component: 'NotFoundPage', animation: 'fade-in' },
    ];

    return (
        <Routes location={location}>
            {routes.map((route) => {
                const Component = pageComponents[route.component];
                return (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AnimatedRoute
                                component={Component}
                                animation={route.animation}
                            />
                        }
                    />
                );
            })}
        </Routes>
    );
}

export { PageTransitionRouter, PageLoader };
