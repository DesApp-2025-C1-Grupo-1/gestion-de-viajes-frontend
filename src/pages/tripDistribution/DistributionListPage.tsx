import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery} from "@mui/material";
import LoadingState from "../../components/LoadingState";
import MenuItem from "../../components/buttons/MenuItem";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useNotify } from "../../hooks/useNotify";
import {  Building2, Calendar, Clock, Eye, MapPinned, User} from "lucide-react";
import { DoubleCell } from "../../components/DoubleCell";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import EntityCard from "../../components/EntityCard";
import PaginationEntity from "../../components/PaginationEntity";
import { TarifaDto, viajeDistribucionControllerRemove, ViajeDistribucionDto, ViajeDistribucionDtoEstado, useViajeDistribucionControllerFindAll, EmpresaDto, VehiculoDto, ChoferDto, empresaControllerFindAll, vehiculoControllerFindAll, choferControllerFindAll, DepositoDto, depositoControllerFindAll } from '../../api/generated';
import { useTheme } from "@mui/material/styles";
import { DetailsTripDistribution } from "../../components/tripsDistribution/DetailsTripDistribution";


export default function DistributionListPage() {
  const navigate = useNavigate();


  const {notify} = useNotify("Viajes");
  const [filterOpen, setFilterOpen] = useState(false);
  const {data: trips, isLoading, refetch} = useViajeDistribucionControllerFindAll();
 
  const [page, setPage] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
 
  const [viajeDistribucionSelected, setviajeDistribucionSelected] = useState<ViajeDistribucionDto>();
  const [tripsDistribution, setTripsDistribution] = useState<ViajeDistribucionDto[]>([]);


  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
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


  //handle de filtros


  const handleDelete = async (id: string) => {
      try {
          await viajeDistribucionControllerRemove(id);
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

  const filtered = trips?.data || [];

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);


  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
  };

  useEffect(() => {
    setPage(1);
  }, [trips?.data]);

  return(
    <>
      <SectionHeader
        title="Viajes de distribución"
        description="Gestione y planifique viajes de distribución asociando remitos, costos y recursos de transporte."
        buttonText="Nuevo viaje"
        onAdd={() => navigate('/trips/distribution/form')}
      />
   
      {/*filtros*/}


      {/*tabla*/}
      {isMobile ? (
        <div className="grid gap-4  lg:grid-cols-2">
            {paginated.map(tripsDistribution => (
                <EntityCard
                    key={tripsDistribution._id}
                    title={tripsDistribution._id}
                    subtitle={`${tripsDistribution.estado}`}
                    icon={<MapPinned size={24}/>}
                    fields={[
                        { label: "Itinerario", value: `${new Date(tripsDistribution.fecha_inicio).toLocaleDateString()} - ${new Date(tripsDistribution.fecha_inicio).toLocaleTimeString()}  `, isLong: true},
                        { label: "Deposito de origen", value: `${tripsDistribution.origen.nombre}`, isLong: true},
                        { label: "Transportista", value: `${tripsDistribution.transportista.nombre_comercial}`},
                        { label: 'Chofer', value: `${tripsDistribution.chofer.nombre}, ${tripsDistribution.chofer.apellido}`}, 
                        { label: "Vehículo", value: `${tripsDistribution.vehiculo.modelo} - ${tripsDistribution.vehiculo.patente}`},
                        { label: "Remitos Asociados", value: `${tripsDistribution.remito_ids}`},
                        { label: "Tarifas", value: `${tripsDistribution.tarifa_id}`}
                    ]}
                    onDelete={() => handleOpenDialog(tripsDistribution)}
                    onEdit={() => navigate(`/trips/distribution/edit/${tripsDistribution._id}`)}  
                    onView={() => handleOpenDetails(tripsDistribution)}          
                />
            ))}
        </div>
            ):(          
                <div className="bg-white rounded-lg overflow-hidden" style={{
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
                                    <TableCell>Tarifas</TableCell>
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
                                ) : paginated.length === 0 ? (
                                    <TableRow key="no-trips">
                                        <TableCell
                                            colSpan={6}
                                            sx={{textAlign: "center", paddingY: "26px",}}
                                        >
                                            No se encontraron viajes en distribución
                                        </TableCell>
                                    </TableRow>
                                ):(
                                    paginated.map((tripDistribucion) => (
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
                                            <TableCell>{`${tripDistribucion.tarifa_id}`}</TableCell>
                                            <TableCell>{tripDistribucion.estado}</TableCell>
                                            <TableCell sx={{ verticalAlign: "middle"}}>
                                                <MenuItem  
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
                filtered={filtered}
                handleChangePage={handleChangePage}
                setRowsPerPage={setRowsPerPage}
                setPage={setPage}
            />

            {viajeDistribucionSelected && (
                <ConfirmDialog
                    open= {openDialog}
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
