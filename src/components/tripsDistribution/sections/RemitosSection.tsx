import { Grid, Typography, Button, Alert, FormHelperText } from "@mui/material";
import { Package } from "lucide-react";
import { useDistributionFormContext, useLocationData } from "../../../contexts/DistributionFormContext";
import { ConditionalField } from "../fields/ConditionalField";
import { useEffect, useMemo, useState } from "react";
import RemitosSelectModal from "../../trip/modals/RemitosSelectModal";
import { CountryProvinceSelect } from "../../trip/CountryProvinceSelect";
import { RemitoDto, useRemitosControllerGetRemitos } from "../../../api/generated";
import { LocalidadSelect } from "../../trip/LocalidadSelected";
import { useWatch } from "react-hook-form";

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
  const { form, permissions, tripData} = useDistributionFormContext();
  const{ selectedPais, selectedProvincia, selectedLocalidad, setSelectedPais, setSelectedProvincia, setSelectedLocalidad } = useLocationData();
  const { control,setValue, watch, formState: { errors } } = form.form;
  
  const [remitosModalOpen, setRemitosModalOpen] = useState(false);
  const selectedRemitosTrip : number[] = useWatch({control,  name: "remito_ids" });
  const [selectedRemitos, setSelectedRemitos] = useState<number[]>(tripData?.remito_ids || selectedRemitosTrip || []);
  const [todosLosRemitos, setTodosLosRemitos] = useState<RemitoDto[]>([]);


  const { data: remitos, isLoading: loading } = useRemitosControllerGetRemitos(
    {
      provincia: selectedProvincia ? selectedProvincia.nombre : undefined,
      localidad: selectedLocalidad ? selectedLocalidad.nombre : undefined,
      estadoId: 2, // Asumiendo que 2 es el ID para "En preparación"
    },
    {
      query: {
          enabled: !!selectedPais && !!selectedProvincia, // solo fetch si hay país + provincia
      },
    }
  );

  const availableRemitos: RemitoDto[] = remitos?.data.data || [];

  useEffect(() => {
    if (availableRemitos.length > 0) {
      setTodosLosRemitos(prev => {
        // Combinar remitos existentes con nuevos, evitando duplicados
        const nuevosRemitos = availableRemitos.filter(newRemito => 
          !prev.some(existingRemito => existingRemito.id === newRemito.id)
        );
        return [...prev, ...nuevosRemitos];
      });
    }
  }, [availableRemitos]);

 const remitosPorPais = useMemo(() => {
    if (selectedRemitos.length === 0) return {};
    
    const conteo: { [pais: string]: number } = {};
    
    selectedRemitos.forEach(remitoId => {
      const remito = todosLosRemitos.find(r => r.id === remitoId);
      if (remito?.destino?.pais) {
        const pais = remito.destino.pais;
        conteo[pais] = (conteo[pais] || 0) + 1;
      }
    });
    
    return conteo;
  }, [selectedRemitos, todosLosRemitos]); // ✅ No depende de availableRemitos

  // DETERMINAR SI ES INTERNACIONAL
  const tieneRemitosInternacionales = useMemo(() => {
    const paises = Object.keys(remitosPorPais);
    
    if (paises.length === 0) return false;
    
    return paises.length > 1 || (paises.length === 1 && paises[0] !== "Argentina");
  }, [remitosPorPais]);

  // 🔥 EFECTO CORREGIDO - SOLO ACTUALIZAR CUANDO CAMBIAN LOS REMITOS SELECCIONADOS
  useEffect(() => {
    const nuevoTipoViaje = tieneRemitosInternacionales ? "internacional" : "nacional";
    const tipoViajeActual = watch("tipo_viaje");
    
    if (nuevoTipoViaje !== tipoViajeActual) {
      setValue("tipo_viaje", nuevoTipoViaje);
    }
  }, [tieneRemitosInternacionales, setValue]); // ✅ Solo estas dependencias

  const tieneRemitosDisponibles = availableRemitos.length > 0;

  const handleRemitoToggle = (remitoId: number) => {
    setSelectedRemitos((prev) => (prev.includes(remitoId) ? prev.filter((id) => id !== remitoId) : [...prev, remitoId]))
  }

  const handleConfirmRemitos = (remitos: number[]) => {
    setSelectedRemitos(remitos);
    setValue("remito_ids", remitos);
    setRemitosModalOpen(false);
  };



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

        <CountryProvinceSelect
          selectedProvincia={selectedProvincia? selectedProvincia : null}
          setSelectedProvincia={setSelectedProvincia}
          selectedPais={selectedPais? selectedPais : ""}
          setSelectedPais={setSelectedPais}
          setSelectedLocalidad={setSelectedLocalidad}
        />

        <LocalidadSelect
          selectedPais={selectedPais}
          selectedLocalidad={selectedLocalidad}
          setSelectedLocalidad={setSelectedLocalidad}
          selectedProvincia={selectedProvincia}
        />

        <Grid item xs={12}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Remitos
          </Typography>
          <ConditionalField 
            permission={permissions.canEditRemitos}
            fieldName="remitos"
          >
            <Button
              fullWidth
              onClick={() => setRemitosModalOpen(true)}
              sx={{ 
                ...depositoSelectButtonStyle, 
                color: selectedRemitos.length > 0 ? "#5A5A65" : "#c7c7c7" 
              }}
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
                No hay remitos disponibles para {selectedProvincia.nombre}.
              </Alert>
            )}
            <FormHelperText error={!!errors.remito_ids?.message}>
              {errors.remito_ids?.message}
            </FormHelperText>
          </ConditionalField>
        </Grid>
      </Grid>

      <RemitosSelectModal
        open={remitosModalOpen}
        onOpenChange={setRemitosModalOpen}
        availableRemitos={availableRemitos}
        selectedRemitos={selectedRemitos}
        onConfirm={handleConfirmRemitos} 
        onRemitoToggle={handleRemitoToggle}
        targetProvince={selectedProvincia ? selectedProvincia.nombre : ""}      
        />
    </>
  );
}