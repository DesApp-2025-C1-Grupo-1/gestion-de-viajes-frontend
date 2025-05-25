import { Grid, Typography, SelectChangeEvent, TextField } from "@mui/material";
import { format } from "date-fns";
import { Deposit } from "../../types";
import { LocalizationProvider, renderTimeViewClock, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
interface BasicInfoSectionProps {
  formData: Partial<Deposit>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const TimeSection = ({
  formData,
  errors,
  touched,
  loading,
  handleChange,
}: BasicInfoSectionProps) => {

  // Helper: convierte string "HH:mm" a Date
  const timeStringToDate = (timeStr: string | undefined) => {
    return timeStr ? new Date(`2000-01-01T${timeStr}`) : null;
  };

  // Wrapper para simular evento y reutilizar handleChange
  const handleTimePickerChange = (name: string, value: Date | null) => {
    const stringValue = value ? format(value, "HH:mm") : "";
    handleChange({
      target: {
        name,
        value: stringValue
      }
    } as React.ChangeEvent<any>);
  };

  return (
    <>
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.4rem", mb:2}}>
        Horarios
      </Typography>
      
      <Grid container spacing={3} mb={4} >

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>Horario de entrada</Typography>
            <TimePicker
              value={timeStringToDate(formData.horario_entrada)}
              onChange={(value) => handleTimePickerChange("horario_entrada", value)}
              disabled={loading}
              slotProps={{
                textField: {
                  fullWidth: true,
                  className: "inside-paper",
                  error: touched.horario_entrada && !!errors.horario_entrada,
                  helperText: touched.horario_entrada && errors.horario_entrada,
                }
              }}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
            
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>Horario de salida</Typography>
            <TimePicker
              value={timeStringToDate(formData.horario_salida)}
              onChange={(value) => handleTimePickerChange("horario_salida", value)}
              disabled={loading}
              slotProps={{
                textField: {
                  fullWidth: true,
                  className: "inside-paper",
                  error: touched.horario_salida && !!errors.horario_salida,
                  helperText: touched.horario_salida && errors.horario_salida,
                }
              }}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
          </Grid>
        </LocalizationProvider>

        <Grid item xs={12}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Restricciones de acceso</Typography>
          <TextField
            name="restricciones"
            placeholder="Ej: Vehiculos de más de 3.5 toneladas no pueden ingresar"
            fullWidth
            value={formData.restricciones || ''}
            onChange={handleChange}
            disabled={loading}
            multiline
            minRows={3}
          />
          
        </Grid>
      </Grid>
    </>
  );
};

export default TimeSection;