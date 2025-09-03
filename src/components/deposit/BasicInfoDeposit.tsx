import { Grid, Typography, FormControl, Select, MenuItem, TextField } from "@mui/material";
import { Control, Controller, UseFormRegister } from "react-hook-form";
import { CreateDepositoSchema } from "../../api/schemas";
interface BasicInfoSectionProps {
  errors: Record<string, any>;
  loading: boolean;
  register: UseFormRegister<CreateDepositoSchema>;
  control: Control<CreateDepositoSchema>; // Asegúrate de pasar el control del formulario
}

const BasicInfoSection = ({
  errors,
  loading,
  register,
  control,
}: BasicInfoSectionProps) => {

  return (
    <>
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.4rem", mb:2}}>
        Datos básicos
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre de depósito</Typography>
          <TextField
            id="nombre"
            placeholder="Ej: Centro de distribución Norte"
            fullWidth
            className="inside-paper"
            {...register("nombre")}
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
            disabled={loading}
          />
        </Grid>

        

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Tipo de depósito</Typography>
            <Controller 
              name="tipo"
              control={control}
              render={({ field }) => (
                <Select
                  fullWidth
                  className="inside-paper"
                  {...field}
                  value={field.value || "propio"} // Asegura que tenga un valor por defecto
                  error={!!errors.tipo}
                  onChange={(event) => field.onChange(event.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="propio">Propio</MenuItem>
                  <MenuItem value="tercero">Tercero</MenuItem>
                </Select>
              )}
            
            />
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default BasicInfoSection;