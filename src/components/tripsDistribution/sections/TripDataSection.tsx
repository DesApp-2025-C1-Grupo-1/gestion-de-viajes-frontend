// components/distribution-form/sections/TripDataSection.tsx
import { Button, FormHelperText, Grid, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Controller, useWatch } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useDistributionFormContext } from "../../../contexts/DistributionFormContext";
import { ConditionalField } from "../fields/ConditionalField";
import { toLocalDate, toUTCDate } from "../../../lib/formatDate";
import { useState } from "react";
import { DepositoSelectModal } from "../../DepositSelectModal";
import { DepositoDto } from "../../../api/generated";

const depositoSelectButtonStyle = {
  height: "48px",
  textTransform: "none",
  color: (theme: any) => (theme.selected ? "#5A5A65" : "#c7c7c7"),
  borderRadius: "6px",
  border: "1px solid #C7C7C7",
  textAlign: "left",
  display: "flex",
  justifyContent: "space-between",
  padding: "0 16px",
  fontSize: "1rem",
  fontWeight: 400,
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#fff",
    borderColor: "#5A5A65",
  },
};

export default function TripDataSection() {
  const { form, permissions } = useDistributionFormContext();
  const { control, register, formState: { errors }, setValue} = form.form;
  const [openModal, setOpenModal] = useState(false);
  const [activeField, setActiveField] = useState<"origen" | null>(null);

  const selectedOrigen = useWatch({ control, name: "origen" });

  return (
    <>
      <Typography variant="h6" sx={{ 
        color: "#5A5A65", 
        fontWeight: 550, 
        fontSize: "1.4rem", 
        mb: 2 
      }}>
        Datos del Viaje
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        {/* Fecha de inicio */}
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
              Fecha y hora de inicio
            </Typography>
            <ConditionalField 
              permission={permissions.canEditFechaInicio}
              fieldName="fecha de inicio"
            >
              <Controller
                name="fecha_inicio"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    className="inside-paper" 
                    value={field.value ? toLocalDate(field.value) : null}
                    onChange={(date: Date | null) => field.onChange(toUTCDate(date))}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fecha_inicio,
                        helperText: errors.fecha_inicio?.message,
                      },
                    }}      
                    format="dd/MM/yyyy HH:mm" 
                  />
                )}
              />
              
            </ConditionalField>
          </LocalizationProvider>
        </Grid>

        {/* Depósito de Origen */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Depósito de Origen
          </Typography>
          <ConditionalField 
            permission={permissions.canEditOrigen}
            fieldName="depósito de origen"
          >
            <Button
                fullWidth
                variant="outlined"
                sx={{ ...depositoSelectButtonStyle, color: selectedOrigen ? "#5A5A65" : "#c7c7c7" }}
                onClick={() =>{ 
                  setOpenModal(true)
                  setActiveField("origen")
                }}
                aria-label="Seleccionar depósito de origen"
            >
                {selectedOrigen ?
                    form.depots?.find((dep: DepositoDto) => dep._id === selectedOrigen)?.nombre : "Seleccionar Depósito"
                }
            </Button>
          </ConditionalField>
          <FormHelperText error={!!errors.origen}>
            {errors.origen?.message}
          </FormHelperText>
        </Grid>

        {/* Kilómetros */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Kilómetros del camión
          </Typography>
          <ConditionalField 
            permission={permissions.canEditKilometrosIniciales}
            fieldName="kilómetros"
          >
            <TextField className="inside-paper" 
              id="kilometros" 
              type="number"
              placeholder="Ingresar km del camión"
              {...register("kilometros", {
                  valueAsNumber: true,
                  validate: (value : number) =>
                  !isNaN(value) && value >= 0.01 || "Mínimo 0.01 kms",
              })} 
              inputProps={{
                  "aria-label": "Kilómetros del camión",
                  step: "0.01",
                  min: "0.01"
              }} 
              fullWidth 
              error={!!errors.kilometros}
              helperText={errors.kilometros?.message as string | undefined}
            />
          </ConditionalField>
        </Grid>

        {/* Descripción */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Descripción (opcional)
          </Typography>
          <ConditionalField 
            permission={permissions.canEditDescripcion}
            fieldName="observaciones"
          >
            <TextField className="inside-paper"
              id="observaciones" 
              placeholder="Ingresar descripción"
              {...register("observaciones", {
                  maxLength: { value: 200, message: "Máximo 200 caracteres" }
              })} 
              inputProps={{
                  "aria-label": "Descripción del viaje",
                  maxLength: 200
              }} 
              fullWidth
              error={!!errors.descripcion}
              helperText={errors.descripcion?.message as string | undefined}
            />
          </ConditionalField>
        </Grid>
      </Grid>

      {/* Modal para seleccionar depósito */}
      <DepositoSelectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        depots={form.depots || []}
        selectedId={selectedOrigen}
        onSelect={(id) => {
            if (activeField) {
                setValue(activeField, id);
            }
            setOpenModal(false);
        }}
        title="Seleccionar depósito de origen"
    />
    </>
  );
}