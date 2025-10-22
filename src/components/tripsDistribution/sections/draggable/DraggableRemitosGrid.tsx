import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Grid, Typography, Paper, Box, Chip, Divider, Button, Alert } from "@mui/material";
import { MapPin, Info, GripVertical } from "lucide-react";
import { RemitoDto } from '../../../../api/generated';
import RemitoCard from '../../../trip/modals/RemitoCard';
import SortableRemitoItem from './SortableRemitoItem';

interface DraggableRemitosGridProps {
  remitos: RemitoDto[];
  remitoIds: number[];
  onToggleRemito: (remitoId: number) => void;
  onReorderRemitos: (nuevoOrden: number[]) => void;
  remitosQuitados: RemitoDto[];
  restaurarRemito: (remito: RemitoDto) => void;
  quitarRemito: (remito: RemitoDto) => void;
}

export default function DraggableRemitosGrid({ 
  remitos, 
  remitoIds, 
  onToggleRemito,
  onReorderRemitos,
  remitosQuitados,
  restaurarRemito,
  quitarRemito
}: DraggableRemitosGridProps) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = remitos.findIndex(r => r.id === active.id as number);
      const newIndex = remitos.findIndex(r => r.id === over?.id as number);

      if (oldIndex !== -1 && newIndex !== -1) {
        const nuevoOrden = arrayMove(remitos, oldIndex, newIndex);
        const nuevosIds = nuevoOrden.map(r => r.id);
        onReorderRemitos(nuevosIds);
      }
    }

    setActiveId(null);
  }

  const activeRemito = remitos.find(rem => rem.id === activeId);

  // Resumen por países
  const remitosPorPais = remitos.reduce((acc, remito) => {
    const pais = remito.destino?.pais || "Sin país";
    acc[pais] = (acc[pais] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const remitosOrdenadosPorPais = Object.keys(remitosPorPais).sort().reduce((obj, key) => {
    obj[key] = remitosPorPais[key];
    return obj;
  }, {} as Record<string, number>);

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
        {/* Header (igual que antes) */}
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

          {Object.entries(remitosPorPais).length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Distribución:
              </Typography>
              {Object.entries(remitosOrdenadosPorPais).map(([pais, count]) => (
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={remitos.map(r => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <Box sx={{ mb: 3 }}>
              {remitos.length === 0 ? (
                <Typography 
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', textAlign: 'center', py: 4 }}
                >
                  No hay remitos seleccionados.
                </Typography>
              ):(
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
                  Orden de entrega (arrastrá para reordenar)
                </Typography>
              )}
              
              <Box  sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {remitos.map((remito, index) => (
                  
                  <SortableRemitoItem
                    key={remito.id}
                    rem={remito}
                    index={index}
                    remitoIds={remitoIds}
                    onToggleRemito={onToggleRemito}
                    quitarRemito={quitarRemito}
                  />
                  
                ))}
              </Box>
            </Box>
          </SortableContext>

          <DragOverlay>
            {activeRemito ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 2,
                  p: 2,
                  border: '2px dashed #8648B9',
                  borderRadius: 2,
                  backgroundColor: '#F8F5FF',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  opacity: 0.9,
                }}
              >
                <Box
            sx={{
                display: 'flex',
                flexDirection: "column",
                alignItems: 'center',
                height: '100%',
                gap: 5,
            }}
        >
            {/* Número de orden */}
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 30,
                height: 30,
                backgroundColor: '#8648B9',
                color: 'white',
                borderRadius: '50%',
                fontWeight: 'bold',
                fontSize: '0.875rem',
            }}
            >
            {remitos.findIndex(r => r.id === activeId) + 1}
            </Box>

            {/* Handle de arrastre */}
            <Box
                sx={{
                    height: '100%',
                    p: 0.5,
                    border: '1px solid #CCC',
                    borderRadius: "50%",
                    cursor: 'grab',
                    color: '#666',
                    '&:hover': {
                    backgroundColor: '#F0F0F0',
                    color: '#8648B9'
                    },
                    '&:active': {
                    cursor: 'grabbing'
                    }
                }}
            >
                <GripVertical size={20} />
            </Box>
        </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <RemitoCard
                    rem={activeRemito}
                    selectedRemitos={remitoIds}
                    onRemitoToggle={() => {}}
                    showCheckbox={false}
                    compactMode={true}
                  />
                </Box>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>

        {remitos.length > 0 &&       
          <Alert severity="info" sx={{ mt: 2, backgroundColor: '#E3F2FD', color: '#0D47A1',p: 1, borderRadius: 1, border: '1px solid #BBDEFB', display: 'flex', alignItems: 'center'}}
          >
            <Typography variant="body2" color="#1565C0" sx={{ fontSize: '0.875rem' }}>
              <strong>Ayuda:</strong> Hacé click en el checkbox para quitar un remito del viaje. 
            </Typography>
          </Alert>
        }

        {remitosQuitados.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle2"
                sx={{ color: "#B71C1C", fontWeight: 600 }}
              >
                Remitos quitados (podés volver a agregarlos)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {remitosQuitados.map((remito) => (
                <Box 
                  key={remito.id} 
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <RemitoCard
                    rem={remito}
                    selectedRemitos={remitoIds}
                    onRemitoToggle={() => restaurarRemito(remito)}
                    showCheckbox={true}
                    compactMode={true}
                  />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Paper>
    </Grid>
  );
}