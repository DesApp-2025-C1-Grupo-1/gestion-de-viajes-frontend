import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField } from "@mui/material";
import { DepositoDto, DireccionDto } from "../../api/generated";
import { CreateDepositoSchema } from "../../api/schemas";
import { UseFormRegister } from "react-hook-form";

interface AdressSectionProps {
  errors: Record<string, any>;
  loading: boolean;
  register: UseFormRegister<CreateDepositoSchema>;
}

const AdressSection = ({
  errors,
  loading,
  register,
}: AdressSectionProps) => {

  return (
    <>
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.4rem", mb:2}}>
        Dirección
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Calle</Typography>
          <TextField
            id="direccion.calle"
            placeholder="Ej: Avenida Libertador"
            fullWidth
            className="inside-paper"
            {...register("direccion.calle")}
            error={!!errors.direccion?.calle}
            helperText={errors.direccion?.calle?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Número</Typography>
          <TextField
            id="direccion.numero"
            placeholder="Ej: 1234"
            fullWidth
            className="inside-paper"
            {...register("direccion.numero")}
            error={!!errors.direccion?.numero}
            helperText={errors.direccion?.numero?.message}
            disabled={loading}
          />
        </Grid>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Ciudad</Typography>
          <TextField
            id="direccion.ciudad"
            placeholder="Ej: Palermo"
            fullWidth
            className="inside-paper"
            {...register("direccion.ciudad")}
            error={!!errors.direccion?.ciudad}
            helperText={errors.direccion?.ciudad?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Estado/Provincia</Typography>
          <TextField
            id="direccion.estado_provincia"
            placeholder="Ej: Buenos Aires"
            fullWidth
            className="inside-paper"
            {...register("direccion.estado_provincia")}
            error={!!errors.direccion?.estado_provincia}
            helperText={errors.direccion?.estado_provincia?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>País</Typography>
          <TextField
            id="direccion.pais"
            placeholder="Ej: Argentina"
            fullWidth
            className="inside-paper"
            {...register("direccion.pais")}
            error={!!errors.direccion?.pais}
            helperText={errors.direccion?.pais?.message}
            disabled={loading}
          />
        </Grid>
        </Grid>
        

        
      </Grid>
    </>
  );
};

export default AdressSection;