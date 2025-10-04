import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery} from "@mui/material";
import LoadingState from "../../components/LoadingState";
import MenuItem from "../../components/buttons/MenuItem";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useNotify } from "../../hooks/useNotify";
import {  Building2, Calendar, Clock, Eye, MapPinned, User} from "lucide-react";
import { DoubleCell } from "../../components/DoubleCell";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import EntityCard from "../../components/EntityCard";
import PaginationEntity from "../../components/PaginationEntity";
import { TarifaDto, viajeDistribucionControllerRemove, ViajeDistribucionDto, ViajeDistribucionDtoEstado, useViajeDistribucionControllerFindAll, EmpresaDto, VehiculoDto, ChoferDto, empresaControllerFindAll, vehiculoControllerFindAll, choferControllerFindAll, DepositoDto, depositoControllerFindAll, BuscarViajeDistribucionDto, useViajeDistribucionControllerBuscar } from '../../api/generated';
import { useTheme } from "@mui/material/styles";
import { DetailsTripDistribution } from "../../components/tripsDistribution/DetailsTripDistribution";
import { TripDistributionType } from "../../components/TripDistributionType";
import DistributionFilters from "../../components/DistributionFilters";


export default function DistributionListPage() {
  const navigate = useNavigate();
  
  const {notify} = useNotify("Viajes");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<BuscarViajeDistribucionDto>({});

  const [trips, setTrips] = useState<ViajeDistribucionDto[]>([]);;
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebouncedValue(searchQuery, 500);
 
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
 
  const [viajeDistribucionSelected, setviajeDistribucionSelected] = useState<ViajeDistribucionDto>();

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

  const { mutateAsync: buscarViajes } = useViajeDistribucionControllerBuscar();

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
          const totalPages = Math.ceil((responseData.total ?? 0) / rowsPerPage)
          setTotalPages(totalPages);
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
 
  const handleOpenDialog = (tripDistribution : ViajeDistribucionDto) => {
    setOpenDialog(true);
    setviajeDistribucionSelected(tripDistribution);
} ;
 
  const handleOpenDetails = (tripDistribution: ViajeDistribucionDto) => {
      setOpenDetailsDialog(true);
      setviajeDistribucionSelected(tripDistribution);
  };


  const handleApplyFilters = useCallback((newFilters: BuscarViajeDistribucionDto) => {
      setAppliedFilters(newFilters)
      setPage(1);
  },[]);


  const handleDelete = async (id: string) => {
      try {
          await viajeDistribucionControllerRemove(id);
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


  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log("page", value);
    setPage(value);
  };

  return(
    <>
      <SectionHeader
        title="Viajes de distribución"
        description="Gestione y planifique viajes de distribución asociando remitos, costos y recursos de transporte."
        buttonText="Nuevo viaje"
        onAdd={() => navigate('/trips/distribution/form')}
      /> 

      <div className="flex justify-around">
        <DistributionFilters 
          filterOpen={filterOpen} 
          setFilterOpen={setFilterOpen} 
          onApply={handleApplyFilters}
          empresas={empresas}
          vehiculos={vehiculos}
          choferes={choferes}
          depositos={depositos}
          loadingOptions={loadingOptions}
        />

        <Button
            variant="contained"
            onClick={() => navigate("/trips/collection")} 
            sx={{
                backgroundColor: "#00A86B",
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: "500",
                boxShadow: "none",
                '&:hover': {
                    backgroundColor: "#008c5a",
                    boxShadow: "none",
                },
            }}
            className="w-full sm:max-w-max"
        >
            Viajes
        </Button>
      </div>

      {/*tabla*/}
      {isMobile ? (
        <div className="grid gap-4  lg:grid-cols-2">
            {trips.map(tripsDistribution => (
                <EntityCard
                    key={tripsDistribution._id}
                    title={tripsDistribution._id}
                    subtitle={`${tripsDistribution.estado[0].toUpperCase()}${tripsDistribution.estado.slice(1).toLowerCase()}`}
                    icon={<MapPinned size={24}/>}
                    fields={[
                        { label: "Itinerario", value: `${new Date(tripsDistribution.fecha_inicio).toLocaleDateString()} - ${new Date(tripsDistribution.fecha_inicio).toLocaleTimeString()}  `, isLong: true},
                        { label: "Deposito de origen", value: `${tripsDistribution.origen.nombre}`, isLong: true},
                        { label: "Transportista", value: `${tripsDistribution.transportista.nombre_comercial}`},
                        { label: 'Chofer', value: `${tripsDistribution.chofer.nombre}, ${tripsDistribution.chofer.apellido}`}, 
                        { label: "Vehículo", value: `${tripsDistribution.vehiculo.modelo} - ${tripsDistribution.vehiculo.patente}`},
                        { label: "Remitos Asociados", value: `${tripsDistribution.remito_ids}`},
                        ...(tripsDistribution.tarifa_id ? [{ label: "Tarifas", value: `${tripsDistribution.tarifa_id}`}] : [])
                    ]}
                  
                    onDelete={() => handleOpenDialog(tripsDistribution)}
                    onEdit={() => navigate(`/trips/distribution/edit/${tripsDistribution._id}`)}  
                    onView={() => handleOpenDetails(tripsDistribution)}          
                />
            ))}
        </div>
            ):(          
                <div className="bg-white rounded-lg" style={{
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    border: "0.5px solid #C7C7C7",
                }}>
                    <TableContainer className=" text-sm rounded-lg">
                        <Table aria-label="simple table">
                            <TableHead >
                                <TableRow>
                                    <TableCell>Número</TableCell>
                                    <TableCell>Itinerario</TableCell>
                                    <TableCell>Deposito de Origen</TableCell>
                                    <TableCell>Transportista</TableCell>
                                    <TableCell>Remitos</TableCell>
                                    <TableCell>Estado actual</TableCell>
                                    <TableCell align="center" sx={{width: 72}}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow key="loading">
                                        <TableCell colSpan={7} >
                                            <LoadingState title="viajesDistribucion"/>
                                        </TableCell>
                                    </TableRow>
                                ) : trips.length === 0 ? (
                                    <TableRow key="no-trips">
                                        <TableCell
                                            colSpan={6}
                                            sx={{textAlign: "center", paddingY: "26px",}}
                                        >
                                            No se encontraron viajes en distribución
                                        </TableCell>
                                    </TableRow>
                                ):(
                                    trips.map((tripDistribucion) => (
                                        <TableRow key={tripDistribucion._id} className="hover:bg-gray-50 overflow-hidden">
                                            <TableCell sx={{fontWeight: "bold", maxWidth: 150}} className="truncate">{tripDistribucion._id}</TableCell>
                                            <TableCell sx={{minWidth: 150}} >
                                                <DoubleCell 
                                                    primarySection={`${new Date(tripDistribucion.fecha_inicio).toLocaleDateString()}`} 
                                                    secondarySection={`${new Date(tripDistribucion.fecha_inicio).toLocaleTimeString()}`}
                                                    primaryIcon={<Calendar size={18} color="#AFB3B9"/>}
                                                    secondaryIcon={<Clock size={18} color="#AFB3B9"/>}
                                                />
                                            </TableCell>
                                            <TableCell>{`${tripDistribucion.origen.nombre}`}</TableCell>
                                            <TableCell sx={{minWidth: 150}} >
                                                <DoubleCell 
                                                    primarySection={`${tripDistribucion.transportista.nombre_comercial}`} 
                                                    secondarySection={`${tripDistribucion.chofer.nombre}, ${tripDistribucion.chofer.apellido}`}
                                                    primaryIcon={<Building2 size={18} color="#AFB3B9"/>}
                                                    secondaryIcon={<User size={18} color="#AFB3B9"/>}
                                                />
                                            </TableCell>
                                            <TableCell>{`${tripDistribucion.remito_ids}`}</TableCell>
                                            <TableCell><TripDistributionType tipo={tripDistribucion.estado}/></TableCell>
                                            <TableCell sx={{ verticalAlign: "middle"}}>
                                                <MenuItem  
                                                    module="trips/distribution"
                                                    handleOpenDialog={() => handleOpenDialog(tripDistribucion)}
                                                    handleOpenDetails={() => handleOpenDetails(tripDistribucion)}
                                                    id={tripDistribucion._id}
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
            )}

            <PaginationEntity
                entity="empresas"
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                filtered={trips}
                handleChangePage={handleChangePage}
                setRowsPerPage={setRowsPerPage}
                setPage={setPage}
            />

            {viajeDistribucionSelected && (
                <ConfirmDialog
                    open= {openDialog}
                    genre="el"
                    onClose={() => setOpenDialog(false)}
                    title="viajes"
                    entityName={viajeDistribucionSelected._id}
                    onConfirm={() => handleDelete(viajeDistribucionSelected?._id)}
                />
            )}

            {/*Detalles*/}
            {viajeDistribucionSelected && (
                <DetailsTripDistribution
                    tripDistributionSelected={viajeDistribucionSelected}
                    setOpenDetailsDialog={setOpenDetailsDialog}
                    openDetailsDialog={openDetailsDialog}
                />
                
            )}
 
  </>
  );
}
