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
import { Info, Package, Truck, } from "lucide-react";
import { VehiculoDto } from "../../api/generated";

interface VehicleDetailsProps {
  vehicleSelected: VehiculoDto;
  setOpenDetailsDialog: (open: boolean) => void;
  openDetailsDialog: boolean;
}

export const DetailsVehicle = ({
  vehicleSelected,
  setOpenDetailsDialog,
  openDetailsDialog,
}: VehicleDetailsProps) => {
  return (
    <Dialog
      open={openDetailsDialog}
      onClose={() => setOpenDetailsDialog(false)}
      aria-labelledby="vehicle-details-title"
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
          id="vehicle-details-title"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: 22,
            color: "#5A5A65", // --color-dialog-title
          }}
        >
          <Truck className="h-6 w-6" color="#E65F2B" /> {/* --color-primary-orange */}
          Detalles del Vehículo
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3} mt={1}>
            {/* Información Básica */}
            <Grid item xs={12}>
              <HeaderDetails
                icon={<Truck className="h-5 w-5" color="#E65F2B" />}
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
                    <Field label="Patente" value={vehicleSelected.patente} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field label="Marca" value={vehicleSelected.marca} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field label="Modelo" value={vehicleSelected.modelo} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      label="Año"
                      value={vehicleSelected.año.toString()}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Carga */}
            <Grid item xs={12}>
              <HeaderDetails
                icon={<Package className="h-5 w-5" color="#E65F2B" />}
                title="Carga"
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
                      label="Peso (kg)"
                      value={`${vehicleSelected.peso_carga} kg`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      label="Volumen (m³)"
                      value={`${vehicleSelected.volumen_carga} m³`}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Información Adicional */}
            <Grid item xs={12}>
                <HeaderDetails
                    icon={<Info className="h-5 w-5" color="#E65F2B" />}
                    title="Información Adicional"
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
                                label="Tipo de Vehículo"
                                value={vehicleSelected.tipo.nombre}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                label="Empresa Transportista"
                                value={vehicleSelected.empresa.nombre_comercial}
                            />
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
