import { SectionHeader } from "../../components/SectionHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Paper, Select, MenuItem, Typography, Backdrop, CircularProgress, Grid, Alert, FormHelperText, Button} from "@mui/material";
import { useTripForm } from "../../hooks/useTripForm";
import { Controller, useWatch } from "react-hook-form";
import { CreateViajeSchema } from "../../api/schemas";
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FormActions from "../../components/deposit/FormActions";
import { useState } from "react";
import { DepositoSelectModal } from "../../components/DepositSelectModal";
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const depositoSelectButtonStyle = {
  height: "48px",
  textTransform: "none",
  color: (theme: any) => (theme.selected ? "#5A5A65" : "#c7c7c7"),
  borderRadius: "6px",
  border: "1px solid #C7C7C7",
  textAlign: "left",
  display: "flex",
  justifyContent: "space-between",
  padding: "0 16px",
  fontSize: "1rem",
  fontWeight: 400,
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#fff",
    borderColor: "#5A5A65",
  },
};

export default function TripFormPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const {
        handleSubmit,
        onSubmit,
        isEditing,
        formErrors,
        control,
        isLoading,
        error: formError,
        companies, 
        depots,
        isSubmitting,
        errorCompanies,
        errorVehicles,
        errorDrivers,
        errorDepots,
        loadingAuxData,
        filteredChoferes,
        filteredVehiculos,
        filterByCompany,
        handleSelectChofer,
        setValue,
    } = useTripForm(id);

    const [activeField, setActiveField] = useState<"deposito_origen" | "deposito_destino" | null>(null);
    const selectedOrigen = useWatch({ control, name: "deposito_origen" });
    const selectedDestino = useWatch({ control, name: "deposito_destino" });

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

    const TIMEZONE = 'America/Argentina/Buenos_Aires';

    const toLocalDate = (input: string | Date): Date => {
        const date = typeof input === 'string' ? new Date(input) : input;
        return utcToZonedTime(date, TIMEZONE);
    };

    const toUTCDate = (input: Date | null): Date | null => {
    if (!input) return null;
    return zonedTimeToUtc(input, TIMEZONE);
    };

    return(
        <>
            <SectionHeader
                title={isEditing ? "Editar Viaje" : "Registrar Viaje"}
                description={isEditing ? "Actualizá los datos del viaje registrado." : "Completá el formulario para dar de alta un viaje."}
            />
            <Paper sx={{maxHeight:"85%", padding: 4, overflow: "auto", mx: 'auto', width: "100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5 }} >
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-[800px] mx-auto">
                    {/* FECHA INICIO FECHA LLEGADA TIPO DE VIAJE*/}
                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Datos del Viaje</Typography>
                    <Grid container spacing={3} mb={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Fecha y hora de inicio</Typography>
                                <Controller
                                    name="fecha_inicio"
                                    control={control}
                                    render={({ field }) => (
                                        <DateTimePicker
                                            {...field}
                                            disabled={isLoading}
                                            value={field.value ?  toLocalDate(field.value) : null}
                                            onChange={(date: Date | null) => field.onChange(toUTCDate(date))}
                                            slotProps={{
                                                textField: {
                                                fullWidth: true,
                                                className: "inside-paper",
                                                error: !!formErrors.fecha_inicio,
                                                helperText: formErrors.fecha_inicio?.message,
                                                },
                                            }}      
                                            format="dd/MM/yyyy HH:mm" 
                                        />
                                    )}
                                />
                            </Grid>
                        
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Fecha y hora de llegada</Typography>
                                <Controller
                                    name="fecha_llegada"
                                    control={control}
                                    render={({ field }) => (
                                        <DateTimePicker
                                            {...field}
                                            disabled={isLoading}
                                            value={field.value ? toLocalDate(new Date(field.value)) : null}
                                            onChange={(date: Date | null) => field.onChange(toUTCDate(date))}
                                            slotProps={{
                                                textField: {
                                                fullWidth: true,
                                                className: "inside-paper",
                                                error: !!formErrors.fecha_llegada,
                                                helperText: formErrors.fecha_llegada?.message,
                                                },
                                            }}        
                                            format="dd/MM/yyyy HH:mm"                
                                        />
                                    )}
                                />
                            </Grid>
                        </LocalizationProvider>
                    </Grid>

                    {/* DEPO ORIGEN Y DESTINO */}
                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Asignar Depositos</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Deposito de Origen</Typography>
                            <Button
                                disabled={isLoading}
                                fullWidth
                                onClick={() => {
                                    setModalOpen(true);
                                    setActiveField("deposito_origen");
                                }}
                                sx={{ ...depositoSelectButtonStyle, color: selectedOrigen ? "#5A5A65" : "#c7c7c7" }}
                                variant="outlined"
                            >
                                {selectedOrigen ?
                                    depots?.data?.find(dep => dep._id === selectedOrigen)?.nombre : "Seleccionar Deposito"
                                }
                            </Button>
                                                                
                            <FormHelperText error={!!formErrors.deposito_origen}>
                                {formErrors.deposito_origen?.message}
                            </FormHelperText>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Deposito de Destino</Typography>
                            <Button
                                disabled={isLoading}
                                fullWidth
                                onClick={() => {
                                    setModalOpen(true);
                                    setActiveField("deposito_destino");
                                }}
                                sx={{ ...depositoSelectButtonStyle, color: selectedDestino ? "#5A5A65" : "#c7c7c7"}}
                                variant="outlined"
                            >
                                {selectedDestino
                                    ? depots?.data?.find((d) => d._id === selectedDestino)?.nombre
                                    : "Seleccionar depósito"
                                }
                            </Button>
                                                                
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
                                    onChange={(event) => {
                                        field.onChange(event.target.value)
                                        filterByCompany(event.target.value);
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
                                    onChange={(event) => {
                                        field.onChange(event.target.value)
                                        handleSelectChofer(event.target.value);
                                    }}
                                    disabled={!control._formValues.empresa}
                                    error={!!formErrors.chofer}
                                    >
                                        <MenuItem value="" disabled>
                                            {control._formValues.empresa ? "Seleccione un chofer" : "Seleccione una empresa primero"}
                                        </MenuItem>
                                        {filteredChoferes.length === 0 ? (
                                            <MenuItem disabled>No hay choferes disponibles</MenuItem>
                                        ) :

                                        filteredChoferes.map((dri) => (
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
                                    disabled={!control._formValues.empresa}
                                    error={!!formErrors.vehiculo}
                                    >
                                        <MenuItem value="" disabled>
                                            {control._formValues.empresa ? "Seleccione un vehiculo" : "Seleccione una empresa primero"}
                                        </MenuItem>
                                        {filteredVehiculos.length === 0 ? (
                                            <MenuItem disabled>No hay vehículos disponibles</MenuItem>
                                        ) :
                                        filteredVehiculos.map((veh) => (
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

            <DepositoSelectModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                depots={depots?.data || []}
                selectedId={
                    activeField === "deposito_origen"
                    ? selectedOrigen
                    : activeField === "deposito_destino"
                    ? selectedDestino
                    : undefined
                }
                onSelect={(id) => {
                    if (activeField) {
                        setValue(activeField, id);
                    }
                }}
                title={
                    activeField === "deposito_origen"
                    ? "Seleccionar depósito de origen"
                    : "Seleccionar depósito de destino"
                }
            />

        </>
    )
}