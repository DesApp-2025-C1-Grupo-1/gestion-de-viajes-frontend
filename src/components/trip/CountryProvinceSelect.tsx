import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { countriesData } from "../../services/countriesData";
import { Localidad, Provincia, useProvincias } from "../../hooks/useGeoref";
import { useEffect } from "react";

interface CountryProvinceSelectProps {
  selectedPais: string;
  setSelectedPais: (pais: string) => void;
  selectedProvincia: Provincia | null;
  setSelectedProvincia: (provincia: Provincia | null) => void;
  setSelectedLocalidad: (localidad: string) => void;
}

export const CountryProvinceSelect = ({
  selectedPais,
  setSelectedPais,
  selectedProvincia,
  setSelectedProvincia,
  setSelectedLocalidad
}: CountryProvinceSelectProps) => {
  const {provincias, loading} = useProvincias(selectedPais);

  // Cuando cambia el país, resetear provincia y localidad
  useEffect(() => {
    setSelectedProvincia(null);
    setSelectedLocalidad("");
  }, [selectedPais]);

  // Cuando cambia la provincia, resetear localidad
  useEffect(() => {
    setSelectedLocalidad("");
  }, [selectedProvincia]);

  return (
    <>
      <Grid item xs={12} md={6}>
        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
          País de destino
        </Typography>
        <Select
          value={selectedPais}
          fullWidth
          displayEmpty
          onChange={(event) => setSelectedPais(event.target.value)}
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
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>
          Provincia/Estado
        </Typography>
        <Select
          value={selectedProvincia?.nombre || ""}
          fullWidth
          displayEmpty
          onChange={(event) => {
            const provinciaId = event.target.value;
            const provincia = provincias.find(p => p.nombre === provinciaId);
            if (provincia) {
              setSelectedProvincia(provincia);
            }
          }}
          disabled={!selectedPais}
        >
          <MenuItem value="" disabled>
            {selectedPais ? (loading ? 'Cargando...' : 'Seleccione una provincia/estado') : 'Seleccione un país primero'}
          </MenuItem>
          {provincias.map((provincia) => (
            <MenuItem key={provincia.id} value={provincia.nombre} sx={{ textTransform: 'capitalize' }}>
              {provincia.nombre}
            </MenuItem>
          ))}
        </Select>
      </Grid>

    </>
  );
};