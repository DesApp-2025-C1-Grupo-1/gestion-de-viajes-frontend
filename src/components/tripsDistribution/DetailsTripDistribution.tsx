import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
} from "@mui/material";
import { Field } from "../detailts/Field";
import { HeaderDetails } from "../detailts/HeaderDetails";
import { MapPinned, Route, Truck, Building2, ClipboardMinus, Ticket} from "lucide-react";
import { ViajeDistribucionDto } from "../../api/generated";
import { TripDistributionType } from "./TripDistributionType";

interface TripDistributionDetailsProps {
    tripDistributionSelected: ViajeDistribucionDto;
    setOpenDetailsDialog: (open: boolean) => void;
    openDetailsDialog: boolean;
}

export const DetailsTripDistribution = ({tripDistributionSelected, setOpenDetailsDialog, openDetailsDialog}: TripDistributionDetailsProps) => {
    return(
        <Dialog 
            open={openDetailsDialog}
            onClose={() => setOpenDetailsDialog(false)}
            aria-labelledby="trip-distribution-details-title"
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
                    Detalles del Viaje en Distribución
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
                                        <Field label="Número de viaje" value={tripDistributionSelected._id} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Estado Actual" value={<TripDistributionType tipo={tripDistributionSelected.estado} />}/>
                        
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field label="Fecha y hora de Inicio" value={`${new Date(tripDistributionSelected.fecha_inicio).toLocaleDateString().split('/').join('-')}`} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Kilometros" value={tripDistributionSelected.kilometros}/>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Deposito origen */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<Route className="h-5 w-5" color="#E65F2B" />}
                                title="Deposito de Origen"
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
                                        label="Nombre del depósito"
                                        value={`${tripDistributionSelected.origen.nombre}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Dirección"
                                            value={`${tripDistributionSelected.origen.direccion.calle} ${tripDistributionSelected.origen.direccion.numero}, ${tripDistributionSelected.origen.direccion.ciudad}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                        label="Horarios de atención"
                                        value={`${tripDistributionSelected.origen.horario_entrada} - ${tripDistributionSelected.origen.horario_salida}`}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Transportista-chofer */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<Building2 className="h-5 w-5" color="#E65F2B" />}
                                title="Transportista"
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
                                            label="Empresa transportista"
                                            value={`${tripDistributionSelected.transportista.nombre_comercial}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Chofer"
                                            value={`${tripDistributionSelected.chofer.nombre}, ${tripDistributionSelected.chofer.apellido}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Vehículo asignado"
                                            value={`${tripDistributionSelected.vehiculo.modelo} - ${tripDistributionSelected.vehiculo.patente}`}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Remitos */}
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<ClipboardMinus className="h-5 w-5" color="#E65F2B" />}
                                title="Remitos"
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
                                            label="Asignados"
                                            value={`${tripDistributionSelected.remito_ids}`}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                            {/* Tarifa */}
                            {tripDistributionSelected.tarifa_id !== undefined && (
                                <Grid item xs={12}>
                                    <HeaderDetails
                                        icon={<Ticket className="h-5 w-5" color="#E65F2B" />}
                                        title="Tarifas"
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
                                                    label="Asignadas"
                                                    value={`${tripDistributionSelected.tarifa_id}`}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            )}
                            
                        

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