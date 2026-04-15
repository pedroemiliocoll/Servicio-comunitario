const FOUNDING_YEAR = 1960; // Año de fundación de la institución

export default function Hero() {
    const currentYear = new Date().getFullYear();
    const yearsRunning = currentYear - FOUNDING_YEAR;
    const schoolYearBadge = `${currentYear}-${currentYear + 1}`;

    return (
        <section className="relative min-h-[870px] flex items-center overflow-hidden bg-surface" id="hero">
            <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-6 mt-16 lg:mt-0">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#005bbf] text-white text-sm font-semibold mb-6">
                        Inscripciones Abiertas {schoolYearBadge}
                    </span>
                    <h1 className="text-6xl lg:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] mb-8 tracking-tighter">
                        Formando los <span className="text-primary italic">líderes</span> del mañana.
                    </h1>
                    <p className="text-on-surface-variant text-lg max-w-lg mb-10 leading-relaxed">
                        Una institución dedicada a la excelencia académica y el desarrollo integral de ciudadanos comprometidos con el futuro de Venezuela.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="/academico"
                            className="bg-[#005bbf] text-white px-8 py-4 rounded-full font-headline font-bold shadow-lg hover:bg-[#004a9e] hover:scale-105 transition-all"
                        >
                            Conocer Oferta Académica
                        </a>
                        <a
                            href="/instalaciones"
                            className="bg-surface-container-high text-on-surface px-8 py-4 rounded-full font-headline font-bold hover:bg-surface-container-highest transition-colors"
                        >
                            Ver Instalaciones
                        </a>
                    </div>
                </div>
                    <div className="lg:col-span-6 relative mt-12 lg:mt-0">
                    <div className="rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img
                            alt="Fachada principal de la U.E.N. Pedro Emilio Coll vista desde la entrada principal con su fachada blanca y'architecture escolar"
                            className="w-full h-[500px] object-cover"
                            src="/assets/images/hero-facade.png"
                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/logo.png'; e.currentTarget.className = 'w-full h-[500px] object-contain p-8 bg-surface-container-low'; }}
                        />
                    </div>
                    {/* Decorative Element */}
                    <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-2xl shadow-xl max-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">stars</span>
                            <span className="font-bold text-on-surface">{yearsRunning} Años</span>
                        </div>
                        <p className="text-xs text-on-surface-variant">De trayectoria educativa ininterrumpida.</p>
                    </div>
                </div>
            </div>
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low z-0 rounded-l-[100px]"></div>
        </section>
    );
}
