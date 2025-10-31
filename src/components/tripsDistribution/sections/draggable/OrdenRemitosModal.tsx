import { Alert, AppBar, Box, Button, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import { CheckCircle, X } from "lucide-react";
import DraggableRemitosGrid from "./DraggableRemitosGrid";
import { EstadoEntrega, OrdenRemitosModalProps } from "../../../../types";


export default function OrdenRemitosModal({ open, onClose, estadoViaje, remitos, remitoIds, onReorderRemitos, onToggleRemito, remitosQuitados, restaurarRemito, quitarRemito }: OrdenRemitosModalProps) {

    const puedeEditarEntrega =
        estadoViaje === "fin de carga" || estadoViaje === "inicio de carga" || estadoViaje === "iniciado";

    const entregas = remitos.reduce((acc, remito) => {
        acc[remito.id] = remito.estado?.nombre as EstadoEntrega || "";
        return acc;
    }, {} as Record<number, EstadoEntrega>);

    return (
        <Dialog open={open} onClose={onClose} fullScreen disableScrollLock scroll="paper" PaperProps={{ sx: { backgroundColor: "#ffffff", mx: "auto", p: 0, borderRadius: 0 } }}>
            <Box sx={{maxWidth: 800, mx: "auto", display: "flex", flexDirection: "column", height: "100vh", width: "100%"}}>
                {/* AppBar fija arriba */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        color: "#333",
                        backgroundColor: "#ffffff",
                    
                    }}
                >
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", paddingX: { xs: 2, sm: 3 }, pt: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Gestión de Remitos
                    </Typography>
                    <IconButton onClick={onClose}>
                        <X />
                    </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Contenido scrollable */}
                <Box sx={{paddingX: { xs: 2, sm: 3 }, py: 2, flex: 1}}>
                    <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 2, fontWeight: 500 }}
                    >
                    {puedeEditarEntrega
                        ? "Reordená los remitos y marcá los entregados."
                        : "Vista de orden y entrega (no editable)"}
                    </Typography>

                    <DraggableRemitosGrid
                        remitos={remitos}
                        remitoIds={remitoIds}
                        onReorderRemitos={onReorderRemitos}
                        disableDrag={!puedeEditarEntrega} 
                        onToggleRemito={onToggleRemito}    
                        entregas={entregas}
                        remitosQuitados={remitosQuitados}
                        restaurarRemito={restaurarRemito}
                        quitarRemito={quitarRemito}
                    />

                    {!puedeEditarEntrega && (
                        <Alert
                            severity="info"
                            sx={{ mt: 2, backgroundColor: "#E3F2FD", color: "#0D47A1" }}
                        >
                            El estado del viaje no permite editar entregas o reordenar remitos.
                        </Alert>
                    )}
                </Box>

                {/* Footer fijo con acciones */}
                <Box
                    sx={{
                        position: "sticky",
                        bottom: 0,
                        backgroundColor: "#ffffff",
                        borderTop: "1px solid #E0E0E0",
                        py: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mr: { xs: 2, sm: 3 },
                        ml: { xs: 2, sm: 3 },
                    }}
                >
                    <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    >
                    Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                        }}
                        variant="contained"
                        sx={{
                            backgroundColor: "#E65F2B",
                            "&:hover": { backgroundColor: "#C94715" },
                        }}
                        startIcon={
                            <CheckCircle size={18} />
                        }
                    >
                    Guardar cambios
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
