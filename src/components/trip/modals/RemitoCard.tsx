import { Box, Card, CardContent, Checkbox, Chip, Grid, Typography } from "@mui/material";
import { MapPin } from "lucide-react";
import { RemitoDto } from "../../../api/generated";

interface RemitoCardProps {
  rem: RemitoDto;
  selectedRemitos: number[];
  onRemitoToggle: (remitoId: number) => void;
}

export default function RemitoCard({ rem, selectedRemitos, onRemitoToggle }: RemitoCardProps) {
    const prioridadColor =
    rem.prioridad === "urgente"
        ? "#D32F2F" // rojo
        : rem.prioridad === "alta"
        ? "#ED6C02" // naranja
        : "#2E7D32"; // verde para normal

    const backgroundPriorityColor =
    rem.prioridad === "urgente"
        ? "#FFEBEE"
        : rem.prioridad === "alta"
        ? "#FFF4E5"
        : "#E8F5E9"; // verde claro

    return (
        <Card
            onClick={() => onRemitoToggle(rem.id)}
            sx={{
                cursor: "pointer",
                border: "2px solid transparent", // 👈 siempre 2px
                borderColor: selectedRemitos.includes(rem.id) ? "#8648B9" : "#ddd", // 👈 cambia el color del borde si está seleccionado
                backgroundColor: selectedRemitos.includes(rem.id) ? "#F5EBFF" : "#fff",
                borderRadius: 2,
                boxShadow: 0,
                transition: "all 0.2s",
                "&:hover": {
                    backgroundColor: "#F5EBFF",
                    borderColor: "#8648B9",
                },
                minHeight: 100,
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                    p: { xs: 1.5, sm: 2 },
                }}
            >
                {/* Checkbox */}
                <Checkbox
                    checked={selectedRemitos.includes(rem.id)}
                    sx={{
                    color: "#8648B9",
                    "&.Mui-checked": { color: "#8648B9" },
                    padding: 0
                    }}
                />

                {/* Contenido */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2}}>
                    {/* Número + Chip */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
                            Nº {rem.numeroAsignado}
                        </Typography>
                        <Chip
                            label={rem.prioridad[0].toUpperCase() + rem.prioridad.slice(1)}
                            
                            sx={{
                                border: "2px solid",
                                borderColor: prioridadColor,
                                backgroundColor: backgroundPriorityColor,
                                color: prioridadColor,
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                padding: "0 5px",
                                height: "26px",
                            }}
                        />
                    </Box>

                    {/* Dirección */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                        <MapPin size={16} color="#666" />
                        <Box>
                            <Typography variant="body2" color="text.primary">
                            {rem.destino?.provincia}, {rem.destino?.localidad}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                            {rem.destino?.direccion}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
