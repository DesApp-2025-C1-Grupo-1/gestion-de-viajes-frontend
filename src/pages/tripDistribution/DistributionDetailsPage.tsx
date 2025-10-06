import { TripDistributionType } from "../../components/TripDistributionType";

import { SectionHeader } from "../../components/SectionHeader";
//import { HeaderDetails } from "../../components/Details";
import { Box, CircularProgress, Grid, Paper, Popover, Typography } from "@mui/material";
import { Building2, ClipboardMinus, MapPinned, Route, Ticket } from "lucide-react";
import { Field } from "../../components/detailts/Field";

import { useParams } from 'react-router-dom';
import { useViajeDistribucionControllerFindOne, ViajeDistribucionDto } from '../../api/generated';
import { useState } from "react";
import { Header2Details } from "../../components/Details";


export default function DistributionDetailsPage() {
    const { id } = useParams<{ id: string }>();
    //const [tripSelected] = useState<ViajeDistribucionDto>();

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
                        <Header2Details
                            icon={<MapPinned color="#E65F2B" />}
                            title="Información General"
                        />
                        <Paper
                            variant="outlined"
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                p: 2.5,
                                backgroundColor: "#F6F7FB", 
                                borderColor: "#C7C7C7", 
                                borderRadius: 1.5,
                                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        variant="h6" 
                                        fontWeight={600} 
                                        sx={{ fontSize: '0.90rem'}}
                                        className="truncate"
                                    >
                                                   Número de viaje            
                                    </Typography>
                                    {tripSelected._id} 

                                    {/*<Field label="Número de viaje" value={tripSelected._id} />*/}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        label="Estado Actual" value={<TripDistributionType tipo={tripSelected.estado} />}/>
                    
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field label="Fecha y hora de Inicio" value={`${new Date(tripSelected.fecha_inicio).toLocaleDateString().split('/').join('-')}`} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        label="Kilometros" value={tripSelected.kilometros}/>
                                </Grid>
                            </Grid>
                        </Paper>
                    </div>

                    <div className="py-2 h-full flex flex-col">
                        <Header2Details
                            icon={<Route color="#E65F2B" />}
                            title="Depósito de Origen"
                        />
                        <Paper
                            variant="outlined"
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                p: 2.5,
                                backgroundColor: "#F6F7FB", 
                                borderColor: "#C7C7C7", 
                                borderRadius: 1.5,
                                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                    label="Nombre del depósito"
                                    value={`${tripSelected.origen.nombre}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        label="Dirección"
                                        value={`${tripSelected.origen.direccion.calle} ${tripSelected.origen.direccion.numero}, ${tripSelected.origen.direccion.ciudad}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                    label="Horarios de atención"
                                    value={`${tripSelected.origen.horario_entrada} - ${tripSelected.origen.horario_salida}`}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-4 px-0.5">
                    <div className="py-2 h-full flex flex-col">
                        <Header2Details
                            icon={<Building2 color="#E65F2B" />}
                            title="Transportista"
                        />
                        <Paper
                            variant="outlined"
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                p: 2.5,
                                backgroundColor: "#F6F7FB", 
                                borderColor: "#C7C7C7", 
                                borderRadius: 1.5,
                                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        label="Empresa transportista"
                                        value={`${tripSelected.transportista.nombre_comercial}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        label="Chofer"
                                        value={`${tripSelected.chofer.nombre}, ${tripSelected.chofer.apellido}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        label="Vehículo asignado"
                                        value={`${tripSelected.vehiculo.modelo} - ${tripSelected.vehiculo.patente}`}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                    </div>
                    <div className="py-2 h-full flex flex-col">
                        <Header2Details
                            icon={<ClipboardMinus color="#E65F2B" />}
                            title="Remitos"
                        />
                        <Paper
                            variant="outlined"
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                p: 2.5,
                                backgroundColor: "#F6F7FB", 
                                borderColor: "#C7C7C7", 
                                borderRadius: 1.5,
                                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        label="Asignados"
                                        value={`${tripSelected.remito_ids}`}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </div>
                </div>

                {tripSelected.tarifa_id !== undefined && (
                    <div className="py-2">
                        <Header2Details
                            icon={<Ticket color="#E65F2B" />}
                            title="Tarifas"
                        />
                    
                        <Paper
                            variant="outlined"
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                p: 2.5,
                                backgroundColor: "#F6F7FB", 
                                borderColor: "#C7C7C7", 
                                borderRadius: 1.5,
                                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        label="Asignadas"
                                        value={`${tripSelected.tarifa_id}`}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    
                    </div>
                )}


            </div>



        </>
    )
}


