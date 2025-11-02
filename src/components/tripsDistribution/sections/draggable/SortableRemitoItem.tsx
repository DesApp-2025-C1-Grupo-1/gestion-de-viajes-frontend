import { Box, IconButton, Typography, Tooltip, Chip } from "@mui/material";
import { GripVertical, Trash2, Pencil } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { SortableRemitoRowProps } from "../../../../types";
import { useState } from "react";
import EntregaModal from "./EntregaModal";

export default function SortableRemitoRow({
  rem,
  index,
  onQuitar,
  canDrag = true,
  isUpdating = false,
  remitosIdsInGrupo = [],
  setRemitosCompletos,
  refrescarRemitos
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
          {rem.estado?.nombre === "En camino" && (
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>

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

        {rem.estado?.nombre !== "En camino" && (
          <Chip label={rem.estado?.nombre} color={rem.estado?.nombre === "Entregado" ? "success" : "error"} />
        )}

        {/* Botón eliminar - solo si está en camino */}
        {(rem.estado?.nombre !== "No entregado") && (rem.estado?.nombre !== "Entregado") && onQuitar && (
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
        setRemitosCompletos={setRemitosCompletos}
        refrescarRemitos={refrescarRemitos}
      />

    </>
  );
}
