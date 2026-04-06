// server/services/seedService.js — Service: Datos iniciales de la base de datos
import { UserModel } from '../models/UserModel.js';
import { NewsModel } from '../models/NewsModel.js';
import { SettingsModel } from '../models/SettingsModel.js';
import { AiConfigModel } from '../models/AiConfigModel.js';

const SAMPLE_NEWS = [
    { titulo: 'Proceso de Inscripción Año Escolar 2025-2026', fecha: '2025-07-15', categoria: 'inscripciones', extracto: 'Se informa a toda la comunidad educativa que el proceso de inscripción para el nuevo año escolar 2025-2026 se encuentra abierto.', contenido: 'Se informa a toda la comunidad educativa que el proceso de inscripción para el nuevo año escolar 2025-2026 se encuentra abierto.\n\nRequisitos:\n• Copia de cédula del representante\n• Partida de nacimiento del estudiante\n• Notas certificadas del año anterior\n• 2 fotos tipo carnet\n• Constancia de residencia\n\nFechas importantes:\n• Inscripciones: Del 15 al 30 de julio\n• Inicio de clases: Septiembre 2025' },
    { titulo: 'Acto de Grado Promoción 2024-2025', fecha: '2025-07-10', categoria: 'eventos', extracto: 'Con orgullo celebramos la graduación de nuestros estudiantes de 5to año. Felicidades a la Promoción 2024-2025.', contenido: 'Con orgullo celebramos la graduación de nuestros estudiantes de 5to año. La ceremonia se llevó a cabo con la presencia de familiares, docentes y autoridades educativas.\n\nFelicidades a la Promoción 2024-2025 por este gran logro académico.' },
    { titulo: 'Jornada de Ciencia y Tecnología', fecha: '2025-05-20', categoria: 'academico', extracto: 'Los estudiantes presentaron sus proyectos científicos y tecnológicos en la feria anual del liceo.', contenido: 'Los estudiantes de todos los años presentaron sus proyectos científicos y tecnológicos en la feria anual.\n\nDestacaron proyectos en las áreas de:\n• Energías renovables\n• Robótica educativa\n• Aplicaciones tecnológicas\n• Investigación ambiental' },
    { titulo: 'Reunión General de Representantes', fecha: '2025-04-12', categoria: 'general', extracto: 'Se convoca a todos los representantes a la reunión general para tratar temas sobre el bienestar estudiantil.', contenido: 'Se convoca a todos los representantes y responsables de los estudiantes a la reunión general.\n\nTemas a tratar:\n• Informe de gestión del primer trimestre\n• Actividades extracurriculares\n• Plan de mejoras de infraestructura' },
    { titulo: 'Celebración del Día del Estudiante', fecha: '2025-11-21', categoria: 'eventos', extracto: 'Celebramos el Día del Estudiante con actividades recreativas, culturales y deportivas.', contenido: 'El Liceo celebró con entusiasmo el Día del Estudiante con:\n\n• Campeonatos deportivos inter-secciones\n• Presentaciones culturales\n• Concursos de talento\n• Compartir y agasajo estudiantil' },
    { titulo: 'Nuevo Laboratorio de Informática', fecha: '2025-03-05', categoria: 'general', extracto: 'Inauguración del nuevo laboratorio de informática equipado con tecnología moderna.', contenido: 'Nos complace anunciar la inauguración del nuevo laboratorio de informática.\n\nEl laboratorio cuenta con:\n• Computadoras de última generación\n• Conexión a internet de alta velocidad\n• Software educativo actualizado\n• Capacidad para 30 estudiantes' },
];

export async function seedDatabase() {
    // Crear usuario admin por defecto si no existe
    const userCount = await UserModel.count();
    if (userCount === 0) {
        await UserModel.create('admin', 'admin@liceo.edu', 'admin123', 'admin');
        console.log('[Seed] Usuario admin creado (admin/admin@liceo.edu/admin123)');
    }

    // Importar noticias si la tabla está vacía
    const newsCount = await NewsModel.count();
    if (newsCount === 0) {
        for (const n of SAMPLE_NEWS) {
            await NewsModel.create(n);
        }
        console.log(`[Seed] ${SAMPLE_NEWS.length} noticias de ejemplo creadas`);
    }

    // Configuración inicial del liceo
    const mision = await SettingsModel.get('mision');
    if (!mision) {
        await SettingsModel.set('mision', 'Brindar una educación integral de calidad que promueva el desarrollo académico, cultural y social de nuestros estudiantes, formando ciudadanos comprometidos con su comunidad y su país.');
        await SettingsModel.set('vision', 'Ser una institución educativa referencia en excelencia académica y formación integral, impulsando la innovación y los valores en cada estudiante.');
        await SettingsModel.set('ubicacion', { estado: 'Distrito Capital', municipio: 'Caracas', direccion: 'Caracas, Venezuela' });
        await SettingsModel.set('contacto', { telefono: 'Por definir', email: 'Por definir', redes_sociales: { facebook: 'https://www.facebook.com/pedroemilio.coll.984', instagram: 'https://www.instagram.com/uenpedroemiliocolloficial/', twitter: 'https://twitter.com/PedroEmilioCoII' } });
        await SettingsModel.set('horario', { entrada: '7:00 AM', salida: '1:00 PM' });
        await SettingsModel.set('estadisticas', { anios: 25, estudiantes: 500, docentes: 40, egresados: 5000 });
        await SettingsModel.set('niveles_educativos', ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año']);
        console.log('[Seed] Configuración del liceo inicializada');
    }

    // Configuración inicial de IA
    await AiConfigModel.getConfig(); 

    // Respuestas personalizadas de ejemplo
    const responses = await AiConfigModel.getAllResponses();
    if (responses.length === 0) {
        await AiConfigModel.addResponse('inscripción', 'Las inscripciones se realizan entre julio y agosto. Se requiere cédula del representante, partida de nacimiento, notas del año anterior, 2 fotos y constancia de residencia.', 10);
        await AiConfigModel.addResponse('horario', 'El horario escolar es de Lunes a Viernes de 7:00 AM a 1:00 PM.', 10);
        await AiConfigModel.addResponse('uniforme', 'El uniforme consiste en pantalón o falda kaki, camisa blanca con el escudo del liceo y zapatos negros.', 5);
        console.log('[Seed] Respuestas personalizadas de IA creadas');
    }
}
