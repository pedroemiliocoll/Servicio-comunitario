import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLiceoInfo } from '../../context/LiceoContext';
import SearchModal from './SearchModal';
import PrefetchLink from '../../components/PrefetchLink';

const NAV_LINKS = [
    { to: '/',              label: 'Inicio',        icon: 'home',          ariaLabel: 'Ir a Inicio' },
    { to: '/noticias',      label: 'Noticias',      icon: 'newspaper',     ariaLabel: 'Ir a Noticias' },
    { to: '/calendario',    label: 'Calendario',    icon: 'calendar_month',ariaLabel: 'Ir al Calendario' },
    { to: '/academico',     label: 'Académico',     icon: 'school',        ariaLabel: 'Ver Oferta Académica' },
    { to: '/instalaciones', label: 'Instalaciones', icon: 'apartment',     ariaLabel: 'Conocer Instalaciones' },
    { to: '/galeria',       label: 'Galería',       icon: 'photo_library', ariaLabel: 'Ver Galería' },
    { to: '/contacto',      label: 'Contacto',      icon: 'mail',          ariaLabel: 'Ir a Contacto' },
];

export default function Header() {
    const { pathname } = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { liceoInfo } = useLiceoInfo();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // Keyboard shortcuts & close on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setMenuOpen(false);
                setSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    const isActive = (link) => pathname === link.to;

    return (
        <>
            {/* ── Main nav bar ── */}
            <nav
                className="fixed top-0 w-full z-50 shadow-sm"
                style={{
                    background: 'color-mix(in srgb, var(--md-surface) 92%, transparent)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                }}
                role="navigation"
                aria-label="Navegación principal"
            >
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
                >
                    Saltar al contenido principal
                </a>

                <div className="flex items-center justify-between h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Logo */}
                    <PrefetchLink
                        to="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
                        aria-label={`${liceoInfo.nombre} – Inicio`}
                    >
                        <img
                            src="/assets/images/logo.png"
                            alt={`Logo ${liceoInfo.nombre}`}
                            className="h-9 w-9 object-contain shrink-0"
                        />
                        {/* On very small screens: only icon. sm-lg: abbreviation. lg+: full name */}
                        <span className="hidden sm:block lg:hidden text-sm font-bold text-on-surface font-headline tracking-tight whitespace-nowrap">
                            U.E.N. P.E. Coll
                        </span>
                        <span className="hidden lg:block text-lg font-bold text-on-surface font-headline tracking-tight whitespace-nowrap">
                            {liceoInfo.nombre}
                        </span>
                    </PrefetchLink>

                    {/* ── Desktop navigation ── */}
                    <ul
                        className="hidden lg:flex items-center gap-1 font-headline font-semibold"
                        role="menubar"
                    >
                        {NAV_LINKS.map(link => (
                            <li key={link.to} role="none">
                                <PrefetchLink
                                    role="menuitem"
                                    to={link.to}
                                    aria-label={link.ariaLabel}
                                    aria-current={isActive(link) ? 'page' : undefined}
                                    className={`px-3 py-1.5 rounded-lg text-[13px] xl:text-sm transition-colors
                                        ${isActive(link)
                                            ? 'text-primary font-bold'
                                            : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                                        }`}
                                >
                                    {link.label}
                                </PrefetchLink>
                            </li>
                        ))}
                    </ul>

                    {/* ── Desktop action buttons ── */}
                    <div className="hidden lg:flex items-center gap-1">
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors group"
                            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
                        >
                            <span
                                className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                                aria-hidden="true"
                            >
                                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>

                        <button
                            onClick={() => setSearchOpen(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors group"
                            aria-label="Buscar (Ctrl+K)"
                        >
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" aria-hidden="true">
                                search
                            </span>
                        </button>
                    </div>

                    {/* ── Mobile action buttons ── */}
                    <div className="lg:hidden flex items-center gap-1">
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors"
                            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
                        >
                            <span
                                className="material-symbols-outlined text-on-surface"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                                aria-hidden="true"
                            >
                                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>

                        <button
                            onClick={() => setMenuOpen(v => !v)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors"
                            aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                        >
                            <span className="material-symbols-outlined text-on-surface" aria-hidden="true">
                                {menuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile backdrop ── */}
            <div
                className={`fixed inset-0 z-[55] lg:hidden transition-opacity duration-300
                    ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
            />

            {/* ── Mobile drawer (slides in from right) ── */}
            <div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación"
                aria-hidden={!menuOpen}
                className={`fixed top-0 right-0 h-dvh z-[60] flex flex-col lg:hidden
                    w-[min(300px,80vw)]
                    transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{
                    background: 'var(--md-surface)',
                    boxShadow: '-4px 0 32px rgba(0,0,0,0.18)',
                }}
            >
                {/* Drawer top bar */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-outline-variant/10 shrink-0">
                    <div className="flex items-center gap-2">
                        <img src="/assets/images/logo.png" alt="Logo" className="h-8 w-8 object-contain shrink-0" />
                        <span className="font-headline font-black text-on-surface text-sm tracking-widest uppercase">Navegación</span>
                    </div>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
                        aria-label="Cerrar menú"
                    >
                        <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
                    </button>
                </div>

                {/* Links */}
                <nav className="flex-1 overflow-y-auto">
                    <ul className="flex flex-col gap-0.5 p-3" role="menu">
                        {NAV_LINKS.map(link => {
                            const active = isActive(link);
                            return (
                                <li key={link.to} role="none">
                                    <PrefetchLink
                                        role="menuitem"
                                        to={link.to}
                                        onClick={() => setMenuOpen(false)}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-headline font-bold text-[15px] transition-all active:scale-[0.97]
                                            ${active
                                                ? 'bg-primary text-on-primary shadow-sm'
                                                : 'text-on-surface hover:bg-surface-container-high'
                                            }`}
                                    >
                                        <span
                                            className="material-symbols-outlined text-[22px] shrink-0"
                                            aria-hidden="true"
                                            style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                                        >
                                            {link.icon}
                                        </span>
                                        {link.label}
                                    </PrefetchLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Drawer bottom */}
                <div className="px-3 pb-6 pt-3 border-t border-outline-variant/10 shrink-0 space-y-2">
                    <button
                        onClick={() => { setSearchOpen(true); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm font-semibold"
                    >
                        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">search</span>
                        Buscar en el sitio
                    </button>
                    <p className="text-center text-[11px] text-on-surface-variant opacity-40 pt-1 px-2">
                        {liceoInfo.nombre}
                    </p>
                </div>
            </div>

            {/* ── Search Modal ── */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
