import { TripDistributionType } from "../../components/tripsDistribution/TripDistributionType";
import { SectionHeader } from "../../components/SectionHeader";
import { Button, CircularProgress, DialogActions, Paper, Table, TableCell, TableHead, TableRow} from "@mui/material";
import { Building2, ClipboardMinus, MapPinned, Route, Ticket } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import CardDetails from "../../components/detailts/Details";
import { TripType } from "../../components/trip/TripType";
import { useViajeDistribucionControllerFindOne, RemitoDto, useRemitosControllerGetRemitos, useTarifasControllerListarZonas, useTarifasControllerTarifasFiltradas, TarifaDto, ZonaDto, useRemitosControllerGetRemitosByIds, remitosControllerGetRemitosByIds, ViajeDistribucionDto} from '../../api/generated';
import CardRemitosDetails from "../../components/tripsDistribution/RemitosDetails";

import { useEffect, useMemo, useState } from "react";
import { useRemitosFromTrip } from "../../hooks/tripDistribution/useRemitosDetails";
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
    const navigate = useNavigate();

    const {
        data: tripSelectedRaw,
        isLoading,
        isError,
    } = useViajeDistribucionControllerFindOne(id!, {
        query: {
        enabled: !!id,
        select: (response) => response.data,
        },
    });

    const [tripSelected, setTripSelected] = useState<ViajeDistribucionDto | null>(null);

    useEffect(() => {
        if (tripSelectedRaw) {
        setTripSelected(tripSelectedRaw);
        }
    }, [tripSelectedRaw]);

    const { remitos, isLoading: isLoadingRemito } = useRemitosFromTrip(tripSelected ?? undefined);

    if (isLoading || !tripSelected) return <CircularProgress />;
    if (isError) return <p>No se encontró el viaje con ID: {id}</p>;

    const tarifaAsignada = tarifasMock.find(t => t.id === tripSelected.tarifa_id);


    //console.log(tripSelected)
    //console.log(remitos)

    return (
        <>
            <SectionHeader
                title="Detalles del viaje"
                description="Visualice los detalles del viaje en distribución y gestione su estado."
            />
            <Paper  sx={{ padding:4, mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}} >
                <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center">
        
                    <div className="w-full max-w-5xl flex flex-col gap-10">
                        <CardDetails 
                            icon={<MapPinned color="#E65F2B" />}
                            title="Información General"
                            fields={[
                                { label: "Número de viaje", value: `${tripSelected.numeroDeViaje}` },
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
                        {tripSelected.tarifa_id !== undefined && tarifaAsignada && (
                            <CardDetails 
                                icon={<Ticket color="#E65F2B" />}
                                title="Tarifas"
                                fields={[
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
