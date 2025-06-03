import { Dialog, DialogContent, DialogTitle, TextField, DialogActions, Button, FormHelperText } from "@mui/material";
import { TipoVehiculoDto } from "../../../api/generated";
import { useForm } from "react-hook-form";
import { CreateTipoVehiculoForm, createTipoVehiculoSchema, tipoVehiculoSchema } from "../../../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

interface VehicleTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<TipoVehiculoDto>) => void;
  editingType?: TipoVehiculoDto | null;
}

export const VehicleTypeDialog = ({ open, onClose, onSubmit, editingType }: VehicleTypeDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors , isValid},
    reset,
  } = useForm<CreateTipoVehiculoForm>({
    resolver: zodResolver(createTipoVehiculoSchema),
    mode: "onBlur",
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  })

  useEffect(() => {
    if (editingType) {
      reset({
        nombre: editingType.nombre,
        descripcion: editingType.descripcion || "",
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
      });
    }
  }, [open, reset]);

  const handleFormSubmit = (data: CreateTipoVehiculoForm) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "0.5rem", padding: "12px 8px "} }}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle sx={{ color: "#5A5A65" , fontWeight: 600 , fontSize: "1.4rem"}}>
          {editingType ? "Editar Tipo de Vehículo" : "Nuevo Tipo de Vehículo"}
        </DialogTitle>
        <DialogContent sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
          <TextField
            id="nombre"
            label="Nombre"
            {...register("nombre")}
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
            placeholder="Ej: Camión Articulado"
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              style: { height: "55px" },
            }}
          />
          <TextField
            id="descripcion"
            label="Descripción"
            {...register("descripcion")}
            error={!!errors.descripcion}
            helperText={errors.descripcion?.message}
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
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={!isValid}>
            {editingType ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};