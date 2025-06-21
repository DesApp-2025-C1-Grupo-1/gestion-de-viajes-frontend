import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Grid, Box, Chip, Button, TextField } from "@mui/material";
import { DepositoDto } from "../api/generated";
import { Building2, Clock, MapPin, Search, X } from "lucide-react";
import { useState } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

interface DepositoSelectModalProps {
  open: boolean;
  onClose: () => void;
  depots: DepositoDto[];
  selectedId?: string;
  onSelect: (id: string) => void;
  title?: string;
}

export const DepositoSelectModal = ({
  open,
  onClose,
  depots,
  selectedId,
  onSelect,
  title = "Seleccionar depósito",
}: DepositoSelectModalProps) => {

  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedQuery = useDebouncedValue(searchQuery, 500);
  
  const filtered = depots.filter((dep) =>
    dep.nombre.toLowerCase().includes(debouncedQuery)
  ) || [];

  const handleSearch = (searchTerm: string) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    setSearchQuery(lowerCaseTerm);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth 
      sx={{ '& .MuiDialog-paper': { width: '80%', minHeight:600 ,maxHeight: 600} }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%"}}>
        
        <DialogTitle className="flex items-center gap-2 w-full" variant="body2" sx={{padding: "12px 24px"}} >
          <Building2 size={24} color="#8648B9"  />
          {title}
        </DialogTitle>
      </Box>
      <Button 
          aria-label="Cerrar"
          sx={{ minWidth: "unset", padding: 0, position: "absolute", top: 24, right: 12, zIndex: 1 }}
          title="Cerrar"
        >
          <X className="size-5 text-gray-500 hover:text-gray-700" onClick={onClose} />
      </Button>
      <DialogContent sx={{display: "flex", flexDirection: "column",  overflowY: "hidden"}}>
        <TextField
          variant="outlined"
          placeholder="Buscar depósito..."
          fullWidth
          size="small"
          className="inside-paper"
          InputProps={{
            startAdornment: (
              <Search className="h-5 w-5 text-gray-500" />
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ccc",
              },
              "&:hover fieldset": {
                borderColor: "#8648B9",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8648B9",
              },
            },
            transition: "border-color 0.3s",
          }}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          value={searchQuery}

        >
        </TextField>

        <Grid container  sx={{ overflowY: "auto", maxHeight: 500, mt: 2 }}>
          {filtered.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", padding: 2 }}>
                <Typography variant="body1" color="textSecondary">
                  No se encontraron depósitos.
                </Typography>
              </Box>  
            </Grid>
          ) :
          filtered.map((dep) => (
            <Grid item xs={12}  key={dep._id}>
              <Card
                onClick={() => {
                  onSelect(dep._id);
                  onClose();
                }}
                sx={{
                  cursor: "pointer",
                  border:
                    selectedId === dep._id
                      ? "2px solid #8648B9"
                      : "1px solid #ccc",
                  marginRight: 0.5,
                  marginBottom: 2,
                  backgroundColor: selectedId === dep._id ? "#E9D5FF" : "#fff",
                  borderRadius: 2,
                  boxShadow: 0,
                  "&:hover": {
                    backgroundColor: "#E9D5FF",
                    borderColor: " #8648B9",
                    transition: "background-color 0.3s, border 0.3s",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" , gap: 2 }}>
                    <Typography variant="h6" sx={{fontSize: "1.2rem"}} >{dep.nombre} </Typography>
                    <Chip
                      label={dep.tipo[0].toUpperCase() + dep.tipo.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: dep.tipo === "propio" ? "#8648B9" : "#4D6280",
                        color: "#fff",
                        fontWeight: "semibold",
                        padding: "2px 4px",
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    <MapPin className="h-5 w-5" color="#8648B9" />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                    
                      <Typography variant="body2" color="#222">
                        {dep.direccion?.calle} {dep.direccion?.numero}, {dep.direccion?.ciudad}, {dep.direccion?.estado_provincia}
                      </Typography>
                      <Typography variant="caption" color="#666">
                        {dep.direccion?.pais}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    <Clock className="size-4 ml-0.5" color="#1E40AF" />
                    <Typography variant="caption" color="#1E40AF" sx={{ marginLeft: 0.2 }}>
                      {dep.horario_entrada} - {dep.horario_salida}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
