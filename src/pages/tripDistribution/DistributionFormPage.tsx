import { useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Alert, Backdrop, Button, CircularProgress, FormHelperText, Grid, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTripDistributionForm } from "../../hooks/useTripDistributionForm";
import { DepositoSelectModal } from "../../components/DepositSelectModal";
import FormActions from "../../components/deposit/FormActions";
import { CreateViajeDistribucionSchema } from "../../api/schemas/viajeDistribucion.schema";
import RemitosSelectModal from "../../components/trip/modals/RemitosSelectModal";
import {Remito} from "../../services/remitos"
import { Package } from "lucide-react";
import { CountryProvinceSelect } from "../../components/trip/CountryProvinceSelect";
import { ZonaTarifaSelect } from "../../components/trip/ZonaTarifaSelect";
import { Localidad, Provincia} from "../../hooks/useGeoref";
import { LocalidadSelect } from "../../components/trip/LocalidadSelected";
import { useRemitos } from "../../hooks/useRemitos";
import { toLocalDate, toUTCDate } from "../../lib/formatDate";

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

export default function DistributionFormPage() {
    const {id} = useParams();

    const [modalOpen, setModalOpen] = useState(false);
    const [remitosModalOpen, setRemitosModalOpen] = useState(false);
    const [availableRemitos, setAvailableRemitos] = useState<Remito[]>([])
    const [selectedRemitos, setSelectedRemitos] = useState<number[]>([]);
    const [selectedPais, setSelectedPais] = useState<string>("");
    const [selectedProvincia, setSelectedProvincia] = useState<Provincia | null>(null);
    const [selectedLocalidad, setSelectedLocalidad] = useState<Localidad | null>(null);
    const [selectedZona, setSelectedZona] = useState<number | null>(null);
    const [tarifasDisponibles, setTarifasDisponibles] = useState<any[]>([]);
    const [activeField, setActiveField] = useState<"origen" | "remito_ids" | null>(null);
    const {remitos, loading} = useRemitos(selectedPais, selectedProvincia, selectedLocalidad);

    const {
        handleSubmit,
        onSubmit,
        isEditing,
        formErrors,
        control,
        companies, 
        clearErrors,
        depots,
        isSubmitting,
        setError,
        errorCompanies,
        errorVehicles,
        errorDrivers,
        errorDepots,
        isLoading,
        filteredChoferes,
        filteredVehiculos,
        filterByCompany,
        handleSelectChofer,
        register,
        setValue,
        typeOfVehicleId,
        setTypeOfVehicleId,
    } = useTripDistributionForm(id);

    const selectedOrigen = useWatch({ control, name: "origen" });

    const tipoViaje = useWatch({ control, name: "tipo_viaje" });
    const transportistaId = useWatch({ control, name: "transportista" });
    const tieneRemitosDisponibles = availableRemitos.length > 0;
    const tieneLocalidadSeleccionada = !!selectedLocalidad;

    useEffect(() => {
        // Cuando cambia el tipo de viaje, resetear la tarifa si ya no es nacional
        if (tipoViaje !== 'nacional') {
            setValue('tarifa_id', '');
            clearErrors('tarifa_id');
        }
    }, [tipoViaje, setValue, clearErrors]);

      // Efecto para limpiar tarifa cuando cambia la zona
    useEffect(() => {
        if (!selectedZona) {
            setValue("tarifa_id", "");
            setTarifasDisponibles([]);
        }
    }, [selectedZona, setValue]);

    // efecto para filtrar remitos
    useEffect(() => {
        setAvailableRemitos(remitos || []);
    }, [remitos]);


    /* if (isLoading || loadingAuxData) return <CircularProgress />; */
    if (errorCompanies || errorVehicles || errorDrivers || errorDepots) return (
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
                : "Error desconocido."
            }
        </Alert>
    );

    const handleFormSubmit = (data: CreateViajeDistribucionSchema) => {

        // Validación manual de tarifa para viajes nacionales
        if (data.tipo_viaje === 'nacional' && (!data.tarifa_id || data.tarifa_id.trim() === '')) {
            setError('tarifa_id', {
                type: 'manual',
                message: 'La tarifa es obligatoria para viajes nacionales'
            });
            return; // Detener el envío
        }
        onSubmit(data);
    };

    const handleRemitoToggle = (remitoId: number) => {
        setSelectedRemitos((prev) => (prev.includes(remitoId) ? prev.filter((id) => id !== remitoId) : [...prev, remitoId]))
    }

    const handleConfirmRemitos = (remitos: number[]) => {
        setSelectedRemitos(remitos);
        setValue("remito_ids", remitos);
    };

    return <>
        <SectionHeader 
        title={isEditing ? "Editar Viaje de Distribución" : "Registrar Viaje de Distribución"}
        description={isEditing ? "Actualizá los datos del viaje de distribución registrado." : "Completá el formulario para dar de alta un viaje de distribución."}
        />
        <Paper sx={{ padding: 4, mx: 'auto', width: "100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "1px solid #C7C7C7", backgroundClip: "padding-box"}} >
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
                        
                        </LocalizationProvider>
                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Depósito de Origen</Typography>
                            <Button
                                fullWidth
                                onClick={() => {
                                    setModalOpen(true);
                                    setActiveField("origen");
                                }}
                                sx={{ ...depositoSelectButtonStyle, color: selectedOrigen ? "#5A5A65" : "#c7c7c7" }}
                                variant="outlined"
                            >
                                {selectedOrigen ?
                                    depots?.data?.find(dep => dep._id === selectedOrigen)?.nombre : "Seleccionar Depósito"
                                }
                            </Button>
                                                                
                            <FormHelperText error={!!formErrors.origen}>
                                {formErrors.origen?.message}
                            </FormHelperText>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Kilómetros del camión</Typography>
                            <TextField className="inside-paper" 
                                id="kilometros" 
                                type="number" 
                                placeholder="Ingresar km del camión" 
                                {...register("kilometros", {
                                    valueAsNumber: true,
                                    validate: (value) =>
                                    !isNaN(value) && value >= 0.01 || "Mínimo 0.01 kms",
                                })} 
                                fullWidth 
                                inputProps={{
                                    "aria-label": "Kilómetros del camión",
                                    step: "0.01",
                                    min: "0.01"
                                }} 
                                error={!!formErrors.kilometros}
                                helperText={formErrors.kilometros?.message}
                        />
                        </Grid>
                    </Grid>

                    {/*EMPRESA - CHOFER - VEHICULO*/}
                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Asignar Recursos</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={6}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Empresa Transportista</Typography>
                                <Controller
                                control={control}
                                name="transportista"
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
                                    error={!!formErrors.transportista}
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
                            <FormHelperText error={!!formErrors.transportista}>
                                {formErrors.transportista?.message}
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
                                    disabled={!control._formValues.transportista}
                                    error={!!formErrors.chofer}
                                    >
                                        <MenuItem value="" disabled>
                                            {control._formValues.transportista ? "Seleccione un chofer" : "Seleccione una empresa primero"}
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
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Vehículo a utilizar</Typography>
                                <Controller
                                control={control}
                                name="vehiculo"
                                render={({ field }) => (
                                    <Select
                                    {...field}
                                    value={field.value || ""}
                                    fullWidth
                                    displayEmpty
                                    onChange={(event) => {
                                        field.onChange(event.target.value)
                                        setTypeOfVehicleId(filteredVehiculos.find(v => v._id === event.target.value)?.tipo._id || "");
                                    }}
                                    disabled={!control._formValues.transportista}
                                    error={!!formErrors.vehiculo}
                                    >
                                        <MenuItem value="" disabled>
                                            {control._formValues.transportista ? "Seleccione un vehículo" : "Seleccione una empresa primero"}
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

                    {/*Pais, Provincia y Remitos*/}
                    <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2 }}>Asignar Remitos</Typography>
                    <Grid container spacing={3} mb={4}>
                        <CountryProvinceSelect
                            selectedPais={selectedPais}
                            setSelectedPais={setSelectedPais}
                            selectedProvincia={selectedProvincia}
                            setSelectedProvincia={setSelectedProvincia}
                            setSelectedLocalidad={setSelectedLocalidad}
                        />

                        {/* Seleccionar localidad */}
                        <LocalidadSelect
                            selectedProvincia={selectedProvincia}
                            selectedPais={selectedPais}
                            selectedLocalidad={selectedLocalidad}
                            setSelectedLocalidad={setSelectedLocalidad}
                        />

                        <Grid item xs={12}>
                            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Remitos</Typography>
                            <Button
                                fullWidth
                                onClick={() =>{ 
                                    availableRemitos.length > 0 && setRemitosModalOpen(true)
                                }}
                                sx={{ ...depositoSelectButtonStyle, color: selectedRemitos ? "#5A5A65" : "#c7c7c7" }}
                                variant="outlined"
                                disabled={!selectedProvincia}
                            >
                                <span className={selectedRemitos.length > 0 ? "text-gray-900" : "text-gray-500"}>
                                    {loading ? "Cargando..." : selectedRemitos.length > 0
                                    ? `${selectedRemitos.length} remito${selectedRemitos.length !== 1 ? "s" : ""} seleccionado${selectedRemitos.length !== 1 ? "s" : ""}`
                                    : tieneRemitosDisponibles ? "Seleccionar Remitos" : "Sin remitos disponibles"}
                                </span>
                                <Package className="h-4 w-4 text-gray-400" />
                            </Button>
                            {!tieneRemitosDisponibles && selectedProvincia && !loading && (
                                <Alert severity="info" sx={{ mt: 1 }}>
                                    No hay remitos disponibles para {tieneLocalidadSeleccionada ? selectedLocalidad.nombre : selectedProvincia.nombre}.
                                </Alert>
                            )}
                            <FormHelperText error={!!formErrors.remito_ids}>
                                {formErrors.remito_ids?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>

                    {selectedPais === "ARG" && (
                        <ZonaTarifaSelect
                            control={control}
                            formErrors={formErrors}
                            empresaId={transportistaId}
                            vehiculoId={typeOfVehicleId}
                            selectedPais={selectedPais}
                            selectedZona={selectedZona}
                            setSelectedZona={setSelectedZona}
                            tarifasDisponibles={tarifasDisponibles}
                            setTarifasDisponibles={setTarifasDisponibles}
                            setValues={setValue}
                        />
                    )}  

                    <FormActions
                        isEditing={isEditing}
                        loading={isLoading}
                        isSubmitting={isSubmitting}
                    />

                </form>

                <Backdrop open={isLoading} sx={{ zIndex: 9999, color: "#fff" }}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <DepositoSelectModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    depots={depots?.data || []}
                    selectedId={selectedOrigen}
                    onSelect={(id) => {
                        if (activeField) {
                            setValue(activeField, id);
                        }
                        setModalOpen(false);
                    }}
                    title="Seleccionar depósito de origen"
                />

                <RemitosSelectModal
                    open={remitosModalOpen}
                    onOpenChange={setRemitosModalOpen}
                    availableRemitos={availableRemitos}
                    selectedRemitos={selectedRemitos}
                    onRemitoToggle={handleRemitoToggle}
                    targetProvince={selectedProvincia?.nombre || ""}
                    onConfirm={handleConfirmRemitos}
                />

        </Paper>
    </>;
}