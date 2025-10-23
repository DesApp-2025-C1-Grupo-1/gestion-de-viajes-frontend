import { Box, Card, Skeleton, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { Map } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ComparativaCostoDto } from "../../api/generated";
import { AnimatePresence, motion } from "framer-motion";

interface ZonasChartProps {
    dataZonas: ComparativaCostoDto[];
    loading: boolean;
}

export default function ZonasChart ({dataZonas, loading}: ZonasChartProps) {
    const theme = useTheme();

    return (
        <Card className="h-full">
            <Box display="flex" alignItems="center" gap={2} padding={3}> 
                <Map className={`size-7 block`} color="#E65F2B"/> 
                <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                    Análisis de Costos por Zona de Viaje
                </Typography>
            </Box>
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box px={3} pb={3} display="flex" flexDirection="column" gap={2}>
                            <Skeleton variant="rounded" height={256} />
                        </Box>
                    </motion.div>
                    ) : (
                    <motion.div
                        key="chart"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
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
                                    formatter={(value, name) => [value, name === 'average' ? 'Costo Promedio' : name === 'max' ? 'Costo Máximo' : '']}
                                />
                                <Bar dataKey="average" fill="#00A86B" />
                                <Bar dataKey="max" fill="#e65f2b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}