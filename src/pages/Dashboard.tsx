import { SectionHeader } from "../components/SectionHeader";
import { MapPinned, Navigation, FileBox} from "lucide-react";
import { InfoCard } from "../components/dashboard/InfoCard";
import { useDashboardControllerGetDashboard } from "../api/generated";
import { Grid } from "@mui/material";
import CardContainer from "../components/dashboard/CardCointainer";
import ProximosViajes from "../components/dashboard/ProximosViajes";

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
                    <Grid item xs={12}  lg={6} >
                        <InfoCard 
                            title="Viajes En Camino"
                            icon={<Navigation className="size-6 block" color="#E65F2B" />} 
                            value={viajesEnCamino}
                            // loading={isLoading}
                        >

                          <CardContainer
                            isViaje={true}
                            viajeCantidadTotal={128}
                            viajeInicioCarga={12}
                            viajeEnCamino={45}
                            viajeFinalizado={71}
                          />

                        </InfoCard>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <InfoCard 
                            title="Remitos"
                            icon={<FileBox className="size-6 block" color="#E65F2B" />} 
                            value={remitos}
                            link="https://remitos-front.netlify.app/remitos"
                            external
                            // loading={isLoading}
                        >
                          <CardContainer
                            isViaje={false}
                            remitoCantidadTotal={128}
                            remitoEnCamino={34}
                            remitoEntregados={198}
                            remitoNoEntregados={24}
                          />
                        </InfoCard>

                    </Grid>

                    <Grid item xs={12}  lg={12}>
                        <InfoCard 
                            title="Próximos viajes"
                            icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                            // loading={isLoading}
                            isList
                        >
                          <ProximosViajes
                              viajeID= {"V-808FF"}
                              fecha= {"12/11/2025"}
                              empresaNombre= {"Acme SRL"}
                              choferNombre= {"Carlos Lonfardo"}
                              precioTarifa= {1500}
                              remitosEntregados= {3}
                              totalRemitos= {10}
                          />
                        </InfoCard>
                    </Grid>
                </Grid>
            </div>
        </>      
    );
}
