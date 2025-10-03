import { Box, Typography, Step, StepLabel, Stepper, Button, Paper, Chip, Stack, Dialog, TextField } from '@mui/material';
import { Truck, Package, CheckCircle, CheckSquare, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ViajeDistribucionDtoEstado } from '../../api/generated';
import { useWatch } from 'react-hook-form';

interface TripStateFlowProps {
  setValue: any;
  control: any;
  initialState: ViajeDistribucionDtoEstado;
  initialKm?: number;
  register: any;
  error: any;
}

const states = [
  { value: 'iniciado', label: 'Iniciado', icon: <Truck size={24} />, description: 'Viaje registrado, pendiente de carga.' },
  { value: 'inicio de carga', label: 'Inicio de Carga', icon: <Package size={24} />, description: 'El vehículo comenzó a cargar los productos.' },
  { value: 'fin de carga', label: 'Fin de Carga', icon: <CheckCircle size={24} />, description: 'La carga ha sido completada y verificada.' },
  { value: 'fin de viaje', label: 'Fin de Viaje', icon: <CheckSquare size={24} />, description: 'El viaje ha concluido exitosamente.' }
];

export function TripStateFlow({ setValue, control, initialState, register, error, initialKm }: TripStateFlowProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const initialKmRef = useRef<number | null>(initialKm ?? null);
  useEffect(() => {
    // si cambia initialKilometros (cuando llega el fetch), lo actualizamos una vez
    if (typeof initialKm === 'number') initialKmRef.current = initialKm;
  }, [initialKm]);

  // Estado actual del viaje
  const currentState = useWatch({ control, name: 'estado', defaultValue: initialState });

    // Watch del campo kilometros (valor que tiene el form, que el usuario puede editar)
  const kmFinalRaw = useWatch({ control, name: 'kilometros', defaultValue: initialKmRef.current ?? '' });
  const kmFinal = kmFinalRaw === '' || kmFinalRaw === undefined ? NaN : Number(kmFinalRaw);


  const currentIndex = states.findIndex(s => s.value === currentState);
  const nextState = currentIndex >= 0 && currentIndex < states.length - 1 ? states[currentIndex + 1] : null;

  const needsFinalKm = nextState?.value === 'fin de viaje';
  const kmInicial = initialKmRef.current ?? 0;

  const handleStateChange = async (nuevoEstado: ViajeDistribucionDtoEstado) => {
    setDialogOpen(false);

    setValue('estado', nuevoEstado);
    
  };

  const kmValid = !needsFinalKm || (!isNaN(kmFinal) && kmFinal > Number(kmInicial));
  
  // Mensaje de error local (no dependemos exclusivamente del formState)
  const kmErrorMessage = needsFinalKm && (!kmFinal || isNaN(kmFinal) || kmFinal <= kmInicial)
    ? `Los km finales deben ser mayores a ${kmInicial}`
    : undefined;

  useEffect(() => {
    if (dialogOpen) {
      // si el campo está vacío o no definido, lo inicializamos con el km inicial para que el usuario lo modifique
      const currentKm = Number(kmFinalRaw);
      if (!currentKm && initialKmRef.current !== null) {
        setValue('kilometros', initialKmRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

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
          {needsFinalKm && (
            <Box sx={{ px: 3, pb: 2 }}>
              <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
                Kilómetros del camión al finalizar el viaje:
              </Typography>
              <TextField
                id="kilometros"
                type="number"
                placeholder="Ingresar km finales"
                {...register("kilometros", {
                  valueAsNumber: true
                  // podés dejar validación adicional aquí, pero controlamos visualmente abajo
                })}
                inputProps={{ "aria-label": "Kilómetros del camión", step: "0.01", min: "0.01" }}
                fullWidth
                error={Boolean(error?.kilometros) || Boolean(kmErrorMessage)}
                helperText={error?.kilometros?.message ?? kmErrorMessage}
                defaultValue={initialKmRef.current ?? ''}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button
            onClick={async () => {
              // opcional: trigger validation si querés utilizar react-hook-form validation
              // await trigger('kilometros'); // si tenés access a trigger
              if (nextState) handleStateChange(nextState.value as ViajeDistribucionDtoEstado);
            }}
            variant="contained"
            disabled={!kmValid} // deshabilita si es fin de viaje y los km no son válidos
          >
            Confirmar
          </Button>
          </Box>
        </Dialog>
    </Paper>
  );
}
