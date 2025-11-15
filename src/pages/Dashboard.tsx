import { SectionHeader } from "../components/SectionHeader";
import { MapPinned, Navigation, FileBox } from "lucide-react";
import { Box, useMediaQuery } from "@mui/material";
import { InfoCard } from "../components/dashboard/InfoCard";
import { useDashboardControllerGetDashboard } from "../api/generated";
import { Grid } from "@mui/material";
import CardContainer from "../components/dashboard/CardCointainer";
import ProximosViajes from "../components/dashboard/ProximosViajes";
import { useTheme } from "@mui/material/styles";
import EntityCard from "../components/EntityCard";
import { useNavigate } from "react-router-dom";
import DashboardProgressBar from "../components/dashboard/DashboardProgressBar";

export default function Dashboard() {
    const { data, isLoading} =  useDashboardControllerGetDashboard();
    const { totalViajes, 
        viajesPorEstado, 
        totalRemitos, 
        remitosPorEstado, 
        proximosViajes,
    } = data?.data || {};

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    return (
        <>
            <SectionHeader
                title="Dashboard"
            />
            <div className="flex flex-col px-0">   
                <Grid container mb={2} spacing={2} marginBottom={0}>
                    <Grid item xs={12} sm={6} lg={6} >
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
                    <Grid item xs={12} sm={6} lg={6}>
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

                    <Grid item xs={12} lg={12}>
                        <InfoCard 
                            title="Próximos viajes"
                            icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                            loading={isLoading}
                            isList
                        >
                          <Box display="flex" paddingLeft={3} paddingRight={3} paddingTop={2} paddingBottom={2} flexDirection={"column"} gap={2}> 
                            {proximosViajes && proximosViajes.length > 0 ? (
                              isMobile ? (
                                proximosViajes.map((tripsDistribution) => (
                                  <EntityCard
                                      key={tripsDistribution._id}
                                      title={ tripsDistribution.nro_viaje ?? (tripsDistribution as any).numeroDeViaje}
                                      icon={<MapPinned size={24}/>}
                                      fields={[
                                          { label: "Transportista", value: `${tripsDistribution.empresa}`},
                                          { label: "Chofer", value: tripsDistribution.chofer, isLong: true },
                                          { label: "Costo", value: tripsDistribution.valorTarifa ? `${tripsDistribution.valorTarifa}` : "N/A" },
                                          { label: "Fecha", value: `${new Date(tripsDistribution.fecha).toLocaleDateString()}` },
                                      ]}
                                      onView={() => navigate(`/trips/distribution/details/${tripsDistribution._id}`)}
                                      children={
                                        <DashboardProgressBar
                                          remitosEntregados={tripsDistribution.remitosEntregados}
                                          totalRemitos={tripsDistribution.totalRemitos}
                                          isMobile={true}
                                        />
                                      }
                                  />
                                ))
                              ) : (
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
                              )
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
