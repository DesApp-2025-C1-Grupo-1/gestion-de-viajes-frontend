import { Grid, Typography, Button, Alert, FormHelperText } from "@mui/material";
import {  Package } from "lucide-react";
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
      toggleRemitos
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

  return (
    <>
      <Typography variant="h6" sx={{ 
        color: "#5A5A65", 
        fontWeight: 550, 
        fontSize: "1.4rem", 
        mb: 2 
      }}>
        Asignar Remitos
      </Typography>
      
      <Grid container spacing={3} mb={4}>

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

          <Button 
            variant="contained" 
            onClick={() => setOrdenModalOpen(true)}
            sx={{ mt: 2, boxShadow: 'none', ":hover": { boxShadow: 'none', backgroundColor: "#C94715" }, py: 1 }}
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
          />

        </Grid>

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
      </Grid>
    </>
  );
}