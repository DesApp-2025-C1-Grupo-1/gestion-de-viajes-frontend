import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery} from "@mui/material";
import LoadingState from "../../components/LoadingState";
import MenuItem from "../../components/buttons/MenuItem";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { formatTelefono } from "../../lib/formatters";
import { useNotify } from "../../hooks/useNotify";
import { depositoControllerRemove, DepositoDto, useDepositoControllerFindAll } from "../../api/generated";
import { Eye, Warehouse } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import EntityCard from "../../components/EntityCard";
import PaginationEntity from "../../components/PaginationEntity";
import FilterSection, { getNestedValue } from "../../components/FilterSection";

export default function DepositPage() {
    const {notify} = useNotify("Depósito");
    const {data: deposits, isLoading, refetch} = useDepositoControllerFindAll();
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [depositSelected, setDepositSelected] = useState<DepositoDto>();
    const [filteredDeposits, setFilteredDeposits] = useState<DepositoDto[] >(deposits?.data || []); 
    const [appliedFilters, setAppliedFilters] = useState<any>({});
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const defaultRows = isMobile ? 5 : isTablet ? 8 : 5;
    const [rowsPerPage, setRowsPerPage] = useState<number>(defaultRows);

    const handleOpenDialog = (deposit : DepositoDto) => {
        setOpenDialog(true);
        setDepositSelected(deposit);
    };

    const handleDelete = async (id: string) => {
        try {
            await depositoControllerRemove(id);
            setOpenDialog(false);
            await refetch();
            notify("delete", "Depósito eliminado correctamente");
            setPage(1);
        } catch (e) {
            const error = e as { response: { data: { message: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const totalPages = Math.ceil(filteredDeposits.length / rowsPerPage);
    const paginated = filteredDeposits.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const navigate = useNavigate();

    const formatChipLabel = (key: string, value: any) => {
        switch (key) {
            case "nombre":
                return `Nombre: ${value}`;
            case "direccion.ciudad":
                return `Ciudad: ${value}`;
            default:
                return `${key}: ${value}`;
        }
    };

    const handleApplyFilters = (filters: any) => {
        setAppliedFilters(filters);
        setPage(1);
    }
    // Filtrado dinámico según los filtros aplicados
    useEffect(() => {
        if (!deposits?.data) return;

        let result = deposits.data;

        Object.entries(appliedFilters).forEach(([key, value]) => {
            if (!value) return;

            result = result.filter((d) => {
            const fieldValue = getNestedValue(d, key);
            if (typeof fieldValue === "string") {
                return fieldValue.toLowerCase().includes((value as string).toLowerCase());
            }
            return fieldValue === value;
            });
        });

        setFilteredDeposits(result);
    }, [appliedFilters, deposits]);


    return (
        <>
            <SectionHeader 
                title="Red de depósitos"
                buttonText="Nuevo depósito"
                onAdd={() => navigate("/depots/form")}
            />
            <FilterSection 
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                formatChipLabel={formatChipLabel}
                onApply={handleApplyFilters}
                listFilters={[
                    { key: "nombre", label: "Nombre", type: "text" },
                    { key: "direccion.ciudad", label: "Ciudad", type: "text" },
                ]}
            />

            {/*tabla*/}
            {isMobile || isTablet ? (
                <div className="grid gap-4  lg:grid-cols-2">
                    {paginated.length > 0 ? paginated.map(deposit => (
                        <EntityCard
                            key={deposit._id}
                            title={`${deposit.nombre}`}
                            subtitle={`${deposit.direccion?.calle} ${deposit.direccion?.numero}, ${deposit.direccion?.ciudad}`}
                            icon={<Warehouse size={24}/>}
                            fields={[
                                { label: "Ciudad", value:   deposit.direccion?.ciudad },
                                { label: "Tipo", value:     deposit.tipo.charAt(0).toUpperCase() + deposit.tipo.slice(1) },
                                { label: "Horario", value:  deposit.horario_entrada + " - " + deposit.horario_salida },
                                { label: "Teléfono", value: formatTelefono(deposit.contacto.telefono) },
                                { label: "Email", value: deposit.contacto.email, extend: true},
                            ]}
                            onDelete={() => handleOpenDialog(deposit)}
                            onEdit={() => navigate(`/depots/edit/${deposit._id}`)}
                            onView={() => navigate(`/depots/details/${deposit._id}`)}
                        />
                    )):(
                        <div className="text-center text-gray-500 py-10">
                            No se encontraron depósitos con el nombre buscado.
                        </div>
                    )}
                </div>
            ) : (
                <Box>
                    <TableContainer component={Paper}>
                        <Table aria-label="tabla de depósitos">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Ciudad</TableCell>
                                    <TableCell>Horario</TableCell>
                                    <TableCell>Teléfono</TableCell>
                                    <TableCell align="center" sx={{width:72}}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow
                                        key="loading"
                                    >
                                        <TableCell colSpan={7} >
                                            <LoadingState title="depósitos"/>
                                        </TableCell>
                                    </TableRow>
                                ) : paginated.length === 0 ? (
                                    <TableRow
                                        key="no-deposits" 
                                        hover
                                    >
                                        <TableCell 
                                            colSpan={7} 
                                            sx={{
                                                textAlign: "center",
                                                paddingY: "26px",
                                            }}
                                        >
                                            No se encontraron depósitos
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((deposit) => (
                                        <TableRow key={deposit._id} hover>
                                            <TableCell sx={{fontWeight: "bold"}}>{deposit.nombre}</TableCell>
                                            <TableCell>{deposit.direccion?.ciudad}</TableCell>
                                            <TableCell>{deposit.horario_entrada} - {deposit.horario_salida}</TableCell>
                                            <TableCell>{formatTelefono(deposit.contacto?.telefono)}</TableCell>
                                            <TableCell sx={{ verticalAlign: "middle"}}>
                                                <MenuItem  handleOpenDialog={() => handleOpenDialog(deposit)}
                                                handleOpenDetails={() => navigate(`/depots/details/${deposit._id}`)}
                                                id={deposit._id}
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
                </Box>
            )}

            {/* Paginación */}
            <PaginationEntity
                entity="depósitos"
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                filtered={filteredDeposits}
                handleChangePage={handleChangePage}
                setRowsPerPage={setRowsPerPage}
                setPage={setPage}
            />

            {/* Dialogo de eliminar */}
            {depositSelected && (
                <ConfirmDialog 
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="Depósito"
                    genre="el"
                    aria-labelledby="confirm-delete-title"
                    aria-describedby="confirm-delete-description"
                    entityName={depositSelected.nombre}
                    onConfirm={() => handleDelete(depositSelected?._id)}
                />
            )}

        </>
    )
}