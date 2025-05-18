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
      <Typography variant="h6" sx={{ color: "text.secondary", mb: 3 }}>
        Ubicación
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="lat"
            label="Latitud"
            value={formData.lat}
            onChange={handleChange}
            error={touched.lat && !!errors.lat}
            helperText={touched.lat && errors.lat}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="long"
            label="Longitud"
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