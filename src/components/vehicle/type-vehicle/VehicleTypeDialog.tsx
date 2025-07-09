import { Dialog, DialogContent, DialogTitle, TextField, DialogActions, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { TipoVehiculoDto } from "../../../api/generated";
import { useForm } from "react-hook-form";
import { CreateTipoVehiculoForm, createTipoVehiculoSchema, tipoVehiculoSchema } from "../../../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { tipoLicenciaSchema } from "../../../api/schemas/enums/tipoLicencia.schema";

interface VehicleTypeDialogProps {
  open: boolean;
  onClose: () => void;
  //onSubmit: (formData: CreateTipoVehiculoForm) => void;
  onSubmit: (formData: { licencias_permitidas: string } & Omit<CreateTipoVehiculoForm, 'licencias_permitidas'>) => void;
  editingType?: TipoVehiculoDto | null;
}

export const VehicleTypeDialog = ({ open, onClose, onSubmit, editingType }: VehicleTypeDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors , isValid, isSubmitting},
    reset,
    watch, //ver
  } = useForm<CreateTipoVehiculoForm>({
    resolver: zodResolver(createTipoVehiculoSchema),
    mode: "onBlur",
    defaultValues: {
      nombre: "",
      descripcion: "",
      licencias_permitidas: "C1",
    },
  })

  useEffect(() => {
    if (editingType) {
      reset({
        nombre: editingType.nombre,
        descripcion: editingType.descripcion || "",
        licencias_permitidas: editingType.licencias_permitidas?.[0] || "C1"
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
        licencias_permitidas: "C1",
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
          <TextField
            select
            label="Licencia base"
            {...register("licencias_permitidas")}
            value={watch("licencias_permitidas")}  //ver
            error={!!errors.licencias_permitidas}
            helperText={errors.licencias_permitidas?.message}
          >
            {tipoLicenciaSchema.options.map((lic) => (
              <MenuItem key={lic} value={lic}>
                {lic}
              </MenuItem>
            ))}
          </TextField>
        
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={isSubmitting}>
            {isSubmitting
                ? editingType
                    ? "Actualizando..."
                    : "Registrando..."
                : editingType
                    ? "Actualizar"
                    : "Registrar"
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};