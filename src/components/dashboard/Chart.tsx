import { Box, Card, Typography, useTheme } from "@mui/material";
import { Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { notifySuccess } from '../../services/toast';


//mock prueba (sacar)
export const masViajesPorEmpresa = [
  { name: "Transporte Sur", viajes: 54 },
  { name: "Logística Norte", viajes: 78 },
  { name: "Camiones Rápidos", viajes: 103 },
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

        <Box sx={{ height: 260, px: 3, pb: 2, '& *:focus': {outline: 'none'} }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={masViajesPorEmpresa} layout="vertical" margin={{left:40, right:40}}>
                    <CartesianGrid strokeDasharray="2 2" stroke={theme.palette.divider} />
                    <XAxis type="number" stroke={theme.palette.text.secondary} tick={{ fontFamily: theme.typography.fontFamily, fontSize: 12 }}/>
                    <YAxis
                        dataKey="name"
                        type="category"
                        stroke={theme.palette.text.secondary}
                        tick={{ fontFamily: theme.typography.fontFamily, fontSize: 14 }}
                    />
                    <Tooltip
                        contentStyle={{
                            border: `0.5px solid ${theme.palette.divider}`,
                            color: theme.palette.text.secondary,
                            borderRadius: 8,
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                    <Bar dataKey="viajes" fill="#00A86B" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </Box>   
    </Card>
  );
}
