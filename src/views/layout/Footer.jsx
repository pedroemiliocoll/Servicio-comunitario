import { Link } from 'react-router-dom';
import { useLiceoInfo } from '../../context/LiceoContext';

const FOOTER_LINKS = [
    {
        title: 'Navegación',
        links: [
            { label: 'Inicio', to: '/' },
            { label: 'Noticias', to: '/noticias' },
            { label: 'Galería', to: '/galeria' },
            { label: 'Contacto', to: '/contacto' },
        ],
    },
    {
        title: 'Información',
        links: [
            { label: 'Nosotros', to: '/#about' },
            { label: 'Misión y Visión', to: '/#academics' },
            { label: 'Créditos del Sistema', to: '/creditos' },
        ],
    },
];

export default function Footer() {
    const { liceoInfo } = useLiceoInfo();
    const year = new Date().getFullYear();

    const contactInfo = [
        { icon: 'location_on', text: liceoInfo.direccion },
        { icon: 'call',        text: liceoInfo.telefono },
        { icon: 'mail',        text: liceoInfo.email },
        { icon: 'schedule',    text: `Lun–Vie ${liceoInfo.horarios.entrada} – ${liceoInfo.horarios.salida}` },
    ];

    return (
        <footer className="bg-surface-container-low border-t border-outline-variant/10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-[var(--container-padding)] py-[var(--section-padding)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                alt={`Logo ${liceoInfo.nombre}`}
                                className="h-10 w-10 object-contain"
                                src="/assets/images/logo.png"
                                onError={e => { e.currentTarget.style.display = 'none'; }}
                            />
                            <span className="font-headline font-bold text-on-surface uppercase tracking-widest text-sm">
                                {liceoInfo.nombreCorto || liceoInfo.nombre}
                            </span>
                        </div>
                        <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                            Institución educativa comprometida con la excelencia académica y el desarrollo integral de nuestra comunidad, transformando el futuro a través del conocimiento.
                        </p>
                    </div>

                    {/* Nav columns */}
                    {FOOTER_LINKS.map(col => (
                        <div key={col.title}>
                            <h4 className="font-headline font-black text-on-surface text-sm uppercase tracking-widest mb-6 opacity-80">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.to}
                                            className="text-on-surface-variant text-sm hover:text-primary transition-colors flex items-center gap-2 group"
                                        >
                                            <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3"></span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="font-headline font-black text-on-surface text-sm uppercase tracking-widest mb-6 opacity-80">Contacto</h4>
                        <ul className="space-y-4">
                            {contactInfo.map(item => (
                                <li key={item.icon} className="flex items-start gap-3 text-on-surface-variant text-sm">
                                    <span className="material-symbols-outlined text-primary text-xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
                                    <span className="leading-snug">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-outline-variant/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-on-surface-variant text-xs text-center md:text-left">
                        © {year} {liceoInfo.nombre}. <br className="block sm:hidden" /> Todos los derechos reservados.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a href="#" className="text-on-surface-variant text-xs hover:text-primary transition-colors underline-offset-4 hover:underline">Privacidad</a>
                        <a href="#" className="text-on-surface-variant text-xs hover:text-primary transition-colors underline-offset-4 hover:underline">Términos</a>
                        <a href="/contacto" className="text-on-surface-variant text-xs hover:text-primary transition-colors underline-offset-4 hover:underline">Soporte</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

