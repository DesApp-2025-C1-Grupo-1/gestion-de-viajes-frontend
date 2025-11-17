import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
  Alert,
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";
import { MapPin, Package, XCircle, CheckCircle, ChevronUp, ChevronDown } from "lucide-react";
import RemitoCard from "../../../trip/modals/RemitoCard";
import SortableRemitoRow from "./SortableRemitoItem";
import { DraggableRemitosGridProps, GrupoRemitos } from "../../../../types";


export default function DraggableRemitosGrid({
  remitos,
  onReorderRemitos,
  remitosQuitados,
  restaurarRemito,
  quitarRemito,
  onToggleEntregaMultiple,
  entregas = {},
  disableDrag,
  bulkUpdating = [],
  setRemitosCompletos,
  refrescarRemitos
}: DraggableRemitosGridProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [gruposExpandidos, setGruposExpandidos] = useState<Record<string, boolean>>({});

  // Agrupar remitos por provincia y localidad
  const grupos: GrupoRemitos[] = useMemo(() => {
    const gruposMap = remitos.reduce((acc, remito) => {
      const key = `${remito.destino?.provincia}-${remito.destino?.localidad}`;
      if (!acc[key]) {
        acc[key] = {
          key,
          provincia: remito.destino?.provincia || "Sin provincia",
          localidad: remito.destino?.localidad || "Sin localidad",
          remitos: [],
          expanded: gruposExpandidos[key] ?? false
        };
      }
      acc[key].remitos.push(remito);
      return acc;
    }, {} as Record<string, GrupoRemitos>);

    return Object.values(gruposMap).sort((a, b) => 
      a.provincia.localeCompare(b.provincia) || a.localidad.localeCompare(b.localidad)
    );
  }, [remitos, gruposExpandidos]);

  const toggleGrupo = (key: string) => {
    setGruposExpandidos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleEntregaGrupo = (grupo: GrupoRemitos, estado: boolean) => {
    if (onToggleEntregaMultiple) {
      const remitoIds = grupo.remitos.map(r => r.id);
      onToggleEntregaMultiple(remitoIds, estado);
    }
  };

const sensors = useSensors(
  // Para escritorio
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // evita arrastres accidentales
    },
  }),

  // Para dispositivos táctiles
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150, // mantener presionado 200ms antes de arrastrar
      tolerance: 5, // margen de movimiento
    },
  }),

  // ⌨Accesibilidad (opcional)
  useSensor(KeyboardSensor)
);

  const handleDragStart = (event: DragStartEvent) => {
    document.body.style.overflow = "hidden"; // bloquea scroll
    setActiveId(event.active.id as number);
  };

  // En handleDragEnd, cambiar esta parte:
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      document.body.style.overflow = "auto"; // restaura scroll
      setActiveId(null);
      return;
    }

    // Encontrar índices en el array completo de remitos
    const oldIndex = remitos.findIndex((r) => r.id === active.id);
    const newIndex = remitos.findIndex((r) => r.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const nuevosIds = arrayMove(remitos.map(r => r.id), oldIndex, newIndex);
      onReorderRemitos(nuevosIds); // ← Solo pasar los IDs, sin grupoKey
    }
    
    setActiveId(null);
  };

  // Estadísticas para el header
  const estadisticas = useMemo(() => {
    const total = remitos.length;
    const entregados = Object.values(entregas).filter(e => e === "Entregado").length;
    const noEntregados = Object.values(entregas).filter(e => e === "No entregado").length;
    const enCamino = Object.values(entregas).filter(e => e === "En camino").length;
    const enPreparacion = total - (entregados + noEntregados + enCamino);

    return { total, entregados, noEntregados, enCamino, enPreparacion };
  }, [remitos.length, entregas]);

  return (
    <Paper variant="outlined" sx={{p: 3, backgroundColor: "#fafafa",borderRadius: 2, border: "1px solid #E0E0E0"}}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#5A5A65",
            fontWeight: 600,
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Package size={20} />
          Remitos Seleccionados ({remitos.length})
        </Typography>

        {/* Barra de progreso/estadísticas */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CheckCircle size={16} />}
            label={`${estadisticas.entregados} Entregados`}
            variant="outlined"
            color="success"
            size="small"
          />
          <Chip 
            icon={<XCircle size={16} />}
            label={`${estadisticas.noEntregados} No Entregados`}
            variant="outlined"
            color="error"
            size="small"
          />
          <Chip 
            label={`${estadisticas.enCamino} En Camino`}
            variant="outlined"
            color="default"
            size="small"
          />
          <Chip 
            label={`${estadisticas.enPreparacion} En Preparación`}
            variant="outlined"
            color="default"
            size="small"
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* DndContext general */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {grupos.map((grupo) => (
            <Paper 
              key={grupo.key}
              variant="outlined"
              sx={{ borderRadius: 2, overflow: 'hidden' }}
            >
              {/* Header del grupo */}
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#F5F5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#EEEEEE' }
                }}
                onClick={() => toggleGrupo(grupo.key)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small">
                    {grupo.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </IconButton>
                  <MapPin size={16} color="#666" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {grupo.provincia}, {grupo.localidad}
                  </Typography>
                  <Chip 
                    label={`${grupo.remitos.length} remitos`} 
                    size="small" 
                    variant="filled"
                  />
                </Box>

                {/* Acciones rápidas del grupo */}
                {onToggleEntregaMultiple && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Marcar todos como entregados">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEntregaGrupo(grupo, true);
                        }}
                        color="success"
                      >
                        <CheckCircle size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Marcar todos como no entregados">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEntregaGrupo(grupo, false);
                        }}
                        color="error"
                      >
                        <XCircle size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>

              {/* Contenido del grupo con su propio SortableContext */}
              <Collapse in={grupo.expanded}>
                <Box sx={{ p: 1 }}>
                  <SortableContext 
                    items={grupo.remitos.map(r => r.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {grupo.remitos.map((remito, index) => (
                        <SortableRemitoRow
                          key={remito.id}
                          rem={remito}
                          index={index}
                          onQuitar={() => quitarRemito(remito)}
                          canDrag={!disableDrag}
                          remitosIdsInGrupo={grupo.remitos.map(r => r.id)}
                          isUpdating={bulkUpdating.includes(remito.id)}
                          setRemitosCompletos={setRemitosCompletos}
                          refrescarRemitos={refrescarRemitos}
                        />
                      ))}
                    </Box>
                  </SortableContext>
                </Box>
              </Collapse>
            </Paper>
          ))}
        </Box>
      </DndContext>

      {remitosQuitados.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography
            variant="subtitle2"
            sx={{ color: "#B71C1C", fontWeight: 600, mb: 1 }}
          >
            Remitos quitados ({remitosQuitados.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {remitosQuitados.map((remito) => (
              <RemitoCard
                key={remito.id}
                rem={remito}
                onAction={() => restaurarRemito(remito)}
                actionTooltip="Restaurar remito"
              />
            ))}
          </Box>
        </>
      )}

      {remitos.length > 2 && (
        <Alert
          severity="info"
          sx={{
            mt: 3,
            backgroundColor: "#E3F2FD",
            color: "#0D47A1",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <strong>Tip:</strong> Podés reordenar remitos dentro del mismo grupo arrastrándolos.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
}