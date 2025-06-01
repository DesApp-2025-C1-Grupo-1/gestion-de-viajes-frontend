import { FormHelperText, Grid, TextField, Typography } from "@mui/material";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateDepositoSchema } from "../../api/schemas";

interface ContactSectionProps {
  errors: Record<string, any>;
  loading: boolean;
  register: UseFormRegister<CreateDepositoSchema>;
  watch: UseFormWatch<CreateDepositoSchema>;
}

const ContactSection = ({
  errors,
  loading,
  register,
  watch,
}: ContactSectionProps) => {
  const codigoPais = watch("contacto.telefono.codigo_pais")
  const mostrarCodigoArea = codigoPais === "54";

  return (
    <>
      <Typography variant="h6" sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.4rem", mb:2}}>
        Información de Contacto
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={7} >
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre de contacto</Typography>
          <TextField
            id="contacto.nombre"
            placeholder="Nombre del responsable"
            fullWidth
            className="inside-paper"
            {...register("contacto.nombre")}
            error={!!errors.contacto?.nombre}
            helperText={errors.contacto?.nombre?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={5} >
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb: 1 }}>Teléfono</Typography>
          <Grid container spacing={2}>
            <Grid item xs={mostrarCodigoArea ? 3 : 4}>
              <TextField
                id="contacto.telefono.codigo_pais"
                placeholder="+54"
                fullWidth
                className="inside-paper"
                {...register("contacto.telefono.codigo_pais")}
                error={!!errors.contacto?.telefono?.codigo_pais}
                disabled={loading}
              />
            </Grid>
            {mostrarCodigoArea && (
              <Grid item xs={2}>
                <TextField
                  id="contacto.telefono.codigo_area"
                  placeholder="11"
                  fullWidth
                  className="inside-paper"
                  {...register("contacto.telefono.codigo_area")}
                  error={!!errors.contacto?.telefono?.codigo_area}
                  disabled={loading}
                />
              </Grid>
            )}
            <Grid item xs={mostrarCodigoArea ? 7 : 8}>
              <TextField
                id="contacto.telefono.numero"
                placeholder="12345678"
                fullWidth
                className="inside-paper"
                {...register("contacto.telefono.numero")}
                error={!!errors.contacto?.telefono?.numero}
                disabled={loading}
              />
            </Grid>
          </Grid>
          
          {(errors.contacto?.telefono?.codigo_pais ||
            errors.contacto?.telefono?.codigo_area ||
            errors.contacto?.telefono?.numero) && (
            <FormHelperText error sx={{ mt: 1 }}>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {errors.contacto?.telefono?.codigo_pais?.message && (
                  <li>{errors.contacto?.telefono?.codigo_pais?.message}</li>
                )}
                {errors.contacto?.telefono?.codigo_area?.message && (
                  <li>{errors.contacto?.telefono?.codigo_area?.message}</li>
                )}
                {errors.contacto?.telefono?.numero?.message && (
                  <li>{errors.contacto?.telefono?.numero?.message}</li>
                )}
              </ul>
            </FormHelperText>
          )}

        </Grid>

        <Grid item xs={12} >
          <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Mail</Typography>
          <TextField
            id="contacto.email"
            placeholder="contacto@deposito.com"
            fullWidth
            className="inside-paper"
            type="email"
            {...register("contacto.email")}
            error={!!errors.contacto?.email}
            helperText={errors.contacto?.email?.message}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ContactSection;