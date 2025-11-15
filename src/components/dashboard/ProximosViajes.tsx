import { Box, LinearProgress, linearProgressClasses, styled, TableCell, TableRow, Typography } from "@mui/material";
import { Building2, ChevronRight, DollarSign, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardProgressBar from "./DashboardProgressBar";

interface ProximosViajesParams {
  viajeID: string;
  viaje_id: string;
  fecha: string;
  empresaNombre: string;
  choferNombre: string;
  precioTarifa?: number;
  totalRemitos: number;
  remitosEntregados: number;
}

export default function ProximosViajes(viajesParam: ProximosViajesParams) {
  const { viajeID, empresaNombre, choferNombre, fecha, precioTarifa, viaje_id } = viajesParam;

  const link={
    pathname: "/trips/distribution",
    state: { defaultFilter: { _id: viaje_id } }
  }


  const navigate = useNavigate();

  const handleRedirect = () => {
    if (!link) return;
    else {
      if (typeof link === "string") navigate(link);
      else navigate(link.pathname, { state: link.state });
    }
  };

  return (
    <Box
      key={viajeID}
      onClick={handleRedirect}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      border="1px solid #c7c7c7"
      marginX={1}
      borderRadius={1}
      padding={3}
      gap={5}

      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      {/* 🟦 Bloque izquierdo: información principal */}
        {/* ID y fecha */}
        <Box
          sx={{
            flex: "0 0 150px",
            maxWidth: 150,
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {viajeID}
          <Typography variant="caption" noWrap>
            {`Inicio: ${new Date(fecha).toLocaleDateString()}`}
          </Typography>
        </Box>

        {/* Empresa / Chofer */}
          <DoubleCell
            primarySection={empresaNombre}
            secondarySection={choferNombre}
            primaryIcon={<Building2 size={18} color="#AFB3B9" />}
            secondaryIcon={<User size={18} color="#AFB3B9" />}
          />

        {/* Precio */}
        <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
          <DollarSign className="shrink-0" size={18} color="#AFB3B9"/>
          
          <Typography variant="body2" fontWeight={"500"} noWrap  >
            {precioTarifa ? `${precioTarifa}` : "N/A"}
          </Typography>
        </Box>

      {/* 🟩 Bloque derecho: barra + chevron */}

        {/* Barra de progreso */}
        <DashboardProgressBar
          remitosEntregados={viajesParam.remitosEntregados}
          totalRemitos={viajesParam.totalRemitos}
        />

        {/* Chevron */}
        <ChevronRight className="size-10 shrink-0" />
      </Box>
  );
}

// Componente DoubleCell (ya existente)
type DoubleCellProps = {
  primarySection: string;
  secondarySection?: string;
  primaryIcon?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
};

const DoubleCell = ({ primarySection, secondarySection, primaryIcon, secondaryIcon }: DoubleCellProps) => {
  return (
    <Box sx={{width: "auto", overflow: 'hidden' }} display="flex" alignItems="center" gap={1} flexDirection={"column"}>
      <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
        {primaryIcon}
        <Typography variant="body2" fontWeight={secondaryIcon ? '500' : 'normal'} noWrap>
          {primarySection}
        </Typography>
      </Box>
      {secondarySection && (
        <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
          {secondaryIcon}
          <Typography variant="caption" noWrap>
            {secondarySection}
          </Typography>
        </Box>
      )}
    </Box>
  );
};