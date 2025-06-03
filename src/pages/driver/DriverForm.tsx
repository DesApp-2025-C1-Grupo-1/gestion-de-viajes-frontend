import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Paper, TextField, Typography, Backdrop, CircularProgress, Grid, Alert, FormHelperText, Select, MenuItem, InputAdornment } from "@mui/material";
import { useDriverForm } from '../../hooks/useDriverForm';
//import { useChoferControllerFindAll } from "../../api/generated";
import { Controller, UseFormRegister } from 'react-hook-form';
import { CreateChoferSchema } from "../../api/schemas";
import { vehicles } from "../../lib/mock-data";

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
        isValid,
        isLoading,
        error: formError,
        companies,
        vehiculos,
        errorEmpresa,
        errorVehicles,
        licenciasValidas,
        watch,
        loadingAuxData
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
                title={isEditing ? "Editar chofer" : "Crear nuevo chofer"}
                description={isEditing ? "Modifica los datos del chofer." : "Registrar un nuevo chofer."}
            />
            <Paper sx={{maxHeight:"85%", padding: 4, overflow: "auto", mx: 'auto', width: "100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5 }} >
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-[800px] mx-auto">

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos personales</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Nombre</Typography>
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
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Apellido</Typography>
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
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>DNI</Typography>
                            <TextField
                                id="dni"
                                {...register("dni")}
                                fullWidth
                                placeholder="Ej: 44258393"
                                inputProps={{ "aria-label": "dni" }}
                                error={!!formErrors.dni}
                                helperText={formErrors.dni?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Fecha de nacimiento</Typography>
                            <TextField
                                id="fecha_nacimiento"
                                {...register("fecha_nacimiento")}
                                fullWidth
                                placeholder="xx-xx-xx"
                                inputProps={{ "aria-label": "fecha_nacimiento" }}
                                error={!!formErrors.fecha_nacimiento}
                                helperText={formErrors.fecha_nacimiento?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos de la licencia</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Licencia</Typography>                                  
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
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Tipo de licencia</Typography>
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

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Información de Contacto</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Telefono</Typography>
                            
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
                                <FormHelperText error sx={{ mt: 1 }}>
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
                                </FormHelperText>
                            )}
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
                                    >
                                    {vehiculos?.data?.map((vehiculos) => (
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


                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                        <Button onClick={() => navigate("/drivers")} variant="outlined" disabled={isLoading}>Cancelar</Button>
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






/*
export default function DriverFormPage(){
    const {id} = useParams();
    const navigate = useNavigate();

    const { formData, errors, loading, touched, handleChange, handleSubmit, isEditing} = useFormDriver(id);
    

    const {data: drivers, isLoading} = useChoferControllerFindAll();
    if(isLoading) return <CircularProgress/>;

    const codigoPais = formData.telefono?.codigo_pais || "";
    const mostrarCodigoArea = codigoPais === "54";

    return(
        <>
            <SectionHeader
                title={isEditing ? "Editar chofer" : "Crear nuevo chofer"}
                description={isEditing ? "Modifica los datos del chofer." : "Registrar un nuevo chofer."}
            />
            <Paper sx={{maxHeight:"85%", padding: 4, overflow: "auto", mx: 'auto', width: "100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5 }} >
                <form onSubmit={handleSubmit} className="w-full max-w-[800px] mx-auto">

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos personales</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Nombre</Typography>
                            <TextField
                                value={formData.nombre}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "nombre" }}
                                error={!!touched.nombre && !!errors.nombre}
                                helperText={touched.nombre && errors.nombre}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Apellido</Typography>
                            <TextField 
                                name="apellido" 
                                placeholder="Ej: Bustamante" 
                                value={formData.apellido} 
                                onChange={handleChange} 
                                fullWidth 
                                inputProps={{"aria-label": "apellido"}} 
                                error={!!touched.apellido && !!errors.apellido}
                                helperText={touched.apellido && errors.apellido}
                                className="inside-paper"
                                disabled={loading} 
                            />
                        </Grid>                       
                    </Grid>

                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>DNI</Typography>
                            <TextField
                                name="dni"
                                placeholder="Ej: 44258393"
                                value={formData.dni}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "dni" }}
                                error={!!touched.dni && !! errors.dni}
                                helperText={touched.dni && errors.dni}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Fecha de nacimiento</Typography>
                            <TextField
                                name="fecha_nacimiento"
                                placeholder="xx-xx-xx"
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "fecha_nacimiento" }}
                                error={!!touched.fecha_nacimiento && !! errors.fecha_nacimiento}
                                helperText={touched.fecha_nacimiento && errors.fecha_nacimiento}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos de la licencia</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Licencia</Typography>                                  
                             <TextField
                                name="licencia"
                                placeholder="Pj: 123AB456"
                                value={formData.licencia}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "licencia" }}
                                error={!!touched.licencia && !! errors.licencia}
                                helperText={touched.licencia && errors.licencia}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Tipo de licencia</Typography>
                            
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Información de Contacto</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Telefono</Typography>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={mostrarCodigoArea ? 3 : 4}>
                                    <TextField
                                        name="contacto.telefono.codigo_pais"
                                        placeholder="+ 54"
                                        value={formData.telefono?.codigo_pais || ""}
                                        onChange={handleChange}
                                        fullWidth 
                                        inputProps={{ "aria-label": "telefono.codigo_pais" }}
                                        error={!!touched["telefono.codigo_pais"] && !!errors["telefono.codigo_pais"]}
                                        helperText={touched["telefono.codigo_pais"] && errors["telefono.codigo_pais"]}
                                        className="inside-paper"
                                        disabled={loading}
                                    />  
                                </Grid>
                                {mostrarCodigoArea && (
                                    <Grid item xs={2}>
                                        <TextField
                                            name="telefono.codigo_area"
                                            placeholder="11"
                                            value={formData.telefono?.codigo_area || ""}
                                            onChange={handleChange}
                                            fullWidth 
                                            inputProps={{ "aria-label": "telefono.codigo_area" }}
                                            error={!!touched["telefono.codigo_area"] && !!errors["telefono.codigo_area"]}
                                            helperText={touched["telefono.codigo_area"] && errors["telefono.codigo_area"]}
                                            className="inside-paper"
                                            disabled={loading}
                                        />   
                                    </Grid>
                                )}
                                <Grid item xs={mostrarCodigoArea ? 7 : 8}>
                                    <TextField
                                        name="telefono.numero"
                                        placeholder="55990552"
                                        value={formData.telefono?.numero || ""}
                                        onChange={handleChange}
                                        fullWidth 
                                        inputProps={{ "aria-label": "telefono.numero" }}
                                        error={!!touched["telefono.numero"] && !!errors["telefono.numero"]}
                                        helperText={touched["telefono.numero"] && errors["telefono.numero"]}
                                        className="inside-paper"
                                        disabled={loading}
                                    />           
                                </Grid>
                            </Grid>

                            {(touched['telefono.codigo_pais'] ||
                                touched['telefono.codigo_area'] ||
                                touched['telefono.numero']) && (
                                    <Box sx={{ mt: 1, color: 'error.main', fontSize: '0.75rem' }}>
                                        <ul style={{margin: 0, paddingLeft: '1.25rem'}}>
                                        {errors['telefono.codigo_pais'] && <li>{errors['telefono.codigo_pais']}</li>}
                                        {errors['telefono.codigo_area'] && <li>{errors['telefono.codigo_area']}</li>}
                                        {errors['telefono.numero'] && <li>{errors['.telefono.numero']}</li>}
                                        </ul>
                                    </Box>
                            )}

                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Asignar recursos</Typography>
                    <Grid container spacing={3} mb={4}>

                    </Grid>



                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                        <Button onClick={() => navigate("/drivers")} variant="outlined" disabled={loading}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {isEditing ? "Actualizar" : "Crear"}
                        </Button>
                    </Box>

                </form>

                <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff" }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Paper>
        </>
    )
}*/