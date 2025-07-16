import { SectionHeader } from "../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import { UserRoundCheck, Building2, MapPinned, Car } from "lucide-react";
import { InfoCard } from "../components/dashboard/InfoCard";


import TopEmpresasChart from "../components/dashboard/Chart";
import { useViajeControllerGetDashboard } from "../api/generated";

export default function Dashboard() {
    const { data } =  useViajeControllerGetDashboard();

    const { totalEmpresas, totalChoferes, totalVehiculos, topEmpresas, proximosViajes, estadisticasRecientes } = data?.data || {};
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
                        subDescription={estadisticasRecientes?.empresas}
                        icon={<Building2 className={`size-7 block`} color="#E65F2B"/>} 
                        value={totalEmpresas}
                        onClick={() => navigate("/companies")}
                    />
                    <InfoCard 
                        title="Choferes"
                        description="choferes registrados"
                        subDescription={estadisticasRecientes?.choferes}
                        icon={<UserRoundCheck className={`size-7 block`} color="#E65F2B"/>} 
                        value={totalChoferes}
                        onClick={() => navigate("/drivers")}
                    />
                    <InfoCard 
                        title="Flota de Vehículos"
                        description="vehículos registrados"
                        subDescription={estadisticasRecientes?.vehiculos}
                        icon={<Car className={`size-7 block`} color="#E65F2B"/>} 
                        value={totalVehiculos}
                        onClick={() => navigate("/vehicles")}
                    />
                </div>

                <div className="col-span-1 xl:col-span-3">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 lg:col-span-5">
                            <InfoCard 
                                title="Próximos viajes"
                                description="Vista previa de los próximos viajes"
                                icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                                list={proximosViajes}
                                onClick={() => navigate("/trips")}
                            />
                        </div>
                        <div className="col-span-12 lg:col-span-7">
                            {topEmpresas && topEmpresas.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">No hay datos disponibles para mostrar.</p>
                                </div>
                            ):(
                                <TopEmpresasChart topEmpresas={topEmpresas ?? []} />
                            )}


                            
                        </div>
                    </div>
                </div>
            </div>
        </>      
    );
}
