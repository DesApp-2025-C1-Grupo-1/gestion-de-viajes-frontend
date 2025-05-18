import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField } from "@mui/material";

import { Deposit } from "../../types";

interface BasicInfoSectionProps {
  formData: Partial<Deposit>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
}

const BasicInfoSection = ({
  formData,
  errors,
  touched,
  loading,
  handleChange,
  handleSelectChange
}: BasicInfoSectionProps) => {
  return (
    <>
      <Typography variant="h6" sx={{ color: "text.secondary", mb: 3 }}>
        Información Básica
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={touched.nombre && !!errors.nombre}
            helperText={touched.nombre && errors.nombre}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="direccion"
            label="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            error={touched.direccion && !!errors.direccion}
            helperText={touched.direccion && errors.direccion}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="ciudad"
            label="Ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            error={touched.ciudad && !!errors.ciudad}
            helperText={touched.ciudad && errors.ciudad}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="estado_provincia"
            label="Estado/Provincia"
            value={formData.estado_provincia}
            onChange={handleChange}
            error={touched.estado_provincia && !!errors.estado_provincia}
            helperText={touched.estado_provincia && errors.estado_provincia}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="pais"
            label="País"
            value={formData.pais}
            onChange={handleChange}
            error={touched.pais && !!errors.pais}
            helperText={touched.pais && errors.pais}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              name="tipo"
              value={formData.tipo}
              onChange={handleSelectChange}
              label="Tipo"
              error={touched.tipo && !!errors.tipo}
              disabled={loading}
            >
              <MenuItem value="propio">Propio</MenuItem>
              <MenuItem value="tercero">Tercero</MenuItem>
            </Select>
            {touched.tipo && errors.tipo && (
              <Typography color="error" variant="caption" display="block">
                {errors.tipo}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default BasicInfoSection;