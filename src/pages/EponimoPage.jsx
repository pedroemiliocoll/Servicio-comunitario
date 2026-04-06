// src/pages/EponimoPage.jsx — Pedro Emilio Coll · UEN Pedro Emilio Coll
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import Chatbot from '../views/chatbot/Chatbot';
import { useDocumentTitle } from '../controllers/useDocumentTitle';

const IconBook = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IconAward = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IconMapPin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconCalendar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconStar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

export default function EponimoPage() {
  useDocumentTitle('Pedro Emilio Coll - Nuestro Epónimo');

  return (
    <div className="bg-surface min-h-screen font-body">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Imagen */}
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="/assets/images/pedro-emilio-coll.png" 
                  alt="Pedro Emilio Coll" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <IconAward />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-6">
                <IconStar />
                <span>Nuestro Epónimo</span>
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tight leading-[0.9] mb-6">
                Pedro Emilio<br />
                <span className="text-primary">Coll</span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8">
                Homenaje al ilustre educador venezolano cuyo legado de excelencia académica y formación en valores inspira a generaciones de estudiantes.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <IconCalendar />
                  <span className="text-sm font-medium">1870 - 1947</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <IconMapPin />
                  <span className="text-sm font-medium">Venezuela</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biografía */}
      <main className="max-w-7xl mx-auto px-6 md:px-16 pb-28">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
              <IconBook />
              <h2 className="font-headline font-black text-2xl text-on-surface">Biografía</h2>
            </div>
            <div className="text-on-surface-variant leading-relaxed space-y-4 text-lg">
              <p>
                <strong className="text-on-surface">Pedro Emilio Coll</strong> (1870-1947) fue un destacado educator, periodista y político venezolano, reconocido por su contribución fundamental al sistema educativo nacional.
              </p>
              <p>
                Ejerció como docente, director escolar y posteriormente como Inspector General de Educación. Su obra "La escuela activa" revolucionó la pedagogía venezolana, promoviendo métodos de enseñanza más dinámicos y centrados en el estudiante.
              </p>
              <p>
                Como periodista, colaboró en importantes publicaciones de la época, utilizando la escritura como herramienta para promover la educación y la cultura en Venezuela.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4">
              <IconAward />
              <h2 className="font-headline font-black text-2xl text-on-surface">Legado</h2>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl space-y-6">
              <div>
                <h3 className="font-headline font-black text-on-surface text-lg mb-2">Educación Integral</h3>
                <p className="text-on-surface-variant">Promovía una formación que combinaba el conocimiento académico con el desarrollo moral y civic.</p>
              </div>
              <div>
                <h3 className="font-headline font-black text-on-surface text-lg mb-2">Innovación Pedagógica</h3>
                <p className="text-on-surface-variant">Pionero en introducir métodos activos de enseñanza que estimulaban el pensamiento crítico.</p>
              </div>
              <div>
                <h3 className="font-headline font-black text-on-surface text-lg mb-2">Formación en Valores</h3>
                <p className="text-on-surface-variant">Consideraba la educación como herramienta fundamental para la transformación social.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cita */}
        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 md:p-12 text-center">
          <blockquote className="font-headline text-2xl md:text-3xl font-black text-on-surface italic leading-relaxed mb-6">
            "El mundo de los libros es el más hermoso de los mundos"
          </blockquote>
          <cite className="text-primary font-semibold">— Pedro Emilio Coll</cite>
        </div>

        {/* Tarjetas de contribución */}
        <div className="mt-20">
          <h2 className="font-headline font-black text-3xl text-on-surface text-center mb-12">
            Contribuciones a la Educación
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Métodos Activos',
                description: 'Desarrollo de técnicas pedagógicas que involucraban al estudiante en su propio aprendizaje.',
                icon: '📚'
              },
              {
                title: 'Formación Docente',
                description: 'Creación de programas para mejorar la capacitación de los maestros venezolanos.',
                icon: '👨‍🏫'
              },
              {
                title: 'Educación Pública',
                description: 'Defensor incansable de la educación gratuita y obligatoria para todos los venezolanos.',
                icon: '🎓'
              }
            ].map((item, i) => (
              <div key={i} className="bg-surface-container-lowest p-8 rounded-3xl text-center hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-headline font-black text-on-surface text-xl mb-3">{item.title}</h3>
                <p className="text-on-surface-variant">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
