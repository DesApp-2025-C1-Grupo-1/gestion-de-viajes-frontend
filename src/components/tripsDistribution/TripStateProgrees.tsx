// components/trip/TripStateProgress.tsx
import { Box, Typography, Step, StepLabel, Stepper, LinearProgress } from '@mui/material';
import { CheckCircle, Circle, Truck, Package, CheckSquare } from 'lucide-react';
import { TripEstado } from '../../hooks/useTripPermissions';

interface TripStateProgressProps {
  currentState: TripEstado;
  onStateClick?: (state: TripEstado) => void;
  clickable?: boolean;
}

const states: { value: TripEstado; label: string; icon: React.ReactNode }[] = [
  { value: 'iniciado', label: 'Iniciado', icon: <Truck size={20} /> },
  { value: 'inicio de carga', label: 'Inicio de Carga', icon: <Package size={20} /> },
  { value: 'fin de carga', label: 'Fin de Carga', icon: <CheckCircle size={20} /> },
  { value: 'fin de viaje', label: 'Fin de Viaje', icon: <CheckSquare size={20} /> }
];

export function TripStateProgress({ currentState, onStateClick, clickable = false }: TripStateProgressProps) {
  const currentIndex = states.findIndex(state => state.value === currentState);

  return (
    <Box sx={{ width: '100%', mb: 4, maxWidth: '900px', mx: 'auto'}}>
      <Stepper activeStep={currentIndex} alternativeLabel>
        {states.map((state, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = clickable && onStateClick && index <= currentIndex + 1;

          return (
            <Step key={state.value} completed={isCompleted}>
              <StepLabel
                icon={
                  <Box
                    sx={{
                      cursor: isClickable ? 'pointer' : 'default',
                      color: isCompleted ? 'success.main' : isCurrent ? 'primary.main' : 'grey.400',
                      '&:hover': isClickable ? { opacity: 0.7 } : {}
                    }}
                    onClick={() => isClickable && onStateClick(state.value)}
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
                    cursor: isClickable ? 'pointer' : 'default'
                  }}
                  onClick={() => isClickable && onStateClick(state.value)}
                >
                  {state.label}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}