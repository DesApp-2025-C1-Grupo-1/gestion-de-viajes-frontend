import { Grid, TextField, Typography } from "@mui/material";
import { Deposit } from "../../types";

interface ContactSectionProps {
  formData: Partial<Deposit>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const ContactSection = ({
  formData,
  errors,
  touched,
  loading,
  handleChange
}: ContactSectionProps) => {
  return (
    <>
      <Typography variant="h6" sx={{ color: "text.secondary", mb: 3 }}>
        Información de Contacto
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="contacto.nombre"
            label="Nombre de contacto"
            value={formData.contacto?.nombre}
            onChange={handleChange}
            error={touched['contacto.nombre'] && !!errors['contacto.nombre']}
            helperText={touched['contacto.nombre'] && errors['contacto.nombre']}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="contacto.telefono"
            label="Teléfono"
            value={formData.contacto?.telefono}
            onChange={handleChange}
            error={touched['contacto.telefono'] && !!errors['contacto.telefono']}
            helperText={touched['contacto.telefono'] && errors['contacto.telefono']}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            name="contacto.email"
            label="Email"
            type="email"
            value={formData.contacto?.email}
            onChange={handleChange}
            error={touched['contacto.email'] && !!errors['contacto.email']}
            helperText={touched['contacto.email'] && errors['contacto.email']}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ContactSection;