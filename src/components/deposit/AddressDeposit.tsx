import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField } from "@mui/material";

import { Deposit, Direccion } from "../../types";

interface AdressSectionProps {
  formData: Partial<Deposit>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
}

const AdressSection = ({
  formData,
  errors,
  touched,
  loading,
  handleChange,
}: AdressSectionProps) => {
  const direccion : Direccion = formData.direccion || {} as Direccion;

  return (
    <>
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.4rem", mb:2}}>
        Dirección
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Calle</Typography>
          <TextField
            name="direccion.calle"
            placeholder="Ej: Avenida Libertador"
            fullWidth
            className="inside-paper"
            value={direccion.calle ?? ""}
            onChange={handleChange}
             error={touched["direccion.calle"] && !!errors["direccion.calle"]}
            helperText={touched["direccion.calle"] && errors["direccion.calle"]}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Número</Typography>
          <TextField
            name="direccion.numero"
            placeholder="Ej: 1234"
            fullWidth
            className="inside-paper"
            value={direccion.numero ?? ""}
            onChange={handleChange}
            error={touched["direccion.numero"] && !!errors["direccion.numero"]}
            helperText={touched["direccion.numero"] && errors["direccion.numero"]}
            disabled={loading}
          />
        </Grid>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Ciudad</Typography>
          <TextField
            name="direccion.ciudad"
            placeholder="Ej: Palermo"
            fullWidth
            className="inside-paper"
            value={direccion.ciudad ?? ""}
            onChange={handleChange}
            error={touched["direccion.ciudad"] && !!errors["direccion.ciudad"]}
            helperText={touched["direccion.ciudad"] && errors["direccion.ciudad"]}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Estado/Provincia</Typography>
          <TextField
            name="direccion.estado_provincia"
            placeholder="Ej: Buenos Aires"
            fullWidth
            className="inside-paper"
            value={direccion.estado_provincia ?? ""}
            onChange={handleChange}
            error={touched["direccion.estado_provincia"] && !!errors["direccion.estado_provincia"]}
            helperText={touched["direccion.estado_provincia"] && errors["direccion.estado_provincia"]}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>País</Typography>
          <TextField
            name="direccion.pais"
            placeholder="Ej: Argentina"
            fullWidth
            className="inside-paper"
            value={direccion.pais ?? ""}
            onChange={handleChange}
            error={touched["direccion.pais"] && !!errors["direccion.pais"]}
            helperText={touched["direccion.pais"] && errors["direccion.pais"]}
            disabled={loading}
          />
        </Grid>
        </Grid>
        

        
      </Grid>
    </>
  );
};

export default AdressSection;