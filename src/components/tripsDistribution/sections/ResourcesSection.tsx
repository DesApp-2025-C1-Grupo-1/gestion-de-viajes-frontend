import { Grid, Typography, MenuItem, Select, FormHelperText, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Controller } from "react-hook-form";
import { useDistributionFormContext } from "../../../contexts/DistributionFormContext";
import { ConditionalField } from "../fields/ConditionalField";
import { VehiculoDto } from "../../../api/generated";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ResourcesSection() {
  const { form, permissions } = useDistributionFormContext();
  const { control, formState: { errors } } = form.form;
  const bloqueada = !permissions.canEditTransportista && !permissions.canEditChofer && !permissions.canEditVehiculo;
  const [expanded, setExpanded] = useState(!bloqueada);

  const handleChange = () => {
    setExpanded(!expanded);
  };
  return (
    <Accordion
      expanded={!bloqueada && expanded}    // si bloqueada = true → nunca se abre
      onChange={!bloqueada ? handleChange : undefined}
      elevation={0}
      disableGutters
      square
      sx={{
        backgroundColor: "transparent",
        "&:before": { display: "none" }, // quita la línea gris superior
        mb: 3,
      }}
    >
      <AccordionSummary
        expandIcon={!bloqueada ? <ChevronDown /> : null}
        sx={{
          px: 0,
          cursor: bloqueada ? "default" : "pointer",
          color: "#5A5A65",
          fontWeight: 600,
          opacity: 1,                 // <- fuerza a no verse gris
          backgroundColor: "transparent !important", 
          "&.Mui-disabled": {
            opacity: 1,               // <- evita el gris de MUI
            backgroundColor: "transparent",
          },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#5A5A65",
              fontWeight: 550,
              fontSize: "1.4rem",
              mb: bloqueada ? 0 : 2,
            }}
          >
            Asignar Recursos
          </Typography>

          {bloqueada && (
            <Typography
              sx={{
                color: "#8A8A95",
                fontSize: "0.85rem",
                mt: 0.5,
              }}
            >
              No tiene permisos para editar recursos, el estado del viaje no lo permite.
            </Typography>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails sx={{padding: 0}}>
      <Grid container spacing={3} mb={4}>
        {/* Empresa Transportista */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Empresa Transportista
          </Typography>
          <ConditionalField 
            permission={permissions.canEditTransportista}
            fieldName="empresa transportista"
          >
            <Controller
              control={control}
              name="transportista"
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ""}
                  fullWidth
                  displayEmpty
                  error={!!errors.transportista}
                >
                  <MenuItem value="" disabled>
                    Seleccione una empresa
                  </MenuItem>
                  {form.companies?.map((company: any) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.nombre_comercial}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText error={!!errors.transportista}>
              {errors.transportista?.message}
            </FormHelperText>
          </ConditionalField>
        </Grid>

        {/* Chofer */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Chofer a asignar
          </Typography>
          <ConditionalField 
            permission={permissions.canEditChofer}
            fieldName="chofer"
          >
            <Controller
              control={control}
              name="chofer"
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ""}
                  fullWidth
                  displayEmpty
                  onChange={(event) => {
                    field.onChange(event);
                    form.handleSelectChofer(event.target.value);
                  }}
                  disabled={!control._formValues.transportista}
                  error={!!errors.chofer}
                >
                  <MenuItem value="" disabled>
                    {control._formValues.transportista ? "Seleccione un chofer" : "Seleccione una empresa primero"}
                  </MenuItem>
                  {form.filteredChoferes?.map((chofer: any) => (
                    <MenuItem key={chofer._id} value={chofer._id}>
                      {chofer.nombre} {chofer.apellido}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText error={!!errors.chofer}>
              {errors.chofer?.message}
            </FormHelperText>
          </ConditionalField>
        </Grid>

        {/* Vehículo */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
            Vehículo a utilizar
          </Typography>
          <ConditionalField 
            permission={permissions.canEditVehiculo}
            fieldName="vehículo"
          >
            <Controller
              control={control}
              name="vehiculo"
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ""}
                  fullWidth
                  displayEmpty
                  disabled={!control._formValues.transportista}
                  error={!!errors.vehiculo}
                >
                  <MenuItem value="" disabled>
                    {control._formValues.transportista ? "Seleccione un vehículo" : "Seleccione una empresa primero"}
                  </MenuItem>
                  {form.filteredVehiculos?.map((vehiculo: VehiculoDto) => (
                    <MenuItem key={vehiculo._id} value={vehiculo._id}>
                      {vehiculo.marca} - {vehiculo.patente}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText error={!!errors.vehiculo}>
              {errors.vehiculo?.message}
            </FormHelperText>
          </ConditionalField>
        </Grid>
      </Grid>
      </AccordionDetails>
    </Accordion>
  );
}