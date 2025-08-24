import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Paper, TextField, Typography, Backdrop, CircularProgress, Grid, Alert, FormHelperText, Select, MenuItem, InputAdornment } from "@mui/material";
import { useDriverForm } from '../../hooks/useDriverForm';
import { Controller} from 'react-hook-form';
import { CreateChoferSchema } from "../../api/schemas";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FormActions from "../../components/deposit/FormActions";

export default function DriverFormPage(){
    const {id} = useParams();
    const navigate = useNavigate();

    const {
        handleSubmit,
        onSubmit,
        isEditing,
        formErrors,
        register,
        control,
        isLoading,
        error: formError,
        companies,
        filteredVehicles,
        handleCompanyChange,
        errorEmpresa,
        errorVehicles,
        licenciasValidas,
        watch,
        loadingAuxData,
        isSubmitting,
    } = useDriverForm(id);

    const codigoPais =  watch("telefono.codigo_pais")
    const mostrarCodigoArea = codigoPais === "54";

    if (isLoading || loadingAuxData) return <CircularProgress />;
    if (errorEmpresa || formError || errorVehicles) return (
        <Alert severity="error">
            {errorEmpresa ? "Error al cargar las empresas transportistas" : errorVehicles ? "Error al cargar los vehiculos" : typeof formError === "string" 
                ? formError : formError?.message || "Error al cargar el formulario"
            }
        </Alert>
    );

    const handleFormSubmit = (data: CreateChoferSchema) => {
        onSubmit(data);
    };

    return(
        <>
            <SectionHeader
                title={isEditing ? "Editar chofer" : "Registrar chofer"}
                description={isEditing ? "Actualizá los datos del chofer registrado." : "Completá el formulario para dar de alta un chofer."}
            />
            
            <Paper sx={{maxHeight:"100%", padding: 4, overflow: "auto", mx: 'auto', width: "100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5 }} >
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-[800px] mx-auto overflow-y-auto">

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos personales</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre</Typography>
                            <TextField
                                id="nombre"
                                {...register("nombre")}
                                fullWidth
                                placeholder="Ej: Carlos"
                                inputProps={{ "aria-label": "nombre" }}
                                error={!!formErrors.nombre}
                                helperText={formErrors.nombre?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Apellido</Typography>
                            <TextField
                                id="apellido"
                                {...register("apellido")}
                                fullWidth
                                placeholder="Ej: Bustamante"
                                inputProps={{ "aria-label": "apellido" }}
                                error={!!formErrors.apellido}
                                helperText={formErrors.apellido?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>                       
                    </Grid>

                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>DNI</Typography>
                            <TextField
                                id="dni"
                                type="text"
                                {...register("dni", { valueAsNumber: true, })}
                                fullWidth
                                placeholder="Ej: 44258393"
                                inputProps={{ "aria-label": "dni" }}
                                error={!!formErrors.dni}
                                helperText={formErrors.dni?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Grid item xs={12} sm={6}>
                                <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Fecha de nacimiento</Typography>
                                <Controller
                                    name="fecha_nacimiento"
                                    control={control}
                                    render={({ field}) => (
                                        <DatePicker                     
                                            value={field.value ? new Date(field.value) : null}
                                            onChange={(date) => {
                                                field.onChange(date ? new Date(date) : null)
                                                console.log(date)
                                            }}
                                            className="inside-paper"
                                            slotProps={{
                                                textField: {
                                                fullWidth: true,
                                                error: !!formErrors.fecha_nacimiento,
                                                helperText: formErrors.fecha_nacimiento?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </LocalizationProvider>
                        
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Información de Contacto</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Telefono</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={mostrarCodigoArea ? 3 : 4}>
                                <TextField
                                    id="telefono.codigo_pais"
                                    placeholder="54"
                                    fullWidth
                                    className="inside-paper"
                                    {...register("telefono.codigo_pais")}
                                    error={!!formErrors.telefono?.codigo_pais}
                                    disabled={isLoading}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                        position="start"
                                        sx={{
                                            minWidth: '0.1rem',
                                            color: '#5A5A65',
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                        }}
                                        >
                                        +
                                        </InputAdornment>
                                    ),
                                    }}
                                />
                                </Grid>
                                {mostrarCodigoArea && (
                                <Grid item xs={2}>
                                    <TextField
                                    id="telefono.codigo_area"
                                    placeholder="11"
                                    fullWidth
                                    className="inside-paper"
                                    {...register("telefono.codigo_area")}
                                    error={!!formErrors.telefono?.codigo_area}
                                    disabled={isLoading}
                                    />
                                </Grid>
                                )}
                                <Grid item xs={mostrarCodigoArea ? 7 : 8}>
                                    <TextField
                                        id="telefono.numero"
                                        placeholder="12345678"
                                        fullWidth
                                        className="inside-paper"
                                        {...register("telefono.numero")}
                                        error={!!formErrors.telefono?.numero}
                                        disabled={isLoading}
                                    />
                                </Grid>
                            </Grid>

                            {(formErrors.telefono?.codigo_pais ||
                                formErrors.telefono?.codigo_area ||
                                formErrors.telefono?.numero) && (
                                <Box sx={{ mt: 1, color: 'error.main', fontSize: '0.75rem' }}>
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                        {formErrors.telefono?.codigo_pais?.message && (
                                        <li>{formErrors.telefono?.codigo_pais?.message}</li>
                                        )}
                                        {formErrors.telefono?.codigo_area?.message && (
                                        <li>{formErrors.telefono?.codigo_area?.message}</li>
                                        )}
                                        {formErrors.telefono?.numero?.message && (
                                        <li>{formErrors.telefono?.numero?.message}</li>
                                        )}
                                    </ul>
                                </Box>
                            )}
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Mail</Typography>
                            <TextField
                                id="email"
                                placeholder="contacto@deposito.com"
                                fullWidth
                                className="inside-paper"
                                type="email"
                                {...register("email")}
                                error={!!formErrors.email}
                                helperText={formErrors.email?.message}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos de la licencia</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Licencia</Typography>                                  
                            <TextField
                                id="licencia"
                                {...register("licencia")}
                                fullWidth
                                placeholder="Ej: 123ABC456"
                                inputProps={{ "aria-label": "licencia" }}
                                error={!!formErrors.licencia}
                                helperText={formErrors.licencia?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Tipo de licencia</Typography>
                            <Controller
                                control={control}
                                name="tipo_licencia"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        inputProps={{ "aria-label": "tipo_licencia" }}
                                        value={field.value || ""}
                                        fullWidth
                                        displayEmpty
                                        onChange={(event) => field.onChange(event.target.value)}
                                        error={!!formErrors.tipo_licencia}
                                        >
                                        {licenciasValidas.map((licencias) => (
                                            <MenuItem key={licencias} value={licencias}>
                                                {licencias}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText error={!!formErrors.tipo_licencia}>
                                {formErrors.tipo_licencia?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Asignar recursos</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Empresa Transportista</Typography>
                            <Controller
                                control={control}
                                name="empresa"
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    inputProps={{ "aria-label": "Empresa transportista" }}
                                    value={field.value || ""}
                                    fullWidth
                                    displayEmpty
                                    onChange={(event) => {
                                        field.onChange(event.target.value)
                                        handleCompanyChange(event.target.value)
                                    }}
                                    error={!!formErrors.empresa}
                                    >
                                    <MenuItem value="" disabled>
                                        Seleccione una empresa
                                    </MenuItem>
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
                        <Grid item xs={12} sm={6}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Vehiculo a utilizar</Typography>
                            <Controller
                                control={control}
                                name="vehiculo"
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    inputProps={{ "aria-label": "vehiculo" }}
                                    value={field.value || ""}
                                    fullWidth
                                    displayEmpty
                                    onChange={(event) => field.onChange(event.target.value)}
                                    error={!!formErrors.vehiculo}
                                    disabled={!control._formValues.empresa}
                                    >
                                    <MenuItem value="" disabled>
                                        {control._formValues.empresa ? "Seleccione un vehiculo" : "Seleccione una empresa primero"}
                                    </MenuItem>
                                    {filteredVehicles.length === 0 && (
                                        <MenuItem disabled>No hay vehículos disponibles</MenuItem>
                                    )}
                                    {filteredVehicles.map((vehiculos) => (
                                        <MenuItem key={vehiculos._id} value={vehiculos._id}>
                                        {vehiculos.marca} - {vehiculos.patente}
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

                    <FormActions 
                        loading={isLoading}
                        isEditing={isEditing}
                        isSubmitting={isSubmitting}
                    />
                </form>
                <Backdrop open={isLoading} sx={{ zIndex: 9999, color: "#fff" }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Paper>
        </>
    )
}