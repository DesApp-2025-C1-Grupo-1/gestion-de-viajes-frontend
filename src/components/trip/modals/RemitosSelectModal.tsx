import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, Grid, Typography, IconButton, Tooltip } from "@mui/material";
import { Package, X, Filter } from "lucide-react";
import { useState } from "react";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import RemitoCard from "./RemitoCard";
import RemitoSearchBar from "./RemitoSearchBar";
import { RemitoDto } from "../../../api/generated";

interface RemitosSelectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableRemitos: RemitoDto[];
    selectedRemitos: number[];
    onRemitoToggle: (remitoId: number) => void;
    targetProvince: string;
    onConfirm: (remitos: number[]) => void;
    onRemitosToggle: (remitoIds: number[]) => void;
}

export default function RemitosSelectModal({ 
  open, 
  onOpenChange, 
  availableRemitos, 
  selectedRemitos, 
  onRemitoToggle, 
  targetProvince, 
  onConfirm,
  onRemitosToggle
}: RemitosSelectModalProps) {
  const [remitosSearch, setRemitosSearch] = useState("")
  const [showCompact, setShowCompact] = useState(false);
  const debouncedQuery = useDebouncedValue(remitosSearch, 500);

  const filteredRemitos = Array.isArray(availableRemitos) ? availableRemitos.filter(
    (remito) =>
      remito.numeroAsignado?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      remito.destino?.direccion?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      remito.destino?.localidad?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      remito.destino?.provincia?.toLowerCase().includes(debouncedQuery.toLowerCase()),
  ) : [];

  // SIMPLE Y EFECTIVO:
  const handleSelectAll = () => {
    const filteredIds = filteredRemitos.map(remito => remito.id);
    
    if (onRemitosToggle) {
      // Usar la función de toggle múltiple
      onRemitosToggle(filteredIds);
    } else {
      // Fallback a la función individual
      if (allFilteredSelected) {
        filteredIds.forEach(id => {
          if (selectedRemitos.includes(id)) {
            onRemitoToggle(id);
          }
        });
      } else {
        filteredIds.forEach(id => {
          if (!selectedRemitos.includes(id)) {
            onRemitoToggle(id);
          }
        });
      }
    }
  }

  const selectedCountInFiltered = filteredRemitos.filter((r) =>
    selectedRemitos.includes(r.id)
  ).length;

  const allFilteredSelected = filteredRemitos.length > 0 && 
    filteredRemitos.every((remito) => selectedRemitos.includes(remito.id));

  const someFilteredSelected = filteredRemitos.length > 0 && 
    filteredRemitos.some((remito) => selectedRemitos.includes(remito.id)) &&
    !allFilteredSelected;

  return (
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)} 
      maxWidth="lg" 
      fullWidth
      sx={{ 
        '& .MuiDialog-paper': { 
          maxHeight: '90vh',
          borderRadius: 2
        } 
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, pb: 1, position: 'relative' }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Package size={24} color="#8648B9" />
          <DialogTitle variant="h6" sx={{ p: 0, fontWeight: 600 }}>
            Seleccionar Remitos
          </DialogTitle>
        </Box>
        
        <IconButton 
          onClick={() => onOpenChange(false)}
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16 
          }}
        >
          <X size={20} />
        </IconButton>

        {targetProvince && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Remitos disponibles para <Typography component="span" fontWeight={600}>{targetProvince}</Typography>
          </Typography>
        )}

        {/* Controles de búsqueda y vista */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <RemitoSearchBar remitosSearch={remitosSearch} setRemitosSearch={setRemitosSearch} />
          </Box>
          <Tooltip title={showCompact ? "Vista detallada" : "Vista compacta"}>
            <IconButton 
              onClick={() => setShowCompact(!showCompact)}
              color={showCompact ? "primary" : "default"}
            >
              <Filter size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3, pt: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Controles de selección */}
        {filteredRemitos.length > 0 && (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 1,
            border: '1px solid #e9ecef'
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Checkbox 
                checked={allFilteredSelected} 
                indeterminate={someFilteredSelected}
                onChange={handleSelectAll} 
                sx={{ 
                  color: "#8648B9", 
                  '&.Mui-checked': { color: "#8648B9" } 
                }} 
              />
              <Typography variant="body1" fontWeight={500}>
                Seleccionar todos ({filteredRemitos.length})
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {selectedCountInFiltered} seleccionados
            </Typography>
          </Box>
        )}

        {/* Grid de remitos */}
        <Box sx={{ 
          overflow: 'auto',
          maxHeight: '400px',
          pr: 1,
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: 4 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#c1c1c1', borderRadius: 4 },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#a8a8a8' }
        }}>
          <Grid container spacing={1.5}>
            {filteredRemitos.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", padding: 4 }}>
                  <Typography variant="h6" color="textSecondary" sx={{ mt: 1 }}>
                    No se encontraron remitos
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {remitosSearch ? "Intenta con otros términos de búsqueda" : "No hay remitos disponibles"}
                  </Typography>
                </Box>  
              </Grid>
            ) : (
              filteredRemitos.map((rem) => (
                <Grid item xs={12} sm={showCompact ? 6 : 12} key={rem.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Checkbox
                      checked={selectedRemitos.includes(rem.id)}
                      onChange={() => onRemitoToggle(rem.id)}
                      sx={{ 
                        color: "#8648B9", 
                        '&.Mui-checked': { color: "#8648B9" } 
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <RemitoCard
                        rem={rem}
                        compact={showCompact}
                        showPriority={true}
                      />
                    </Box>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          pt: 2,
          borderTop: '1px solid #e0e0e0',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            Total seleccionados: <Typography component="span" fontWeight={600} color="primary">
              {selectedRemitos.length}
            </Typography>
          </Typography>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outlined"
              size="large"
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                boxShadow: 'none',
                minWidth: 180 
              }}
              onClick={() => { 
                onOpenChange(false); 
                onConfirm(selectedRemitos) 
              }}
            >
              Confirmar ({selectedRemitos.length})
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}