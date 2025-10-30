import { Box, Chip, IconButton, Typography, Tooltip, CircularProgress, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { GripVertical, CheckCircle2, XCircle, Trash2, CheckCircle, Clock, MessageCircle, Camera, Pen, Pencil, X } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { RemitoDto } from "../../../../api/generated";
import { SortableRemitoRowProps } from "../../../../types";
import { useState } from "react";
import EntregaModal from "./EntregaModal";

export default function SortableRemitoRow({
  rem,
  index,
  estadoEntrega = "en camino",
  onToggleEntrega,
  onQuitar,
  canDrag = true,
  isUpdating = false,
  remitosIdsInGrupo = [],
}: SortableRemitoRowProps) {
  const [showEntregaDialog, setShowEntregaDialog] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const isMinimallyDraggable = remitosIdsInGrupo.length > 1;

  return (
    <>
      <Box
        ref={setNodeRef}
        style={style}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          border: "1px solid #E0E0E0",
          backgroundColor: isDragging ? "#F5EBFF" : "white",
          transition: "all 0.2s",
          "&:hover": { 
            borderColor: "#8648B9", 
            backgroundColor: "#FAF7FF",
            '& .action-buttons': {
              opacity: 1
            }
          },
        }}
      >
        {/* Orden + Drag handle */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 50,
            color: "#5A5A65",
          }}
        >
          <Typography fontWeight={600} width={18}>
            {index + 1}
          </Typography>
          {canDrag && (
            <Box
              {...(isMinimallyDraggable ? attributes : {})}
              {...(isMinimallyDraggable ? listeners : {})}
              sx={{
                cursor: "grab",
                "&:active": { cursor: isMinimallyDraggable ? "grabbing" : "not-allowed" },
                color: "#888",
              }}
            >
              <GripVertical size={18} />
            </Box>
          )}
        </Box>

        {/* Contenido principal */}
        <Box sx={{ flex: 1, flexWrap: "wrap" , display: "flex", alignItems: "center", justifyContent: "space-between" , width: '100%', gap: 1 }}>
          <Box sx={{ width: 'max-content' }}>
            <Typography fontWeight={600} fontSize="0.9rem">
              Nº {rem.numeroAsignado}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              {rem.destino?.provincia}, {rem.destino?.localidad}
            </Typography>
          </Box>

          {/* Botones de acción - solo mostrar si está en camino */}
          {estadoEntrega === "en camino" && onToggleEntrega && (
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
{/*               <Tooltip title="Marcar como entregado">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Camera size={14} />}
                  onClick={() => setShowEntregaDialog(true)}
                  disabled={isUpdating}
                  sx={{ 
                    fontSize: '0.75rem',
                    borderColor: '#2E7D32',
                    color: '#2E7D32',
                    '&:hover': {
                      backgroundColor: '#2E7D32',
                      borderColor: '#2E7D32',
                      color: 'white'
                    }
                  }}
                >
                  Entregar
                </Button>
              </Tooltip>

              <Tooltip title="Marcar como no entregado">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<MessageCircle size={14} />}
                  onClick={() => setShowNoEntregaDialog(true)}
                  disabled={isUpdating}
                  sx={{ 
                    fontSize: '0.75rem',
                    borderColor: '#C62828',
                    color: '#C62828',
                    '&:hover': {
                      backgroundColor: '#C62828',
                      borderColor: '#C62828',
                      color: 'white'
                    }
                  }}
                >
                  No Entregar
                </Button>
              </Tooltip> */}

              <Tooltip title="Marcar remito">
                <IconButton 
                  size="small" 
                  onClick={() => setShowEntregaDialog(true)}
                  sx={{ opacity: 0.7, transition: 'opacity 0.2s' }}
                >
                  <Pencil size={18} color="#888" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Botón eliminar - solo si está en camino */}
        {estadoEntrega === "en camino" && onQuitar && (
          <Tooltip title="Quitar remito">
            <IconButton 
              size="small" 
              onClick={() => onQuitar?.(rem)}
              sx={{ opacity: 0.7, transition: 'opacity 0.2s' }}
            >
              <Trash2 size={18} color="#888" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      {/* Dialogs para entrega y no entrega */}
      <EntregaModal
        open={showEntregaDialog}
        onClose={() => setShowEntregaDialog(false)}
        remito={rem}
        isLoading={isUpdating}
        onConfirm={() => setShowEntregaDialog(false)}
      />

    </>
  );
}
