import { Box, Typography, Step, StepLabel, Stepper, Button, Paper, Chip, Stack, Dialog } from '@mui/material';
import { Truck, Package, CheckCircle, CheckSquare, Check } from 'lucide-react';
import { useState } from 'react';
import { ViajeDistribucionDtoEstado } from '../../api/generated';
import { useWatch } from 'react-hook-form';

interface TripStateFlowProps {
  setValue: any;
  control: any;
  initialState: ViajeDistribucionDtoEstado;
}

const states = [
  { value: 'iniciado', label: 'Iniciado', icon: <Truck size={24} />, description: 'Viaje registrado, pendiente de carga.' },
  { value: 'inicio de carga', label: 'Inicio de Carga', icon: <Package size={24} />, description: 'El vehículo comenzó a cargar los productos.' },
  { value: 'fin de carga', label: 'Fin de Carga', icon: <CheckCircle size={24} />, description: 'La carga ha sido completada y verificada.' },
  { value: 'fin de viaje', label: 'Fin de Viaje', icon: <CheckSquare size={24} />, description: 'El viaje ha concluido exitosamente.' }
];

export function TripStateFlow({ setValue, control, initialState }: TripStateFlowProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Estado actual del viaje
  const currentState = useWatch({ control, name: 'estado', defaultValue: initialState });

  const currentIndex = states.findIndex(s => s.value === currentState);
  const nextState = currentIndex >= 0 && currentIndex < states.length - 1 ? states[currentIndex + 1] : null;

  const handleStateChange = async (nuevoEstado: ViajeDistribucionDtoEstado) => {
    setDialogOpen(false);

    setValue('estado', nuevoEstado);
    
  };


  return (
    <Paper
      elevation={1}
      sx={{
        py: 3,
        px: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        mb: 3,
        maxWidth: '900px',
        mx: 'auto',
        boxShadow: 'none',
      }}
    >
      
      <Box textAlign="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Estado actual
        </Typography>
        {/* <Chip
          label={states[currentIndex].label}
          color="primary"
          sx={{ mt: 1, fontWeight: 'bold' }}
        /> */}
      </Box>
      {/* Header con icono + estado */}
      {/* <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {states[currentIndex].label}
        </Typography>
      </Stack> */}
      {/* Stepper */}
      <Stepper activeStep={currentIndex} alternativeLabel>
        {states.map((state, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <Step key={state.value} completed={index < currentIndex}>
              <StepLabel
                  icon={
                    <Box
                      sx={{
                      color: isCompleted ? 'success.main' : isCurrent ? 'primary.main' : 'grey.400',
                    }}
                  >
                    {isCompleted ? <CheckCircle size={24} /> : state.icon}
                  </Box>
                }
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isCurrent ? 'bold' : 'normal',
                    color: isCompleted ? 'success.main' : isCurrent ? 'primary.main' : 'grey.400',
                  }}
                >
                  {state.label}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {/* Descripción */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textAlign: 'center', mx: 'auto', display: 'block', mt: 2, fontSize: '0.8rem' }}
      >
        {states[currentIndex]?.description}
      </Typography>

      {/* Acción / próximo paso */}
      <Box textAlign="center" mt={3}>
        {nextState ? (
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            sx={{ px: 4, textTransform: 'none' }}
          >
            Avanzar a {nextState.label}
          </Button>
        ) : (
          <Chip
            icon={<Check size={18} />}
            label="Viaje Completado"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 'bold' , px: 1, py: 1, display: 'flex', alignItems: 'center', gap: 0.5, mx: 'auto', width: 'fit-content' }}
          />
        )}
      </Box>

      <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Confirmar cambio de estado
            </Typography>
          </Box>
          <Box sx={{ px: 3, pb: 2 }}>
            <Typography variant="body1" gutterBottom>
              ¿Estás seguro que deseas cambiar el estado a "{nextState?.label}"?
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (nextState) handleStateChange(nextState.value as ViajeDistribucionDtoEstado);
              }}
              variant="contained"
            >
              Confirmar
            </Button>
          </Box>
        </Dialog>
    </Paper>
  );
}
