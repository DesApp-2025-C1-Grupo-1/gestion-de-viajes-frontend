import { Globe} from 'lucide-react';
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
                } : {
                backgroundColor: '#E9D5FF', 
                color: '#6B21A8',
                }),
            }}
            
        />
    );
};



/*
export const TripType = ({tipo}: TripTypeProps) => {
    const isInternacional = tipo === "Internacional";

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: isInternacional ? "#F5EFFF" : "#DBEAFE",
                color: isInternacional ? "#9333EA" : "#1E3A8A",
                padding: "4px 12px",
                borderRadius: "9999px",
                fontWeight: 500,
                fontSize: "0.875rem",
                height: 32,
            }}
        >
            {isInternacional ? (
                <Globe size={16} color="#9333EA" />
            ) : (
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>AR</span>
            )}
            {tipo}
        </div>
    );
};*/

/*<div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium 
                ${isNacional ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}
            >
            {isNacional ? (
                <span className="text-[10px] font-bold">AR</span>
            ) : (
                <Globe size={12} />
            )}
            {isNacional ? "Nacional" : "Internacional"}
        </div>*/