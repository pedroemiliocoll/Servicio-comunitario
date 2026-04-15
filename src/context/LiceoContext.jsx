// src/context/LiceoContext.jsx - Contexto para datos dinámicos del liceo
import { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';

const LiceoContext = createContext(null);

const DEFAULT_LICEO_INFO = {
    nombre: 'U.E.N. Pedro Emilio Coll',
    nombreCorto: 'Liceo Pedro Emilio Coll',
    email: 'contacto@uenpedroemiliocoll.edu.ve',
    telefono: '+58 (212) 555-0123',
    direccion: 'Av. Intercomunal de El Valle, Caracas 1090, Distrito Capital',
    horario: {
        entrada: '7:00 AM',
        salida: '5:00 PM'
    }
};

export function LiceoProvider({ children }) {
    const [liceoInfo, setLiceoInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiceoInfo = async () => {
            try {
                const data = await settingsService.getPublic();
                if (data && Object.keys(data).length > 0) {
                    // Normalizar: el backend devuelve "horario" pero usamos "horarios" en el frontend
                    const normalized = {
                        ...data,
                        // Si existe "horario" del backend, usarla como "horarios"
                        horarios: data.horario || data.horarios || DEFAULT_LICEO_INFO.horario
                    };
                    setLiceoInfo(normalized);
                } else {
                    setLiceoInfo(DEFAULT_LICEO_INFO);
                }
            } catch (err) {
                console.error('Error fetching liceo info:', err);
                setLiceoInfo(DEFAULT_LICEO_INFO);
            } finally {
                setLoading(false);
            }
        };

        fetchLiceoInfo();
    }, []);

    const refreshLiceoInfo = async () => {
        try {
            const data = await settingsService.getPublic();
            if (data && Object.keys(data).length > 0) {
                const normalized = {
                    ...data,
                    horarios: data.horario || data.horarios || DEFAULT_LICEO_INFO.horario
                };
                setLiceoInfo(normalized);
            }
        } catch (err) {
            console.error('Error refreshing liceo info:', err);
        }
    };

    return (
        <LiceoContext.Provider value={{ liceoInfo, loading, refreshLiceoInfo }}>
            {children}
        </LiceoContext.Provider>
    );
}

export function useLiceoInfo() {
    const context = useContext(LiceoContext);
    if (!context) {
        throw new Error('useLiceoInfo must be used within a LiceoProvider');
    }
    return context;
}