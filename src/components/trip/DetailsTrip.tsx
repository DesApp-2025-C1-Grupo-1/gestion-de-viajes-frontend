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
import { MapPinned, Clock, MapPin, Users } from "lucide-react";
import { formatTelefono } from "../../lib/formatters";
import { ViajeDto } from "../../api/generated";

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
                        <Grid item xs={12}>
                            <HeaderDetails
                                icon={<MapPinned className="h-5 w-5" color="#E65F2B" />}
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
                                        <Field label="Nombre" value={triptSelected._id} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            label="Tipo"
                                            value={
                                            <Chip
                                                //label={triptSelected.tipo === "propio" ? "Propio" : "Terceros"}
                                                //color={triptSelected.tipo === "propio" ? "primary" : "default"}
                                                size="small"
                                            />
                                            }
                                        />
                                    </Grid>
                                </Grid>

                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </>
        </Dialog>
    )
}