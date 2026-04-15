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
        <footer className="bg-surface-container-low border-t border-outline-variant/20 w-full">
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
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
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                            Institución educativa comprometida con la excelencia académica y el desarrollo integral de nuestra comunidad.
                        </p>
                    </div>

                    {/* Nav columns */}
                    {FOOTER_LINKS.map(col => (
                        <div key={col.title}>
                            <h4 className="font-headline font-black text-on-surface text-sm uppercase tracking-widest mb-4">{col.title}</h4>
                            <ul className="space-y-3">
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.to}
                                            className="text-on-surface-variant text-sm hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="font-headline font-black text-on-surface text-sm uppercase tracking-widest mb-4">Contacto</h4>
                        <ul className="space-y-3">
                            {contactInfo.map(item => (
                                <li key={item.icon} className="flex items-start gap-2 text-on-surface-variant text-sm">
                                    <span className="material-symbols-outlined text-primary text-base mt-0.5 flex-shrink-0" aria-hidden="true">{item.icon}</span>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-outline-variant/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-on-surface-variant text-xs">
                        © {year} {liceoInfo.nombre}. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-on-surface-variant text-xs hover:text-primary transition-colors">Política de Privacidad</a>
                        <a href="#" className="text-on-surface-variant text-xs hover:text-primary transition-colors">Términos de Servicio</a>
                        <a href="/contacto" className="text-on-surface-variant text-xs hover:text-primary transition-colors">Atención al Estudiante</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
