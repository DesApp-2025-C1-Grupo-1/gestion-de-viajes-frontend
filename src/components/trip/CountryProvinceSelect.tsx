import { FormHelperText, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { countriesData } from "../../services/countriesData";

interface CountryProvinceSelectProps {
  selectedPais: string;
  setSelectedPais: (pais: string) => void;
  selectedProvincia: string;
  setSelectedProvincia: (provincia: string) => void;
  setAvailableRemitos: (remitos: any[]) => void;
  setSelectedRemitos: (remitos: number[]) => void;
  remitosData: any;
}

export const CountryProvinceSelect = ({
  selectedPais,
  setSelectedPais,
  selectedProvincia,
  setSelectedProvincia,
  setAvailableRemitos,
  setSelectedRemitos,
  remitosData
}: CountryProvinceSelectProps) => {
  const [filteredProvincias, setFilteredProvincias] = useState<any[]>([]);

  // Filtrar provincias según el país seleccionado
  useEffect(() => {
    if (selectedPais) {
      const selectedCountry = countriesData.find(country => country._id === selectedPais);
      if (selectedCountry) {
        setFilteredProvincias(selectedCountry.provincias);
        
        // Limpiar la selección de provincia cuando se cambia de país
        setSelectedProvincia("");
        setAvailableRemitos([]);
        setSelectedRemitos([]);
      }
    } else {
      setFilteredProvincias([]);
    }
  }, [selectedPais, setSelectedProvincia, setAvailableRemitos, setSelectedRemitos]);

  // Cuando se selecciona una provincia, filtrar los remitos disponibles
  useEffect(() => {
    if (selectedProvincia) {
      const filtered = remitosData?.data.filter((remito: any) => 
        remito.destino.provincia.toLowerCase() === selectedProvincia.toLowerCase()
      );
      setAvailableRemitos(filtered || []);
    }
  }, [selectedProvincia, remitosData, setAvailableRemitos]);

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
          value={selectedProvincia}
          fullWidth
          displayEmpty
          onChange={(event) => setSelectedProvincia(event.target.value)}
          disabled={!selectedPais}
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
      </Grid>
    </>
  );
};