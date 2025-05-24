import { FormHelperText, Grid, TextField, Typography } from "@mui/material";
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
  const codigoPais = formData.contacto?.telefono.codigo_pais || "";
  const mostrarCodigoArea = codigoPais === "+54";

  return (
    <>
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:2}}>
        Información de Contacto
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre de contacto</Typography>
          <TextField
            name="contacto.nombre"
            placeholder="Nombre del responsable"
            fullWidth
            className="inside-paper"
            value={formData.contacto?.nombre}
            onChange={handleChange}
            error={touched['contacto.nombre'] && !!errors['contacto.nombre']}
            helperText={touched['contacto.nombre'] && errors['contacto.nombre']}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>Teléfono</Typography>
          <Grid container spacing={2}>
            <Grid item xs={mostrarCodigoArea ? 3 : 4}>
              <TextField
                name="contacto.telefono.codigo_pais"
                placeholder="+54"
                fullWidth
                className="inside-paper"
                value={formData.contacto?.telefono.codigo_pais || ""}
                onChange={handleChange}
                error={touched['contacto.telefono.codigo_pais'] && !!errors['contacto.telefono.codigo_pais']}
                disabled={loading}
              />
            </Grid>
            {mostrarCodigoArea && (
              <Grid item xs={3}>
                <TextField
                  name="contacto.telefono.codigo_area"
                  placeholder="11"
                  fullWidth
                  className="inside-paper"
                  value={formData.contacto?.telefono.codigo_area || ""}
                  onChange={handleChange}
                  error={!!errors['contacto.telefono.codigo_area'] && touched['contacto.telefono.codigo_area']}
                  disabled={loading}
                />
              </Grid>
            )}
            <Grid item xs={mostrarCodigoArea ? 6 : 8}>
              <TextField
                name="contacto.telefono.numero"
                placeholder="12345678"
                fullWidth
                className="inside-paper"
                value={formData.contacto?.telefono.numero || ""}
                onChange={handleChange}
                error={touched['contacto.telefono.numero'] && !!errors['contacto.telefono.numero']}
                disabled={loading}
              />
            </Grid>
          </Grid>
          
          {(touched['contacto.telefono.codigo_pais'] ||
            touched['contacto.telefono.codigo_area'] ||
            touched['contacto.telefono.numero']) &&
            (errors['contacto.telefono.codigo_pais'] ||
              errors['contacto.telefono.codigo_area'] ||
              errors['contacto.telefono.numero']) && (
              <FormHelperText error sx={{  mt: 1 }}>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {errors['contacto.telefono.codigo_pais'] && <li>{errors['contacto.telefono.codigo_pais']}</li>}
                  {errors['contacto.telefono.codigo_area'] && <li>{errors['contacto.telefono.codigo_area']}</li>}
                  {errors['contacto.telefono.numero'] && <li>{errors['contacto.telefono.numero']}</li>}
                </ul>
              </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Email</Typography>
          <TextField
            name="contacto.email"
            placeholder="contacto@deposito.com"
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