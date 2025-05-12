import { Button, InputAdornment, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { SectionHeader } from "../components/SectionHeader";
import { useEffect, useState } from "react";
import { Ellipsis, SearchIcon} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "../hooks/useVechicle";
import  LoadingState  from "../components/LoadingState";


export default function VehiclePage() {
    const { vehicles, isLoading } = useVehicles();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const rowsPerPage: number = 5;

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
                onAdd={() => {}}
            />

            {/* Buscador y boton para ir a tipo de vehiculos*/}
            <div className="flex flex-col sm:flex-row justify-between gap-2 mb-6">
                <TextField
                    id="search"
                    name="search"
                    variant="outlined"
                    size="small"
                    placeholder="Buscar vehiculo por patente o modelo"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon className="size-4"/>
                        </InputAdornment>
                        ),
                    }}
                    
                    className="w-full sm:w-full sm:max-w-80 "
                />
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
            </div>

            {/* Tabla de vehículos */}
            <div 
                className="overflow-x-auto bg-white rounded-lg "
                style={{
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    border: "0.5px solid #C7C7C7",
                }}
            >
                
                <TableContainer className="min-w-full text-sm">
                    <Table 
                        aria-label="simple table"
                    >
                        <TableHead >
                            <TableRow >
                                <TableCell>Patente</TableCell>
                                <TableCell>Modelo</TableCell>
                                <TableCell>Año</TableCell>
                                <TableCell>Capacidad(kg)</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Transportista</TableCell>
                                <TableCell align="center">Acciones</TableCell>
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
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell sx={{fontWeight: "bold"}}>{vehicle.patente}</TableCell>
                                        <TableCell>{vehicle.modelo}</TableCell>
                                        <TableCell>{vehicle.año}</TableCell>
                                        <TableCell>{vehicle.volumen_carga} kg</TableCell>
                                        <TableCell>{vehicle.tipo}</TableCell>
                                        <TableCell>{vehicle.empresa}</TableCell>
                                        <TableCell sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                                            <Ellipsis
                                                className="cursor-pointer text-gray-500 hover:text-gray-700
                                                size-4"
                                                onClick={() => {}}
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
            <div className="flex justify-between gap-2 items-center sm:px-4 py-6 ">
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

        </>
        
    );
}