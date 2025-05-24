import { Dialog, DialogContent, DialogTitle, TextField, DialogActions, Button } from "@mui/material";
import { VehicleType } from "../../../types";
import { useEffect, useState } from "react";
import { TipoVehiculoDto } from "../../../api/generated";

interface VehicleTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<TipoVehiculoDto>) => void;
  editingType?: TipoVehiculoDto | null;
}

export const VehicleTypeDialog = ({ open, onClose, onSubmit, editingType }: VehicleTypeDialogProps) => {
  const [formData, setFormData] = useState<Partial<TipoVehiculoDto>>({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    if (editingType) {
      setFormData({
        nombre: editingType.nombre,
        descripcion: editingType.descripcion || "",
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
      });
    }
  }, [editingType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "0.5rem", padding: "12px 8px "} }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ color: "#5A5A65" , fontWeight: 600 , fontSize: "1.4rem"}}>
          {editingType ? "Editar Tipo de Vehículo" : "Nuevo Tipo de Vehículo"}
        </DialogTitle>
        <DialogContent sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
          <TextField
            id="nombre"
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Camión Articulado"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            InputProps={{
              style: { height: "55px" },
            }}
          />
          <TextField
            id="descripcion"
            name="descripcion"
            label="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del tipo de vehículo"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            variant="outlined"
            InputProps={{
              style: { height: "100px"},
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={!formData.nombre}>
            {editingType ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};