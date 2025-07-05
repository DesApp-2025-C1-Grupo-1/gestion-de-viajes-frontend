import { SectionHeader } from "../components/SectionHeader";
//import {  CircularProgress } from "@mui/material";
import { useDashboard } from "../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { UserRoundCheck, Building2, MapPinned, Car } from "lucide-react";
import { InfoCard } from "../components/dashboard/InfoCard";

import { mockUltimosViajes } from "../lib/mock-data";

export default function Dashboard() {
    //modificar
    const { empresas, choferes, ultimosViajes, isLoading } = useDashboard();
    const navigate = useNavigate();

    return (
        <>
            <SectionHeader
                title="Logística Acme SRL"
                description="Bienvenido al panel de administración de la aplicación."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 px-0.5 overflow-y-auto max-h-[calc(100vh-120px)] lg:h-max">
                <InfoCard 
                    title="Empresas transportistas"
                    description="Empresas registradas actualmente"
                    icon={<Building2 className={`size-7 block`} color="#E65F2B"/>} 
                    value={12}
                    onClick={() => navigate("/companies")}
                />
                <InfoCard 
                    title="Nuevos choferes"
                    description="Ultimos choferes registrados"
                    icon={<UserRoundCheck className={`size-7 block`} color="#E65F2B"/>} 
                    value={12}
                    onClick={() => navigate("/drivers")}
                />
                <InfoCard 
                    title="Vehiculos"
                    description="Vehiculos registradas actualmente"
                    icon={<Car className={`size-7 block`} color="#E65F2B"/>} 
                    value={12}
                    onClick={() => navigate("/drivers")}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4 px-0.5 overflow-y-auto max-h-[calc(100vh-120px)] lg:h-max">

                <InfoCard 
                    title="Viajes registrados"
                    description="Vista previa de los viajes registrados"
                    icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                    list={mockUltimosViajes}
                    onClick={() => navigate("/trips")}
                />

                <InfoCard 
                    title="Viajes registrados"
                    description="Vista previa de los viajes registrados"
                    icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                    
                    onClick={() => navigate("/trips")}
                />

            </div>

        </>      
    );
}

function useUltimosViajes(): { data?: never[] | undefined; isLoading: any; } {
    throw new Error("Function not implemented.");
}
