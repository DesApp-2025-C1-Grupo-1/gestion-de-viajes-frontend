import { Button, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { SectionHeader } from "../../components/SectionHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "../../hooks/useVechicle";
import  LoadingState  from "../../components/LoadingState";
import { useAutoRowsPerPage } from "../../hooks/useAutoRowsPerPage";
import SearchBar from "../../components/SearchBar";
import MenuItem from "../../components/buttons/MenuItem";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Vehicle } from "../../types";
import { useVehiculoControllerFindAll, vehiculoControllerRemove, VehiculoDto } from "../../api/generated";


export default function VehiclePage() {
    const {data, isLoading, error} = useVehiculoControllerFindAll()
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const {rowsPerPage} = useAutoRowsPerPage();
    const [openDialog, setOpenDialog] = useState(false);
    const [vehicleSelected, setVehicleSelected] = useState<VehiculoDto>();
    const vehicles = data?.data || [];

    const handleOpenDialog = (vehicle : VehiculoDto) => {
        setOpenDialog(true);
        setVehicleSelected(vehicle);
    };

    const handleDelete = async (id: string) => {
        try {
            await vehiculoControllerRemove(id);
            setOpenDialog(false);
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    };

    const filtered = vehicles.filter((v) =>
        v.patente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.modelo.toLowerCase().includes(searchQuery.toLowerCase())
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
            <SectionHeader 
                title="Flota de Vehículos"
                description="Registre y gestione los vehículos disponibles para su red de transporte."
                buttonText="Nuevo vehículo"
                onAdd={() => navigate("/vehicles/form")}
            />

            {/* Buscador y boton para ir a tipo de vehiculos*/}    
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar vehículo por modelo o patente" >
                <Button
                    variant="contained"
                    onClick={() => navigate("/type-vehicle")} // o abrir modal
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
                    Tipos de vehículo
                </Button>
            </SearchBar>
            
            {/* Tabla de vehículos */}
            <div 
                className="bg-white rounded-lg overflow-hidden"
                style={{
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    border: "0.5px solid #C7C7C7",
                }}
            >         
                <TableContainer className="h-full text-sm">
                    <Table 
                        aria-label="simple table"
                    >
                        <TableHead >
                            <TableRow>
                                <TableCell>Patente</TableCell>
                                <TableCell>Modelo</TableCell>
                                <TableCell>Año</TableCell>
                                <TableCell>Capacidad(kg)</TableCell>
                                <TableCell>Tipo</TableCell>
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
                                    <TableRow 
                                        key={vehicle._id} 
                                        className="hover:bg-gray-50 overflow-hidden"
                                    >
                                        <TableCell sx={{fontWeight: "bold"}}>{vehicle.patente}</TableCell>
                                        <TableCell>{vehicle.modelo}</TableCell>
                                        <TableCell>{vehicle.año}</TableCell>
                                        <TableCell>{vehicle.volumen_carga} kg</TableCell>
                                        <TableCell>{vehicle.tipo?.nombre || '-'}</TableCell>
                                        <TableCell>{vehicle.empresa.nombre_comercial}</TableCell>
                                        <TableCell sx={{ verticalAlign: "middle"}}>
                                            <MenuItem  handleOpenDialog={() => handleOpenDialog(vehicle)}
                                            id={vehicle._id}
                                            />
                                           
                                        </TableCell>
                                         
                                    </TableRow>
                                    
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Paginación */}
            <div className="flex justify-between gap-2 items-center sm:px-4 py-4 ">
                <p className="text-sm w-full">
                    Mostrando {Math.min((page - 1) * rowsPerPage + 1, filtered.length)}– 
                    {Math.min(page * rowsPerPage, filtered.length)} de {filtered.length} vehículos
                </p>
                <Pagination 
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    shape="rounded"
                    color="primary"
                    sx={{width: "100%", display: "flex", justifyContent: "flex-end"}}
                />
            </div>

            {/* Dialogo de eliminar */}
            {vehicleSelected && (
                <ConfirmDialog 
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="Eliminar vehículo"
                    content={<p>
                        ¿Estás seguro que deseas eliminar el vehículo{" "}
                        <strong>{vehicleSelected?.patente}</strong>?
                    </p>}
                    onConfirm={() => handleDelete(vehicleSelected?._id)}
                />
            )}
            
        </>
        
    );
}