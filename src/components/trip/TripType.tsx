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
                backgroundColor: '#ddebfcff', 
                color: '#2a49b1ff',
                } : {
                backgroundColor: '#ede0fcff', 
                color: '#7131a5ff',
                }),
            }}
            
        />
    );
};