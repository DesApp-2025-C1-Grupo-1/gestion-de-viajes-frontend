import { Grid, TextField, Typography } from "@mui/material";
import { Deposit } from "../../types";

interface LocationSectionProps {
  formData: Partial<Deposit>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const LocationSection = ({
  formData,
  errors,
  touched,
  loading,
  handleChange
}: LocationSectionProps) => {
  return (
    <>
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:2}}>
        Coordernadas
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Latitud</Typography>
          <TextField
            name="lat"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
            value={formData.lat}
            onChange={handleChange}
            error={touched.lat && !!errors.lat}
            helperText={touched.lat && errors.lat}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Longitud</Typography>
          <TextField
            name="long"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
            value={formData.long}
            onChange={handleChange}
            error={touched.long && !!errors.long}
            helperText={touched.long && errors.long}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LocationSection;