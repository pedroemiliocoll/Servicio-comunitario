const FOUNDING_YEAR = 1960;

export default function Hero() {
    const currentYear = new Date().getFullYear();
    const yearsRunning = currentYear - FOUNDING_YEAR;
    const schoolYearBadge = `${currentYear}-${currentYear + 1}`;

    return (
        <section className="relative min-h-[600px] md:min-h-[750px] lg:min-h-[870px] flex items-center overflow-hidden bg-surface" id="hero">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* Text Content */}
                <div className="lg:col-span-6 mt-12 lg:mt-0 order-2 lg:order-1">
                    <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-[#005bbf] text-white text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                        Inscripciones Abiertas {schoolYearBadge}
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-headline font-extrabold text-on-surface leading-[1.15] mb-6 sm:mb-8 tracking-tight">
                        Formando los <span className="text-primary italic">líderes</span> del mañana.
                    </h1>
                    <p className="text-on-surface-variant text-base sm:text-lg max-w-lg mb-8 sm:mb-10 leading-relaxed">
                        Una institución dedicada a la excelencia académica y el desarrollo integral de ciudadanos comprometidos con el futuro de Venezuela.
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        <a
                            href="/academico"
                            className="bg-[#005bbf] text-white px-5 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full font-headline font-bold shadow-lg hover:bg-[#004a9e] hover:scale-105 transition-all text-sm sm:text-base"
                        >
                            Oferta Académica
                        </a>
                        <a
                            href="/instalaciones"
                            className="bg-surface-container-high text-on-surface px-5 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full font-headline font-bold hover:bg-surface-container-highest transition-colors text-sm sm:text-base"
                        >
                            Instalaciones
                        </a>
                    </div>
                </div>

                {/* Image Content */}
                <div className="lg:col-span-6 relative mt-8 lg:mt-0 order-1 lg:order-2">
                    <div className="rounded-2xl lg:rounded-[2rem] overflow-hidden shadow-xl lg:shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img
                            alt="Fachada principal de la U.E.N. Pedro Emilio Coll"
                            className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px] object-cover"
                            src="/assets/images/hero-facade.png"
                            onError={e => { 
                                e.currentTarget.onerror = null; 
                                e.currentTarget.src = '/assets/images/logo.png'; 
                                e.currentTarget.className = 'w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-contain p-4 sm:p-8 bg-surface-container-low'; 
                            }}
                        />
                    </div>
                    {/* Decorative Badge - hidden on small mobile */}
                    <div className="hidden sm:block absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-surface-container-lowest p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl max-w-[160px] sm:max-w-[200px]">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <span className="material-symbols-outlined text-primary text-lg sm:text-xl" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">stars</span>
                            <span className="font-bold text-on-surface text-sm sm:text-base">{yearsRunning} Años</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-on-surface-variant">De trayectoria educativa.</p>
                    </div>
                </div>
            </div>
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-1/2 lg:w-1/3 h-full bg-surface-container-low z-0 rounded-l-[50px] lg:rounded-l-[100px]"></div>
        </section>
    );
}