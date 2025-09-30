// components/tripsDistribution/TripStateActions.tsx
import { Button, Box, Alert, Typography } from "@mui/material";
import { ViajeDistribucionDto, ViajeDistribucionDtoEstado } from "../../../api/generated";
import { CheckCircle, CheckSquare, Package, Truck } from "lucide-react";

interface TripStateActionsProps {
  currentState?: string;
  onStateChange: (nuevoEstado: string) => void;
  tripData?: ViajeDistribucionDto;
}

export function TripStateActions({ currentState, onStateChange, tripData }: TripStateActionsProps) {
  const getNextStates = (currentState: string) => {
    const stateFlow: Record<string, string[]> = {
      'iniciado': ['inicio de carga'],
      'inicio de carga': ['fin de carga'],
      'fin de carga': ['fin de viaje'],
      'fin de viaje': [] // Estado final
    };
    return stateFlow[currentState] || [];
  };

  const nextStates = currentState ? getNextStates(currentState) : [];

  if (!currentState || nextStates.length === 0) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        <strong>✅ Viaje Completado</strong> - El viaje ha finalizado correctamente.
      </Alert>
    );
  }

  const states: { value: ViajeDistribucionDtoEstado; label: string; icon: React.ReactNode }[] = [
    { value: 'iniciado', label: 'Iniciado', icon: <Truck size={20} /> },
    { value: 'inicio de carga', label: 'Inicio de Carga', icon: <Package size={20} /> },
    { value: 'fin de carga', label: 'Fin de Carga', icon: <CheckCircle size={20} /> },
    { value: 'fin de viaje', label: 'Fin de Viaje', icon: <CheckSquare size={20} /> }
  ];

  const getStateLabel = (state: string) => {
    const stateObj = states.find(s => s.value === state);
    return stateObj ? stateObj.label : state;
  }

  const getIcon = (state: string) => {
    const stateObj = states.find(s => s.value === state);
    return stateObj ? stateObj.icon : null;
  }

  const getStateDescription = (state: string) => {
    const descriptions: Record<string, string> = {
      'inicio de carga': 'El vehículo comenzó a cargar los productos',
      'fin de carga': 'La carga ha sido completada y verificada',
      'fin de viaje': 'El viaje ha concluido exitosamente'
    };
    return descriptions[state] || '';
  };

  return (
    <Box sx={{p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 , width: '100%' , maxWidth: '800px', mx: 'auto'}} >
      <Alert severity="info" sx={{ 
          borderLeft: '6px solid #0288d1', 
          backgroundColor: '#e5f6fd',
          mb: 2 
        }}>
        <strong>Acciones de Estado del Viaje</strong>
      </Alert>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nextStates.map((state) => (
          <Box key={state} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 2, }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onStateChange(state)}
              size="medium"
              sx={{ minWidth: '200px', gap: 1, width: { xs: '100%', md: 'auto' }, textTransform: 'none', boxShadow: 'none' }}
            >
              {getIcon(state)}
              {getStateLabel(state)}
            </Button>
            <Typography variant="body2" color="text.secondary">
              {getStateDescription(state)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}