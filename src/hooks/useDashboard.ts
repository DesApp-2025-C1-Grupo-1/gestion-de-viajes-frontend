import { useEffect, useState } from "react";
// import { useEmpresaControllerCount, useChoferControllerCount, useViajeControllerFindAll } from "../api/generated";


//sacar simnulacion de viaje
export type ViajeResumen = {
  _id: string;
  origen: string;
  destino: string;
  fecha_salida: string;
};


export const useDashboard = () => {
    //despues reemplazo
    const [empresas, setEmpresas] = useState<number>(0);
    const [choferes, setChoferes] = useState<number>(0);
    const [ultimosViajes, setUltimosViajes] = useState<ViajeResumen[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    //const { data, isLoading, error } = useDashCollerFindOne();

    useEffect(() => {
        // Simulación temporal
        setTimeout(() => {
        setEmpresas(7);
        setChoferes(18);
        setUltimosViajes([
            { _id: "v1", origen: "Depósito A", destino: "Depósito B", fecha_salida: "2025-07-01" },
            { _id: "v2", origen: "Depósito C", destino: "Depósito D", fecha_salida: "2025-06-30" },
            { _id: "v3", origen: "Depósito E", destino: "Depósito F", fecha_salida: "2025-06-29" },
        ]);
        setIsLoading(false);
        }, 500);
    }, []);

    return {
        empresas,
        choferes,
        ultimosViajes,
        isLoading,
    };  
}