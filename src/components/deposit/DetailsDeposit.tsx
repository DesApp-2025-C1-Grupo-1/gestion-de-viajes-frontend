import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Field } from "../detailts/Field";
import { HeaderDetails } from "../detailts/HeaderDetails";
import { Building2, Clock, MapPin, Users } from "lucide-react";
import { formatTelefono } from "../../lib/formatters";
import { DepositoDto } from "../../api/generated";

interface DepositDetailsProps {
  depositSelected: DepositoDto;
  setOpenDetailsDialog: (open: boolean) => void;
  openDetailsDialog: boolean;
}

export const DetailsDeposit = ({
  depositSelected,
  setOpenDetailsDialog,
  openDetailsDialog,
}: DepositDetailsProps) => {
  return (
    <Dialog
      open={openDetailsDialog}
      onClose={() => setOpenDetailsDialog(false)}
      aria-labelledby="deposit-details-title"
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 3,
          px: 3,
          py: 2,
        },
      }}
    >
      <>
        <DialogTitle
          id="deposit-details-title"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: 22,
            color: "#5A5A65", // --color-dialog-title
          }}
        >
          <Building2 className="h-6 w-6" color="#E65F2B" /> {/* --color-primary-orange */}
          Detalles del Depósito
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3} mt={1}>
            {/* Información Básica */}
            <Grid item xs={12}>
              <HeaderDetails
                icon={<Building2 className="h-5 w-5" color="#E65F2B" />}
                title="Información Básica"
              />
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "#F6F7FB", // --color-table-header
                  borderColor: "#C7C7C7", // --color-line
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field label="Nombre" value={depositSelected.nombre} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      label="Tipo"
                      value={
                        <Chip
                          label={depositSelected.tipo === "propio" ? "Propio" : "Terceros"}
                          color={depositSelected.tipo === "propio" ? "primary" : "default"}
                          size="small"
                        />
                      }
                    />
                  </Grid>
                </Grid>
                {depositSelected.restricciones && (
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Restricciones de Acceso
                    </Typography>
                    <Typography variant="body2">
                      {depositSelected.restricciones}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
              <HeaderDetails
                icon={<MapPin className="h-5 w-5" color="#E65F2B" />}
                title="Dirección"
              />
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "#F6F7FB",
                  borderColor: "#C7C7C7",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      label="Calle y Número"
                      value={`${depositSelected.direccion.calle} ${depositSelected.direccion.numero}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field label="Ciudad" value={depositSelected.direccion.ciudad} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      label="Provincia - País"
                      value={`${depositSelected.direccion.estado_provincia} - ${depositSelected.direccion.pais}`}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Coordenadas */}
            {(depositSelected.lat !== 0 || depositSelected.long !== 0) && (
              <Grid item xs={12}>
                <HeaderDetails
                  icon={<MapPin className="h-5 w-5" color="#E65F2B" />}
                  title="Coordenadas"
                />
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: "#F6F7FB",
                    borderColor: "#C7C7C7",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field label="Latitud" value={depositSelected.lat.toLocaleString()} mono />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field label="Longitud" value={depositSelected.long.toLocaleString()} mono />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Contacto */}
            <Grid item xs={12}>
              <HeaderDetails
                icon={<Users className="h-5 w-5" color="#E65F2B" />}
                title="Información de Contacto"
              />
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "#F6F7FB",
                  borderColor: "#C7C7C7",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Field label="Nombre" value={depositSelected.contacto.nombre} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Field label="Email" value={depositSelected.contacto.email} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Field
                      label="Teléfono"
                      value={formatTelefono(depositSelected.contacto.telefono)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Horarios */}
            <Grid item xs={12}>
              <HeaderDetails
                icon={<Clock className="h-5 w-5" color="#E65F2B" />}
                title="Horarios de Operación"
              />
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "#F6F7FB",
                  borderColor: "#C7C7C7",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field label="Horario de Entrada" value={depositSelected.horario_entrada} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field label="Horario de Salida" value={depositSelected.horario_salida} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDetailsDialog(false)}
            variant="contained"
            sx={{
              backgroundColor: "#E65F2B",
              "&:hover": {
                backgroundColor: "#C94715",
              },
              color: "#FFF",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
};
