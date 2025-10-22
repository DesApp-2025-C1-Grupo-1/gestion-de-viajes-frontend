import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from "@mui/material";
import { SectionHeader } from "../../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import SearchBar from "../../components/SearchBar";
import MenuItemDialog from "../../components/buttons/MenuItem";
import { useNotify } from "../../hooks/useNotify";
import { choferControllerRemove, ChoferDto, useChoferControllerFindAll } from "../../api/generated";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DoubleCell } from "../../components/DoubleCell";
import { Phone, Mail, Building2, Car, UserRound, Eye } from "lucide-react";
import { formatTelefono } from "../../lib/formatters";
import EntityCard from "../../components/EntityCard";
import { DriverDetailsDialog } from "../../components/driver/DriverDetailsDialog";
import PaginationEntity from "../../components/PaginationEntity";


export default function DriverPage(){
    const {notify} = useNotify("Chofer");
    const {data, isLoading, refetch} = useChoferControllerFindAll();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [choferSelect, setChoferSelect] = useState<ChoferDto>();
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
    const choferes = data?.data || [];
    const debouncedQuery = useDebouncedValue(searchQuery, 500);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg")); // <1280px

    const handleOpenDialog = (company: ChoferDto) => {
        setOpenDialog(true);
        setChoferSelect(company);
    };

    const handleDelete = async(id:string) => {
        try{
            await choferControllerRemove(id);
            setOpenDialog(false);
            await refetch();
            notify("delete", "Chofer eliminado correctamente.")
            setPage(1);
        } catch(err){
            const error = err as {response:{data:{message:string}}};
            if(error.response?.data?.message){
                notify("error", error.response.data.message);
            }
        }
    };

    const filtered = choferes.filter((dri) => 
        dri.apellido.toLocaleLowerCase().includes(debouncedQuery.toLocaleLowerCase()) ||
        dri.nombre.toLocaleLowerCase().includes(debouncedQuery.toLocaleLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((page-1) * rowsPerPage, page*rowsPerPage);
    const handleChangePage = (event: React.ChangeEvent<unknown>, value:number) => {
        setPage(value);
    };

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const navigate = useNavigate();

    return(
        <>
            <div> 
                <SectionHeader
                    title="Choferes"
                    description="Gestione el personal habilitado para conducir vehículos de transporte."
                    buttonText="Nuevo chofer"
                    onAdd={() => navigate("/driver/create")}
                /> 
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar por nombre o apellido"></SearchBar>
            </div>

            {/*tabla*/}
            {isMobile ? (
                <div className="grid gap-4  lg:grid-cols-2">
                    {paginated.map(driver => (
                        <EntityCard
                            key={driver._id}
                            title={`${driver.nombre} ${driver.apellido}`}
                            subtitle={`${driver.dni}`}
                            icon={<UserRound size={24}/>}
                            fields={[
                                { label: "Licencia", value: `${driver.licencia} - ${driver.tipo_licencia}` },
                                { label: "Teléfono", value: formatTelefono(driver.telefono) },
                                { label: "Empresa", value: driver.empresa.nombre_comercial },
                                { label: "Vehículo", value:  `${driver.vehiculo.marca} - ${driver.vehiculo.patente}` },
                            ]}
                            onDelete={() => handleOpenDialog(driver)}
                            onEdit={() => navigate(`/drivers/edit/${driver._id}`)}
                            onView={() => navigate(`/drivers/details/${driver._id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg " style={{
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    border: "0.5px solid #C7C7C7",
                }}>

                    <TableContainer className="text-sm rounded-lg">
                        <Table aria-label="simple table">
                            <TableHead >
                                <TableRow>
                                    <TableCell>Nombre completo</TableCell>
                                    <TableCell>DNI</TableCell>
                                    <TableCell>Licencia</TableCell>
                                    <TableCell sx={{ minWidth: 150, maxWidth: 200}}>Teléfono</TableCell>
                                    <TableCell sx={{minWidth: 200}}>Transporte</TableCell>
                                    <TableCell align="center" sx={{maxWidth: 100}}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow key="loading">
                                        <TableCell colSpan={7} >
                                            <LoadingState title="choferes"/>
                                        </TableCell>
                                    </TableRow>
                                ) : paginated.length === 0 ? (
                                    <TableRow key="no-drivers">
                                        <TableCell 
                                            colSpan={8} 
                                            sx={{textAlign: "center", paddingY: "26px",}}
                                        >
                                            No se encontraron choferes
                                        </TableCell>
                                    </TableRow>
                                ):(
                                    paginated.map((driver) => (
                                        <TableRow key={driver._id} className="hover:bg-gray-50 overflow-hidden">
                                            <TableCell sx={{fontWeight: "bold"}}>{`${driver.nombre} ${driver.apellido}`}</TableCell>
                                            <TableCell>{driver.dni}</TableCell>
                                            <TableCell>{`${driver.licencia} - ${driver.tipo_licencia}`}</TableCell>
                                            <TableCell>
                                                <DoubleCell 
                                                    primarySection={formatTelefono(driver.telefono)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <DoubleCell 
                                                    primarySection={driver.empresa?.nombre_comercial}
                                                    secondarySection={driver.vehiculo?.modelo}
                                                    primaryIcon={<Building2 size={18} color="#AFB3B9"/>}
                                                    secondaryIcon={<Car size={20} color="#AFB3B9"/>}
                                                />
                                            </TableCell>

                                            <TableCell sx={{ verticalAlign: "middle"}}>
                                                <MenuItemDialog  
                                                    handleOpenDialog={() => handleOpenDialog(driver)}
                                                    handleOpenDetails={() => navigate(`/drivers/details/${driver._id}`)}
                                                    titleItem="Detalles"
                                                    id={driver._id}
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
                </div>
            )}
            

            {/* Paginación */}
            <PaginationEntity
                entity="choferes"
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                filtered={filtered}
                handleChangePage={handleChangePage}
                setRowsPerPage={setRowsPerPage}
                setPage={setPage}
            />

            {choferSelect && (
                <ConfirmDialog 
                    open= {openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="chofer"
                    genre="el"
                    entityName={`${choferSelect?.nombre} ${choferSelect?.apellido}`}
                    onConfirm={() => handleDelete(choferSelect?._id)}
                />
            )}

            {choferSelect && (
                <DriverDetailsDialog
                    choferSelected={choferSelect}
                    setOpenDetailsDialog={setOpenDetailsDialog}
                    openDetailsDialog={openDetailsDialog}
                />
            )}
        </>
    )
}
