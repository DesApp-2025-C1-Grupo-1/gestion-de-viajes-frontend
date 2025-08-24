import {
  Button,
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
import { MapPinned, CalendarDays, Route, Truck, Package, Info, UserRound, Phone, IdCard} from "lucide-react";
import { ChoferDto } from "../../api/generated";
import { formatTelefono } from "../../lib/formatters";

interface TripDetailsProps {
    choferSelected: ChoferDto;
    setOpenDetailsDialog: (open: boolean) => void;
    openDetailsDialog: boolean;
}

export const DriverDetailsDialog = ({choferSelected, setOpenDetailsDialog, openDetailsDialog}: TripDetailsProps) => {
    return(
        <Dialog 
            open={openDetailsDialog}
            onClose={() => setOpenDetailsDialog(false)}
            aria-labelledby="driver-details-title"
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
                    id="driver-details-title"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: 22,
                        color: "#5A5A65", 
                    }}
                >
                    <UserRound className="h-6 w-6" color="#E65F2B" /> 
                    Detalles del chofer
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} mt={1}>
                        {/* Informacion general */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<UserRound className="h-5 w-5" color="#E65F2B" />}
                                title="Información básica"
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
                                        <Field label="Nombre" value={choferSelected.nombre} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field label="Apellido" value={choferSelected.apellido} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field label="Fecha de nacimiento" value={new Date(choferSelected.fecha_nacimiento).toLocaleDateString()} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field label="DNI" value={choferSelected.dni} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Contacto */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<Phone className="h-5 w-5" color="#E65F2B" />}
                                title="Datos de contacto"
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
                                        <Field label="Email" value={choferSelected.email} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field label="Teléfono" value={formatTelefono(choferSelected.telefono)} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Licencia */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<IdCard className="h-5 w-5" color="#E65F2B" />}
                                title="Datos de licencia"
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
                                    label="Licencia"
                                    value={`${choferSelected.licencia}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                    label="Tipo de licencia"
                                    value={`${choferSelected.tipo_licencia}`}
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
                                            label="Empresa Transportista"
                                            value={choferSelected.empresa.nombre_comercial}
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Vehículo"
                                            value={choferSelected.vehiculo.modelo}
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
    )
}