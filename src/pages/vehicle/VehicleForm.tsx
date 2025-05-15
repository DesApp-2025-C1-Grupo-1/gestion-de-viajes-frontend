import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Paper, TextField, Select, MenuItem, Typography, Backdrop, CircularProgress, Grid} from "@mui/material";
import { companies, vehicleTypes } from "../../lib/mock-data";
import { useVehicleForm } from "../../hooks/useVehicleForm";

export default function VehicleFormPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    
    const {
        formData,
        errors,
        loading,
        touched,
        handleChange,
        handleSelectChange,
        handleSubmit,
        isEditing,
    } = useVehicleForm(id);

    return (
        <>
            <SectionHeader 
                title={isEditing ? "Editar vehículo" : "Crear vehículo"}
                description={isEditing ? "Modifica los datos del vehículo" : "Aquí puedes registrar un nuevo vehículo."}
                buttonText="Volver a vehículos"
                onAdd={() => history.back()}
            />

            <Paper  sx={{maxHeight:"85%", padding:3, overflow:"auto", mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5} }>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Datos personales</Typography>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Patente</Typography>
                            <TextField
                                name="patente" 
                                placeholder="Ingresar" 
                                value={formData.patente} 
                                onChange={handleChange} 
                                fullWidth 
                                inputProps={{ "aria-label": "Patente del vehículo" }}
                                error={!!touched.patente && !!errors.patente}
                                helperText={touched.patente && errors.patente}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3} >
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Modelo</Typography>
                            <TextField  
                                name="modelo" 
                                placeholder="Ingresar" 
                                value={formData.modelo} 
                                onChange={handleChange} 
                                fullWidth 
                                inputProps={{ "aria-label": "Modelo del vehículo" }}
                                error={!!touched.modelo  && !!errors.modelo}
                                helperText={touched.modelo && errors.modelo}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Marca</Typography>
                            <TextField className="inside-paper" name="marca" placeholder="Ingresar" value={formData.marca} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Marca del vehículo" }}
                                error={!!touched.marca  && !!errors.marca}
                                helperText={touched.marca && errors.marca}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Año</Typography>
                            <TextField className="inside-paper"  type="number" name="año" placeholder="Ingresar" value={formData.año} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Año del vehículo" }} 
                                error={!!touched.año  && !!errors.año}
                                helperText={touched.año && errors.año}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Volumen de carga</Typography>
                            <TextField className="inside-paper" name="volumen_carga" type="number" placeholder="Ingresar" value={formData.volumen_carga} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Volumen de carga del vehículo" }} 
                                error={!!touched.volumen_carga  && !!errors.volumen_carga}
                                helperText={touched.volumen_carga && errors.volumen_carga}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Peso de carga</Typography>
                            <TextField className="inside-paper" name="peso_carga" type="number"  placeholder="Ingresar" value={formData.peso_carga} onChange={handleChange} fullWidth inputProps={{ "aria-label": "Peso de carga del vehículo" }} 
                                error={!!touched.peso_carga  && !!errors.peso_carga}
                                helperText={touched.peso_carga && errors.peso_carga}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Asignar recursos</Typography>

                    <Grid container spacing={5} mb={3} > 
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Empresa Transportista</Typography>
                            <Select 
                                name="empresa" 
                                value={formData.empresa ?? ""}
                                fullWidth
                                onChange={handleSelectChange}
                                displayEmpty
                                inputProps={{ "aria-label": "Empresa transportista" }}
                                error={!!touched.empresa && !!errors.empresa}
                                disabled={loading}
                            >
                                {companies.map((empresa) => (
                                    <MenuItem key={empresa._id} value={empresa.nombre_comercial}>
                                        {empresa.nombre_comercial}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography color="error" fontSize={12}>
                                {touched.empresa && errors.empresa}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> 
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Tipo de vehículo a utilizar</Typography>
                            <Select 
                                name="tipo" 
                                value={formData.tipo} 
                                fullWidth
                                onChange={handleSelectChange}
                                displayEmpty
                                inputProps={{ "aria-label": "Tipo de vehículo" }}
                                error={!!errors.tipo && !!touched.tipo}
                                disabled={loading}
                            >
                                {vehicleTypes.map((type) => (
                                    <MenuItem key={type._id} value={type.name}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography color="error" fontSize={12}>
                                {touched.tipo && errors.tipo}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 , mt: 3 }}>
                        <Button onClick={() => navigate("/vehicles")} variant="outlined">Cancelar</Button>
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