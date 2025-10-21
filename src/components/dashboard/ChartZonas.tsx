import { Box, Card, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { Map } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ZonasChartProps {
    dataZonas: any[];
}

export default function ZonasChart ({dataZonas}: ZonasChartProps) {
    const theme = useTheme();

    return (
        <Card className="h-full">
            <Box display="flex" alignItems="center" gap={2} padding={3}> 
                <Map className={`size-7 block`} color="#E65F2B"/> 
                <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                    Análisis de Costos por Zona de Viaje
                </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={256}>
                <BarChart data={dataZonas} margin={{ left: 60, right: 24 }}  barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="nombre" stroke={theme.palette.text.secondary}  tick={{ fontFamily: theme.typography.fontFamily, fontSize: 12 }} />
                    <YAxis/>
                    <Tooltip
                        contentStyle={{
                            border: `0.5px solid ${theme.palette.divider}`,
                            color: theme.palette.text.secondary,
                            borderRadius: 8,
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                        labelFormatter={(value) => `Zona: ${value}`}
                        formatter={(value, name) => [value, name === 'promedio' ? 'Costo Promedio' : name === 'maximo' ? 'Costo Máximo' : '']}
                    />
                    <Bar dataKey="promedio" fill="#00A86B" />
                    <Bar dataKey="maximo" fill="#e65f2b" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}