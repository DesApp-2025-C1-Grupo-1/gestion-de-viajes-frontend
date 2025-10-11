import { SectionHeader } from "../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import { UserRoundCheck, Building2, MapPinned, Car} from "lucide-react";
import { InfoCard } from "../components/dashboard/InfoCard";


import TopEmpresasChart from "../components/dashboard/Chart";
import { useViajeControllerGetDashboard } from "../api/generated";
import { Grid } from "@mui/material";

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
            <div className="flex flex-col px-4 py-2">   
                <Grid container mb={2} spacing={2}>
                    <Grid item xs={12} md={6} lg={4}>
                        <InfoCard 
                            title="Transportistas"
                            description="empresas registradas"
                            subDescription={estadisticasRecientes?.empresas}
                            icon={<Building2 className={`size-7 block`} color="#E65F2B"/>} 
                            value={totalEmpresas}
                            onClick={() => navigate("/companies")}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <InfoCard 
                            title="Choferes"
                            description="choferes registrados"
                            subDescription={estadisticasRecientes?.choferes}
                            icon={<UserRoundCheck className={`size-7 block`} color="#E65F2B"/>} 
                            value={totalChoferes}
                            onClick={() => navigate("/drivers")}
                        />
                    </Grid>
                    <Grid item xs={12}  lg={4} >
                        <InfoCard 
                            title="Flota de Vehículos"
                            description="vehículos registrados"
                            subDescription={estadisticasRecientes?.vehiculos}
                            icon={<Car className={`size-7 block`} color="#E65F2B"/>} 
                        value={totalVehiculos}
                        onClick={() => navigate("/vehicles")}
                    />
                    </Grid>
                
                </Grid>
                <Grid container mb={2} spacing={2}>
                    <Grid item xs={12}  lg={6}>
                        <InfoCard 
                            title="Próximos viajes"
                            description="Vista previa de los próximos viajes"
                            icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                            list={proximosViajes}
                            onClick={() => navigate("/trips/distribution")}
                        />
                    </Grid>

                    <Grid item xs={12}  lg={6} >
                        {topEmpresas && topEmpresas.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">No hay datos disponibles para mostrar.</p>
                            </div>
                        ):(
                            <TopEmpresasChart topEmpresas={topEmpresas ?? []} />
                        )}
                    </Grid>
                </Grid>
            </div>
        </>      
    );
}
