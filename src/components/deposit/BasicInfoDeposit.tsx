import { Grid, Typography, FormControl, Select, MenuItem, SelectChangeEvent, TextField } from "@mui/material";
import { DepositoDto } from "../../api/generated";
interface BasicInfoSectionProps {
  formData: Partial<DepositoDto>;
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
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.4rem", mb:2}}>
        Información Básica
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre de depósito</Typography>
          <TextField
            name="nombre"
            placeholder="Ej: Centro de distribución Norte"
            fullWidth
            className="inside-paper"
            value={formData.nombre}
            onChange={handleChange}
            error={touched.nombre && !!errors.nombre}
            helperText={touched.nombre && errors.nombre}
            disabled={loading}
          />
        </Grid>

        

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Tipo de depósito</Typography>
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