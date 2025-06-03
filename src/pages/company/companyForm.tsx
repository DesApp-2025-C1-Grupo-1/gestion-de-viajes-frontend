import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Paper, TextField, Typography, Backdrop, CircularProgress, Grid, Alert, InputAdornment } from "@mui/material";
import { CreateEmpresaSchema } from "../../api/schemas";
import { useCompanyForm } from "../../hooks/useCompanyForm";

export default function CompanyFormPage() {
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
        watch,
    } = useCompanyForm(id);

    if (isLoading) return <CircularProgress />;
    if (formError) return (
        <Alert severity="error">
            {typeof formError === "string"
                    ? formError
                    : formError?.message || "Error al cargar el formulario."
            }
        </Alert>
    );

    const handleFormSubmit = (data: CreateEmpresaSchema) => {
        onSubmit(data);
    };

    const codigoPais = watch("contacto.telefono.codigo_pais")
    const mostrarCodigoArea = codigoPais === "54";

    return(
        <>
            <SectionHeader
                title={isEditing ? "Editar empresa transportista" : "Crear empresa transportista"}
                description={isEditing ? "Modifica los datos de la empresa transportista." : "Registrar nueva empresa transportista."}
            />
            <Paper sx={{maxHeight:"85%", padding: 4, overflow: "auto", mx: 'auto', width: "100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5 }} >
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-[800px] mx-auto">

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos de la Empresa</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Razon social</Typography>
                            <TextField
                                id="razon_social" 
                                placeholder="Ej: Transportes del sur SA"
                                {...register("razon_social")}
                                fullWidth 
                                error={!!formErrors.razon_social}
                                helperText={formErrors.razon_social?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Nombre comercial</Typography>
                            <TextField
                                id="nombre_comercial" 
                                placeholder="Ej: Transportes del sur"
                                {...register("nombre_comercial")}
                                fullWidth 
                                error={!!formErrors.nombre_comercial}
                                helperText={formErrors.nombre_comercial?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>                       
                    </Grid>

                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>CUIT/RUT</Typography>
                            <TextField
                                id="cuit" 
                                placeholder="Ej: 27-44258393-0"
                                {...register("cuit")}
                                fullWidth 
                                error={!!formErrors.cuit}
                                helperText={formErrors.cuit?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Domicilio Fiscal</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={8}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Calle</Typography>
                            <TextField
                                id="direccion.calle" 
                                placeholder="Ej: Vergara"
                                {...register("direccion.calle")}
                                fullWidth 
                                error={!!formErrors.direccion?.calle}
                                helperText={formErrors.direccion?.calle?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Numero</Typography>
                            <TextField
                                id="direccion.numero" 
                                placeholder="Ej: 151"
                                {...register("direccion.numero")}
                                fullWidth 
                                error={!!formErrors.direccion?.numero}
                                helperText={formErrors.direccion?.numero?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Ciudad</Typography>
                            <TextField
                                id="direccion.ciudad" 
                                placeholder="Ej: Villa Tesei"
                                {...register("direccion.ciudad")}
                                fullWidth 
                                error={!!formErrors.direccion?.ciudad}
                                helperText={formErrors.direccion?.ciudad?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Estado/provincia</Typography>
                            <TextField
                                id="direccion.estado_provincia" 
                                placeholder="Ej: Buenos Aires"
                                {...register("direccion.estado_provincia")}
                                fullWidth 
                                error={!!formErrors.direccion?.estado_provincia}
                                helperText={formErrors.direccion?.estado_provincia?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Pais</Typography>
                            <TextField
                                id="direccion.pais" 
                                placeholder="Ej: Argentina"
                                {...register("direccion.pais")}
                                fullWidth 
                                error={!!formErrors.direccion?.pais}
                                helperText={formErrors.direccion?.pais?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Información de Contacto</Typography>
                     
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Nombre de contacto</Typography>
                            <TextField
                                id="contacto.nombre" 
                                placeholder="Ej: Administrador"
                                {...register("contacto.nombre")}
                                fullWidth 
                                error={!!formErrors.contacto?.nombre}
                                helperText={formErrors.contacto?.nombre?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Correo electrónico</Typography>
                            <TextField
                                id="contacto.email" 
                                placeholder="Ej: contacto@empresa.com"
                                {...register("contacto.email")}
                                fullWidth 
                                error={!!formErrors.contacto?.email}
                                helperText={formErrors.contacto?.email?.message}
                                className="inside-paper"
                                disabled={isLoading}
                            />
                        </Grid>

                        <Grid item xs={12} md={5} >
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>Teléfono</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={mostrarCodigoArea ? 3 : 4}>
                                <TextField
                                    id="contacto.telefono.codigo_pais"
                                    placeholder="54"
                                    fullWidth
                                    className="inside-paper"
                                    {...register("contacto.telefono.codigo_pais")}
                                    error={!!formErrors.contacto?.telefono?.codigo_pais}
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
                                    id="contacto.telefono.codigo_area"
                                    placeholder="11"
                                    fullWidth
                                    className="inside-paper"
                                    {...register("contacto.telefono.codigo_area")}
                                    error={!!formErrors.contacto?.telefono?.codigo_area}
                                    disabled={isLoading}
                                    />
                                </Grid>
                                )}
                                <Grid item xs={mostrarCodigoArea ? 7 : 8}>
                                <TextField
                                    id="contacto.telefono.numero"
                                    placeholder="12345678"
                                    fullWidth
                                    className="inside-paper"
                                    {...register("contacto.telefono.numero")}
                                    error={!!formErrors.contacto?.telefono?.numero}
                                    disabled={isLoading}
                                />
                                </Grid>
                            </Grid>
                            
                            {(formErrors.contacto?.telefono?.codigo_pais ||
                                formErrors.contacto?.telefono?.codigo_area ||
                                formErrors.contacto?.telefono?.numero) && (
                                <Box sx={{ mt: 1, color: 'error.main', fontSize: '0.75rem' }}>
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                        {formErrors.contacto?.telefono?.codigo_pais?.message && (
                                        <li>{formErrors.contacto?.telefono?.codigo_pais?.message}</li>
                                        )}
                                        {formErrors.contacto?.telefono?.codigo_area?.message && (
                                        <li>{formErrors.contacto?.telefono?.codigo_area?.message}</li>
                                        )}
                                        {formErrors.contacto?.telefono?.numero?.message && (
                                        <li>{formErrors.contacto?.telefono?.numero?.message}</li>
                                        )}
                                    </ul>
                                </Box>   
                            )}

                        </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                        <Button onClick={() => navigate("/companies")} variant="outlined" disabled={isLoading}>Cancelar</Button>
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


/*import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Paper, TextField, Typography, Backdrop, CircularProgress, Grid, Alert, FormHelperText } from "@mui/material";
import { useFormCompany } from "../../hooks/useCompanyForm";
import { useEmpresaControllerFindAll} from "../../api/generated";

export default function CompanyFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { formData, errors, loading, touched, handleChange, handleSubmit, isEditing} = useFormCompany(id);

    const { data: companies, isLoading} = useEmpresaControllerFindAll();
    if (isLoading) return <CircularProgress />;

    //if (errors) return <Alert severity="error">Error al cargar empresas</Alert>;

    const codigoPais = formData.contacto?.telefono.codigo_pais || "";
    const mostrarCodigoArea = codigoPais === "54";

    return (
        <>
            <SectionHeader
                title={isEditing ? "Editar empresa transportista" : "Crear empresa transportista"}
                description={isEditing ? "Modifica los datos de la empresa transportista." : "Registrar nueva empresa transportista."}
            />
            <Paper sx={{maxHeight:"85%", padding: 4, overflow: "auto", mx: 'auto', width: "100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5 }} >
                <form onSubmit={handleSubmit} className="w-full max-w-[800px] mx-auto">

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos de la Empresa</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Razon social</Typography>
                            <TextField
                                name="razon_social"
                                placeholder="Ej: Transportes del sur SA"
                                value={formData.razon_social}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "Razon social" }}
                                error={!!touched.razon_social && !!errors.razon_social}
                                helperText={touched.razon_social && errors.razon_social}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Nombre comercial</Typography>
                            <TextField 
                                name="nombre_comercial" 
                                placeholder="Ej: Transportes del sur" 
                                value={formData.nombre_comercial} 
                                onChange={handleChange} 
                                fullWidth 
                                inputProps={{"aria-label": "Nombre comercial"}} 
                                error={!!touched.nombre_comercial && !!errors.nombre_comercial}
                                helperText={touched.nombre_comercial && errors.nombre_comercial}
                                className="inside-paper"
                                disabled={loading} 
                            />
                        </Grid>                       
                    </Grid>

                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>CUIT/RUT</Typography>
                            <TextField
                                name="cuit"
                                placeholder="Ej: 27-44258393-0"
                                value={formData.cuit}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "CUIT/RUT" }}
                                error={!!touched.cuit && !! errors.cuit}
                                helperText={touched.cuit && errors.cuit}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Domicilio Fiscal</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={8}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Calle</Typography>
                            <TextField
                                name="direccion.calle"
                                placeholder="Ej: Origone"
                                value={formData.direccion?.calle}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "direccion.calle" }}
                                error={!!touched["direccion.calle"] && !!errors["direccion.calle"]}
                                helperText={touched["direccion.calle"] && errors["direccion.calle"]}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Numero</Typography>
                            <TextField
                                name="direccion.numero"
                                placeholder="Ej: 2372"
                                value={formData.direccion?.numero}
                                onChange={handleChange}
                                
                                fullWidth 
                                inputProps={{ "aria-label": "direccion.numero" }}
                                error={!!touched["direccion.numero"] && !!errors["direccion.numero"]}
                                helperText={touched["direccion.numero"] && errors["direccion.numero"]}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Ciudad</Typography>
                            <TextField
                                name="direccion.ciudad"
                                placeholder="Ej: Villa tesei"
                                value={formData.direccion?.ciudad}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "direccion.ciudad" }}
                                error={!!touched["direccion.ciudad"] && !!errors["direccion.ciudad"]}
                                helperText={touched["direccion.ciudad"] && errors["direccion.ciudad"]}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Estado/provincia</Typography>
                            <TextField
                                name="direccion.estado_provincia"
                                placeholder="Ej: Buenos Aires"
                                value={formData.direccion?.estado_provincia}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "direccion.estado_provincia" }}
                                error={!!touched["direccion.estado_provincia"] && !!errors["direccion.estado_provincia"]}
                                helperText={touched["direccion.estado_provincia"] && errors["direccion.estado_provincia"]}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Pais</Typography>
                            <TextField
                                name="direccion.pais"
                                placeholder="Ej: Argentina"
                                value={formData.direccion?.pais}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "direccion.pais" }}
                                error={!!touched["direccion.pais"] && !!errors["direccion.pais"]}
                                helperText={touched["direccion.pais"] && errors["direccion.pais"]}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Información de Contacto</Typography>
                     
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Nombre de contacto</Typography>
                            <TextField
                                name="contacto.nombre"
                                placeholder="Nombre del responsable"
                                value={formData.contacto?.nombre}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "contacto.nombre" }}
                                error={!!touched["contacto.nombre"] && !!errors["contacto.nombre"]}
                                helperText={touched["contacto.nombre"] && errors["contacto.nombre"]}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={8} xl={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Correo electrónico</Typography>
                            <TextField
                                name="contacto.email"
                                placeholder="transporteDelSur@gmail.com"
                                value={formData.contacto?.email}
                                onChange={handleChange}
                                fullWidth 
                                inputProps={{ "aria-label": "contacto.email" }}
                                error={!!touched["contacto.email"] && !!errors["contacto.email"]}
                                helperText={touched["contacto.email"] && errors["contacto.email"]}
                                className="inside-paper"
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Telefono</Typography>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={mostrarCodigoArea ? 3 : 4}>
                                    <TextField
                                        name="contacto.telefono.codigo_pais"
                                        placeholder="+ 54"
                                        value={formData.contacto?.telefono.codigo_pais || ""}
                                        onChange={handleChange}
                                        fullWidth 
                                        inputProps={{ "aria-label": "contacto.telefono.codigo_pais" }}
                                        error={!!touched["contacto.telefono.codigo_pais"] && !!errors["contacto.telefono.codigo_pais"]}
                                        helperText={touched["contacto.telefono.codigo_pais"] && errors["contacto.telefono.codigo_pais"]}
                                        className="inside-paper"
                                        disabled={loading}
                                    />  
                                </Grid>
                                {mostrarCodigoArea && (
                                    <Grid item xs={2}>
                                        <TextField
                                            name="contacto.telefono.codigo_area"
                                            placeholder="11"
                                            value={formData.contacto?.telefono.codigo_area || ""}
                                            onChange={handleChange}
                                            fullWidth 
                                            inputProps={{ "aria-label": "contacto.telefono.codigo_area" }}
                                            error={!!touched["contacto.telefono.codigo_area"] && !!errors["contacto.telefono.codigo_area"]}
                                            helperText={touched["contacto.telefono.codigo_area"] && errors["contacto.telefono.codigo_area"]}
                                            className="inside-paper"
                                            disabled={loading}
                                        />   
                                    </Grid>
                                )}
                                <Grid item xs={mostrarCodigoArea ? 7 : 8}>
                                    <TextField
                                        name="contacto.telefono.numero"
                                        placeholder="55990552"
                                        value={formData.contacto?.telefono.numero || ""}
                                        onChange={handleChange}
                                        fullWidth 
                                        inputProps={{ "aria-label": "contacto.telefono.numero" }}
                                        error={!!touched["contacto.telefono.numero"] && !!errors["contacto.telefono.numero"]}
                                        helperText={touched["contacto.nombre"] && errors["contacto.nombre"]}
                                        className="inside-paper"
                                        disabled={loading}
                                    />           
                                </Grid>
                            </Grid>

                            {(touched['contacto.telefono.codigo_pais'] ||
                                touched['contacto.telefono.codigo_area'] ||
                                touched['contacto.telefono.numero']) && (
                                    <Box sx={{ mt: 1, color: 'error.main', fontSize: '0.75rem' }}>
                                        <ul style={{margin: 0, paddingLeft: '1.25rem'}}>
                                        {errors['contacto.telefono.codigo_pais'] && <li>{errors['contacto.telefono.codigo_pais']}</li>}
                                        {errors['contacto.telefono.codigo_area'] && <li>{errors['contacto.telefono.codigo_area']}</li>}
                                        {errors['contacto.telefono.numero'] && <li>{errors['contacto.telefono.numero']}</li>}
                                        </ul>
                                    </Box>
                            )}

                        </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                        <Button onClick={() => navigate("/companies")} variant="outlined" disabled={loading}>Cancelar</Button>
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
    );
};*/
