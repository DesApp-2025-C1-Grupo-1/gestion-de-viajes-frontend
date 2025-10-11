import { SectionHeader } from "../../components/SectionHeader";
import CardDetails from "../../components/detailts/Details";
import { Button, Chip, CircularProgress, DialogActions, Paper, Typography} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Building2, Clock, MapPin, Route, Users } from "lucide-react";
import { formatTelefono } from "../../lib/formatters";
import { useDepositoControllerFindOne, DepositoDto } from "../../api/generated";

export default function DepositDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: depositSelected, isLoading, isError } = useDepositoControllerFindOne(id!, {
        query: {
            enabled: !!id,
            select: (response) => response.data,
        },
    });

    if (isLoading) return <CircularProgress />;
    if (isError || !depositSelected) return <Typography>Error al cargar el depósito</Typography>;


    return (
        <>
            <SectionHeader
                title="Detalles del depósito"
                description="Visualice los detalles del depósito"
            />
            <Paper  sx={{ padding:4, mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}} >
                <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center">
        
                    <div className="w-full max-w-5xl flex flex-col gap-10">
                        <CardDetails 
                            icon={<Building2 color="#E65F2B" />}
                            title="Información general"
                            fields={[
                                { label: "Nombre", value: `${depositSelected.nombre}` },
                                { label: "Tipo de depósito", value: <Chip
                                                                        sx={{
                                                                            borderRadius: '16px',
                                                                            fontWeight: 500,
                                                                            fontSize: '0.75rem',
                                                                            height: 'auto',
                                                                            py: 0.8,
                                                                            px: 1.5,
                                                                            '& .MuiChip-icon': {
                                                                            ml: '4px',
                                                                            mr: '2px',
                                                                            },
                                                                            '& .MuiChip-label': {
                                                                            px: '2px',
                                                                            },
                                                                        }}
                                                                        label={depositSelected.tipo === "propio" ? "Propio" : "Terceros"}
                                                                        color={depositSelected.tipo === "propio" ? "primary" : "default"}
                                                                        size="small"
                                                                    /> 
                                },
                                ...(depositSelected?.restricciones ? [{ label: "Restricciones", value: depositSelected.restricciones, isLong: true }] : []),
                            ]}
                        />                
                        <CardDetails 
                            icon={<MapPin color="#E65F2B" />}
                            title="Dirección"
                            fields={[
                                { label: "Calle y número", value: `${depositSelected.direccion.calle} ${depositSelected.direccion.numero}` },
                                { label: "Ciudad y provincia", value: `${depositSelected.direccion.ciudad}, ${depositSelected.direccion.estado_provincia}`, isLong: true },
                                { label: "Pais", value: `${depositSelected.direccion.pais}` },
                                { label: "Latitud", value: `${depositSelected.lat.toLocaleString()}` },
                                { label: "Longitud", value: `${depositSelected.long.toLocaleString()}` },
                            ]}
                        />                 
                        <CardDetails 
                            icon={<Users color="#E65F2B" />}
                            title="Información de contacto"
                            fields={[
                                { label: "Nombre", value: `${depositSelected.contacto.nombre}` },
                                { label: "Email", value: `${depositSelected.contacto.email}` },
                                { label: "Telefono", value: `${formatTelefono(depositSelected.contacto.telefono)}` },
                            ]}
                        /> 
                        <CardDetails 
                            icon={<Clock color="#E65F2B" />}
                            title="Horarios de operación"
                            fields={[
                                { label: "Horario de entrada", value: `${depositSelected.horario_entrada}` },
                                { label: "Horario de salida", value: `${depositSelected.horario_salida}` },
                            ]}
                        />  
                    </div>
                </div>  
            </Paper> 

            <DialogActions sx={{paddingTop:4}}>
                <Button
                    onClick={() => navigate(`/depots`)}
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
    );
}