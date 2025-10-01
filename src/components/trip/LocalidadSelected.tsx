import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import { Localidad, Provincia, useLocalidades } from "../../hooks/useGeoref";
import { ConditionalField } from "../tripsDistribution/fields/ConditionalField";

interface Props {
  selectedProvincia: Provincia | null;
  selectedPais: string;
  selectedLocalidad: Localidad | null;
  setSelectedLocalidad: (loc: Localidad | null) => void;
  permissions: any;
}

export const LocalidadSelect = ({
  selectedProvincia,
  selectedPais,
  selectedLocalidad,
  setSelectedLocalidad,
  permissions
}: Props) => {
  const { localidades, loading } = useLocalidades(selectedPais, selectedProvincia);

  // Eliminar duplicados por id (o nombre si no hay id)
  const uniqueLocalidades = Array.from(
    new Map(localidades.map((loc) => [loc.nombre, loc])).values()
  );

  return (
    <Grid item xs={12} md={6}>
      <Typography sx={{ color: "#5A5A65", fontSize: "0.9rem", mb: 1 }}>
        Localidad
      </Typography>
      <ConditionalField 
        permission={permissions.canEditPais}
        fieldName="pais"
      >
        <Autocomplete
          disablePortal
          id="combo-box-localidades"
          className="inside-paper"
          options={uniqueLocalidades}
          getOptionLabel={(option) => option.nombre}
          // Add getOptionKey to ensure unique keys
          getOptionKey={(option) => option.id || option.nombre}
          value={selectedLocalidad}
          onChange={(event, newValue) => setSelectedLocalidad(newValue)}
          loading={loading}
          disabled={!selectedProvincia || loading}
          isOptionEqualToValue={(option, value) => option.nombre === value?.nombre}
          noOptionsText="No hay localidades"
          filterOptions={(options, params) =>
            options.filter((option) =>
              option.nombre.toLowerCase().includes(params.inputValue.toLowerCase())
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              className="inside-paper"
              placeholder={
                loading
                  ? "Cargando..."
                  : selectedProvincia
                  ? "Seleccione una localidad"
                  : "Seleccione una provincia primero"
              }
              disabled={!selectedProvincia || loading}
            />
          )}
        />
      </ConditionalField>
    </Grid>
  );
};