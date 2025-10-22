import { TripDistributionType } from "../../components/tripsDistribution/TripDistributionType";
import { SectionHeader } from "../../components/SectionHeader";
import { Button, CircularProgress, DialogActions, Paper, Table, TableCell, TableHead, TableRow, SxProps, Typography, Box } from '@mui/material';
import { Building2, ClipboardMinus, MapPinned, Route, Ticket } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import CardDetails from "../../components/detailts/Details";
import { TripType } from "../../components/trip/TripType";
import { useRemitosControllerGetRemitosByIds, useViajeDistribucionControllerFindOne} from '../../api/generated';
import CardRemitosDetails from "../../components/tripsDistribution/RemitosDetails";
import { useTarifaDetails } from "../../hooks/tripDistribution/useTarifasDetails";
import { useEffect } from "react";
import LoadingState from "../../components/LoadingState";
import { TripStateDetails } from "../../components/tripsDistribution/TripStateDetails";

export default function DistributionDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: tripSelected,
        isLoading,
        isError,
    } = useViajeDistribucionControllerFindOne(id!, {
        query: {
        enabled: !!id,
        select: (response) => response.data,
        },
    });

    const remitosMutation = useRemitosControllerGetRemitosByIds();
    const { tarifa, isLoading: isLoadingTarifa } = useTarifaDetails(tripSelected);

    useEffect(() => {
        if (tripSelected?.remito_ids?.length) {
            remitosMutation.mutate({ data: { ids: tripSelected.remito_ids } });
        }
    }, [tripSelected]);

    const isLoadingAll = isLoading || !tripSelected || remitosMutation.isPending || isLoadingTarifa;

    if (isError) {
        return <p>No se encontró el viaje con ID: {id}</p>;
    }

    const remitos = Array.isArray(remitosMutation.data?.data)
    ? remitosMutation.data.data
    : [];

    return (
        <>
            <SectionHeader
                title="Detalles del viaje"
                description="Visualice los detalles del viaje en distribución y gestione su estado."
            />
            <Paper  sx={{ padding:4, mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}} >
                <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center">

                    {isLoadingAll ? (
                        <LoadingState title="detalles del viaje"/>
                    ):(


                        <div className="w-full max-w-5xl flex flex-col gap-10">
                            <CardDetails 
                                icon={<MapPinned color="#E65F2B" />}
                                title="Información General"
                                fields={[
                                    { label: "Número de viaje", value: `${tripSelected.nro_viaje}` },
                                    { label: "Estado actual", value: <TripDistributionType tipo={tripSelected.estado} /> },
                                    { label: "Kilómetros", value: `${tripSelected.kilometros}` },
                                    { label: "Tipo de viaje", value: <TripType tipo={tripSelected.tipo_viaje} /> },
                                    { label: "Fecha de inicio", value: `${new Date(tripSelected.fecha_inicio).toLocaleDateString().split('/').join('-')}` },
                                    { label: "Hora de inicio", value: `${new Date(tripSelected.fecha_inicio).toLocaleTimeString()}` },
                                    ...(tripSelected.observaciones ? [{ label: "Observaciones", value: tripSelected.observaciones, isLong: true }] : []),
                                ]}
                            />                
                            <CardDetails 
                                icon={<Route color="#E65F2B" />}
                                title="Depósito de Origen"
                                fields={[
                                    { label: "Nombre del depósito", value: `${tripSelected.origen.nombre}` },
                                    { label: "Dirección", value: `${tripSelected.origen.direccion.calle} ${tripSelected.origen.direccion.numero}, ${tripSelected.origen.direccion.ciudad}`, isLong: true },
                                    { label: "Horarios de atención", value: `${tripSelected.origen.horario_entrada} - ${tripSelected.origen.horario_salida}` },
                                    { label: "Mail de contacto", value: `${tripSelected.origen.contacto.email}`, isLong: true },
                                ]}
                            />                
                            <CardDetails 
                                icon={<Building2 color="#E65F2B" />}
                                title="Transportista"
                                fields={[
                                    { label: "Empresa transportista", value: `${tripSelected.transportista.nombre_comercial}` },
                                    { label: "Chofer asignado", value: `${tripSelected.chofer.apellido} ${tripSelected.chofer.nombre}` },
                                    { label: "Vehículo asignado", value: `${tripSelected.vehiculo.modelo} - ${tripSelected.vehiculo.patente}` },
                                ]}
                            />  
                            <CardRemitosDetails 
                                icon={<ClipboardMinus color="#E65F2B" />}
                                title="Remitos"
                                remitos={remitos}
                            />
                            {tripSelected.tipo_viaje === "nacional" && (
                                isLoadingTarifa ? (
                                    <CircularProgress />
                                ) : tarifa ? (
                                    <CardDetails
                                    icon={<Ticket color="#E65F2B" />}
                                    title="Tarifa asociada"
                                    fields={[
                                        { label: "Nombre", value: tarifa.nombreTarifa },
                                        { label: "Valor base", value: `$ ${tarifa.valorBase}` },
                                        { label: "Precio total", value: `$ ${tarifa.total}` },
                                        { label: "Zona", value: tarifa.zonaNombre },
                                        { label: "Tipo de carga", value: tarifa.tipoCargaNombre },
                                        { label: "Transportista", value: tarifa.transportistaNombre },
                                        { label: "Tipo de vehículo", value: tarifa.tipoVehiculoNombre },
                                    ]}
                                    />
                                ) : (
                                    <CardDetails 
                                    icon={<Ticket color="#E65F2B" />}
                                    title="Tarifa asociada"
                                    fields={[
                                    { label: "", value: "No se encontró la tarifa asociada." }
                                    ]}
                                    />
                                )
                            )}

                            <Box sx={{ mb: 4,  bgcolor: 'background.default', borderRadius: 2 }}>
                                <TripStateDetails 
                                    viajeId={tripSelected._id}
                                    initialState={tripSelected.estado}
                                    initialKm={tripSelected.kilometros}
                                />


                            </Box>
                        </div>             
                    )}                  
                </div>

                
                  
            </Paper>   
            <DialogActions sx={{paddingTop:4}}>
                <Button
                    onClick={() => navigate(`/trips/distribution`)}
                    variant="contained"
                    sx={{
                    backgroundColor: "#E65F2B",
                    "&:hover": {
                        backgroundColor: "#C94715",
                    },
                    color: "#FFF",
                    textTransform: "none",
                    fontWeight: 500,
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>          

        </>
    )
}
