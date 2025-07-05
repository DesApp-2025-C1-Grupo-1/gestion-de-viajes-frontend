import { Box, Card, Typography, useTheme } from "@mui/material";
import { Building2 } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


//mock prueba
export const masViajesPorEmpresa = [
  { name: "Transporte Sur", viajes: 54 },
  { name: "Logística Norte", viajes: 78 },
  { name: "Camiones Rápidos", viajes: 102 },
];


export default function TopEmpresasChart () {
  const theme = useTheme();

  return (
    <Card
        sx={{
            width: "100%",
            minHeight: 150,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
            overflow: "hidden",
            flexDirection: "column",
            justifyContent: "space-between",
            '&:hover': { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" },
            transition: "box-shadow 0.3s ease",
        }}
    >
        <Box display="flex" alignItems="center" gap={2} padding={3}> 
            <Building2 className={`size-7 block`} color="#E65F2B"/> 
            <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                Top 3 empresas con más viajes
            </Typography>
        </Box>

        <Box sx={{ height: 260, px: 2, pb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={masViajesPorEmpresa} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis type="number" stroke={theme.palette.text.secondary} />
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke={theme.palette.text.secondary}
                />
                <Tooltip
                    contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                    }}
                />
                <Bar dataKey="viajes" fill={theme.palette.primary.main} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </Box>   

    </Card>
  );
}
