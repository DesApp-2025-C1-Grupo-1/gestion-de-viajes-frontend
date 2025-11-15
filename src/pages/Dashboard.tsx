import { SectionHeader } from "../components/SectionHeader";
import { MapPinned, Navigation, FileBox } from "lucide-react";
import { Box } from "@mui/material";
import { InfoCard } from "../components/dashboard/InfoCard";
import { useDashboardControllerGetDashboard } from "../api/generated";
import { Grid } from "@mui/material";
import CardContainer from "../components/dashboard/CardCointainer";
import ProximosViajes from "../components/dashboard/ProximosViajes";

export default function Dashboard() {
    const { data, isLoading} =  useDashboardControllerGetDashboard();
    const { totalViajes, 
        viajesPorEstado, 
        totalRemitos, 
        remitosPorEstado, 
        proximosViajes,
    } = data?.data || {};

    return (
        <>
            <SectionHeader
                title="Dashboard"
            />
            <div className="flex flex-col px-0">   
                <Grid container mb={2} spacing={2} marginBottom={0}>
                    <Grid item xs={12}  lg={6} >
                        <InfoCard 
                            title="Viajes En Camino"
                            icon={<Navigation className="size-6 block" color="#E65F2B" />} 
                            loading={isLoading}
                        >

                          <CardContainer
                            isViaje={true}
                            viajeCantidadTotal={totalViajes}
                            viajeInicioCarga={viajesPorEstado?.inicioCarga}
                            viajeEnCamino={viajesPorEstado?.finCarga}
                            viajeFinalizado={viajesPorEstado?.finViaje}
                          />

                        </InfoCard>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <InfoCard 
                            title="Remitos"
                            icon={<FileBox className="size-6 block" color="#E65F2B" />} 
                            link={import.meta.env.VITE_REMITOS_URL || 'https://localhost:8081/remitos'}
                            external
                            loading={isLoading}
                        >
                          <CardContainer
                            isViaje={false}
                            remitoCantidadTotal={totalRemitos}
                            remitoEnCamino={remitosPorEstado?.enCamino}
                            remitoEntregados={remitosPorEstado?.entregados}
                            remitoNoEntregados={remitosPorEstado?.noEntregados}
                          />
                        </InfoCard>

                    </Grid>

                    <Grid item xs={12}  lg={12}>
                        <InfoCard 
                            title="Próximos viajes"
                            icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                            loading={isLoading}
                            isList
                        >
                          <Box display="flex" paddingLeft={3} paddingRight={3} paddingTop={2} paddingBottom={2} flexDirection={"column"}>
                            {proximosViajes && proximosViajes.length > 0 ? (
                                proximosViajes.map((viaje) => (
                                  <ProximosViajes
                                    key={viaje._id}
                                    viajeID={viaje.nro_viaje}
                                    viaje_id={viaje._id}
                                    fecha={viaje.fecha}
                                    empresaNombre={viaje.empresa}
                                    choferNombre={viaje.chofer}
                                    precioTarifa={viaje.valorTarifa}
                                    remitosEntregados={viaje.totalRemitos}
                                    totalRemitos={viaje.remitosEntregados}
                                  />
                                ))
                            ) : (
                                <Box padding={2} textAlign="center" width="100%">
                                    No hay próximos viajes disponibles.
                                </Box>
                            )}
                          </Box>
                        </InfoCard>
                    </Grid>
                </Grid>
            </div>
        </>      
    );
}
