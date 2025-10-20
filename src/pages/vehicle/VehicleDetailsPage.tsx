import { SectionHeader } from "../../components/SectionHeader";
import CardDetails from "../../components/detailts/Details";
import { Button, Chip, CircularProgress, DialogActions, Paper, Typography} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Building2, Clock, Info, MapPin, Package, Route, Truck, Users } from "lucide-react";
import { formatTelefono } from "../../lib/formatters";
import { useVehiculoControllerFindOne } from "../../api/generated";

export default function VehicleDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: vehicleSelected, isLoading, isError } = useVehiculoControllerFindOne(id!, {
        query: {
            enabled: !!id,
            select: (response) => response.data,
        },
    });

    if (isLoading) return <CircularProgress />;
    if (isError || !vehicleSelected) return <Typography>Error al cargar el  vehículo</Typography>;

    return (
        <>
            <SectionHeader
                title="Detalles del vehículo"
                description="Visualice los detalles del vehículo."
            />
            <Paper  sx={{ padding:4, mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}} >
                <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center">
        
                    <div className="w-full max-w-5xl flex flex-col gap-10">
                        <CardDetails 
                            icon={<Truck color="#E65F2B" />}
                            title="Información general"
                            fields={[
                                { label: "Patente", value: `${vehicleSelected.patente}` },
                                { label: "Marca", value: `${vehicleSelected.marca}` , isLong: true},
                                { label: "Modelo", value: `${vehicleSelected.modelo}` , isLong: true},
                                { label: "Año del vehículo", value: vehicleSelected.año.toString() },
                                
                            ]}
                        />                
                        <CardDetails 
                            icon={<Package color="#E65F2B" />}
                            title="Capacidad de carga"
                            fields={[
                                { label: "Peso (kg)", value: `${vehicleSelected.peso_carga}` },
                                { label: "Volumen (m³)", value: `${vehicleSelected.volumen_carga}`},
                            ]}
                        />                 
                        <CardDetails 
                            icon={<Info color="#E65F2B" />}
                            title="Recursos asignados"
                            fields={[
                                { label: "Tipo de vehículo", value: `${vehicleSelected.tipo.nombre}` , isLong: true},
                                { label: "Empresa transportista", value: `${vehicleSelected.empresa.nombre_comercial}` , isLong: true},
                            ]}
                        /> 
                    </div>
                </div>  
            </Paper> 

            <DialogActions sx={{paddingTop:4}}>
                <Button
                    onClick={() => navigate(`/vehicles`)}
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