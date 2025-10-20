import { SectionHeader } from "../../components/SectionHeader";
import CardDetails from "../../components/detailts/Details";
import { Button, CircularProgress, DialogActions, Paper, Typography} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, Car, IdCard, MapPin,  Phone,  UserRound,  Users } from "lucide-react";
import { formatTelefono } from "../../lib/formatters";
import { useChoferControllerFindOne } from "../../api/generated";

export default function DriverDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: driverSelected, isLoading, isError } = useChoferControllerFindOne(id!, {
        query: {
            enabled: !!id,
            select: (response) => response.data,
        },
    });

    if (isLoading) return <CircularProgress />;
    if (isError || !driverSelected) return <Typography>Error al cargar el chofer</Typography>;
   
    return (
        <>
            <SectionHeader
                title="Detalles del chofer"
                description="Visualice los detalles del chofer."
            />
            <Paper  sx={{ padding:4, mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}} >
                <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center">
                    <div className="w-full max-w-5xl flex flex-col gap-10">
                        <CardDetails 
                            icon={<UserRound color="#E65F2B" />}
                            title="Información general"
                            fields={[
                                { label: "Apellido y nombre", value: `${driverSelected.apellido} ${driverSelected.nombre}` , isLong: true},
                                { label: "Fecha de nacimiento", value: new Date(driverSelected.fecha_nacimiento).toLocaleDateString() },
                                { label: "Documento de identidad", value: `${driverSelected.dni}` },
                            ]}
                        />                
                        <CardDetails 
                            icon={<Phone color="#E65F2B" />}
                            title="Información de contacto"
                            fields={[
                                { label: "Email", value: `${driverSelected.email}` , isLong: true},
                                { label: "Telefono", value: `${formatTelefono(driverSelected.telefono)}` },
                            ]}
                        />                 
                        <CardDetails 
                            icon={<IdCard color="#E65F2B" />}
                            title="Datos de la licencia"
                            fields={[
                                { label: "Número de licencia", value: `${driverSelected.licencia}` },
                                { label: "Tipo de licencia", value: `${driverSelected.tipo_licencia}` },
                            ]}
                        />  
                        <CardDetails 
                            icon={<Car color="#E65F2B" />}
                            title="Recursos asignados"
                            fields={[
                                { label: "Vehículo", value: `${driverSelected.vehiculo.modelo} - ${driverSelected.vehiculo.patente}` , isLong: true},
                                { label: "Empresa transportista", value: `${driverSelected.empresa.nombre_comercial}` , isLong: true},
                            ]}
                        />  
                    </div>
                </div>  
            </Paper> 

            <DialogActions sx={{paddingTop:4}}>
                <Button
                    onClick={() => navigate(`/drivers`)}
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