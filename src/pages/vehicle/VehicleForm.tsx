import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Paper, TextField, Select, MenuItem, Typography, Backdrop, CircularProgress, Grid, Alert, FormHelperText} from "@mui/material";
import { useVehicleForm } from "../../hooks/useVehicleForm";
import { Controller } from "react-hook-form";
import { CreateVehiculoSchema } from "../../api/schemas";

export default function VehicleFormPage() {
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
        errorEmpresa,
        vehicleTypes,
        errorTipoVehiculo,
        loadingAuxData
    } = useVehicleForm(id);

    if (isLoading || loadingAuxData) return <CircularProgress />;
    if (errorEmpresa || formError || errorTipoVehiculo) return (
        <Alert severity="error">
            {errorEmpresa
                ? "Error al cargar las empresas transportistas."
                : errorTipoVehiculo
                    ? "Error al cargar los tipos de vehículo."
                    : typeof formError === "string"
                        ? formError
                        : formError?.message || "Error al cargar el formulario."
            }
        </Alert>
    );

    const handleFormSubmit = (data: CreateVehiculoSchema) => {
        onSubmit(data);
    };


    return (
        <>
            <SectionHeader 
                title={isEditing ? "Editar vehículo" : "Crear vehículo"}
                description={isEditing ? "Modifica los datos del vehículo" : "Aquí puedes registrar un nuevo vehículo."}
            />

            <Paper  sx={{maxHeight:"85%", padding:3, overflow:"auto", mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5} }>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
                    <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Datos personales</Typography>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Patente</Typography>
                            <TextField
                                id="patente" 
                                {...register("patente")}
                                placeholder="Ej: ABC123" 
                                fullWidth 
                                inputProps={{ "aria-label": "Patente del vehículo" }}
                                error={!!formErrors.patente}
                                helperText={formErrors.patente?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3} >
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Modelo</Typography>
                            <TextField  
                                id="modelo"
                                placeholder="Ej: Corolla" 
                                {...register("modelo")}
                                fullWidth 
                                inputProps={{ "aria-label": "Modelo del vehículo" }}
                                error={!!formErrors.modelo}
                                helperText={formErrors.modelo?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Marca</Typography>
                            <TextField className="inside-paper" id="marca" {...register("marca")} placeholder="Ej: Toyota"  fullWidth inputProps={{ "aria-label": "Marca del vehículo" }}
                                error={!!formErrors.marca}
                                helperText={formErrors.marca?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Año</Typography>
                            <TextField className="inside-paper"  type="number" id="año" placeholder="Ingresar" {...register("año", {valueAsNumber:true})} fullWidth inputProps={{ "aria-label": "Año del vehículo" }} 
                                error={!!formErrors.año}
                                helperText={formErrors.año?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Volumen de carga</Typography>
                            <TextField className="inside-paper" id="volumen_carga" type="number" placeholder="Ingresar" {...register("volumen_carga", {valueAsNumber:true})} fullWidth inputProps={{ "aria-label": "Volumen de carga del vehículo" }} 
                                error={!!formErrors.volumen_carga}
                                helperText={formErrors.volumen_carga?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Peso de carga</Typography>
                            <TextField className="inside-paper" id="peso_carga" type="number"  placeholder="Ingresar" {...register("peso_carga", {valueAsNumber:true})} fullWidth inputProps={{ "aria-label": "Peso de carga del vehículo" }} 
                                error={!!formErrors.peso_carga}
                                helperText={formErrors.peso_carga?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>

                    <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Asignar recursos</Typography>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Empresa Transportista</Typography>
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
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Tipo de vehículo a utilizar</Typography>
                            <Controller
                                control={control}
                                name="tipo"
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    inputProps={{ "aria-label": "Tipo de vehículo" }}
                                    value={field.value || ""}
                                    onChange={(event) => field.onChange(event.target.value)}
                                    fullWidth
                                    displayEmpty
                                    error={!!formErrors.tipo}
                                    >
                                        {vehicleTypes?.data?.map((type) => (
                                            <MenuItem key={type._id} value={type._id}>
                                                {type.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            
                            <FormHelperText error={!!formErrors.tipo}>
                                {formErrors.tipo?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 , mt: 3 }}>
                        <Button onClick={() => navigate("/vehicles")} variant="outlined">Cancelar</Button>
                        <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={!isValid }>
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