import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLiceoInfo } from '../../context/LiceoContext';
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
    const { liceoInfo } = useLiceoInfo();
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
                <PrefetchLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label={`${liceoInfo.nombre} - Ir al inicio`}>
                    <img
                        alt={`Logo ${liceoInfo.nombre}`}
                        className="h-10 w-10 object-contain"
                        src="/assets/images/logo.png"
                    />
                    <span className="text-xl font-bold text-on-surface font-headline tracking-tight">{liceoInfo.nombre}</span>
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

            {/* Mobile drawer (Full-screen Overlay) */}
            <div
                id="mobile-menu"
                className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ease-in-out ${
                    menuOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'
                }`}
                style={{ 
                    background: 'color-mix(in srgb, var(--md-surface) 90%, transparent)', 
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)'
                }}
                aria-hidden={!menuOpen}
            >
                <div className="flex flex-col h-full bg-surface/40">
                    <div className="flex justify-between items-center px-8 h-16 border-b border-outline-variant/10">
                        <div className="flex items-center gap-3">
                            <img alt="Logo" className="h-8 w-8 object-contain" src="/assets/images/logo.png" />
                            <span className="font-headline font-bold text-on-surface text-sm uppercase tracking-widest">Menú</span>
                        </div>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface"
                            aria-label="Cerrar menú"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-12 px-8">
                        <nav className="flex flex-col gap-8">
                            {NAV_LINKS.map((link, i) => (
                                <PrefetchLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMenuOpen(false)}
                                    className={`group flex items-center justify-between transition-all duration-300 ${
                                        isActive(link) ? 'text-primary' : 'text-on-surface hover:text-primary'
                                    }`}
                                    style={{ transitionDelay: `${i * 50}ms` }}
                                >
                                    <span className="text-4xl font-headline font-extrabold tracking-tight">
                                        {link.label}
                                    </span>
                                    <span className={`material-symbols-outlined transition-transform duration-300 group-hover:translate-x-2 ${
                                        isActive(link) ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                        arrow_forward_ios
                                    </span>
                                </PrefetchLink>
                            ))}
                        </nav>
                        
                        <div className="mt-16 pt-8 border-t border-outline-variant/10 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <span className="text-on-surface-variant font-medium">Apariencia</span>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                    </span>
                                    <span className="text-sm font-semibold">{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
                                </button>
                            </div>
                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                <p className="text-sm text-on-surface-variant mb-0 italic">
                                    "La educación es el arma más poderosa que puedes usar para cambiar el mundo."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </nav>
    );
}
