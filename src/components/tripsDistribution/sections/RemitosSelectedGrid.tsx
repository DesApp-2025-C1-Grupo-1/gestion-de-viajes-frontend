// components/tripsDistribution/RemitosSelectedGrid.tsx
import { Grid, Typography, Paper, Alert, Box, Stack, Chip, Divider } from "@mui/material";
import { useState } from "react";
import { RemitoDto } from "../../../api/generated";
import RemitoCard from "../../trip/modals/RemitoCard";
import { GripVertical, Info, MapPin } from "lucide-react";

interface RemitosSelectedGridProps {
  remitos: RemitoDto[];
  remitoIds: number[];
  onToggleRemito: (remitoId: number) => void;
}

export default function RemitosSelectedGrid({ remitos, remitoIds, onToggleRemito }: RemitosSelectedGridProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Resumen por países
  const remitosPorPais = remitos.reduce((acc, remito) => {
    const pais = remito.destino?.pais || "Sin país";
    acc[pais] = (acc[pais] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calcular estadísticas
  const totalRemitos = remitos.length;
  const paisesCount = Object.keys(remitosPorPais).length;

  return (
    <Grid item xs={12} sx={{ mt: 4 }}>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 3, 
          backgroundColor: "#FAFAFA",
          border: "1px solid #E0E0E0",
          borderRadius: 2
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#5A5A65", 
              fontWeight: 600, 
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <MapPin size={20} />
            Remitos Seleccionados
          </Typography>

          {/* Distribución por países */}
          {Object.entries(remitosPorPais).length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Distribución:
              </Typography>
              {Object.entries(remitosPorPais).map(([pais, count]) => (
                <Chip
                  key={pais}
                  label={`${count} ${pais}`}
                  size="small"
                  variant="filled"
                  sx={{ 
                    backgroundColor: '#EDE7F6',
                    color: '#5E35B1',
                    fontSize: '0.75rem'
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: "#5A5A65", 
              fontWeight: 500, 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <GripVertical size={16} />
            Orden de entrega
          </Typography>

          <Grid container spacing={2}>
            {remitos.map((remito, index) => (
              <Grid item xs={12} key={remito.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    border: dragOverIndex === index ? '2px dashed #8648B9' : '1px solid #E0E0E0',
                    borderRadius: 2,
                    backgroundColor: dragOverIndex === index ? '#F8F5FF' : 'white',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    '&:hover': {
                      borderColor: '#8648B9',
                      backgroundColor: '#F8F5FF'
                    },
                    placeItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 40,
                      height: 40,
                      backgroundColor: '#8648B9',
                      color: 'white',
                      borderRadius: '50%',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      flexShrink: 0
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <RemitoCard
                      rem={remito}
                      selectedRemitos={remitoIds}
                      onRemitoToggle={() => onToggleRemito(remito.id)}
                      showCheckbox={true}
                      compactMode={true} 
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
            backgroundColor: '#E3F2FD',
            borderRadius: 1,
            border: '1px solid #BBDEFB'
          }}
        >
          <Info size={16} color="#1976D2" />
          <Typography variant="body2" color="#1565C0" sx={{ fontSize: '0.875rem' }}>
            <strong>Tip:</strong> Hacé click en el checkbox para quitar un remito del viaje. 
            {/* Futuro: Próximamente hacer para arrastrar y cambiar el orden */}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}