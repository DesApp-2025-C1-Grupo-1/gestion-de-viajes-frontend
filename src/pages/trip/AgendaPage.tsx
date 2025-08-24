import { useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { useEffect, useState } from "react";
import { ChoferDto, useChoferControllerFindOne, useVehiculoControllerFindOne, useViajeControllerBuscar, VehiculoDto, ViajeDto } from "../../api/generated";
import { Calendar, Views } from "react-big-calendar";
import { localizer } from "../../lib/localizer";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Popover, Typography } from "@mui/material";
import { Clock, MapPin } from "lucide-react";
import { useNotify } from "../../hooks/useNotify";

export default function AgendaPage() {
    const { tipo, id } = useParams<{ tipo: string; id: string }>();
    const {notify} = useNotify("Viajes");
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [viajes, setViajes] = useState<ViajeDto[]>([]);
    const [entity, setEntity] = useState<VehiculoDto | ChoferDto | undefined>(undefined);
    const [selectedEvent, setSelectedEvent] = useState<{
        title: string;
        start: Date;
        end: Date;
        viaje: ViajeDto;
    } | null>(null);

    const { mutateAsync: buscarViajes } = useViajeControllerBuscar();
    const vehiculoQuery = tipo === "vehicles" && id ? useVehiculoControllerFindOne(id) : undefined;
    const choferQuery = tipo === "drivers" && id ? useChoferControllerFindOne(id) : undefined;

    useEffect(() => {
        const fetchAgenda = async () => {
            if (!tipo || !id) return;
            const filtro = tipo === "vehicles" ? { vehiculo: id } : { chofer: id };

            try {
                const res = await buscarViajes({
                    data: filtro,
                    params: { page: 1, limit: 1000 },
                });
                setViajes(res.data.data);
            } catch (err) {
                notify("error", "No se pudieron cargar los viajes.");
                console.error("Error al cargar los viajes:", err);
            }
        };

        fetchAgenda();
    }, [tipo, id]);

    useEffect(() => {
        if (tipo === "vehicles" && vehiculoQuery && vehiculoQuery.data) {
            setEntity(vehiculoQuery.data.data);
        } else if (tipo === "drivers" && choferQuery && choferQuery.data) {
            setEntity(choferQuery.data.data);
        }
    }, [tipo, vehiculoQuery?.data, choferQuery?.data]);

    const handleEventClick = (event: any, e: React.SyntheticEvent) => {
        setSelectedEvent(event);
        setAnchorEl(e.currentTarget as HTMLElement);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedEvent(null);
    };

    const parseEvents = () => {
        if (!viajes || viajes.length === 0) return [];

        return(
            viajes.map(viaje => ({
                title: `${viaje.vehiculo.patente} - ${viaje.chofer.nombre} ${viaje.chofer.apellido}`,
                start: new Date(viaje.fecha_inicio),
                end: new Date(viaje.fecha_llegada),
                viaje,
            }))
        )

    };

    const open = Boolean(anchorEl);
    const entityType = tipo === "vehicles" ? "vehículo" : "chofer";

    if (!tipo || !id) return <div>Error: Tipo o ID no proporcionados.</div>;

    if (vehiculoQuery?.isLoading || choferQuery?.isLoading) {
        return <div>Cargando agenda...</div>;
    }

    if (viajes.length === 0) {
        return (
            <SectionHeader
                title={`Agenda del ${entityType} - ${
                    entityType === "vehículo"
                        ? entity && "patente" in entity
                            ? entity.patente
                            : ""
                        : entity && "nombre" in entity && "apellido" in entity
                            ? `${entity.nombre} ${entity.apellido}`
                            : ""
                }`}
                description={`No hay viajes registrados para este ${entityType}.`}
            />
        );
    }

    return (
        <>
            <SectionHeader
                title={`Agenda del ${entityType} - ${
                    entityType === "vehículo"
                        ? entity && "patente" in entity
                            ? entity.patente
                            : ""
                        : entity && "nombre" in entity && "apellido" in entity
                            ? `${entity.nombre} ${entity.apellido}`
                            : ""
                }`}
                description="Aquí puedes ver la agenda de los viajes."
            />

            <div className="h-full mb-2">
                <Calendar
                    localizer={localizer}
                    events={parseEvents()}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView={Views.MONTH}
                    views={["month", "week", "day", "agenda"]}
                    style={{ height: "100%" }}
                    messages={{
                        allDay: "Todo el día",
                        previous: "Atrás",
                        next: "Siguiente",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        agenda: "Agenda",
                        date: "Fecha",
                        time: "Hora",
                        event: "Evento",
                        noEventsInRange: "No hay eventos en este rango.",
                        showMore: total => `+ Ver más (${total})`,
                    }}
                    culture="es"
                    onSelectEvent={handleEventClick}
                />
            </div>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                slotProps={{
                    paper: {
                    elevation: 4,
                    style: {
                        borderRadius: 12,
                        minWidth: 280,
                        padding: 16,
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#fff',
                        marginTop: 8,
                    },
                    },
                }}
                >
                {selectedEvent && (
                    <Box className="flex flex-col gap-2 text-gray-800">
                    <Typography variant="subtitle1" align="center" sx={{ fontWeight: 'bold' }}>
                        {selectedEvent.viaje.vehiculo.patente} - {selectedEvent.viaje.chofer.nombre} {selectedEvent.viaje.chofer.apellido}
                    </Typography>

                    <Box className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        <Typography variant="body2">
                        <strong>Inicio:</strong>{" "}
                        {new Intl.DateTimeFormat("es-AR", {
                            dateStyle: "short",
                            timeStyle: "short",
                        }).format(selectedEvent.start)}
                        </Typography>
                    </Box>

                    <Box className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        <Typography variant="body2">
                        <strong>Fin:</strong>{" "}
                        {new Intl.DateTimeFormat("es-AR", {
                            dateStyle: "short",
                            timeStyle: "short",
                        }).format(selectedEvent.end)}
                        </Typography>
                    </Box>

                    <Box className="flex items-center gap-2 pt-2 border-t border-gray-200 mt-1">
                        <MapPin size={16} className="text-gray-500" />
                        <Typography variant="body2" className="text-sm">
                        <strong>Origen:</strong> {selectedEvent.viaje.deposito_origen.nombre}
                        </Typography>
                    </Box>

                    <Box className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-500" />
                        <Typography variant="body2" className="text-sm">
                        <strong>Destino:</strong> {selectedEvent.viaje.deposito_destino.nombre}
                        </Typography>
                    </Box>
                    </Box>
                )}
            </Popover>
        </>
    );
}
