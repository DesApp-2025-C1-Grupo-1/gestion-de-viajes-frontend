// components/distribution-form/sections/TripManagementSection.tsx
import { Grid, Typography, TextField, Button, Box, Alert } from "@mui/material";
import { useDistributionFormContext } from "../../../contexts/DistributionFormContext";
import { useState } from "react";
import { ConditionalField } from "../fields/ConditionalField";

export function TripManagementSection() {
  const { form, permissions, tripData } = useDistributionFormContext();
  const { register, formState: { errors } } = form;
  
  const [isChangingState, setIsChangingState] = useState(false);

  // Estados posibles a los que se puede cambiar
  const getNextPossibleStates = () => {
    const stateFlow = ['iniciado', 'inicio de carga', 'fin de carga', 'fin de viaje'];
    const currentIndex = stateFlow.indexOf(tripData?.estado || 'iniciado');
    
    return stateFlow.slice(currentIndex + 1, currentIndex + 2); // Solo el siguiente estado
  };

  const nextStates = getNextPossibleStates();

  const handleStateChange = async (newState: string) => {
    if (!tripData) return;
    
    setIsChangingState(true);
    try {
      // Aquí iría tu llamada API para cambiar el estado
      console.log(`Cambiando estado a: ${newState}`);
      
      // Validación para "fin de viaje"
      if (newState === 'fin de viaje') {
        const remitosEnCamino = tripData.remitos?.filter((r: any) => 
          r.estadoId !== 4 && r.estadoId !== 5 // 4: ENTREGADO, 5: NO ENTREGADO
        ) || [];
        
        if (remitosEnCamino.length > 0) {
          alert(`No se puede finalizar el viaje. ${remitosEnCamino.length} remito(s) aún en camino.`);
          return;
        }
      }
      
      // Actualizar el estado localmente (luego deberías hacer la llamada API)
      // await api.updateTripState(tripData._id, newState);
      
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setIsChangingState(false);
    }
  };

  const canFinalizeTrip = () => {
    if (tripData?.estado !== 'fin de viaje') return false;
    
    const allRemitosFinalized = tripData.remitos?.every((r: any) => 
      r.estadoId === 4 || r.estadoId === 5 // ENTREGADO o NO ENTREGADO
    );
    
    return allRemitosFinalized;
  };

  return (
    <>
      <Typography variant="h6" sx={{ 
        color: "#5A5A65", 
        fontWeight: 550, 
        fontSize: "1.4rem", 
        mb: 2,
        mt: 4 
      }}>
        Gestión del Viaje
      </Typography>

      <Grid container spacing={3} mb={4}>
        {/* Kilómetros finales - Solo en "fin de viaje" */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Kilómetros finales del camión
          </Typography>
          <ConditionalField 
            permission={permissions.canEditKilometrosFinales}
            fieldName="kilómetros finales"
            reason="Solo editable al finalizar el viaje"
          >
            <TextField 
              fullWidth
              type="number"
              placeholder="Ingresar km finales del camión"
              {...register("kilometros_finales", {
                valueAsNumber: true,
                validate: (value: number) => 
                  !isNaN(value) && value >= 0.01 || "Mínimo 0.01 kms",
              })}
              inputProps={{
                step: "0.01",
                min: "0.01"
              }}
              error={!!errors.kilometros_finales}
              helperText={errors.kilometros_finales?.message}
            />
          </ConditionalField>
        </Grid>

        {/* Observaciones - Siempre editable en gestión */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Observaciones
          </Typography>
          <TextField 
            fullWidth
            multiline
            rows={3}
            placeholder="Agregar observaciones del viaje..."
            {...register("observaciones")}
            error={!!errors.observaciones}
            helperText={errors.observaciones?.message}
          />
        </Grid>

        {/* Cambio de estado - Solo si hay siguientes estados posibles */}
        {nextStates.length > 0 && (
          <Grid item xs={12}>
            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 2 }}>
              Avanzar estado del viaje
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {nextStates.map((state) => (
                <Button
                  key={state}
                  variant="outlined"
                  onClick={() => handleStateChange(state)}
                  disabled={isChangingState}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {isChangingState ? 'Cambiando...' : `Marcar como ${state}`}
                </Button>
              ))}
            </Box>
            
            {/* Información para "fin de viaje" */}
            {nextStates.includes('fin de viaje') && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Para finalizar el viaje, todos los remitos deben estar marcados como ENTREGADOS o NO ENTREGADOS.
              </Alert>
            )}
          </Grid>
        )}

        {/* Información de estado actual */}
        <Grid item xs={12}>
          <Alert 
            severity="info" 
            sx={{ 
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Estado actual: {tripData?.estado || 'iniciado'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {tripData?.estado === 'iniciado' && 'Puedes editar todos los datos del viaje.'}
              {tripData?.estado === 'inicio de carga' && 'El viaje está en proceso de carga. No se pueden modificar los datos principales.'}
              {tripData?.estado === 'fin de carga' && 'La carga ha finalizado. El viaje está en camino.'}
              {tripData?.estado === 'fin de viaje' && 'Viaje finalizado. Solo puedes cargar kilómetros finales y observaciones.'}
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </>
  );
}