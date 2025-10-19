import { Grid, Typography, MenuItem, Select, FormHelperText, Alert, Box } from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import { useDistributionFormContext } from "../../../contexts/DistributionFormContext";
import { ConditionalField } from "../fields/ConditionalField";
import { useEffect, useMemo, useState } from "react";
import { TarifaDto, useTarifasControllerGetTarifaById, useTarifasControllerListarZonas, useTarifasControllerTarifasFiltradas, ZonaDto } from "../../../api/generated";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface TripData {
  tarifa_id?: number;
  tipo_viaje?: string;
}

export default function TariffSection() {
  const context = useDistributionFormContext();
  
  if (!context) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error: No se pudo cargar la sección de tarifas. Contexto no disponible.
      </Alert>
    );
  }

  const { form, permissions, isEditing, tripData} = context;
  
  if (!form || !form.form) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error: No se pudo cargar el formulario de tarifas.
      </Alert>
    );
  }

  const { control, setValue, formState: { errors } } = form.form;
  
  const { data, isLoading: loadingZonas } = useTarifasControllerListarZonas();
  const zonas: ZonaDto[] = data?.data || [];
  const [tarifasDisponibles, setTarifasDisponibles] = useState<TarifaDto[]>([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<number | "">("");
  const [inicializado, setInicializado] = useState(false); // NUEVO: Control de inicialización

  // Watch los valores necesarios para las dependencias
  const tipoViaje = useWatch({ control, name: "tipo_viaje" });
  const transportistaId = useWatch({ control, name: "transportista" });
  const tipoVehiculoId = form.typeOfVehicleId;
  const tarifaId = useWatch({ control, name: "tarifa_id" });

  const safeTripData: TripData = tripData || {};

  const safeIsEditing = Boolean(isEditing);
  const {data: tarifas, isLoading: loadingTarifas, error: errorTarifas} =  useTarifasControllerTarifasFiltradas({
    zona: zonaSeleccionada as number,
    transportista: transportistaId,
    tipoVehiculo: tipoVehiculoId
  }, { query: { enabled: !!zonaSeleccionada } });

  const { data: tarifaActual, isLoading: cargandoTarifaActual } = useTarifasControllerGetTarifaById(
    safeTripData.tarifa_id!,
    { query: { enabled: !!(safeIsEditing && safeTripData.tarifa_id) } }
  );

  const esViajeInternacional = useMemo(() => {
    // Prioridad: valor del formulario > valor de tripData
    if (!tipoViaje && !safeTripData.tipo_viaje) {
      return false; // Valor por defecto si no hay ninguno
    }

    const tipoViajeActual = safeTripData.tipo_viaje || tipoViaje || 'nacional';

    return tipoViajeActual === 'internacional';
  }, [tipoViaje, safeTripData.tipo_viaje]);

  // DEBUG: Mostrar estado de los requisitos
  const tieneRequisitos = transportistaId && tipoVehiculoId;

  // EFECTO 1: Inicializa la zona si estamos editando
  useEffect(() => {
    if (esViajeInternacional || inicializado) return;

    // 🔹 Si estamos editando y ya se obtuvo la tarifa actual
    if (safeIsEditing && tarifaActual) {
      try {
        setZonaSeleccionada(tarifaActual.data?.zonaId);
        setValue("tarifa_id", tarifaActual.data?.id, { shouldValidate: true });
        setInicializado(true);
      } catch (error) {
        setInicializado(true);
      }
    } else if (!safeIsEditing) {
      setInicializado(true);
    }
  }, [safeIsEditing, tarifaActual?.data, esViajeInternacional, setValue, inicializado]);

  // EFECTO 2: Cargar tarifas y seleccionar tarifa existente si aplica
  useEffect(() => {
    if (esViajeInternacional || !zonaSeleccionada) return;

    if (tarifas?.data) {
      setTarifasDisponibles(tarifas.data);

      if (safeIsEditing && safeTripData.tarifa_id && !tarifaId) {
        const tarifaExistente = tarifas.data.find(t => t.id === safeTripData.tarifa_id);
        if (tarifaExistente) {
          setValue("tarifa_id", tarifaExistente.id, { shouldValidate: true });
        }
      }

      setInicializado(true); // solo acá, cuando ya cargaron las tarifas
    }
  }, [tarifas?.data, zonaSeleccionada, esViajeInternacional, safeIsEditing, safeTripData.tarifa_id, tarifaId, setValue]);

  // EFECTO: LIMPIAR CUANDO ES INTERNACIONAL
  useEffect(() => {
    if (esViajeInternacional) {
      setZonaSeleccionada("");
      setValue("tarifa_id", undefined);
      setTarifasDisponibles([]);
      setInicializado(false);
    }
  }, [esViajeInternacional, setValue]);

  // DETERMINAR TARIFA PARA MOSTRAR EN RESUMEN
  const tarifaParaMostrar = useMemo(() => {
    if (tarifaId) {
      return tarifasDisponibles.find(t => t.id === tarifaId);
    }
    if (safeIsEditing && safeTripData.tarifa_id) {
      return tarifasDisponibles.find(t => t.id === safeTripData.tarifa_id);
    }
    return null;
  }, [tarifaId, safeTripData.tarifa_id, safeIsEditing, tarifasDisponibles]);

  // DETERMINAR SI LA ZONA DEBE ESTAR DESHABILITADA
  const zonaDeshabilitada = !tieneRequisitos || 
                         loadingZonas || 
                         (safeIsEditing && !inicializado); // SOLO deshabilitar durante inicialización

  // No mostrar la sección si es internacional
  if (esViajeInternacional) {

    return (
      <Alert severity="info" 
        sx={{ 
          borderLeft: '6px solid #0288d1', 
          backgroundColor: '#e5f6fd' 
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          Viaje Internacional
        </Typography>
        <Typography variant="body2">
          Para viajes internacionales no es necesario seleccionar tarifa.
        </Typography>
      </Alert>
    );
  }

  // Validar si hay zonas disponibles
  const tieneZonas = zonas.length > 0;

  return (
    <>
      <Typography variant="h6" sx={{ 
        color: "#5A5A65", 
        fontWeight: 550, 
        fontSize: "1.4rem", 
        mb: 2 
      }}>
        Tarifa del Viaje
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        {/* Selección de Zona */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Zona de destino
          </Typography>
          <ConditionalField 
            permission={permissions?.canEditTrip}
            fieldName="zona"
          >
            <Select
              value={zonaSeleccionada}
              fullWidth
              displayEmpty
              disabled={zonaDeshabilitada}
              onChange={(e) => {
                const value = e.target.value;
                const nuevaZona = value === "" ? "" : Number(value);
                setZonaSeleccionada(nuevaZona);
                setValue("tarifa_id", undefined);
              }}
            >
              <MenuItem value="" disabled>
                {!tieneRequisitos 
                  ? "Seleccione empresa y vehículo primero" 
                  : loadingZonas 
                    ? "Cargando zonas..." 
                    : safeIsEditing && loadingZonas && !inicializado
                      ? "Cargando configuración..."
                      : "Seleccione una zona"
                }
              </MenuItem>
              
              {zonas.map((zona) => (
                <MenuItem key={zona.id} value={zona.id}>
                  {zona.nombre}
                </MenuItem>
              ))}
            </Select>
            
            {tieneRequisitos && !tieneZonas && !loadingZonas && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                No hay zonas disponibles para la empresa y vehículo seleccionados
              </Alert>
            )}
          </ConditionalField>
        </Grid>

        {/* Selección de Tarifa */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Tarifa aplicable
          </Typography>
          <ConditionalField 
            permission={permissions?.canEditTrip}
            fieldName="tarifa"
          >
            <Controller
              control={control}
              name="tarifa_id"
              render={({ field }) => (
                <Select
                  {...field}
                  value={!zonaSeleccionada || cargandoTarifaActual || loadingTarifas ? "" : field.value}
                  fullWidth
                  displayEmpty
                  disabled={!zonaSeleccionada || loadingTarifas || tarifasDisponibles.length === 0}
                  error={!!errors.tarifa_id}
                >
                  <MenuItem value="" disabled>
                    {!zonaSeleccionada
                      ? "Seleccione una zona primero" 
                      : loadingTarifas || cargandoTarifaActual 
                        ? "Cargando tarifas..." 
                        : tarifasDisponibles.length === 0
                          ? "No hay tarifas disponibles"
                          : "Seleccione una tarifa"
                    }
                  </MenuItem>
                  
                  {tarifasDisponibles.map((tarifa, index) => (
                    <MenuItem key={index} value={tarifa.id}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          ${tarifa.total} - {tarifa.nombreTarifa}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText error={!!errors.tarifa_id}>
              {errors.tarifa_id?.message as string}
            </FormHelperText>
          </ConditionalField>
        </Grid>

        {/* Resumen de tarifa seleccionada */}
        {tarifaParaMostrar && (
          <Grid item xs={12}>
            <Alert  severity="success" sx={{ 
              borderLeft: '6px solid #2F691D', 
              backgroundColor: '#E6F4EA' 
            }}>
              <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                {safeIsEditing && tarifaParaMostrar.id === safeTripData.tarifa_id ? "Tarifa Existente" : "Tarifa Seleccionada"}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography >
                  <strong className="text-[#2F691D]">Nombre:</strong> {tarifaParaMostrar.nombreTarifa}
                </Typography>
                <Typography>
                  <strong className="text-[#2F691D]">Precio Total:</strong> ${tarifaParaMostrar.total}
                </Typography>
                <Typography>
                  <strong className="text-[#2F691D]">Valor Base:</strong> ${tarifaParaMostrar.valorBase}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Incluye {tarifaParaMostrar.adicionales?.length || 0} adicional(es)
                </Typography>
              </Box>
            </Alert>
          </Grid>
        )}
      </Grid>
    </>
  );
}
