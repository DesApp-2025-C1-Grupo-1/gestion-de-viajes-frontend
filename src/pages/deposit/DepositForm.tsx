import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Paper, TextField, Typography, Backdrop, CircularProgress, Grid} from "@mui/material";
import { useDepositForm } from "../../hooks/deposits/useDepositsForm";

export default function DepositFormPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    
    const {
        formData,
        errors,
        loading,
        touched,
        handleChange,
        handleSubmit,
        isEditing,
    } = useDepositForm(id);

    return (
        <>
            <SectionHeader 
                title={isEditing ? "Editar depósito" : "Crear depósito"}
                description={isEditing ? "Modifica los datos del depósito" : "Aquí puedes registrar un nuevo depósito."}
            />

            <Paper  sx={{maxHeight:"85%", padding:3, overflow:"auto", mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5} }>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Datos personales</Typography>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Nombre</Typography>
                            <TextField
                                name="nombre" 
                                placeholder="Ingresar" 
                                value={formData.nombre} 
                                onChange={handleChange} 
                                fullWidth 
                                inputProps={{ "aria-label": "Nombre del depósito" }}
                                error={!!touched.nombre && !!errors.nombre}
                                helperText={touched.nombre && errors.nombre}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3} >
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Dirección</Typography>
                            <TextField  
                                name="direccion" 
                                placeholder="Ingresar" 
                                value={formData.direccion} 
                                onChange={handleChange} 
                                fullWidth 
                                inputProps={{ "aria-label": "Dirección del depósito" }}
                                error={!!touched.direccion  && !!errors.direccion}
                                helperText={touched.direccion && errors.direccion}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Ciudad</Typography>
                            <TextField className="inside-paper" name="ciudad" placeholder="Ingresar" value={formData.ciudad} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Ciudad del depósito" }}
                                error={!!touched.ciudad  && !!errors.ciudad}
                                helperText={touched.ciudad && errors.ciudad}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Estado/Provincia</Typography>
                            <TextField className="inside-paper" name="estado_provincia" placeholder="Ingresar" value={formData.estado_provincia} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Estado/Provincia del depósito" }}
                                error={!!touched.estado_provincia  && !!errors.estado_provincia}
                                helperText={touched.estado_provincia && errors.estado_provincia}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>País</Typography>
                            <TextField className="inside-paper" name="pais" placeholder="Ingresar" value={formData.pais} onChange={handleChange} fullWidth inputProps={{ "aria-label": "País del depósito" }}
                                error={!!touched.pais  && !!errors.pais}
                                helperText={touched.pais && errors.pais}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Tipo</Typography>
                            <TextField className="inside-paper" name="tipo" placeholder="Ingresar" value={formData.tipo} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Tipo del depósito" }}
                                error={!!touched.tipo  && !!errors.tipo}
                                helperText={touched.tipo && errors.tipo}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Latitud</Typography>
                            <TextField className="inside-paper" name="lat" placeholder="Ingresar" value={formData.lat} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Latitud del depósito" }}
                                error={!!touched.lat  && !!errors.lat}
                                helperText={touched.lat && errors.lat}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Longitud</Typography>
                            <TextField className="inside-paper" name="long" placeholder="Ingresar" value={formData.long} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Longitud del depósito" }}
                                error={!!touched.long  && !!errors.long}
                                helperText={touched.long && errors.long}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Horario Entrada</Typography>
                            <TextField className="inside-paper" name="horario_entrada" placeholder="Ingresar" value={formData.horario_entrada} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Horario Entrada del depósito" }}
                                error={!!touched.horario_entrada  && !!errors.horario_entrada}
                                helperText={touched.horario_entrada && errors.horario_entrada}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Horario Salida</Typography>
                            <TextField className="inside-paper" name="horario_salida" placeholder="Ingresar" value={formData.horario_salida} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Horario Salida del depósito" }}
                                error={!!touched.horario_salida  && !!errors.horario_salida}
                                helperText={touched.horario_salida && errors.horario_salida}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Restricciones</Typography>
                            <TextField className="inside-paper" name="restricciones" placeholder="Ingresar" value={formData.restricciones} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Horario Entrada del depósito" }}
                                error={!!touched.restricciones  && !!errors.restricciones}
                                helperText={touched.restricciones && errors.restricciones}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Datos de contacto</Typography>
                    <Grid container spacing={5} mb={3} >
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Nombre</Typography>
                            <TextField className="inside-paper" name="contacto.nombre" placeholder="Ingresar" value={formData.contacto?.nombre} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Nombre del contacto" }}
                                error={!!touched["contacto.nombre"]  && !!errors["contacto.nombre"]}
                                helperText={touched["contacto.nombre"] && errors["contacto.nombre"]}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Teléfono</Typography>
                            <TextField className="inside-paper" name="contacto.telefono" placeholder="Ingresar" value={formData.contacto?.telefono} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Teléfono del contacto" }}
                                error={!!touched["contacto.telefono"]  && !!errors["contacto.telefono"]}
                                helperText={touched["contacto.telefono"] && errors["contacto.telefono"]}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} mb={3} >
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Email</Typography>
                            <TextField className="inside-paper" name="contacto.email" placeholder="Ingresar" value={formData.contacto?.email} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Email del contacto" }}
                                error={!!touched["contacto.email"]  && !!errors["contacto.email"]}
                                helperText={touched["contacto.email"] && errors["contacto.email"]}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
                        
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 , mt: 3 }}>
                        <Button onClick={() => navigate("/depots")} variant="outlined">Cancelar</Button>
                        <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={loading }>
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