import { SectionHeader } from "../../components/SectionHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Paper, TextField, Select, MenuItem, Typography, Backdrop, CircularProgress, Grid, Alert, FormHelperText} from "@mui/material";
import { useTripForm } from "../../hooks/useTripForm";
import { Import } from "lucide-react";
import { Controller } from "react-hook-form";
import { CreateViajeSchema } from "../../api/schemas";

export default function TripFormPage() {
    const {id} = useParams();
    const navigate = useNavigate();
     const {
        handleSubmit,
        onSubmit,
        isEditing,
        formErrors,
        register,
        control,
        isValid,
        isLoading,
        error: formError,
        companies, 
        vehicles, 
        drivers,
        depots,
        errorCompanies,
        errorVehicles,
        errorDrivers,
        errorDepots,
        watch,
        loadingAuxData
    } = useTripForm(id);

    if (isLoading || loadingAuxData) return <CircularProgress />;
    if (errorCompanies || formError || errorVehicles || errorDrivers || errorDepots) return (
        //consultar...
        <Alert severity="error">
            {
                errorCompanies
                ? "Error al cargar las empresas transportistas."
                : errorVehicles
                ? "Error al cargar los tipos de vehículo."
                : errorDrivers
                ? "Error al cargar los choferes."
                : errorDepots
                ? "Error al cargar los depósitos."
                : typeof formError === "string"
                ? formError
                : formError?.message || "Error al cargar el formulario."
            }
        </Alert>
    );

    const handleFormSubmit = (data: CreateViajeSchema) => {
        onSubmit(data);
    };


    return(
        <>
            <SectionHeader
                title={isEditing ? "Editar Viaje" : "Crear Viaje"}
                description={isEditing ? "Modifica los datos del viaje." : "Registrar nuevo viaje."}
            />
            <Paper sx={{maxHeight:"85%", padding: 4, overflow: "auto", mx: 'auto', width: "100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5 }} >
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-[800px] mx-auto">
                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos del Viaje</Typography>
                    <Grid container spacing={3} mb={4}>

                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Asignar Depositos</Typography>
                    <Grid container spacing={3} mb={4}>

                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Asignar Recursos</Typography>
                    <Grid container spacing={3} mb={4}>

                    </Grid>
                </form>
            </Paper>
        </>
    )
}