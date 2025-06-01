import { Grid, TextField, Typography } from "@mui/material";
import { UseFormRegister } from "react-hook-form";
import { CreateDepositoSchema } from "../../api/schemas";

interface LocationSectionProps {
  errors: Record<string, any>;
  loading: boolean;
  register: UseFormRegister<CreateDepositoSchema>;
}

const LocationSection = ({
  errors,
  loading,
  register,
}: LocationSectionProps) => {
  return (
    <>
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.4rem", mb:2}}>
        Coordernadas
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Latitud</Typography>
          <TextField
            id="lat"
            placeholder="Ej: -34.6037"
            type="number"
            fullWidth
            className="inside-paper"
            {...register("lat", {valueAsNumber:true})}
            error={!!errors.lat}
            helperText={errors.lat?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Longitud</Typography>
          <TextField
            id="long"
            placeholder="Ej: -58.3816"
            type="number"
            fullWidth
            className="inside-paper"
            {...register("long", {valueAsNumber:true})}
            error={!!errors.long}
            helperText={errors.long?.message}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LocationSection;