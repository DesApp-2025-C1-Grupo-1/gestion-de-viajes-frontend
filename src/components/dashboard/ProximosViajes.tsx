import { Box, LinearProgress, linearProgressClasses, styled, TableCell, TableRow, Typography } from "@mui/material";
import { Building2, ChevronRight, DollarSign, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const porcentajeEntregado =
    (
    (viajesParam.remitosEntregados / viajesParam.totalRemitos) === Infinity 
    ? 0 
    : (viajesParam.remitosEntregados / viajesParam.totalRemitos) 
    ) * 100;

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
      margin={1}
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
        <Box sx={{ flex: 1, maxWidth: "50%"}}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" fontWeight={"500"} noWrap  >
              Remitos Entregados:
            </Typography>
            <Typography variant="body2" fontWeight={"500"} noWrap >
              {viajesParam.remitosEntregados}/{viajesParam.totalRemitos}
            </Typography>
          </Box>
          <BorderLinearProgress variant="determinate" value={porcentajeEntregado} />
        </Box>

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

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#23A26D',
    ...theme.applyStyles('dark', {
      backgroundColor: '#c7c7c7',
    }),
  },
}));