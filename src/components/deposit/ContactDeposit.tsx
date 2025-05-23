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
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:2}}>
        Información de Contacto
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre de contacto</Typography>
          <TextField
            name="contacto.nombre"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
            value={formData.contacto?.nombre}
            onChange={handleChange}
            error={touched['contacto.nombre'] && !!errors['contacto.nombre']}
            helperText={touched['contacto.nombre'] && errors['contacto.nombre']}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Telefono</Typography>
          <TextField
            name="contacto.telefono"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
            value={formData.contacto?.telefono}
            onChange={handleChange}
            error={touched['contacto.telefono'] && !!errors['contacto.telefono']}
            helperText={touched['contacto.telefono'] && errors['contacto.telefono']}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Email</Typography>
          <TextField
            name="contacto.email"
            placeholder="Ingresar"
            fullWidth
            className="inside-paper"
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