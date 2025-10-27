import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from "@mui/material";
import { SectionHeader } from "../../components/SectionHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  LoadingState  from "../../components/LoadingState";
import SearchBar from "../../components/SearchBar";
import MenuItemDialog from "../../components/buttons/MenuItem";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useVehiculoControllerFindAll, vehiculoControllerRemove, VehiculoDto } from "../../api/generated";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useNotify } from "../../hooks/useNotify";
import { Eye, Truck } from "lucide-react";
import EntityCard from "../../components/EntityCard";
import PaginationEntity from "../../components/PaginationEntity";


export default function VehiclePage() {
    const {notify} = useNotify("Vehículo");
    const {data, isLoading, refetch} = useVehiculoControllerFindAll()
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [vehicleSelected, setVehicleSelected] = useState<VehiculoDto>();
    const vehicles = data?.data || [];
    const debouncedQuery = useDebouncedValue(searchQuery, 500);
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const defaultRows = isMobile ? 5 : isTablet ? 8 : 5;
    const [rowsPerPage, setRowsPerPage] = useState<number>(defaultRows);

    const handleOpenDialog = (vehicle : VehiculoDto) => {
        setOpenDialog(true);
        setVehicleSelected(vehicle);
    };

    const handleDelete = async (id: string) => {
        try {
            await vehiculoControllerRemove(id);
            setOpenDialog(false);
            await refetch();
            notify("delete", "Vehículo eliminado correctamente");
            setPage(1);
        } catch (e) {
            const error = e as { response: { data: { message: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const filtered = vehicles.filter((v) =>
        v.patente.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        v.modelo.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        // Si el search cambia, reseteamos a página 1
        setPage(1);
    }, [searchQuery]);

    const navigate = useNavigate();
    return (
        <>
            <div>
                <SectionHeader 
                    title="Flota de vehículos"
                    buttonText="Nuevo vehículo"
                    onAdd={() => navigate("/vehicles/form")}
                />

                {/* Buscador y boton para ir a tipo de vehiculos*/}    
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar vehículo por modelo o patente" />
            </div>

            {isTablet || isMobile ? (
                <div className="grid gap-4  lg:grid-cols-2">
                    {paginated.length > 0 ? paginated.map(vehicle => (
                        <EntityCard
                            key={vehicle._id}
                            title={vehicle.patente}
                            subtitle={`${vehicle.modelo}`}
                            icon={<Truck size={24}/>}
                            fields={[
                                { label: "Tipo", value: vehicle.tipo.nombre },
                                { label: "Capacidad (kg)", value: `${vehicle.peso_carga} kg` },
                                { label: "Empresa", value: vehicle.empresa.nombre_comercial },
                                { label: "Año", value: vehicle.año },
                            ]}
                            onDelete={() => handleOpenDialog(vehicle)}
                            onEdit={() => navigate(`/vehicles/edit/${vehicle._id}`)}
                            onView={() => navigate(`/vehicles/details/${vehicle._id}`)}
                        />
                    )) : (
                        <div className="text-center text-gray-500 py-10">
                            No se encontraron vehículos con el modelo o patente buscado.
                        </div>
                    )}
                </div>
            ) : (
                <Box>         
                    <TableContainer component={Paper}>
                        <Table aria-label="tabla de vehículos">
                            <TableHead >
                                <TableRow>
                                    <TableCell>Patente</TableCell>
                                    <TableCell>Modelo</TableCell>
                                    <TableCell>Año</TableCell>
                                    <TableCell>Capacidad(kg)</TableCell>
                                    <TableCell sx={{minWidth: 160}}>Tipo</TableCell>
                                    <TableCell>Transportista</TableCell>
                                    <TableCell align="center" sx={{width: 72}}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow
                                        key="loading"
                                    >
                                        <TableCell colSpan={7} >
                                            <LoadingState title="vehículos"/>
                                        </TableCell>
                                    </TableRow>
                                ) : paginated.length === 0 ? (
                                    <TableRow
                                        key="no-vehicles" 
                                    >
                                        <TableCell 
                                            colSpan={7} 
                                            sx={{
                                                textAlign: "center",
                                                paddingY: "26px",
                                            }}
                                        >
                                            No se encontraron vehículos
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((vehicle) => (
                                        <TableRow key={vehicle._id} hover>
                                            <TableCell sx={{fontWeight: "bold"}}>{vehicle.patente}</TableCell>
                                            <TableCell>{vehicle.modelo}</TableCell>
                                            <TableCell>{vehicle.año}</TableCell>
                                            <TableCell>{vehicle.volumen_carga} kg</TableCell>
                                            <TableCell>{vehicle.tipo?.nombre || '-'}</TableCell>
                                            <TableCell>{vehicle.empresa.nombre_comercial}</TableCell>
                                            <TableCell sx={{ verticalAlign: "middle"}}>
                                                <MenuItemDialog  
                                                    handleOpenDialog={() => handleOpenDialog(vehicle)}
                                                    handleOpenDetails={() => navigate(`/vehicles/details/${vehicle._id}`)}
                                                    titleItem="Detalles"
                                                    id={vehicle._id}
                                                >
                                                    <Eye className="text-gray-500 hover:text-gray-700 size-4" />
                                     
                                                </MenuItemDialog>
                                            
                                            </TableCell>
                                            
                                        </TableRow>
                                        
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
            

            {/* Paginación */}
            <PaginationEntity
                entity="vehículos"
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                filtered={filtered}
                handleChangePage={handleChangePage}
                setRowsPerPage={setRowsPerPage}
                setPage={setPage}
            />

            {/* Dialogo de eliminar */}
            {vehicleSelected && (
                <ConfirmDialog 
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="Vehículo"
                    genre="el"
                    entityName={vehicleSelected.patente}
                    onConfirm={() => handleDelete(vehicleSelected?._id)}
                />
            )}

        </>
        
    );
}