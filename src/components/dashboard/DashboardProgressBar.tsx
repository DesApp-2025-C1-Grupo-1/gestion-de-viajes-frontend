import { Box, LinearProgress, linearProgressClasses, styled, TableCell, TableRow, Typography } from "@mui/material";

export default function DashboardProgressBar({remitosEntregados, totalRemitos, isMobile}: {remitosEntregados: number; totalRemitos: number, isMobile?: boolean}) {
  
  const porcentajeEntregado =
    (
    (remitosEntregados / totalRemitos) === Infinity 
    ? 0 
    : (remitosEntregados / totalRemitos) 
    ) * 100;
  
  return (
    <Box
      sx={{
        flex: 1,
        maxWidth: !isMobile ? "50%" : "100%",
        mt: isMobile ? 2 : 0
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={1}>
        
        {/* ← TITULO */}
        <Typography
          variant={isMobile ? "body2" : "body1"}
          color={isMobile ? "text.secondary" : "inherit"}
          noWrap
        >
          Remitos Entregados:
        </Typography>

        {/* ← VALOR */}
        <Typography
          variant={isMobile ? "body2" : "body1"}
          color={isMobile ? "text.secondary" : "inherit"}
          noWrap
        >
          {remitosEntregados}/{totalRemitos}
        </Typography>
      </Box>

      <BorderLinearProgress variant="determinate" value={porcentajeEntregado} />
    </Box>
  );

}

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