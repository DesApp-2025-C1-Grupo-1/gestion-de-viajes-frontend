import { useEffect, useState } from "react";
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from "@mui/material";
import { SectionHeader } from "../../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import MenuItemDialog from "../../components/buttons/MenuItem";
import { useNotify } from "../../hooks/useNotify";
import { choferControllerRemove, ChoferDto, useChoferControllerFindAll } from "../../api/generated";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DoubleCell } from "../../components/DoubleCell";
import { Building2, Car, UserRound, Eye } from "lucide-react";
import { formatTelefono } from "../../lib/formatters";
import EntityCard from "../../components/EntityCard";
import { DriverDetailsDialog } from "../../components/driver/DriverDetailsDialog";
import PaginationEntity from "../../components/PaginationEntity";
import FilterSection, { getNestedValue } from "../../components/FilterSection";


export default function DriverPage(){
    const {notify} = useNotify("Chofer");
    const {data, isLoading, refetch} = useChoferControllerFindAll();
    const [page, setPage] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [choferSelect, setChoferSelect] = useState<ChoferDto>();
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [filteredChoferes, setFilteredChoferes] = useState<ChoferDto[]>(data?.data || []);
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
    const choferes = data?.data || [];
    const [appliedFilters, setAppliedFilters] = useState<any>({});
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const defaultRows = isMobile ? 5 : isTablet ? 8 : 5;
    const [rowsPerPage, setRowsPerPage] = useState<number>(defaultRows);

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

    const totalPages = Math.ceil(filteredChoferes.length / rowsPerPage);
    const paginated = filteredChoferes.slice((page-1) * rowsPerPage, page*rowsPerPage);
    const handleChangePage = (event: React.ChangeEvent<unknown>, value:number) => {
        setPage(value);
    };

    const formatChipLabel = (key: string, value: any) => {
        switch (key) {
            case "nombre":
                return `Nombre: ${value}`;
            case "apellido":
                return `Apellido: ${value}`;
            case "dni":
                return `DNI: ${value}`;
            default:
                return `${key}: ${value}`;
        }
    };

    const handleApplyFilters = (filters: any) => {
        setAppliedFilters(filters);
        setPage(1);
    };
    
    // Filtrado dinámico según los filtros aplicados
    useEffect(() => {
        if (!choferes) return;

        let result = choferes;

        Object.entries(appliedFilters).forEach(([key, value]) => {
            if (!value) return;

            result = result.filter((d) => {
            const fieldValue = getNestedValue(d, key);
            if (typeof fieldValue === "string") {
                return fieldValue.toLowerCase().includes((value as string).toLowerCase());
            }
            if (typeof fieldValue === "number") {
                return fieldValue.toString().includes((value as number).toString());
            }
            return fieldValue === value;
            });
        });

        setFilteredChoferes(result);
    }, [appliedFilters, choferes]);


    const navigate = useNavigate();

    return(
        <>
            <SectionHeader
                title="Choferes"
                buttonText="Nuevo chofer"
                onAdd={() => navigate("/driver/create")}
            /> 

            <FilterSection
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                onApply={handleApplyFilters}
                formatChipLabel={formatChipLabel}
                listFilters={[
                    { key: "nombre", label: "Nombre", type: "text" },
                    { key: "apellido", label: "Apellido", type: "text" },
                    { key: "dni", label: "DNI", type: "number" },
                ]}
            />

            {/*tabla*/}
            {isMobile || isTablet ? (
                <Grid>
                    {isLoading ? (
                        <LoadingState title="choferes" />
                    ) : filteredChoferes.length === 0 || paginated.length === 0 ? (
                        <Box className="text-center text-gray-500 py-5">
                            No se encontraron choferes.
                        </Box>
                    ) : ( 
                    <Grid container spacing={2}>
                        {paginated.length > 0 && paginated.map(driver => (
                            <Grid item xs={12} md={6} lg={4} key={driver._id}>
                                <EntityCard
                                    key={driver._id}
                                    title={`${driver.nombre} ${driver.apellido}`}
                                    subtitle={`${driver.dni}`}
                                    icon={<UserRound size={24}/>}
                                    fields={[
                                        { label: "Licencia", value: `${driver.licencia} - ${driver.tipo_licencia}` },
                                        { label: "Teléfono", value: formatTelefono(driver.telefono) },
                                        { label: "Empresa", value: driver.empresa?.nombre_comercial},
                                        { label: "Vehículo", value:  `${driver.vehiculo.marca} - ${driver.vehiculo.patente}` },
                                    ]}
                                    onDelete={() => handleOpenDialog(driver)}
                                    onEdit={() => navigate(`/drivers/edit/${driver._id}`)}
                                    onView={() => navigate(`/drivers/details/${driver._id}`)}
                                />
                            </Grid>
                        ) 
                        )}
                        
                    </Grid>
                    )}
                </Grid>
            ) : (
                <Box>
                    <TableContainer component={Paper}>
                        <Table aria-label="tabla de choferes">
                            <TableHead >
                                <TableRow>
                                    <TableCell>Nombre completo</TableCell>
                                    <TableCell sx={{ minWidth: 100}}>DNI</TableCell>
                                    <TableCell sx={{ minWidth: 150}}>Licencia</TableCell>
                                    <TableCell sx={{ minWidth: 160}}>Teléfono</TableCell>
                                    <TableCell sx={{minWidth: 200}}>Transporte</TableCell>
                                    <TableCell align="center" sx={{width: 72}}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow key="loading">
                                        <TableCell colSpan={6} >
                                            <LoadingState title="choferes"/>
                                        </TableCell>
                                    </TableRow>
                                ) : paginated.length === 0 ? (
                                    <TableRow key="no-drivers" hover>
                                        <TableCell
                                            colSpan={6}
                                            sx={{ textAlign: "center", paddingY: "26px" }}
                                        >
                                            No se encontraron choferes
                                        </TableCell>
                                    </TableRow>
                                ):(
                                    paginated.map((driver) => (
                                        <TableRow key={driver._id} hover>
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
                </Box>
            )}
            

            {/* Paginación */}
            <PaginationEntity
                entity="choferes"
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                filtered={filteredChoferes}
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
