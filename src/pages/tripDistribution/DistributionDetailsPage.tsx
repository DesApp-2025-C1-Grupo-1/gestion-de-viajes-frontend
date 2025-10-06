import { TripDistributionType } from "../../components/TripDistributionType";
import { SectionHeader } from "../../components/SectionHeader";
import { CircularProgress} from "@mui/material";
import { Building2, ClipboardMinus, MapPinned, Route, Ticket } from "lucide-react";
import { useParams } from 'react-router-dom';
import { useViajeDistribucionControllerFindOne} from '../../api/generated';
import CardDetails from "../../components/detailts/Details";


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

    
    return (
        <>
            <SectionHeader
                title="Detalles del viaje"
                description="Visualice los detalles del viaje en distribución y gestione su estado"
            />

            <div className="flex-1 overflow-y-auto px-2 py-2">  
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-4 px-0.5">
                    <div className="py-2 h-full flex flex-col">
                        <CardDetails 
                            icon={<MapPinned color="#E65F2B" />}
                            title="Información General"
                            fields={[
                                { label: "Número de viaje", value: `${tripSelected._id}`, isLong: true},
                                { label: "Estado actual", value: <TripDistributionType tipo={tripSelected.estado} /> },
                                { label: "Fecha de inicio", value: `${new Date(tripSelected.fecha_inicio).toLocaleDateString().split('/').join('-')}`, isLong: true},
                                { label: "Hora de inicio", value: `${new Date(tripSelected.fecha_inicio).toLocaleTimeString()}`, isLong: true},
                                { label: "Kilómetros", value: `${tripSelected.kilometros}`, isLong: true},
                            ]}
                        />
                    </div>

                    <div className="py-2 h-full flex flex-col">
                        <CardDetails 
                            icon={<Route color="#E65F2B" />}
                            title="Depósito de Origen"
                            fields={[
                                { label: "Nombre del depósito", value: `${tripSelected.origen.nombre}`, isLong: true},
                                { label: "Dirección", value: `${tripSelected.origen.direccion.calle} ${tripSelected.origen.direccion.numero}, ${tripSelected.origen.direccion.ciudad}`, isLong: true},
                                { label: "Horarios de atención", value: `${tripSelected.origen.horario_entrada} - ${tripSelected.origen.horario_salida}`, isLong: true},
                                { label: "Mail de contacto", value: `${tripSelected.origen.contacto.email}`, isLong: true}
                            ]}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-4 px-0.5">
                    <div className="py-2 h-full flex flex-col">      
                        <CardDetails 
                            icon={<Building2 color="#E65F2B" />}
                            title="Transportista"
                            fields={[
                               { label: "Empresa transportista", value: `${tripSelected.transportista.nombre_comercial}`, isLong: true},
                               { label: "Chofer asignado", value: `${tripSelected.chofer.apellido} ${tripSelected.chofer.nombre}`, isLong: true},
                               { label: "Vehículo asignado", value: `${tripSelected.vehiculo.modelo} - ${tripSelected.vehiculo.patente}`, isLong: true},
                            ]}
                        />
                    </div>
                    <div className="py-2 h-full flex flex-col">
                        <CardDetails 
                            icon={<ClipboardMinus color="#E65F2B" />}
                            title="Remitos"
                            fields={[
                               { label: "Asignados", value: `${tripSelected.remito_ids}`, isLong: true},
                               
                            ]}
                        />                                          
                    </div>
                </div>

                {tripSelected.tarifa_id !== undefined && (
                    <div className="py-2">
                        <CardDetails 
                            icon={<Ticket color="#E65F2B" />}
                            title="Tarifas"
                            fields={[
                              { label: "Asignadas", value: `${tripSelected.tarifa_id}`, isLong: true},
                            ]}
                        />
                    </div>
                )}


            </div>



        </>
    )
}
