import { Box, Card, CardContent, Checkbox, Chip, Grid, Typography } from "@mui/material";
import { MapPin } from "lucide-react";
import { RemitoDto } from "../../../api/generated";

interface RemitoCardProps {
  rem: RemitoDto;
  selectedRemitos: number[];
  onRemitoToggle: (remitoId: number) => void;
  showCheckbox?: boolean;
  compactMode?: boolean;
  permissionsEdit?: boolean;
}

export default function RemitoCard({ rem, selectedRemitos, onRemitoToggle, showCheckbox = true, compactMode = false, permissionsEdit = true }: RemitoCardProps) {
    const prioridadColor =rem.prioridad === "urgente"? "#D32F2F" // rojo
        : rem.prioridad === "alta"? "#ED6C02" : "#2E7D32"; // verde para normal

    const backgroundPriorityColor =rem.prioridad === "urgente" ? "#FFEBEE"
        : rem.prioridad === "alta" ? "#FFF4E5" : "#E8F5E9"; // verde claro

    return (
        <Card
            onClick={showCheckbox ? () => onRemitoToggle(rem.id) : undefined}
            sx={{
                cursor: showCheckbox ? "pointer" : "default",
                border: "2px solid transparent", // siempre 2px
                borderColor: selectedRemitos.includes(rem.id) ? "#8648B9" : "#ddd", // cambia el color del borde si está seleccionado
                backgroundColor: selectedRemitos.includes(rem.id) ? "#F5EBFF" : "#fff",
                borderRadius: 2,
                boxShadow: 0,
                transition: "all 0.2s",
                "&:hover": {
                    backgroundColor: "#F5EBFF",
                    borderColor: "#8648B9",
                },
                minHeight: compactMode ? 80 : 100
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    gap: compactMode ? 1 : 1.5,
                    alignItems: "flex-start",
                    p: { xs: 1.5, sm: 2 },
                }}
            >
                {/* Checkbox */}
                <Checkbox
                    checked={selectedRemitos.includes(rem.id)}
                    onChange={!showCheckbox ? () => onRemitoToggle(rem.id) : undefined}
                    sx={{
                        color: "#8648B9",
                        "&.Mui-checked": { color: "#8648B9" },
                        padding: 0,
                        cursor: showCheckbox && permissionsEdit ? "pointer" : "default",
                        display: showCheckbox && permissionsEdit ? "block" : "none",
                    }}
                />

                {/* Contenido */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: compactMode ? 1 : 2}}>
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
                        <Typography sx={{ 
                            fontSize: compactMode ? "0.9rem" : "1rem", // 🔥 Tamaño adaptable
                            fontWeight: 600 
                        }}>
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
                                fontSize: compactMode ? "0.7rem" : "0.75rem",
                                padding: "0 5px",
                                height: compactMode ? "22px" : "26px",
                            }}
                        />
                    </Box>

                    {/* Dirección */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                        <MapPin size={compactMode ? 14 : 16} color="#666" />
                        <Box>
                            <Typography variant="body2" color="text.primary" sx={{ fontSize: compactMode ? "0.8rem" : "0.875rem" }}>
                            {rem.destino?.provincia}, {rem.destino?.localidad}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: compactMode ? "0.7rem" : "0.75rem" }}>
                            {rem.destino?.direccion}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
