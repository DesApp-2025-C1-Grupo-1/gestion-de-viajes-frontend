import { Box, Typography, Step, StepLabel, Stepper, Button, Paper, Chip, Stack, Dialog, TextField, Alert, DialogContent } from '@mui/material';
import { Truck, Package, CheckCircle, CheckSquare, Check, Ban, CircleAlert, OctagonX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ViajeDistribucionDtoEstado } from '../../api/generated';
import { useWatch } from 'react-hook-form';
import { useDistributionFormContext } from '../../contexts/DistributionFormContext';

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
  const [permission, setPermission] = useState(true);
  const initialKmRef = useRef<number | null>(initialKm ?? null);

  const {remitosCompletos} = useDistributionFormContext();

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

    // Validación para "fin de viaje"
    if (nuevoEstado === 'fin de viaje') {
      const remitosEnCamino = remitosCompletos.filter(({ estadoId }) => ![5, 6].includes(estadoId));

      console.log("Remitos en camino:", remitosEnCamino);

      if (remitosEnCamino.length > 0) {
        setPermission(false);
        return;
      }

      setPermission(true);
    }

    setValue('estado', nuevoEstado);
    setDialogOpen(false);
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
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            m: 2,
            maxHeight: 'calc(100vh - 4rem)',
          }
        }}
      >
        <DialogContent sx={{ p: { xs: 3, sm: 4 }, pb: { xs: 2, sm: 3 } }}>
          <Box sx={{textAlign: "center", mb: 3}}>
            <Typography variant="h6" fontWeight={700} sx={{fontSize: { xs: '1.125rem', sm: '1.25rem' }, mb: 1}}>
              Confirmar cambio de estado
            </Typography>
          </Box>
          <Typography variant="body2" mb={3} sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' },
          lineHeight: 1.6, textAlign: 'center' }}>
            ¿Estás seguro que deseas cambiar el estado a{" "}
            <Box 
              component="span" 
              sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                display: 'inline-block',
              }}
            >
              "{nextState?.label}"
            </Box>?
          </Typography>

          {needsFinalKm && (
            <Box 
              sx={{
                mb: 3,
                bgcolor: 'grey.50',
                borderRadius: 2,
              }}
            >
              <Typography variant='body2' fontWeight={600} sx={{mb: 1.5, fontSize: "0.875rem"}}>
                Kilómetros finales del camión:
              </Typography>
              <TextField
                id="kilometros"
                type="number"
                placeholder="Ingresar km finales"
                {...register("kilometros", {valueAsNumber: true})}
                inputProps={{ "aria-label": "Kilómetros del camión", step: "1", min: "1" }}
                fullWidth
                autoFocus
                InputProps={{
                  sx: {
                    bgcolor: 'white',
                    '& input': {
                      fontSize: { xs: '1rem', sm: '0.95rem' },
                      py: 1.5,
                    }
                  }
                }}
                error={Boolean(error?.kilometros) || Boolean(kmErrorMessage)}
                helperText={error?.kilometros?.message ?? kmErrorMessage}
                defaultValue={initialKmRef.current ?? ''}
              />
            </Box>
          )}

          {!permission && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: "#FEF2F2",
                border: '1px solid #FEE2E2',
                borderRadius: 1,
                p: 2,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 0.25,
                }}
              >
                <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>!</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '0.95rem' }, lineHeight: 1.5, color: "#991b1b" }}>
                Existen remitos pendientes de entrega.
              </Typography>
            </Box>
          )}
        </DialogContent>

        {/* Botones de acción */}
        <Box
          sx={{ display: 'flex', flexDirection: {xs: "column-reverse", sm: "row"}, gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-end' },
              px: { xs: 3, sm: 4 },
          pb: { xs: 3, sm: 4 },
          pt: 0,
          }}
        >
          <Button 
            onClick={() => setDialogOpen(false)} 
            fullWidth
            size='large'
            variant="outlined"
            sx={{ 
              textTransform: "none",
              fontWeight: 600,
              borderWidth: 2,
              boxShadow: 0,
              '&:hover': {
                borderWidth: 2,
              },
              py: { xs: 1.5, sm: 1 },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              // opcional: trigger validation si querés utilizar react-hook-form validation
              // await trigger('kilometros'); // si tenés access a trigger
              if (nextState) handleStateChange(nextState.value as ViajeDistribucionDtoEstado);
            }}
            fullWidth
            size='large'
            variant="contained"
            sx={{ 
              textTransform: "none",
              fontWeight: 600,
              boxShadow: 0,
              py: { xs: 1.5, sm: 1.25 },
              '&:hover': {
                boxShadow: 4,
              },
              width: { xs: '100%', sm: 'auto' },
            }}
            disabled={!kmValid} // deshabilita si es fin de viaje y los km no son válidos
          >
            Confirmar
          </Button>
        </Box>
      </Dialog>
    </Paper>
  );
}
