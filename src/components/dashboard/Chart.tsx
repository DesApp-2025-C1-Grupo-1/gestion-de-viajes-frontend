import { Box, Card, Typography, useTheme } from "@mui/material";
import { Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { EmpresaViajesDto } from "../../api/generated";

interface TopEmpresasChartProps {
  topEmpresas: EmpresaViajesDto[];
}

export default function TopEmpresasChart ({ topEmpresas }: TopEmpresasChartProps) {
  const theme = useTheme();

  return (
    <Card className="h-full">
        <Box display="flex" alignItems="center" gap={2} padding={3}> 
            <Building2 className={`size-7 block`} color="#E65F2B"/> 
            <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                Empresas con más viajes asignados
            </Typography>
        </Box>
        <Box sx={{ height: '100%',minHeight:'256px', px: 3, pb: 2, '& *:focus': {outline: 'none'} }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEmpresas} layout="vertical"  margin={{ left: 60, right: 24 }}  barSize={20}>
                    <CartesianGrid strokeDasharray="2 2" stroke={theme.palette.divider} />
                    <XAxis type="number" stroke={theme.palette.text.secondary}  tick={{ fontFamily: theme.typography.fontFamily, fontSize: 12 }} 
                        padding={{ right: 30 }} />
                    <YAxis
                        dataKey="nombre"
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
                        labelFormatter={(value) => `Empresa: ${value}`}
                        formatter={(value, name) => [value, 'Cantidad de viajes']}
                    />
                    <Bar dataKey="cantidadViajes" fill="#00A86B" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    </Card>
  );
}