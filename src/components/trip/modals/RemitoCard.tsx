import { Box, IconButton, Typography, Tooltip, Chip, Stack } from "@mui/material";
import { RotateCcw, MapPin, Calendar } from "lucide-react";
import { RemitoDto } from "../../../api/generated";

interface RemitoCardProps {
  rem: RemitoDto;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  actionTooltip?: string;
  showPriority?: boolean;
  compact?: boolean;
}

export default function RemitoCard({
  rem,
  onAction,
  actionIcon = <RotateCcw size={18} />,
  actionTooltip = "Restaurar remito",
  showPriority = true,
  compact = false,
}: RemitoCardProps) {
  const prioridadColor = {
    urgente: "#D32F2F",
    alta: "#ED6C02", 
    normal: "#1976D2",
    baja: "#2E7D32"
  }[rem.prioridad] || "#757575";

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  if (compact) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          border: "1px solid #E0E0E0",
          borderRadius: 2,
          backgroundColor: "#FFF",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#8648B9",
            backgroundColor: "#F9F6FF",
          },
          width: "100%",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={600} fontSize="0.9rem" noWrap>
            Nº {rem.numeroAsignado}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }} noWrap>
            {rem.destino?.localidad}, {rem.destino?.provincia}
          </Typography>
        </Box>

        {showPriority && (
          <Chip
            label={rem.prioridad[0].toUpperCase()}
            size="small"
            sx={{
              backgroundColor: prioridadColor,
              color: "white",
              fontWeight: 600,
              minWidth: 24,
              height: 24,
            }}
            title={rem.prioridad}
          />
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        backgroundColor: "#FFF",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#8648B9",
          backgroundColor: "#F9F6FF",
        },
        width: "100%",
      }}
    >
      {/* Header con número y prioridad */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography fontWeight={600} fontSize="1rem">
          Nº {rem.numeroAsignado}
        </Typography>
        {showPriority && (
          <Chip
            label={rem.prioridad}
            size="small"
            sx={{
              backgroundColor: prioridadColor,
              color: "white",
              fontWeight: 500,
              textTransform: 'capitalize'
            }}
          />
        )}
      </Box>

      {/* Información de ubicación */}
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MapPin size={14} color="#666" />
          <Typography variant="body2" color="text.secondary">
            {rem.destino?.localidad}, {rem.destino?.provincia}
          </Typography>
        </Box>

        {rem.destino?.direccion && (
          <Typography variant="body2" color="text.secondary" sx={{ 
            fontSize: "0.8rem", 
            fontStyle: 'italic',
            pl: 2 
          }}>
            {rem.destino.direccion}
          </Typography>
        )}
      </Stack>

      {/* Acción */}
      {onAction && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Tooltip title={actionTooltip}>
            <IconButton
              onClick={onAction}
              size="small"
              sx={{
                color: "#8648B9",
                "&:hover": { backgroundColor: "#F5EBFF" },
              }}
            >
              {actionIcon}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}