import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SectionHeader } from "../../components/SectionHeader";
import TripFilters from "../../components/TripFilters";
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import LoadingState from "../../components/LoadingState";
import MenuItem from "../../components/buttons/MenuItem";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useNotify } from "../../hooks/useNotify";
import { viajeControllerRemove, ViajeDto, useViajeControllerFindAll } from '../../api/generated';
import { useAutoRowsPerPage } from "../../hooks/useAutoRowsPerPage";
import {  Eye, User, Building2} from "lucide-react";
import { DoubleCell } from "../../components/DoubleCell";
import { TripType } from "../../components/TripType";
import { DetailsTrip } from "../../components/trip/DetailsTrip";

export default function TripPage() {
    const navigate = useNavigate();
    const {notify} = useNotify("Viajes");
    const [filterOpen, setFilterOpen] = useState(false);

    const [page, setPage] = useState<number>(1);
    const {rowsPerPage, headerRef, footerRef} = useAutoRowsPerPage(145);
    const { data: response, isLoading, refetch } = useViajeControllerFindAll({page, limit: rowsPerPage}); //paso como limit al back el rows pero verr
    
    const trips = response?.data?.data ?? [];
    const total = response?.data?.total ?? 0;
    
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [tripSelected, setTripSelected] = useState<ViajeDto>();

    const handleOpenDialog = (trip : ViajeDto) => {
        setOpenDialog(true);
        setTripSelected(trip);
    };

    //handleOpenDetails
    const handleOpenDetails = (trip: ViajeDto) => {
        setOpenDetailsDialog(true);
        setTripSelected(trip);
    }

    const handleDelete = async (id: string) => {
        try {
            await viajeControllerRemove(id);
            setOpenDialog(false);
            await refetch();
            notify("delete", "Viaje eliminado correctamente");
            setPage(1);
        } catch (e) {
            const error = e as { response: { data: { message: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return(
        <>
            <div ref={headerRef}>
                <SectionHeader
                    title="Viajes"
                    description="Consulte los viajes registrados junto con su logística asociada."
                    buttonText="Nuevo viaje"
                    onAdd={() => navigate('/trips/form')}

                />
            </div>

            <TripFilters filterOpen={filterOpen} setFilterOpen={setFilterOpen} />

            <div className="bg-white rounded-lg overflow-hidden" style={{
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                border: "0.5px solid #C7C7C7",}}>
                    <TableContainer className="text-sm rounded-lg"> {/*className="h-full text-sm"*/}
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número</TableCell>
                                    <TableCell>Ruta</TableCell>
                                    <TableCell>Transportista</TableCell>
                                    <TableCell>Itinerario</TableCell>
                                    <TableCell>Tipo de Viaje</TableCell>
                                    <TableCell align="center" sx={{width:72}}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {isLoading ? (
                                    <TableRow key="loading">
                                        <TableCell colSpan={7} >
                                            <LoadingState title="viajes"/>
                                        </TableCell>
                                    </TableRow>
                                ) : trips.length === 0 ? (
                                    <TableRow key="no-trips">
                                        <TableCell 
                                            colSpan={7} 
                                            sx={{textAlign: "center", paddingY: "26px",}}
                                        >
                                            No se encontraron viajes
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    trips.map((trip) => (
                                        <TableRow 
                                            key={trip._id} 
                                            className="hover:bg-gray-50 overflow-hidden"
                                        >
                                            <TableCell sx={{fontWeight: "bold"}}>{trip._id}</TableCell>
                                            <TableCell><DoubleCell primarySection={trip.deposito_origen?.nombre} secondarySection={`> ${trip.deposito_destino?.nombre}`}/></TableCell>
                                            <TableCell>
                                                <DoubleCell 
                                                    primarySection={trip.empresa?.nombre_comercial} 
                                                    secondarySection={`${trip.chofer?.nombre} ${trip.chofer?.apellido}`}
                                                    primaryIcon={<Building2  color="#AFB3B9"/>}
                                                    secondaryIcon={<User color="#AFB3B9"/>}
                                                />
                                            </TableCell>
                                            <TableCell><DoubleCell primarySection={`Inicio: ${new Date(trip.fecha_inicio).toISOString().split('T')[0]}`} secondarySection={`Llegada: ${new Date(trip.fecha_llegada).toISOString().split('T')[0]}`}/></TableCell>
                                            <TableCell><TripType tipo={trip.tipo_viaje as "Nacional" | "Internacional"} /></TableCell>
                                            <TableCell sx={{ verticalAlign: "middle"}}>
                                                <MenuItem  handleOpenDialog={() => handleOpenDialog(trip)}
                                                handleOpenDetails={() => handleOpenDetails(trip)}
                                                id={trip._id}
                                                >
                                                    <Eye className="text-gray-500 hover:text-gray-700 size-4" />
                                                </MenuItem>
                                            </TableCell>   
                                        </TableRow>                            
                                    ))
                                )}
                            </TableBody>

                        </Table>
                    </TableContainer>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center  container mx-auto py-4 " ref={footerRef}>
                <p className="text-sm w-full">
                    Mostrando {(page-1) * rowsPerPage+1} - {Math.min(page*rowsPerPage, total)} de {total} viajes
                </p>
                <Pagination 
                    count={Math.ceil(total / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    shape="rounded"
                    color="primary"
                    sx={{width: "100%", display: "flex", justifyContent: "flex-end"}}
                />
            </div>

            {/* Dialogo de eliminar */}
            {tripSelected && (
                <ConfirmDialog 
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="Viajes"
                    aria-labelledby="confirm-delete-title"
                    aria-describedby="confirm-delete-description"
                    entityName={tripSelected._id}
                    onConfirm={() => handleDelete(tripSelected?._id)}
                />
            )}

            {tripSelected && (
                <DetailsTrip 
                    triptSelected={tripSelected}
                    setOpenDetailsDialog={setOpenDetailsDialog}
                    openDetailsDialog={openDetailsDialog}
                />
            )}

        </>
    )
}