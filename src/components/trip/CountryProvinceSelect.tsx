import { FormHelperText, Grid, MenuItem, Select, Typography } from "@mui/material";
import { Controller, UseFormSetValue } from "react-hook-form";
import { countriesData } from "../../services/countriesData";

interface CountryProvinceSelectProps {
  control: any;
  formErrors: any;
  selectedPais: string;
  filteredProvincias: any[];
  setFilteredProvincias: (provincias: any[]) => void;
  setValue: UseFormSetValue<any>;
  setAvailableRemitos: (remitos: any[]) => void;
  setSelectedRemitos: (remitos: number[]) => void;
  filterByProvince: (province: string) => void;
}

export const CountryProvinceSelect = ({
  control,
  formErrors,
  selectedPais,
  filteredProvincias,
  setFilteredProvincias,
  setValue,
  setAvailableRemitos,
  setSelectedRemitos,
  filterByProvince
}: CountryProvinceSelectProps) => {
  
  const handlePaisChange = (value: string) => {
    // Filtrar provincias según el país seleccionado
    const selectedCountry = countriesData.find(country => country._id === value);
    if (selectedCountry) {
      setFilteredProvincias(selectedCountry.provincias);
      
      // Limpiar selecciones relacionadas
      setValue("provincia_destino", "");
      setAvailableRemitos([]);
      setSelectedRemitos([]);

      // Ajustar tipo de viaje según el país seleccionado
      setValue("tipo_viaje", selectedCountry.nombre_comercial.toLowerCase() === "argentina" ? "nacional" : "internacional");
    }
  };

  return (
    <>
      <Grid item xs={12} md={6}>
        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>País</Typography>
        <Controller
          control={control}
          name="pais_destino"
          render={({ field }) => (
            <Select
              {...field}
              value={field.value || ""}
              fullWidth
              displayEmpty
              onChange={(event) => {
                field.onChange(event.target.value);
                handlePaisChange(event.target.value);
              }}
              error={!!formErrors.pais_destino}
            >
              <MenuItem value="" disabled>
                Seleccione un país
              </MenuItem>
              {countriesData.map((country) => (
                <MenuItem key={country._id} value={country._id}>
                  {country.nombre_comercial}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <FormHelperText error={!!formErrors.pais_destino}>
          {formErrors.pais_destino?.message}
        </FormHelperText>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>Estado/Provincia</Typography>
        <Controller
          control={control}
          name="provincia_destino"
          render={({ field }) => (
            <Select
              {...field}
              value={field.value || ""}
              fullWidth
              displayEmpty
              onChange={(event) => {
                field.onChange(event.target.value);
                filterByProvince(event.target.value);
              }}
              disabled={!selectedPais}
              error={!!formErrors.provincia_destino}
            >
              <MenuItem value="" disabled>
                {selectedPais ? "Seleccione una provincia/estado" : "Seleccione un país primero"}
              </MenuItem>
              {filteredProvincias.map((provincia) => (
                <MenuItem key={provincia.id} value={provincia.nombre} sx={{ textTransform: 'capitalize' }}>
                  {provincia.nombre}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <FormHelperText error={!!formErrors.provincia_destino}>
          {formErrors.provincia_destino?.message}
        </FormHelperText>
      </Grid>
    </>
  );
};