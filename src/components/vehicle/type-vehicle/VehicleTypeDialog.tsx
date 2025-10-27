import { Dialog, DialogContent, DialogTitle, TextField, DialogActions, Button, FormControl, InputLabel, MenuItem, Select, Grid, Typography } from "@mui/material";
import { TipoVehiculoDto } from "../../../api/generated";
import { useForm } from "react-hook-form";
import { CreateTipoVehiculoForm, createTipoVehiculoSchema, tipoVehiculoSchema } from "../../../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { tipoLicenciaSchema } from "../../../api/schemas/enums/tipoLicencia.schema";

interface VehicleTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateTipoVehiculoForm) => void;
  editingType?: TipoVehiculoDto | null;
}

export const VehicleTypeDialog = ({ open, onClose, onSubmit, editingType }: VehicleTypeDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors , isValid, isSubmitting},
    reset,
    watch, 
  } = useForm<CreateTipoVehiculoForm>({
    resolver: zodResolver(createTipoVehiculoSchema),
    mode: "onBlur",
    defaultValues: {
      nombre: "",
      descripcion: "",
      licencia_permitida: "C1",
    },
  })

  useEffect(() => {
    if (editingType) {
      reset({
        nombre: editingType.nombre,
        descripcion: editingType.descripcion || "",
        licencia_permitida: editingType.licencia_permitida || "C1"
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
        licencia_permitida: "C1",
      });
    }
  }, [open, reset]);

  const handleFormSubmit = (data: CreateTipoVehiculoForm) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "0.5rem"}}}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle sx={{ color: "#5A5A65" , fontWeight: 600 , fontSize: "1.4rem", width: "100%"}}>
          {editingType ? "Editar Tipo de Vehículo" : "Nuevo Tipo de Vehículo"}
        </DialogTitle>
        <DialogContent sx={{ gap: 2, display: "flex", flexDirection: "column", mt:2 }}>
          <Grid container spacing={2}> 
            <Grid item xs={12} > 
              <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre</Typography>
              <TextField
                id="nombre"
                {...register("nombre")}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                placeholder="Ej: Camión Articulado"
                fullWidth
                className="inside-paper"
              />
            </Grid>
            <Grid item xs={12} > 
              <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Descripción</Typography>
              <TextField
                id="descripcion"
                {...register("descripcion")}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
                placeholder="Descripción del tipo de vehículo"
                fullWidth
                className="inside-paper"
                multiline
                rows={3}
                variant="outlined"
                InputProps={{
                  style: { height: "100px"},
                }}
              />
            </Grid> 
            <Grid item xs={12} > 
              <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Licencia base</Typography>
              <TextField
                select
                {...register("licencia_permitida")}
                value={watch("licencia_permitida")} 
                error={!!errors.licencia_permitida}
                fullWidth
                className="inside-paper"
                helperText={errors.licencia_permitida?.message}
              >
                {tipoLicenciaSchema.options.map((lic) => (
                  <MenuItem key={lic} value={lic}>
                    {lic}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{px: 3, pb: 2}}>
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