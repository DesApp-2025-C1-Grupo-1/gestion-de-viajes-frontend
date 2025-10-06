import { Chip } from '@mui/material';

interface TripDistributionTypeProps {
  tipo: string;
}

const tripDistributionType: Record<string, { label: string; bgColor: string; textColor: string; brColor:string}> = {

   'iniciado': {
    label: 'Iniciado',
    bgColor: '#e1eefae3',     
    textColor: '#626c7bff',
    brColor: '#626c7bff'
  },
  'inicio de carga': {
    label: 'Inicio de Carga',
    bgColor: '#efed9cff',    
    textColor: '#c46c1eff',
    brColor: '#c46c1eff'
  },
  'fin de carga': {
    label: 'Fin de Carga',
    bgColor: '#DBEAFE', 
    textColor: '#1E40AF',
    brColor: '#1E40AF'
  },
  'fin de viaje': {
    label: 'Fin de Viaje', 
    bgColor: '#e6f4eaff',
    textColor: '#2F855A',
    brColor: '#2F855A'
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
        border: '0.5px solid',
        borderColor: config.brColor,
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