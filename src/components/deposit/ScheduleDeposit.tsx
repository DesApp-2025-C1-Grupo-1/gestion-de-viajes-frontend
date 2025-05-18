import { Grid, TextField, Typography } from "@mui/material";
import { Deposit } from "../../types";

interface ScheduleSectionProps {
  formData: Partial<Deposit>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const ScheduleSection = ({
  formData,
  errors,
  touched,
  loading,
  handleChange
}: ScheduleSectionProps) => {
  return (
    <>
      <Typography variant="h6" sx={{ color: "text.secondary", mb: 3 }}>
        Horario
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="horario_entrada"
            label="Horario Entrada"
            type="time"
            value={formData.horario_entrada}
            onChange={handleChange}
            error={touched.horario_entrada && !!errors.horario_entrada}
            helperText={touched.horario_entrada && errors.horario_entrada}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="horario_salida"
            label="Horario Salida"
            type="time"
            value={formData.horario_salida}
            onChange={handleChange}
            error={touched.horario_salida && !!errors.horario_salida}
            helperText={touched.horario_salida && errors.horario_salida}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            name="restricciones"
            label="Restricciones"
            value={formData.restricciones || ''}
            onChange={handleChange}
            error={touched.restricciones && !!errors.restricciones}
            helperText={touched.restricciones && errors.restricciones}
            disabled={loading}
            multiline
            rows={3}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ScheduleSection;