import { SectionHeader } from "../components/SectionHeader";
import { MapPinned, DollarSign, Navigation, FileText, FileBox} from "lucide-react";
import { InfoCard } from "../components/dashboard/InfoCard";
import TopEmpresasChart from "../components/dashboard/Chart";
import { RemitoDto, ViajeDistribucionDto, useDashboardControllerGetDashboard } from "../api/generated";
import { Grid } from "@mui/material";
import ZonasChart from "../components/dashboard/ChartZonas";

export default function Dashboard() {
    const { data, isLoading} =  useDashboardControllerGetDashboard();
    const { topEmpresas, 
        proximosViajes, 
        viajesEnCamino, 
        viajesRecientes, 
        comparativaCostos, 
        remitos, 
        cantidadTarifas, 
        remitosProximos,
        cantidadRemitosRecientes
    } = data?.data || {};

    return (
        <>
            <SectionHeader
                title="Dashboard"
                description="Realice un seguimiento de sus cargas y entregas logísticas diarias"
            />
            <div className="flex flex-col px-0 md:px-2">   
                <Grid container mb={2} spacing={2}>
                    <Grid item xs={12} lg={4}  >
                        <InfoCard 
                            title="Viajes En Camino"
                            description="viajes activos"
                            icon={<Navigation className="size-6 block" color="#E65F2B" />} 
                            value={viajesEnCamino}
                            subDescription={viajesRecientes}
                            link="/trips/distribution"
                            loading={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <InfoCard 
                            title="Tarifas de Costos"
                            description="tarifas registradas"
                            icon={<DollarSign className="size-6 block" color="#E65F2B" />} 
                            value={cantidadTarifas}
                            link="https://tarifas-de-costo.netlify.app/tarifas"
                            external
                            loading={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <InfoCard 
                            title="Remitos"
                            description="remitos registrados"
                            icon={<FileBox className="size-6 block" color="#E65F2B" />} 
                            value={remitos}
                            link="https://remitos-front.netlify.app/remitos"
                            subDescription={cantidadRemitosRecientes}
                            external
                            loading={isLoading}
                        />
                    </Grid>
                
                </Grid>
                <Grid container mb={2} spacing={2}>
                    <Grid item xs={12}  lg={6}>
                        <InfoCard 
                            title="Próximos viajes"
                            icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                            list={proximosViajes ? (proximosViajes as unknown as ViajeDistribucionDto[]) : undefined}
                            link="/trips/distribution"
                            loading={isLoading}
                            isList
                        />
                    </Grid>
                    <Grid item xs={12}  lg={6}>
                        <InfoCard 
                            title="Próximos remitos"
                            icon={<FileText className={`size-7 block`} color="#E65F2B"/>} 
                            listRemitos={remitosProximos ? (remitosProximos as unknown as RemitoDto[]) : undefined}
                            link="https://remitos-front.netlify.app/remitos"
                            external
                            loading={isLoading}
                            isList
                        />
                    </Grid>


                    <Grid item xs={12}  lg={6} >
                        <TopEmpresasChart 
                            topEmpresas={topEmpresas ?? []} 
                            loading={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <ZonasChart 
                            dataZonas={comparativaCostos ?? []} 
                            loading={isLoading}    
                        />
                    </Grid>
                </Grid>
            </div>
        </>      
    );
}
