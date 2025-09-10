import { Box, Button, Card, CardContent, Checkbox, Chip, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { Remito } from "../../../services/remitos";
import {  MapPin, Package, Search, X } from "lucide-react";
import { useState } from "react";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import RemitoCard from "./RemitoCard";
import RemitoSearchBar from "./RemitoSearchBar";

interface RemitosSelectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableRemitos: Remito[];
    selectedRemitos: number[];
    onRemitoToggle: (remitoId: number) => void;
    targetProvince: string;
    onConfirm: (remitos: number[]) => void;
}

export default function RemitosSelectModal({ open, onOpenChange, availableRemitos, selectedRemitos, onRemitoToggle, targetProvince, onConfirm}: RemitosSelectModalProps) {
  const [remitosSearch, setRemitosSearch] = useState("")
  const debouncedQuery = useDebouncedValue(remitosSearch, 500);

  const filteredRemitos = availableRemitos.filter(
    (remito) =>
      remito.numeroAsignado?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      remito.cliente.razonSocial.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      remito.destino.localidad.toLowerCase().includes(debouncedQuery.toLowerCase()),
  )

  const handleSelectAll = () => {
    const allIds = filteredRemitos.map((remito) => remito.id)
    const allSelected = allIds.every((id) => selectedRemitos.includes(id))

    if (allSelected) {
      // Deseleccionar todos los filtrados
      allIds.forEach((id) => {
        if (selectedRemitos.includes(id)) {
          onRemitoToggle(id)
        }
      })
    } else {
      // Seleccionar todos los filtrados
      allIds.forEach((id) => {
        if (!selectedRemitos.includes(id)) {
          onRemitoToggle(id)
        }
      })
    }
  }

  const allFilteredSelected =
    filteredRemitos.length > 0 && filteredRemitos.every((remito) => selectedRemitos.includes(remito.id))


  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} maxWidth="md" fullWidth
      sx={{ overflowY: "auto"}}
    >
      <Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%"}}>
          <DialogTitle className="flex items-center gap-2 w-full" variant="body1" sx={{padding: "12px 24px", fontWeight: 500}} >
            <Package size={24} color="#8648B9"  />
            Seleccionar remitos
          </DialogTitle>
        </Box>
        <Button 
            aria-label="Cerrar"
            sx={{ minWidth: "unset", padding: 0, position: "absolute", top: 24, right: 12, zIndex: 1 }}
            title="Cerrar"
          >
            <X className="size-5 text-gray-500 hover:text-gray-700" onClick={() => onOpenChange(false)} />
        </Button>
        {targetProvince && (
          <Typography className="text-sm text-gray-600 mt-2 px-6">
            Remitos disponibles para <span className="font-medium">{targetProvince}</span>
          </Typography>
        )}
      </Box>

      <DialogContent sx={{display: "flex", flexDirection: "column",  overflowY: "hidden", padding: "12px 24px", gap: 1, maxHeight: "70vh" }}>
        <RemitoSearchBar remitosSearch={remitosSearch} setRemitosSearch={setRemitosSearch} />

        {/* Controles de selección */}
        {filteredRemitos.length > 0 && (
          <div className="flex items-center justify-between px-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Checkbox checked={allFilteredSelected} onChange={handleSelectAll} sx={{ color: "#8648B9", '&.Mui-checked': { color: "#8648B9" } }} />
              <span className="text-sm font-medium text-gray-700">Seleccionar todos ({filteredRemitos.length})</span>
            </div>
          </div>
        )}

        <Grid container gap={1}  sx={{ overflowY: "auto"}}>
          {filteredRemitos.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", padding: 2 }}>
                <Typography variant="body1" color="textSecondary">
                  No se encontraron remitos.
                </Typography>
              </Box>  
            </Grid>
          ) :
          filteredRemitos.map((rem) => {
            return (
              <RemitoCard
                key={rem.id}
                rem={rem}
                selectedRemitos={selectedRemitos}
                onRemitoToggle={onRemitoToggle}
              />
            );
          })}
        </Grid>

        {/* Footer del modal */}
        <Box
          flexWrap="wrap"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: { xs: "stretch", sm: "center" },
            mt: 2,
            gap: 2,
          }}
        >
          <Box sx={{ fontSize: "0.9rem", color: "#555", textAlign: { xs: "center", sm: "left" } }}>
            <span className="font-medium">{selectedRemitos.length}</span> de{" "}
            <span className="font-medium">{availableRemitos.length}</span> remitos seleccionados
            {remitosSearch && filteredRemitos.length !== availableRemitos.length && (
              <span className="ml-2 text-gray-500">({filteredRemitos.length} mostrados)</span>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "flex-end",
              gap: 2,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              onClick={() => { onOpenChange(false)}}
              variant="outlined"
              fullWidth={true}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth={true}
              sx={{ minWidth: 180 }}
              onClick={() => { onOpenChange(false); onConfirm(selectedRemitos) }}
            >
              Confirmar selección
            </Button>
          </Box>
        </Box>

      </DialogContent>
    </Dialog>
  );
} 