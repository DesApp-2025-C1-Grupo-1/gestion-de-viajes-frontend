import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeader } from "../../components/SectionHeader";
import TripFilters from "../../components/TripFilters";
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import LoadingState from "../../components/LoadingState";
import MenuItem from "../../components/buttons/MenuItem";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useNotify } from "../../hooks/useNotify";
import { viajeControllerRemove, ViajeDto, BuscarViajeDto, useViajeControllerBuscar, EmpresaDto, VehiculoDto, ChoferDto, empresaControllerFindAll, vehiculoControllerFindAll, choferControllerFindAll, DepositoDto, depositoControllerFindAll } from '../../api/generated';
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
    const widthTableRef = useRef<HTMLDivElement>(null);
    const widthTable = widthTableRef.current?.offsetWidth || 0;
    const {rowsPerPage, headerRef, footerRef, filterRef} = useAutoRowsPerPage(widthTable>= 1040 ? 100 : 150);

    const [trips, setTrips] = useState<ViajeDto[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    
    const [appliedFilters, setAppliedFilters] = useState<BuscarViajeDto>({});
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [tripSelected, setTripSelected] = useState<ViajeDto>();

    const [empresas, setEmpresas] = useState<EmpresaDto[]>([]);
    const [vehiculos, setVehiculos] = useState<VehiculoDto[]>([]);
    const [choferes, setChoferes] = useState<ChoferDto[]>([]);
    const [depositos, setDepositos] = useState<DepositoDto[]>([]);
    const [loadingOptions, setLoadingOptions] = useState({
        empresas: false,
        vehiculos: false,
        choferes: false,
        depositos: false
    });

    // Función para cargar las opciones de los selects
    const loadSelectOptions = useCallback(async () => {
        try {
            setLoadingOptions(prev => ({...prev, empresas: true}));
            const resEmpresas = await empresaControllerFindAll();
            setEmpresas(resEmpresas.data);

            setLoadingOptions(prev => ({...prev, vehiculos: true}));
            const resVehiculos = await vehiculoControllerFindAll();
            setVehiculos(resVehiculos.data);

            setLoadingOptions(prev => ({...prev, choferes: true}));
            const resChoferes = await choferControllerFindAll();
            setChoferes(resChoferes.data);

            setLoadingOptions(prev => ({...prev, depositos: true}));
            const resDepositos = await depositoControllerFindAll();
            setDepositos(resDepositos.data);
        } catch (error) {
            notify("error", "Error al cargar opciones de filtros");
        } finally {
            setLoadingOptions({
                empresas: false,
                vehiculos: false,
                choferes: false,
                depositos: false
            });
        }
    }, []);

    useEffect(() => {
        loadSelectOptions();
    }, [loadSelectOptions]);

    const { mutateAsync: buscarViajes } = useViajeControllerBuscar();


    const fetchTrips = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await buscarViajes({
                data: appliedFilters,
                params: {
                    page: page,
                    limit: rowsPerPage,
                },
            });
            const responseData = res.data

            setTrips(responseData.data); // Ajustá si hay paginación en backend
            setTotal(responseData.total);
        } catch (err) {
            notify("error", "No se pudieron cargar los viajes.");
        } finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, appliedFilters, buscarViajes]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTrips();
        }, 300); // Pequeño debounce para evitar llamadas rápidas consecutivas

        return () => clearTimeout(timer);
    }, [fetchTrips, page]);

    const handleOpenDialog = (trip : ViajeDto) => {
        setOpenDialog(true);
        setTripSelected(trip);
    };

    const handleOpenDetails = (trip: ViajeDto) => {
        setOpenDetailsDialog(true);
        setTripSelected(trip);
    }

    const handleApplyFilters = useCallback((newFilters: BuscarViajeDto) => {
        setAppliedFilters(newFilters)
        setPage(1);
    },[]);

    const handleDelete = async (id: string) => {
        try {
            await viajeControllerRemove(id);
            setOpenDialog(false);
            await fetchTrips();
            notify("delete", "Viaje eliminado correctamente");
            setPage(1);
        } catch (e) {
            const error = e as { response: { data: { message: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
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

            <div ref={filterRef}>
                <TripFilters 
                    filterOpen={filterOpen} 
                    setFilterOpen={setFilterOpen} 
                    onApply={handleApplyFilters}
                    empresas={empresas}
                    vehiculos={vehiculos}
                    choferes={choferes}
                    depositos={depositos}
                    loadingOptions={loadingOptions}
                />
            </div>
            <div className="bg-white rounded-lg overflow-hidden" style={{
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                border: "0.5px solid #C7C7C7",}}>
                    <TableContainer className="text-sm rounded-lg" ref={widthTableRef}>
                        <Table aria-label="simple table" >
                            <TableHead >
                                    <TableRow >
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
                                            <TableCell sx={{fontWeight: "bold", maxWidth: 150}} className="truncate">{trip._id}</TableCell>
                                            <TableCell sx={{minWidth: 150,  maxWidth: 250}}><DoubleCell primarySection={trip.deposito_origen?.nombre} secondarySection={`> ${trip.deposito_destino?.nombre}`}/></TableCell>
                                            <TableCell sx={{minWidth: 120}}>
                                                <DoubleCell 
                                                    primarySection={trip.empresa?.nombre_comercial} 
                                                    secondarySection={`${trip.chofer?.nombre} ${trip.chofer?.apellido}`}
                                                    primaryIcon={<Building2  color="#AFB3B9"/>}
                                                    secondaryIcon={<User color="#AFB3B9"/>}
                                                />
                                            </TableCell>
                                            <TableCell sx={{minWidth: 150}}><DoubleCell primarySection={`Inicio: ${new Date(trip.fecha_inicio).toLocaleDateString().split('/').join('-')}`} secondarySection={`Llegada: ${new Date(trip.fecha_llegada).toLocaleDateString().split('/').join('-')}`}/></TableCell>
                                            <TableCell sx={{padding: "4px 8px", maxWidth: "fit-content"}}><TripType tipo={trip.tipo_viaje as "Nacional" | "Internacional"} /></TableCell>
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