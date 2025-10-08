import { Globe } from 'lucide-react';
import { Chip } from '@mui/material';

interface TripTypeProps {
  tipo: string;
}

export const TripType = ({tipo}: TripTypeProps) => {
    const tipoViaje = tipo.trim().toLocaleLowerCase();
    const isNacional = tipoViaje === "nacional";
    const isInternacional = tipoViaje === "internacional";

    if (!isNacional && !isInternacional) return null;

    return (
        <Chip
            size="small"
            icon={
                isNacional ? (
                <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 'bold',
                    color: 'inherit' 
                }}>
                    AR
                </span>
                ) : (
                <Globe 
                    size={12} 
                    style={{ color: 'inherit' }} 
                />
                )
            }
            label={isNacional ? "Nacional" : "International"} 
            sx={{
                borderRadius: '16px',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 'auto', 
                py: 0.8, 
                px: 1.5, 
                '& .MuiChip-icon': {
                    ml: '4px', 
                    mr: '2px',
                },
                '& .MuiChip-label': {
                    px: '2px', 
                },
                ...(isNacional ? {
                backgroundColor: '#DBEAFE', 
                color: '#1E40AF',
                border: '1px solid',
                borderColor: '#1E40AF'
                } : {
                backgroundColor: '#E9D5FF', 
                color: '#6B21A8',
                border: '1px solid',
                borderColor: '#6B21A8'
                }),
            }}
            
        />
    );
};