import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Paper, TextField, Typography, Backdrop, CircularProgress, Grid, Alert, FormHelperText, Select } from "@mui/material";
import { useFormDriver, ChoferFormData } from '../../hooks/useDriverForm';
import { useChoferControllerFindAll } from "../../api/generated";
import { Controller } from "react-hook-form";

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
                                name="nombre"
                                placeholder="Ej: Carlos"
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
                            {/*<TextField
                                name="tipo_licencia"
                                //placeholder="Pj: 123AB456"
                                value={formData.tipo_licencia}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "tipo_licencia" }}
                                error={!!touched.tipo_licencia && !! errors.tipo_licencia}
                                helperText={touched.tipo_licencia && errors.tipo_licencia}
                                className="inside-paper"
                                disabled={loading}
                            />*/}
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
}