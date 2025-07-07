import { SectionHeader } from "../components/SectionHeader";
//import { CircularProgress, SxProps } from '@mui/material';
import { useDashboard } from "../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { UserRoundCheck, Building2, MapPinned, Car } from "lucide-react";
import { InfoCard } from "../components/dashboard/InfoCard";

import { mockUltimosViajes } from "../lib/mock-data";

import TopEmpresasChart from "../components/dashboard/Chart";

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
            <div className="flex-1 overflow-y-auto px-4 py-2">   
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 px-0.5">
                    <InfoCard 
                        title="Transportistas"
                        description="empresas registradas"
                        subDescription="(+6 esta semana)"
                        icon={<Building2 className={`size-7 block`} color="#E65F2B"/>} 
                        value={12}
                        onClick={() => navigate("/companies")}
                    />
                    <InfoCard 
                        title="Choferes"
                        description="choferes registrados"
                        subDescription="(+3 esta semana)"
                        icon={<UserRoundCheck className={`size-7 block`} color="#E65F2B"/>} 
                        value={7}
                        onClick={() => navigate("/drivers")}
                    />
                    <InfoCard 
                        title="Flota de Vehiculos"
                        description="vehiculos registrados"
                        subDescription="(+10 esta semana)"
                        icon={<Car className={`size-7 block`} color="#E65F2B"/>} 
                        value={36}
                        onClick={() => navigate("/drivers")}
                    />
                </div>

                <div className="col-span-1 xl:col-span-3">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 lg:col-span-5">
                            <InfoCard 
                                title="Próximos viajes"
                                description="Vista previa de los próximos viajes"
                                icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                                list={mockUltimosViajes}
                                onClick={() => navigate("/trips")}
                            />
                        </div>
                        <div className="col-span-12 lg:col-span-7">
                            <TopEmpresasChart />
                        </div>
                    </div>
                </div>
            </div>
        </>      
    );
}
