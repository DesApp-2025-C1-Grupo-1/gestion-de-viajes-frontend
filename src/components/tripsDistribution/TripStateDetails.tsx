import {Box, Typography, Step, StepLabel, Stepper, Button, Paper, Chip, Dialog, TextField, CircularProgress} from "@mui/material";
import { Truck, Package, CheckCircle, CheckSquare, Check } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import { UpdateViajeDistribucionDtoEstado, ViajeDistribucionDtoEstado, useViajeDistribucionControllerUpdateEstado, viajeDistribucionControllerUpdate, useViajeDistribucionControllerUpdate, UpdateViajeDistribucionDto } from '../../api/generated';
import { notifyError, notifySuccess } from "../../services/toast";
import { useQueryClient } from "@tanstack/react-query";


const states = [
  { value: "iniciado", label: "Iniciado", icon: <Truck size={24} />, description: "Viaje registrado, pendiente de carga." },
  { value: "inicio de carga", label: "Inicio de Carga", icon: <Package size={24} />, description: "El vehículo comenzó a cargar los productos." },
  { value: "fin de carga", label: "Fin de Carga", icon: <CheckCircle size={24} />, description: "La carga ha sido completada y verificada." },
  { value: "fin de viaje", label: "Fin de Viaje", icon: <CheckSquare size={24} />, description: "El viaje ha concluido exitosamente." },
];

interface TripStateDetailsProps {
  viajeId: string;
  initialState: ViajeDistribucionDtoEstado;
  initialKm?: number;
}

export function TripStateDetails({ viajeId, initialState, initialKm }: TripStateDetailsProps) {
  const queryClient = useQueryClient();

  const [estadoActual, setEstadoActual] = useState(initialState);
  const [kmFinal, setKmFinal] = useState<number | ''>(initialKm ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [kmError, setKmError] = useState<string | null>(null);

  const initialKmRef = useRef<number | null>(initialKm ?? null);

  //const { mutate, isPending } = useViajeDistribucionControllerUpdateEstado();
  const { mutate, isPending } = useViajeDistribucionControllerUpdate();

  const currentIndex = states.findIndex((s) => s.value === estadoActual);
  const nextState = currentIndex >= 0 && currentIndex < states.length - 1 ? states[currentIndex + 1] : null;
  
  const needsFinalKm = nextState?.value === "fin de viaje";
  const kmInicial = initialKmRef.current ?? 0;

  useEffect(() => {
    if (dialogOpen && !kmFinal && initialKmRef.current !== null) {
      setKmFinal(initialKmRef.current);
    }
  }, [dialogOpen]);

  const validateKm = () => {
    if (!needsFinalKm) return true;
    if (typeof kmFinal !== "number" || isNaN(kmFinal)) {
      setKmError("Debes ingresar los kilómetros finales.");
      return false;
    }
    if (kmFinal <= kmInicial) {
      setKmError(`Los kilómetros deben ser mayores a ${kmInicial}.`);
      return false;
    }
    setKmError(null);
    return true;
  };

  const handleConfirm = async () => {
    if (!nextState || !validateKm()) return;

    const payload: Partial<UpdateViajeDistribucionDto> = {
      estado: nextState.value as UpdateViajeDistribucionDtoEstado,
    };

    if (
      needsFinalKm &&
      typeof kmFinal === "number" &&
      !isNaN(kmFinal) &&
      kmFinal > kmInicial
    ) {
      payload.kilometros = kmFinal;
    }

    console.log("ID enviado:", viajeId);
    console.log("Payload limpio:", payload);

    mutate(
      { id: viajeId, data: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["viajeDistribucion", viajeId],
          });
          setEstadoActual(nextState.value as ViajeDistribucionDtoEstado);
          setDialogOpen(false);
          notifySuccess(`Estado actualizado a "${nextState.label}"`);
        },
        onError: (err: any) => {
          console.error("Error al actualizar estado del viaje", err);
          notifyError(
            err?.response?.data?.message ??
              "Error al actualizar el estado del viaje"
          );
        },
      }
    );
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
        Estado del viaje
      </Typography>

      <Stepper activeStep={currentIndex} alternativeLabel>
        {states.map((state, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <Step key={state.value} completed={isCompleted}>
              <StepLabel
                icon={
                  <Box sx={{ color: isCompleted ? "success.main" : isCurrent ? "primary.main" : "grey.400" }}>
                    {isCompleted ? <CheckCircle size={24} /> : state.icon}
                  </Box>
                }
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isCurrent ? "bold" : "normal",
                    color: isCompleted ? "success.main" : isCurrent ? "primary.main" : "grey.400",
                  }}
                >
                  {state.label}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={2}>
        {states[currentIndex]?.description}
      </Typography>

      <Box textAlign="center" mt={3}>
        {nextState ? (
          <Button variant="contained" onClick={() => setDialogOpen(true)} disabled={isPending}>
            {isPending ? <CircularProgress size={20} /> : `Avanzar a ${nextState.label}`}
          </Button>
        ) : (
          <Chip icon={<Check size={18} />} label="Viaje Completado" color="success" variant="outlined" />
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Confirmar cambio de estado
          </Typography>
          <Typography variant="body1" gutterBottom>
            ¿Deseas cambiar el estado a "{nextState?.label}"?
          </Typography>

          {needsFinalKm && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Kilómetros finales"
                type="number"
                fullWidth
                value={kmFinal}
                onChange={(e) => setKmFinal(Number(e.target.value))}
                error={!!kmError}
                helperText={kmError ?? ""}
              />
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button onClick={() => setDialogOpen(false)} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} variant="contained" disabled={isPending}>
              {isPending ? <CircularProgress size={20} /> : "Confirmar"}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
}
