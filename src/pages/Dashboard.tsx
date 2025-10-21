import { SectionHeader } from "../components/SectionHeader";
import { MapPinned, DollarSign, Navigation, FileText, FileBox} from "lucide-react";
import { InfoCard } from "../components/dashboard/InfoCard";
import TopEmpresasChart from "../components/dashboard/Chart";
import { useRemitosControllerGetRemitos, useViajeControllerGetDashboard, RemitoDto, ViajeDistribucionDto } from "../api/generated";
import { Grid } from "@mui/material";
import ZonasChart from "../components/dashboard/ChartZonas";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingOverlay } from "../components/LoadginOverlay";

export default function Dashboard() {
    const { data } =  useViajeControllerGetDashboard();
    const [cantTarifas, setCantTarifas] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [dataZonas, setDataZonas] = useState<any[]>([]);

    const { totalEmpresas, topEmpresas, proximosViajes, estadisticasRecientes } = data?.data || {};

    const { data: remitosDisponiblesData } = useRemitosControllerGetRemitos();
    
    const remitosExtraidos = remitosDisponiblesData?.data?.data || [];

    const remitosDisponibles = remitosExtraidos.filter((remito) => {
        return remito.estado?.nombre === "En preparación";
    });

    const totalRemitos = remitosDisponiblesData?.data?.totalItems || 0;

    useEffect(() => {
        const fetchTarifas = async () => {
        try {
            const { data } = await axios.get("https://tarifas-de-costos-acme-backend.onrender.com/api/tarifas");
            // Ejemplo: la API devuelve el objeto como el que me mostraste
            const rawData = data;
            setCantTarifas(rawData.length);
            
        } catch (error) {
            console.error("Error al obtener zonas:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchTarifas();
    }, []);

    useEffect(() => {
        const fetchZonas = async () => {
        try {
            const { data } = await axios.get("https://tarifas-de-costos-acme-backend.onrender.com/api/zonas/comparativa-costos");
            // Ejemplo: la API devuelve el objeto como el que me mostraste
            const rawData = data;

            // Transformar el objeto en array filtrando las zonas sin tarifas
            const transformado = Object.entries(rawData)
            .filter(([_, value]) => value !== "No hay tarifas")
            .map(([nombre, value]: [string, any]) => ({
                nombre,
                promedio: value.average.toFixed(2),
                minimo: value.min,
                maximo: value.max,
                tarifas: value.count,
            }));

            // Ordenar de mayor a menor por promedio
            const ordenado = transformado.sort((a, b) => b.promedio - a.promedio);

            const ordenadoFiltrado = ordenado.slice(0, 5); // Top 5 zonas con más costo

            setDataZonas(ordenadoFiltrado);
        } catch (error) {
            console.error("Error al obtener zonas:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchZonas();
    }, []);

    if(loading){ return <LoadingOverlay active={loading}/>;}

    return (
        <>
            <SectionHeader
                title="Dashboard"
                description="Realice un seguimiento de sus cargas y entregas logísticas diarias"
            />
            <div className="flex flex-col px-2">   
                <Grid container mb={2} spacing={2}>
                    <Grid item xs={12} lg={4}  >
                        <InfoCard 
                            title="Viajes En Camino"
                            description="viajes activos"
                            icon={<Navigation className="size-6 block" color="#E65F2B" />} 
                            value={totalEmpresas}

                            link="/trips/distribution"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <InfoCard 
                            title="Tarifas de Costos"
                            description="tarifas registradas"
                            icon={<DollarSign className="size-6 block" color="#E65F2B" />} 
                            value={cantTarifas}
                            link="https://tarifas-de-costo.netlify.app/tarifas"
                            external
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <InfoCard 
                            title="Remitos"
                            description="remitos registrados"
                            icon={<FileBox className="size-6 block" color="#E65F2B" />} 
                            value={totalRemitos}
                            link="https://remitos-front.netlify.app/remitos"
                            external
                        />
                    </Grid>
                
                </Grid>
                <Grid container mb={2} spacing={2}>
                    <Grid item xs={12}  lg={6}>
                        <InfoCard 
                            title="Próximos viajes"
                            description="Vista previa de los próximos viajes"
                            icon={<MapPinned className={`size-7 block`} color="#E65F2B"/>} 
                            list={proximosViajes ? (proximosViajes as unknown as ViajeDistribucionDto[]) : undefined}
                            link="/trips/distribution"
                        />
                    </Grid>
                    <Grid item xs={12}  lg={6}>
                        <InfoCard 
                            title="Próximos remitos"
                            description="Vista previa de los próximos remitos"
                            icon={<FileText className={`size-7 block`} color="#E65F2B"/>} 
                            listRemitos={remitosDisponibles  ? (remitosDisponibles as unknown as RemitoDto[]) : undefined}
                            link="https://remitos-front.netlify.app/remitos"
                            external
                        />
                    </Grid>

                    {topEmpresas && topEmpresas.length !== 0 && (
                        <Grid item xs={12}  lg={6} >
                            <TopEmpresasChart topEmpresas={topEmpresas ?? []} />
                        </Grid>
                    )}

                    <Grid item xs={12} lg={6}>
                        <ZonasChart dataZonas={dataZonas} />
                    </Grid>

                </Grid>
            </div>
        </>      
    );
}
