import { Grid, Typography, TextField } from "@mui/material";
import { LocalizationProvider, renderTimeViewClock, TimePicker } from "@mui/x-date-pickers";
import { Control, Controller, UseFormRegister } from "react-hook-form";
import { CreateDepositoSchema } from "../../api/schemas";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface BasicInfoSectionProps {
  errors: Record<string, any>;
  loading: boolean;
  register: UseFormRegister<CreateDepositoSchema>;
  control: Control<CreateDepositoSchema>;
}

// Helper: convierte string "HH:mm" a Date
const timeStringToDate = (timeStr: string | undefined) => {
  return timeStr ? new Date(`2000-01-01T${timeStr}`) : null;
};

const TimeSection = ({
  errors,
  loading,
  register,
  control,
}: BasicInfoSectionProps) => {

  return (
    <>
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.4rem", mb:2}}>
        Horarios
      </Typography>
      
      <Grid container spacing={3} mb={4} >

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#5A5A65", fontSize: "0.900rem", mb: 1 }}>Horario de entrada</Typography>
            <Controller
              name="horario_entrada"
              control={control}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  ampm={false}
                  disabled={loading}
                  value={timeStringToDate(field.value)}
                  onChange={(date) => {
                    field.onChange(date ? date.toTimeString().slice(0, 5) : "");
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      className: "inside-paper",
                      error: !!errors.horario_entrada,
                      helperText: errors.horario_entrada?.message,
                    },
                  }}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#5A5A65", fontSize: "0.900rem", mb: 1 }}>Horario de salida</Typography>
            <Controller
              name="horario_salida"
              control={control}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  ampm={false}
                  disabled={loading}
                  value={timeStringToDate(field.value)}
                  onChange={(date) => {
                    field.onChange(date ? date.toTimeString().slice(0, 5) : "");
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      className: "inside-paper",
                      error: !!errors.horario_salida,
                      helperText: errors.horario_salida?.message,
                    },
                  }}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
              )}
            />
          </Grid>
        </LocalizationProvider>

        <Grid item xs={12}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Restricciones de acceso</Typography>
          <TextField
            id="restricciones"
            placeholder="Ej: Vehiculos de más de 3.5 toneladas no pueden ingresar"
            fullWidth
            {...register("restricciones")}
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