import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Paper, TextField, Typography, Backdrop, CircularProgress, Grid, Alert, InputAdornment } from "@mui/material";
import { CreateEmpresaSchema } from "../../api/schemas";
import { useCompanyForm } from "../../hooks/useCompanyForm";
import FormActions from "../../components/deposit/FormActions";

export default function CompanyFormPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {
        handleSubmit,
        onSubmit,
        isEditing,
        formErrors,
        register,
        isLoading,
        error: formError,
        watch,
        isSubmitting,
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
                title={isEditing ? "Editar empresa transportista" : "Registrar empresa transportista"}
                description={isEditing ? "Actualizá los datos de la empresa registrada." : "Completá el formulario para dar de alta una empresa."}
            />
            <Paper sx={{maxHeight:"100%", padding: 4, overflow: "auto", mx: 'auto', width: "100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5 }} >
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-[800px] mx-auto overflow-y-auto">

                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos de la Empresa</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Razón social</Typography>
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
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>Número</Typography>
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
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem' }}>País</Typography>
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
