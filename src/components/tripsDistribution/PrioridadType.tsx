import { Chip } from "@mui/material";
import { RemitoDtoPrioridad } from "../../api/generated";

interface PrioridadChipProps {
  prioridad: string
}

const prioridadStyles: Record<string, { label: string; bgColor: string; textColor: string; }> = {
  urgente: {
    label: "Urgente",
    bgColor: "#FFEBEE",
    textColor: "#D32F2F",  
  },
  alta: {
    label: "Alta",
    bgColor: "#FFF4E5",
    textColor: "#ED6C02",   
  },
  normal: {
    label: "Normal",
    bgColor: "#E8F5E9",
    textColor: "#2E7D32",
  },
};

export const PrioridadType = ({ prioridad }: PrioridadChipProps) => {
  const key = prioridad.trim().toLowerCase();
  const config = prioridadStyles[key];

  if (!config) return null;

  return (
    <Chip
      size="small"
      label={config.label}
      sx={{
        borderRadius: "16px",
        fontWeight: 500,
        fontSize: "0.75rem",
        height: "auto",
        py: 0.8,
        px: 1.5,
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: '1px solid',
        borderColor: config.textColor,
        "& .MuiChip-icon": {
          ml: "4px",
          mr: "2px",
        },
        "& .MuiChip-label": {
          px: "2px",
        },
      }}
    />
  );
};