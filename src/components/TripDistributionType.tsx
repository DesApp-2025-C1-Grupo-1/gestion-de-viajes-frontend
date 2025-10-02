import { Chip } from '@mui/material';

interface TripDistributionTypeProps {
  tipo: string;
}

const tripDistributionType: Record<string, { label: string; bgColor: string; textColor: string }> = {

   'iniciado': {
    label: 'Iniciado',
    bgColor: '#e1eefae3',     
    textColor: '#64748B'
  },
  'inicio de carga': {
    label: 'Inicio de Carga',
    bgColor: '#e9dc9eff',    
    textColor: '#b96419ff'
  },
  'fin de carga': {
    label: 'Fin de Carga',
    bgColor: '#DBEAFE', 
     textColor: '#1E40AF',
  },
  'fin de viaje': {
    label: 'Fin de Viaje', 
    bgColor: '#E6F4EA',
    textColor: '#2F855A',
  }
};

export const TripDistributionType = ({ tipo }: TripDistributionTypeProps) => {
  const tipoViajeDistribucion = tipo.trim().toLocaleLowerCase();
  const config = tripDistributionType[tipoViajeDistribucion];

  if (!config) return null;

  return (
    <Chip
      size="small"
      label={config.label}
      sx={{
        borderRadius: '16px',
        fontWeight: 500,
        fontSize: '0.75rem',
        height: 'auto',
        py: 0.8,
        px: 1.5,
        backgroundColor: config.bgColor,
        color: config.textColor,
        '& .MuiChip-icon': {
          ml: '4px',
          mr: '2px',
        },
        '& .MuiChip-label': {
          px: '2px',
        },
      }}
    />
  );
};