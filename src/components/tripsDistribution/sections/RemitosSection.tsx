import { Grid, Typography, Button, Alert, FormHelperText, AccordionSummary, AccordionDetails, Accordion } from "@mui/material";
import {  ChevronDown, Package } from "lucide-react";
import { useDistributionFormContext, useLocationData } from "../../../contexts/DistributionFormContext";
import { ConditionalField } from "../fields/ConditionalField";
import { useEffect, useMemo, useState } from "react";
import RemitosSelectModal from "../../trip/modals/RemitosSelectModal";
import { CountryProvinceSelect } from "../../trip/CountryProvinceSelect";
import { LocalidadSelect } from "../../trip/LocalidadSelected";
import { useRemitosManagement } from "../../../hooks/tripDistribution/useRemitosManagement";
import OrdenRemitosModal from "./draggable/OrdenRemitosModal";

const depositoSelectButtonStyle = {
  height: "48px",
  textTransform: "none",
  borderRadius: "6px",
  border: "1px solid #C7C7C7",
  textAlign: "left" as const,
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

export default function RemitosSection() {
  const { form, permissions, tripData, setRemitosCompletos } = useDistributionFormContext();
  const{ selectedPais, selectedProvincia, selectedLocalidad, setSelectedPais, setSelectedProvincia, setSelectedLocalidad } = useLocationData();
  const { control,setValue, formState: { errors } } = form.form;
  const [remitosModalOpen, setRemitosModalOpen] = useState(false);
  const [ordenModalOpen, setOrdenModalOpen] = useState(false);

  const {
      remitosSeleccionados,
      remitosDisponibles,
      remitoIds,
      isLoading,
      toggleRemito,
      remitosCompletos,
      reordenarRemitos,
      quitarRemito,
      remitosQuitados,
      restaurarRemito,
      toggleRemitos,
      refrescarRemitos
    } = useRemitosManagement({
      control,
      setValue,
      initialRemitoIds: tripData?.remito_ids,
      selectedProvincia,
      selectedLocalidad
  });

  const tieneRemitosInternacionales = useMemo(() => {
    const paises = [...new Set(remitosSeleccionados.map(r => r.destino?.pais).filter(Boolean))];
    return paises.length > 1 || (paises.length === 1 && paises[0] !== "Argentina");
  }, [remitosSeleccionados]);

  // Efecto simplificado
  useEffect(() => {
    const nuevoTipoViaje = tieneRemitosInternacionales ? "internacional" : "nacional";
    setValue("tipo_viaje", nuevoTipoViaje);
  }, [tieneRemitosInternacionales, setValue, remitosSeleccionados]);

  useEffect(() => {
    setRemitosCompletos(remitosCompletos);
  }, [remitosCompletos, setRemitosCompletos]);

      const bloqueada = !permissions.canEditRemitos && !permissions.canEditPais 
  const [expanded, setExpanded] = useState(!bloqueada);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Accordion
        expanded={!bloqueada && expanded}    // si bloqueada = true → nunca se abre
        onChange={!bloqueada ? handleChange : undefined}
        elevation={0}
        disableGutters
        square
        sx={{
          backgroundColor: "transparent",
          "&:before": { display: "none" }, // quita la línea gris superior
          mb: 0,
        }}
      >
      <AccordionSummary
        expandIcon={!bloqueada ? <ChevronDown /> : null}
        sx={{
          px: 0,
          cursor: bloqueada ? "default" : "pointer",
          color: "#5A5A65",
          fontWeight: 600,
          opacity: 1,                 // <- fuerza a no verse gris
          backgroundColor: "transparent !important", 
          "&.Mui-disabled": {
            opacity: 1,               // <- evita el gris de MUI
            backgroundColor: "transparent",
          },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#5A5A65",
              fontWeight: 550,
              fontSize: "1.4rem",
              mb: bloqueada ? 0 : 2,
            }}
          >
            Asignar Remitos
          </Typography>

          {bloqueada && (
            <Typography
              sx={{
                color: "#8A8A95",
                fontSize: "0.85rem",
                mt: 0.5,
              }}
            >
              No tiene permisos para editar recursos, el estado del viaje no lo permite.
            </Typography>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails sx={{padding: 0}}>
        <Grid container spacing={3}>

          {permissions.canEditPais && (
            <>
              <CountryProvinceSelect
                selectedProvincia={selectedProvincia? selectedProvincia : null}
                setSelectedProvincia={setSelectedProvincia}
                selectedPais={selectedPais? selectedPais : ""}
                setSelectedPais={setSelectedPais}
                setSelectedLocalidad={setSelectedLocalidad}
                permissions={permissions}
              />
              <LocalidadSelect
                selectedPais={selectedPais}
                selectedLocalidad={selectedLocalidad}
                setSelectedLocalidad={setSelectedLocalidad}
                selectedProvincia={selectedProvincia}
                permissions={permissions}
              />
            </>  
          )}  

          {/* Botón para abrir modal */}
          <Grid item xs={12}>
            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>Remitos</Typography>
            <ConditionalField permission={permissions.canEditRemitos} fieldName="remitos">
              <Button
                fullWidth
                onClick={() => setRemitosModalOpen(true)}
                sx={{ 
                  ...depositoSelectButtonStyle, 
                  color: remitoIds.length > 0 ? "#5A5A65" : "#c7c7c7" 
                }}
                variant="outlined"
                disabled={!selectedProvincia}
              >
                <span className={remitoIds.length > 0 ? "text-gray-900" : "text-gray-500"}>
                  {isLoading ? "Cargando..." : remitoIds.length > 0
                    ? `${remitoIds.length} remito${remitoIds.length !== 1 ? "s" : ""} seleccionado${remitoIds.length !== 1 ? "s" : ""}`
                    : remitosDisponibles.length > 0 ? "Seleccionar Remitos" : "Sin remitos disponibles"}
                </span>
                <Package className="h-4 w-4 text-gray-400" />
              </Button>
              <FormHelperText error={!!errors.remito_ids?.message}>
                {errors.remito_ids?.message}
              </FormHelperText>
              {!remitosDisponibles.length && selectedProvincia && !isLoading && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  No hay remitos disponibles para {selectedProvincia.nombre} {selectedLocalidad && `en ${selectedLocalidad.nombre}`}.
                </Alert>
              )}
            </ConditionalField>
          



          </Grid>
        </Grid>
      </AccordionDetails>
      </Accordion>
        
      <Button 
        variant="contained" 
        onClick={() => setOrdenModalOpen(true)}
        sx={{ my: 3, boxShadow: 'none', ":hover": { boxShadow: 'none', backgroundColor: "#C94715" }, py: 1 }}
        disabled={remitoIds.length === 0}
        fullWidth
      >
        Editar orden de entrega
      </Button>

      <OrdenRemitosModal 
        open={ordenModalOpen} 
        onClose={() => setOrdenModalOpen(false)} 
        estadoViaje={tripData?.estado || ""}
        remitos={remitosSeleccionados}
        remitoIds={remitoIds}
        onReorderRemitos={reordenarRemitos}
        onToggleRemito={toggleRemito}
        remitosQuitados={remitosQuitados}
        restaurarRemito={restaurarRemito}
        quitarRemito={quitarRemito}
        setRemitosCompletos={setRemitosCompletos}
        refrescarRemitos={refrescarRemitos}
      />

      <RemitosSelectModal
        open={remitosModalOpen}
        onOpenChange={setRemitosModalOpen}
        availableRemitos={remitosDisponibles}
        selectedRemitos={remitoIds}
        onRemitoToggle={toggleRemito}
        onConfirm={(nuevosIds) => {
          setValue("remito_ids", nuevosIds, { shouldValidate: true });
          setRemitosModalOpen(false);
        }}
        onRemitosToggle={toggleRemitos}
        targetProvince={selectedProvincia ? selectedProvincia.nombre : ""}      
      />


    </>
  );
}