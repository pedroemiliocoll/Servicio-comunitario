const FOUNDING_YEAR = 1960; // Año de fundación de la institución

export default function Hero() {
    const currentYear = new Date().getFullYear();
    const yearsRunning = currentYear - FOUNDING_YEAR;
    const schoolYearBadge = `${currentYear}-${currentYear + 1}`;

    return (
        <section className="relative min-h-[70vh] md:min-h-[870px] flex items-center overflow-hidden bg-surface py-12 md:py-0" id="hero">
            <div className="max-w-7xl mx-auto px-[var(--container-padding)] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
                <div className="lg:col-span-6 mt-8 md:mt-16 lg:mt-0 text-center lg:text-left">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-[12px] md:text-sm font-bold mb-6 tracking-wide shadow-lg shadow-primary/20">
                        Inscripciones Abiertas {schoolYearBadge}
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] mb-6 md:mb-8 tracking-tighter">
                        Formando los <span className="text-primary italic">líderes</span> del mañana.
                    </h1>
                    <p className="text-on-surface-variant text-base md:text-lg max-w-lg mb-8 md:mb-10 leading-relaxed mx-auto lg:mx-0">
                        Una institución dedicada a la excelencia académica y el desarrollo integral de ciudadanos comprometidos con el futuro de Venezuela.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <a
                            href="/academico"
                            className="bg-primary text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-headline font-bold shadow-xl shadow-primary/20 hover:bg-primary-container hover:scale-105 transition-all text-sm md:text-base"
                        >
                            Ver Oferta Académica
                        </a>
                        <a
                            href="/instalaciones"
                            className="bg-surface-container-high text-on-surface px-6 md:px-8 py-3.5 md:py-4 rounded-full font-headline font-bold hover:bg-surface-container-highest transition-all text-sm md:text-base"
                        >
                            Instalaciones
                        </a>
                    </div>
                </div>
                
                <div className="lg:col-span-6 relative mt-12 lg:mt-0 px-4 md:px-0">
                    <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 hover:rotate-0 lg:rotate-2">
                        <img
                            alt="Fachada principal de la U.E.N. Pedro Emilio Coll"
                            className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                            src="/assets/images/hero-facade.png"
                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/logo.png'; e.currentTarget.className = 'w-full h-[300px] md:h-[500px] object-contain p-12 bg-surface-container-low'; }}
                        />
                    </div>
                    
                    {/* Decorative Element */}
                    <div className="absolute -bottom-4 -left-2 md:-bottom-6 md:-left-6 bg-surface-container-lowest p-5 md:p-6 rounded-2xl shadow-2xl max-w-[160px] md:max-w-[200px] z-20 border border-outline-variant/10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-xl" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">stars</span>
                            <span className="font-bold text-on-surface text-sm md:text-base">{yearsRunning} Años</span>
                        </div>
                        <p className="text-[10px] md:text-xs text-on-surface-variant font-medium">De trayectoria educativa ininterrumpida.</p>
                    </div>
                    
                    {/* Floating circle decoration */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0"></div>
                </div>
            </div>
            
            {/* Background Texture - Responsive adjustment */}
            <div className="absolute top-0 right-0 w-full lg:w-1/3 h-1/2 lg:h-full bg-surface-container-low z-0 lg:rounded-l-[100px] rounded-b-[40px] opacity-50 lg:opacity-100"></div>
        </section>
    );
}

