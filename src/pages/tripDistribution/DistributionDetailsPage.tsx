import { TripDistributionType } from "../../components/tripsDistribution/TripDistributionType";
import { SectionHeader } from "../../components/SectionHeader";
import { CircularProgress} from "@mui/material";
import { Building2, ClipboardMinus, MapPinned, Route, Ticket } from "lucide-react";
import { useParams } from 'react-router-dom';
import CardDetails from "../../components/detailts/Details";
import { TripType } from "../../components/trip/TripType";
import { useViajeDistribucionControllerFindOne, RemitoDto, useRemitosControllerGetRemitos, useTarifasControllerListarZonas, useTarifasControllerTarifasFiltradas, TarifaDto, ZonaDto} from '../../api/generated';

import { useMemo } from "react";
//import { useTarifaMockDesdeViaje } from "../../hooks/tripDistribution/useDistributionDetails";

const tarifasMock: TarifaDto[] = [
  { 
    id: 1,
    nombre: "Tarifa Estándar",
    valorBase: 1000,
    esVigente: true,
    transportistaNombre: "Transporte Rápido",
    tipoVehiculoNombre: "Camión Semi",
    zonaNombre: "Zona Norte",
    tipoCargaNombre: "General",
    transportistaId: "683f7e7e4904b1a84fc05250",
    tipoVehiculoId: "6845d29a9d776351c1752411",
    zonaId: 46,
    tipoCargaId: 7,
    total: 1200,
    adicionales: [
      {
        id: 1,
        nombre: "Peaje",
        costoDefault: 100,
        descripcion: "Costo de peajes en la ruta",
        activo: true,
        esGlobal: true,
        costoEspecifico: 100
      }
    ]
  }
];

const fetchTarifasPorZona = async (zonaId: number, transportistaId: string, tipoVehiculoId: string): Promise<TarifaDto[]> => {
  return tarifasMock.filter(t => 
    t.zonaId === zonaId && 
    t.esVigente === true
  );
};

export default function DistributionDetailsPage() {
    const { id } = useParams<{ id: string }>();

    const {data: tripSelected, isLoading, isError} = useViajeDistribucionControllerFindOne(id!, {
        query: {
            enabled: !!id,
            select: (response) => response.data, 
        },
    });

    if (isLoading) return <CircularProgress />;
    if (isError || !tripSelected) return <p>No se encontró el viaje con ID: {id}</p>;

    const tarifaAsignada = tarifasMock.find(t => t.id === tripSelected?.tarifa_id);

    //console.log(tripSelected)

    /*const esViajeNacional = tripSelected.tipo_viaje === 'nacional';

    const { data: zonasResponse, isLoading: loadingZonas } = useTarifasControllerListarZonas();
    const zonas: ZonaDto[] = zonasResponse?.data ?? [];

    const zonaSeleccionada = zonas.find(z => z.id === tarifa?.zonaId);

    const { tarifa, isLoading: isLoadingTarifa } = useTarifaDesdeViaje({
        tripSelected,
        zonaDto: zonaSeleccionada,
        });
    

    const { data: zonasResponse } = useTarifasControllerListarZonas();
    const zonas: ZonaDto[] = zonasResponse?.data ?? [];

    const { tarifa, isLoading: isLoadingTarifa } = useTarifaDesdeViaje({
    tripSelected,
    zonaDto: undefined, 
    });

    const zonaInferida = useMemo(() => {
    if (!tarifa || !tarifa.zonaId || zonas.length === 0) return undefined;
    return zonas.find(z => z.id === tarifa.zonaId);
    }, [tarifa, zonas]);*/

   
    
    return (
        <>
            <SectionHeader
                title="Detalles del viaje"
                description="Visualice los detalles del viaje en distribución y gestione su estado"
            />

            <div className="flex-1 overflow-y-auto px-2 py-2">  
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 px-0.5">
                    <div className="py-2 h-full flex flex-col">
                        <CardDetails 
                            icon={<MapPinned color="#E65F2B" />}
                            title="Información General"
                            fields={[
                                { label: "Número de viaje", value: `${tripSelected.id}`},
                                { label: "Estado actual", value: <TripDistributionType tipo={tripSelected.estado} /> },
                                { label: "Kilómetros", value: `${tripSelected.kilometros}`},
                                { label: "Tipo de viaje", value: <TripType tipo={tripSelected.tipo_viaje} />},
                                { label: "Fecha de inicio", value: `${new Date(tripSelected.fecha_inicio).toLocaleDateString().split('/').join('-')}`},
                                { label: "Hora de inicio", value: `${new Date(tripSelected.fecha_inicio).toLocaleTimeString()}`},
                                ...(tripSelected.observaciones ? [{ label: "Observaciones", value: tripSelected.observaciones, isLong: true }] : []),
                            ]}
                        />
                    </div>
                    <div className="py-2 h-full flex flex-col">
                        <CardDetails 
                            icon={<Route color="#E65F2B" />}
                            title="Depósito de Origen"
                            fields={[
                                { label: "Nombre del depósito", value: `${tripSelected.origen.nombre}`},
                                { label: "Dirección", value: `${tripSelected.origen.direccion.calle} ${tripSelected.origen.direccion.numero}, ${tripSelected.origen.direccion.ciudad}`, isLong: true},
                                { label: "Horarios de atención", value: `${tripSelected.origen.horario_entrada} - ${tripSelected.origen.horario_salida}`},
                                { label: "Mail de contacto", value: `${tripSelected.origen.contacto.email}`, isLong: true},
                            ]}
                        />
                    </div>
                    <div className="py-2 h-full flex flex-col">      
                        <CardDetails 
                            icon={<Building2 color="#E65F2B" />}
                            title="Transportista"
                            fields={[
                               { label: "Empresa transportista", value: `${tripSelected.transportista.nombre_comercial}`},
                               { label: "Chofer asignado", value: `${tripSelected.chofer.apellido} ${tripSelected.chofer.nombre}`},
                               { label: "Vehículo asignado", value: `${tripSelected.vehiculo.modelo} - ${tripSelected.vehiculo.patente}`},
                            ]}
                        />
                    </div>
                </div>


                <div className="flex-1 overflow-y-auto px-2 py-2">
                    <CardDetails 
                        icon={<ClipboardMinus color="#E65F2B" />}
                        title="Remitos"
                        fields={[
                            { label: "Asignados", value: `${tripSelected.remitos_info}`, isLong: true},
                            
                        ]}
                    />  
                </div>            
                <div className="flex-1 overflow-y-auto px-2 py-2">
                    {tripSelected.tarifa_id !== undefined && tarifaAsignada && (                           
                            <CardDetails 
                                icon={<Ticket color="#E65F2B" />}
                                title="Tarifas"
                            fields={[
                                    //{ label: "Zona", value: tripSelected.tarifa?.nombre },
                                    //{ label: "Total", value: `$ ${tripSelected.tarifa?.valorBase}` },
                                    { label: "Nombre", value: tarifaAsignada.nombre },
                                    { label: "Valor base", value: `$ ${tarifaAsignada.valorBase}` },
                                    { label: "Precio total", value: `$ ${tarifaAsignada.total}` },
                                    { label: "Zona", value: tarifaAsignada.zonaNombre },
                                    { label: "Tipo de carga", value: tarifaAsignada.tipoCargaNombre },
                                ]}
                            />
                    )}
                </div>
                        
            </div>



        </>
    )
}
