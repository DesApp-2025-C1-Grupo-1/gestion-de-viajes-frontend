import { useEffect, useState } from "react";
import { Remito } from "../services/remitos";
import { fetchRemitos } from "../api/remitosApi";
import { Localidad, Provincia } from "./useGeoref";

export const useRemitos = (
    pais: string,
    provincia: Provincia | null,
    localidad: Localidad | null
) => {
    const [remitos, setRemitos] = useState<Remito[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!pais || !provincia) {
        setRemitos([]);
        return;
        }

        setLoading(true);
        const fetch = async () => {
        try {
            const data = await fetchRemitos({
            pais,
            provincia: provincia.nombre,
            localidad: localidad?.nombre,
            limit: 100, // opcional, depende de cuántos quieras mostrar
            });
            setRemitos(data);
        } finally {
            setLoading(false);
        }
        };

        fetch();
    }, [pais, provincia, localidad]);

    return { remitos, loading };
};