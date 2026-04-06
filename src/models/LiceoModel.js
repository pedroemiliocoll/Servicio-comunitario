// LiceoModel.js — Model (LEGACY - mantiene compatibilidad)
// La configuración del liceo ahora está en src/services/settingsService.js y en el backend.

export const DEFAULT_LICEO_INFO = {
    nombre: "U.E.N. Pedro Emilio Coll",
    nombreCorto: "Liceo Pedro Emilio Coll",
    tipo: "Unidad Educativa Nacional",
    niveles_educativos: ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"],
    horario: { entrada: "7:00 AM", salida: "1:00 PM" },
    estadisticas: { anios: 25, estudiantes: 500, docentes: 40, egresados: 5000 }
};

// Para compatibilidad con Sections.jsx que aún usa valores estáticos
export const getInfo = () => DEFAULT_LICEO_INFO;
