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
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:2}}>
        Información Básica
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre de depósito</Typography>
          <TextField
            name="nombre"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
            value={formData.nombre}
            onChange={handleChange}
            error={touched.nombre && !!errors.nombre}
            helperText={touched.nombre && errors.nombre}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Dirección</Typography>
          <TextField
            name="direccion"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
            value={formData.direccion}
            onChange={handleChange}
            error={touched.direccion && !!errors.direccion}
            helperText={touched.direccion && errors.direccion}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Ciudad</Typography>
          <TextField
            name="ciudad"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
            value={formData.ciudad}
            onChange={handleChange}
            error={touched.ciudad && !!errors.ciudad}
            helperText={touched.ciudad && errors.ciudad}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Estado/Provincia</Typography>
          <TextField
            name="estado_provincia"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
            value={formData.estado_provincia}
            onChange={handleChange}
            error={touched.estado_provincia && !!errors.estado_provincia}
            helperText={touched.estado_provincia && errors.estado_provincia}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>País</Typography>
          <TextField
            name="pais"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
            value={formData.pais}
            onChange={handleChange}
            error={touched.pais && !!errors.pais}
            helperText={touched.pais && errors.pais}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Tipo</Typography>
            <Select
              name="tipo"
              fullWidth
              className="inside-paper"
              value={formData.tipo}
              onChange={handleSelectChange}
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