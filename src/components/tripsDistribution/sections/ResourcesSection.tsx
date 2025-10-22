import { Grid, Typography, MenuItem, Select, FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";
import { useDistributionFormContext } from "../../../contexts/DistributionFormContext";
import { ConditionalField } from "../fields/ConditionalField";
import { VehiculoDto } from "../../../api/generated";

export default function ResourcesSection() {
  const { form, permissions } = useDistributionFormContext();
  const { control, formState: { errors } } = form.form;

  return (
    <>
      <Typography variant="h6" sx={{ 
        color: "#5A5A65", 
        fontWeight: 550, 
        fontSize: "1.4rem", 
        mb: 2 
      }}>
        Asignar Recursos
      </Typography>
      
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
    </>
  );
}