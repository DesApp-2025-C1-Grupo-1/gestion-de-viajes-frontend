import { Alert, FormHelperText, Grid, MenuItem, Select, Typography } from "@mui/material";
import { Controller, UseFormSetValue } from "react-hook-form";
import { getTarifasFiltradas, Tarifa, zonas } from "../../services/zonaTarifas";
import { CreateViajeDistribucionSchema } from "../../api/schemas/viajeDistribucion.schema";
import { ta } from "date-fns/locale";

interface ZonaTarifaSelectProps {
  control: any;
  formErrors: any;
  empresaId: string;
  vehiculoId: string;
  selectedPais: string;
  selectedZona: number | null;
  setSelectedZona: (zonaId: number | null) => void;
  tarifasDisponibles: Tarifa[];
  setTarifasDisponibles: (tarifas: Tarifa[]) => void;
  setValues: UseFormSetValue<CreateViajeDistribucionSchema>;
}

export const ZonaTarifaSelect = ({
  control,
  formErrors,
  empresaId,
  vehiculoId,
  selectedPais,
  selectedZona,
  setSelectedZona,
  tarifasDisponibles,
  setTarifasDisponibles,
  setValues
}: ZonaTarifaSelectProps) => {
  
  const handleZonaChange = (zonaId: number) => {
    setSelectedZona(zonaId);
    
    // Filtrar tarifas según empresa, vehículo y zona seleccionada
    if (empresaId && vehiculoId) {
      const tarifasFiltradas = getTarifasFiltradas(empresaId, vehiculoId, zonaId);
      setTarifasDisponibles(tarifasFiltradas);
      setValues("tarifa", tarifasFiltradas[0]?.id.toString() || ""); // Resetear selección de tarifa
    }

  };

  // Solo mostrar para Argentina
  if (selectedPais !== "ARG") {
    return null;
  }

  return (
    <>
      <Typography variant="h6" sx={{ color: "#5A5A65", fontWeight: 550, fontSize: "1.4rem", mb: 2, mt: 4 }}>
        Asignar Tarifa
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>Zona</Typography>
          <Select
            fullWidth
            value={selectedZona !== null ? String(selectedZona) : ""}
            displayEmpty
            onChange={(event) => handleZonaChange(Number(event.target.value))}
            disabled={!empresaId || !vehiculoId}
          >
            <MenuItem value="" disabled>
              {empresaId && vehiculoId ? "Seleccione una zona" : "Seleccione empresa y vehículo primero"}
            </MenuItem>
            {zonas.map((zona) => (
              <MenuItem key={zona.id} value={zona.id}>
                {zona.nombre} - {zona.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>Tarifa</Typography>
          <Controller
            control={control}
            name="tarifa"
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  value={field.value || ""}
                  fullWidth
                  displayEmpty
                  onChange={(event) => field.onChange(event.target.value.toString())}
                  disabled={!selectedZona || tarifasDisponibles.length === 0}
                  error={!!formErrors.tarifa}
                >
                  <MenuItem value="" disabled>
                    {!selectedZona 
                      ? "Seleccione una zona primero" 
                      : tarifasDisponibles.length === 0
                        ? "No hay tarifas disponibles para esta combinación"
                        : "Seleccione una tarifa"}
                  </MenuItem>
                  {tarifasDisponibles.map((tarifa) => (
                    <MenuItem key={tarifa.id} value={tarifa.id}>
                      {tarifa.nombre} - ${tarifa.valorBase.toString()}
                    </MenuItem>
                  ))}
                </Select>
                {tarifasDisponibles.length > 0 && field.value && (
                  <Alert sx={{ mt: 1 }}>
                    Valor: ${tarifasDisponibles.find(t => t.id === Number(field.value))?.valorBase || "N/A"}
                  </Alert>
                )}
              </>
            )}
          />
          <FormHelperText error={!!formErrors.tarifa}>
            {formErrors.tarifa?.message}
          </FormHelperText>
        </Grid>
      </Grid>
    </>
  );
};