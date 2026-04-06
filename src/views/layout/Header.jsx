import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SearchModal from './SearchModal';
import PrefetchLink from '../../components/PrefetchLink';

const NAV_LINKS = [
    { to: '/',              label: 'Inicio',             ariaLabel: 'Ir a Inicio' },
    { to: '/noticias',      label: 'Noticias',           ariaLabel: 'Ir a Noticias' },
    { to: '/calendario',    label: 'Calendario',        ariaLabel: 'Ir al Calendario' },
    { to: '/academico',     label: 'Académico',         ariaLabel: 'Ver Oferta Académica' },
    { to: '/instalaciones', label: 'Instalaciones',      ariaLabel: 'Conocer Instalaciones' },
    { to: '/galeria',       label: 'Galería',           ariaLabel: 'Ver Galería' },
    { to: '/contacto',      label: 'Contacto',          ariaLabel: 'Ir a Contacto' },
];

export default function Header() {
    const { pathname } = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const isActive = (link) => pathname === link.to;

    return (
        <nav
            className="fixed top-0 w-full z-50 shadow-sm transition-colors duration-300"
            style={{ background: 'color-mix(in srgb, var(--md-surface) 85%, transparent)' }}
            role="navigation"
            aria-label="Navegación principal"
        >
            <style>{`
                nav[role="navigation"] { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
            `}</style>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">
                Saltar al contenido principal
            </a>
            <div className="flex justify-between items-center px-8 h-16 w-full max-w-7xl mx-auto">
                {/* Logo */}
                <PrefetchLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="UEN Pedro Emilio Coll - Ir al inicio">
                    <img
                        alt="Logo UEN Pedro Emilio Coll"
                        className="h-10 w-10 object-contain"
                        src="/assets/images/logo.png"
                    />
                    <span className="text-xl font-bold text-on-surface font-headline tracking-tight">UEN Pedro Emilio Coll</span>
                </PrefetchLink>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center space-x-8 font-headline tracking-tight font-semibold" role="menubar">
                    {NAV_LINKS.map(link => (
                        <li key={link.to} role="none">
                            <PrefetchLink
                                role="menuitem"
                                aria-label={link.ariaLabel}
                                aria-current={isActive(link) ? 'page' : undefined}
                                className={`transition-colors ${isActive(link) ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                                to={link.to}
                            >
                                {link.label}
                            </PrefetchLink>
                        </li>
                    ))}
                </ul>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-all duration-300 cursor-pointer group"
                        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    >
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors theme-toggle-icon" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    {/* Search */}
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
                        aria-label="Buscar"
                    >
                        <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" aria-hidden="true">search</span>
                    </button>
                </div>

                {/* Mobile hamburger */}
                <div className="md:hidden flex items-center gap-2">
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-container-high transition-all duration-300 cursor-pointer"
                        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                        <span className="material-symbols-outlined text-on-surface theme-toggle-icon" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMenuOpen(v => !v)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-container-high transition-colors"
                        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                    >
                        <span className="material-symbols-outlined text-on-surface" aria-hidden="true">
                            {menuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <div
                id="mobile-menu"
                className={`md:hidden transition-all duration-300 overflow-hidden border-t border-outline-variant/20 ${menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                style={{ background: 'color-mix(in srgb, var(--md-surface) 95%, transparent)', backdropFilter: 'blur(16px)' }}
                aria-hidden={!menuOpen}
            >
                <ul className="flex flex-col px-8 py-4 gap-2" role="menu">
                    {NAV_LINKS.map(link => (
                        <li key={link.to} role="none">
                            <PrefetchLink
                                role="menuitem"
                                aria-label={link.ariaLabel}
                                aria-current={isActive(link) ? 'page' : undefined}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={`py-3 font-headline font-semibold transition-colors border-b border-outline-variant/10 block ${isActive(link) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                            >
                                {link.label}
                            </PrefetchLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </nav>
    );
}
