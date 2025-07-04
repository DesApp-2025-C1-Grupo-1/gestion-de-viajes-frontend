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
import { MapPinned, CalendarDays, Route, Truck} from "lucide-react";
import { ViajeDto } from "../../api/generated";
import { TripType } from "../TripType";

interface TripDetailsProps {
    triptSelected: ViajeDto;
    setOpenDetailsDialog: (open: boolean) => void;
    openDetailsDialog: boolean;
}

export const DetailsTrip = ({triptSelected, setOpenDetailsDialog, openDetailsDialog}: TripDetailsProps) => {
    return(
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
                    id="trip-details-title"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: 22,
                        color: "#5A5A65", 
                    }}
                >
                    <MapPinned className="h-6 w-6" color="#E65F2B" /> 
                    Detalles del Viaje
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} mt={1}>
                        {/* Informacion general */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<MapPinned className="h-5 w-5" color="#E65F2B" />}
                                title="Información General"
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
                                        <Field label="Número de viaje" value={triptSelected._id} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Tipo de viaje"
                                            value={ <TripType tipo={triptSelected.tipo_viaje}/>}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Rutas */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<Route className="h-5 w-5" color="#E65F2B" />}
                                title="Rutas"
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
                                            label="Origen"
                                            value={
                                                <>
                                                <Typography  variant="body2" >
                                                    {triptSelected.deposito_origen.nombre}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {triptSelected.deposito_origen.direccion.estado_provincia}, {triptSelected.deposito_origen.direccion.pais}
                                                </Typography>
                                                </>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Destino"
                                            value={
                                                <>
                                                <Typography  variant="body2" >
                                                    {triptSelected.deposito_destino.nombre}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {triptSelected.deposito_destino.direccion.estado_provincia}, {triptSelected.deposito_destino.direccion.pais}
                                                </Typography>
                                                </>
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Fechas */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<CalendarDays className="h-5 w-5" color="#E65F2B" />}
                                title="Itinerario"
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
                                            label="Fecha de salida"
                                            value={`${new Date(triptSelected.fecha_inicio).toLocaleDateString().split('/').join('-')}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Fecha de llegada"
                                            value={`${new Date(triptSelected.fecha_llegada).toLocaleDateString().split('/').join('-')}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Horario de salida"
                                            value={`${new Date(triptSelected.fecha_inicio).toLocaleTimeString().split(":")[0].length === 1 ? "0" + new Date(triptSelected.fecha_inicio).toLocaleTimeString().slice(0, 4) : new Date(triptSelected.fecha_inicio).toLocaleTimeString().slice(0, 5)}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Horario de llegada"
                                            value={`${new Date(triptSelected.fecha_llegada).toLocaleTimeString().split(":")[0].length === 1 ? "0" + new Date(triptSelected.fecha_llegada).toLocaleTimeString().slice(0, 4) : new Date(triptSelected.fecha_llegada).toLocaleTimeString().slice(0, 5)}`}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Transporte */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<Truck className="h-5 w-5" color="#E65F2B" />}
                                title="Transporte"
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
                                            label="Transportista"
                                            value={`${triptSelected.empresa.nombre_comercial}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Chofer"
                                            value={`${triptSelected.chofer.nombre} ${triptSelected.chofer.apellido}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Vehículo"
                                            value={`${triptSelected.vehiculo.modelo} - ${triptSelected.vehiculo.patente}`}
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