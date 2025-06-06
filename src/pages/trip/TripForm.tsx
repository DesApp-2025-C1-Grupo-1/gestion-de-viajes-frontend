import { SectionHeader } from "../../components/SectionHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Paper, Select, MenuItem, Typography, Backdrop, CircularProgress, Grid, Alert, FormHelperText, FormControl} from "@mui/material";
import { useTripForm } from "../../hooks/useTripForm";
import { Controller } from "react-hook-form";
import { CreateViajeSchema } from "../../api/schemas";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function TripFormPage() {
    const {id} = useParams();
    const navigate = useNavigate();
     const {
        handleSubmit,
        onSubmit,
        isEditing,
        formErrors,
        control,
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
                    {/* FECHA INICIO FECHA LLEGADA TIPO DE VIAJE*/}
                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos del Viaje</Typography>
                    <Grid container spacing={3} mb={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Fecha estimada de inicio</Typography>
                                <Controller
                                    name="fecha_inicio"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                        {...field}
                                        disabled={isLoading}
                                        value={new Date (field.value)||null}
                                        onChange={(date) => field.onChange(date)}
                                        format="dd/MM/yyyy"
                                        slotProps={{
                                            textField: {
                                            fullWidth: true,
                                            className: "inside-paper",
                                            error: !!formErrors.fecha_inicio,
                                            helperText: formErrors.fecha_inicio?.message,
                                            },
                                        }}                         
                                    />
                                    )}
                                />
                            </Grid>
                        
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Fecha estimada de llegada</Typography>
                                <Controller
                                    name="fecha_llegada"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                        {...field}
                                        disabled={isLoading}
                                        value={new Date (field.value) ||null}
                                        onChange={(date) => field.onChange(date)}
                                        format="dd/MM/yyyy"
                                        slotProps={{
                                            textField: {
                                            fullWidth: true,
                                            className: "inside-paper",
                                            error: !!formErrors.fecha_llegada,
                                            helperText: formErrors.fecha_llegada?.message,
                                            },
                                        }}                              
                                    />
                                    )}
                                />
                            </Grid>
                        </LocalizationProvider>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Tipo de viaje</Typography>
                                <Controller 
                                    name="tipo_viaje"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                        fullWidth
                                        className="inside-paper"
                                        {...field}
                                        value={field.value || "nacional"} 
                                        error={!!formErrors.tipo_viaje}
                                        onChange={(event) => field.onChange(event.target.value)}
                                        disabled={isLoading}
                                        >
                                            <MenuItem value="nacional">Nacional</MenuItem>
                                            <MenuItem value="internacional">Internacional</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* DEPO ORIGEN Y DESTINO */}
                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Asignar Depositos</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Deposito de Origen</Typography>
                                <Controller
                                control={control}
                                name="deposito_origen"
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    value={field.value || ""}
                                    fullWidth
                                    displayEmpty
                                    onChange={(event) => field.onChange(event.target.value)}
                                    error={!!formErrors.deposito_origen}
                                    >
                                    {depots?.data?.map((dep) => (
                                        <MenuItem key={dep._id} value={dep._id}>
                                        {dep.nombre}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText error={!!formErrors.deposito_origen}>
                                {formErrors.deposito_origen?.message}
                            </FormHelperText>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Deposito de Destino</Typography>
                                <Controller
                                control={control}
                                name="deposito_destino"
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    value={field.value || ""}
                                    fullWidth
                                    displayEmpty
                                    onChange={(event) => field.onChange(event.target.value)}
                                    error={!!formErrors.deposito_destino}
                                    >
                                    {depots?.data?.map((dep) => (
                                        <MenuItem key={dep._id} value={dep._id}>
                                        {dep.nombre}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText error={!!formErrors.deposito_destino}>
                                {formErrors.deposito_destino?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>

                    {/*EMPRESA - CHOFER - VEHICULO*/}
                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Asignar Recursos</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Empresa Transportista</Typography>
                                <Controller
                                control={control}
                                name="empresa"
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    value={field.value || ""}
                                    fullWidth
                                    displayEmpty
                                    onChange={(event) => field.onChange(event.target.value)}
                                    error={!!formErrors.empresa}
                                    >
                                    {companies?.data?.map((company) => (
                                        <MenuItem key={company._id} value={company._id}>
                                        {company.nombre_comercial}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText error={!!formErrors.empresa}>
                                {formErrors.empresa?.message}
                            </FormHelperText>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Chofer a asignar</Typography>
                                <Controller
                                control={control}
                                name="chofer"
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    value={field.value || ""}
                                    fullWidth
                                    displayEmpty
                                    onChange={(event) => field.onChange(event.target.value)}
                                    error={!!formErrors.chofer}
                                    >
                                    {drivers?.data?.map((dri) => (
                                        <MenuItem key={dri._id} value={dri._id}>
                                        {dri.nombre}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText error={!!formErrors.chofer}>
                                {formErrors.chofer?.message}
                            </FormHelperText>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Vehiculo a utilizar</Typography>
                                <Controller
                                control={control}
                                name="vehiculo"
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    value={field.value || ""}
                                    fullWidth
                                    displayEmpty
                                    onChange={(event) => field.onChange(event.target.value)}
                                    error={!!formErrors.vehiculo}
                                    >
                                    {vehicles?.data?.map((veh) => (
                                        <MenuItem key={veh._id} value={veh._id}>
                                        {veh.marca} - {veh.patente}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText error={!!formErrors.vehiculo}>
                                {formErrors.vehiculo?.message}
                            </FormHelperText>
                        </Grid>

                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                        <Button onClick={() => navigate("/trips")} variant="outlined" disabled={isLoading}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                            {isEditing ? "Actualizar" : "Crear"}
                        </Button>
                    </Box>

                </form>

                <Backdrop open={isLoading} sx={{ zIndex: 9999, color: "#fff" }}>
                    <CircularProgress color="inherit" />
                </Backdrop>

            </Paper>
        </>
    )
}