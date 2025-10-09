import { Chip } from '@mui/material';
import { CircleCheck, PackageCheck, PackagePlus, Truck } from 'lucide-react';
import { ReactElement } from 'react';

interface TripDistributionTypeProps {
  tipo: string;
}

const tripDistributionType: Record<string, { label: string; bgColor: string; textColor: string; icon?: ReactElement}> = {

   'iniciado': {
    label: 'Iniciado',
    bgColor: '#00A86B',
    textColor: '#ffffff',
    icon: <Truck size={15}  style={{ color: 'white' }}  /> 
  },
  'inicio de carga': {
    label: 'Inicio de Carga',
    bgColor: '#3B82F6',    
    textColor: '#ffffff',
    icon: <PackagePlus size={15} style={{ color: 'white' }}/> 
  },
  'fin de carga': {
    label: 'Fin de Carga',
    bgColor: '#F97316',  
    textColor: '#ffffff',
    icon: <PackageCheck size={15} style={{ color: 'white' }}/>
 
  },
  'fin de viaje': {
    label: 'Fin de Viaje', 
    bgColor: '#9699a1ff',    
    textColor: '#ffffff',
    icon: <CircleCheck size={15} style={{ color: 'white' }}/>
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
      icon={config.icon ? config.icon : undefined}
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
